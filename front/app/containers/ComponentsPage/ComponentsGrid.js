import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDataGrid from 'react-data-grid';
import { compose } from 'redux';
import { flatMapDeep, union } from 'lodash';
import { withStyles } from '@material-ui/core/styles';

import GridToolbar from './ComponentsGridToolbar';
import QtyEditor from './ComponentsGridQtyEditor';

const styles = theme => ({
  root: {
    padding: 0,
    marginBottom: theme.spacing.unit * 2,
  },
});

const RowRenderer = ({ renderBaseRow, ...props }) => {
  if (!props.row.group) {
    return renderBaseRow(props);
  }
  return <div style={{ fontWeight: 'bold' }}>{renderBaseRow(props)}</div>;
};

class ComponentsGrid extends React.Component {
  state = {
    expandedGroups: new Set(),
  };

  columns = [
    { key: 'group', width: 58 },
    { key: 'code', name: 'Code', editable: false, width: 340 },
    { key: 'name', name: 'Name', editable: false },
    { key: 'qty', name: 'Qty', editable: true, width: 100, editor: QtyEditor },
    { key: 'price', name: 'Price', editable: false, width: 100 },
    { key: 'discount', name: 'Discount, %', editable: false, width: 100 },
    { key: 'total', name: 'Total price', editable: false, width: 120 },
  ];

  onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    const { components } = this.props;
    if ('qty' in updated) {
      const codes = components
        .slice(fromRow, toRow + 1)
        .filter(c => c.qty !== updated.qty)
        .map(c => c.component.code);
      if (codes.length > 0) {
        if (updated.qty > 0) {
          this.props.bulkUpdateQty(codes, updated.qty);
        } else {
          for (let i = 0; i < codes.length; i += 1) {
            this.props.deleteComponent(codes[i]);
          }
        }
      }
    }
  };

  mapComponentsToGridData() {
    const { components } = this.props;
    return flatMapDeep(components, group => [
      {
        group: true,
        expanded: this.state.expandedGroups.has(group.order),
        numberSiblings: components.length,
        order: group.order,
        code: group.name,
      },
      !this.state.expandedGroups.has(group.order)
        ? []
        : union(
            group.entries.map(c => ({
              code: c.code,
              name: c.name,
              price: c.price,
              collectionName: c.collection_name,

              discount: c.collection_discount,

              qty: c.qty,
              total: c.aggregated_price,
            })),
            [{}],
          ),
    ]);
  }

  getSubRowDetails = () => row =>
    !row.group
      ? { group: false, treeDepth: 2, field: 'group' }
      : {
          group: row.group,
          expanded: row.expanded,
          treeDepth: 1,
          siblingIndex: row.order,
          numberSiblings: row.numberSiblings,
          field: 'group',
        };

  onCellExpand = () => ({ expandArgs: { expanded }, rowData: { order } }) => {
    let { expandedGroups } = this.state;
    if (!expanded) {
      expandedGroups.add(order);
    } else {
      expandedGroups.delete(order);
    }
    this.setState({ expandedGroups });
  };

  render() {
    const { classes, suggestions, getSuggestions, addComponent } = this.props;
    const components = this.mapComponentsToGridData();
    return (
      <Paper className={classes.root} elevation={3}>
        <GridToolbar
          suggestions={suggestions}
          getSuggestions={getSuggestions}
          addComponent={addComponent}
        />
        <ReactDataGrid
          columns={this.columns}
          rowGetter={i => components[i]}
          rowsCount={components.length}
          minHeight={(components.length + 1) * 35 + 20}
          enableCellAutoFocus={false}
          onGridRowsUpdated={this.onGridRowsUpdated}
          getSubRowDetails={this.getSubRowDetails()}
          onCellExpand={this.onCellExpand()}
          rowRenderer={RowRenderer}
          enableCellSelect
        />
      </Paper>
    );
  }
}

ComponentsGrid.propTypes = {
  classes: PropTypes.object.isRequired,
  components: PropTypes.array.isRequired,
  bulkUpdateQty: PropTypes.func.isRequired,
  suggestions: PropTypes.array.isRequired,
  getSuggestions: PropTypes.func.isRequired,
  addComponent: PropTypes.func.isRequired,
  deleteComponent: PropTypes.func.isRequired,
};

const withStyle = withStyles(styles);

export default compose(withStyle)(ComponentsGrid);
