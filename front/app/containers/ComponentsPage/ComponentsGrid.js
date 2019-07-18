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
    marginBottom: theme.spacing(2),
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
    { key: 'expand', width: 58, editable: false },
    {
      key: 'code',
      name: 'Code',
      editable: rowData => rowData.group || rowData.empty,
      width: 340,
    },
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
    return union(
      flatMapDeep(components, group => [
        {
          group: true,
          empty: false,
          expanded: this.state.expandedGroups.has(group.id),
          numberSiblings: components.length,
          id: group.id,
          code: group.name,
        },
        !this.state.expandedGroups.has(group.id)
          ? []
          : union(
              group.entries.map(c => ({
                code: c.code,
                empty: false,
                name: c.name,
                price: c.price,
                collectionName: c.collection_name,

                discount: c.collection_discount,

                qty: c.qty,
                total: c.aggregated_price,
              })),
              [{ empty: true }],
            ),
      ]),
      [
        {
          group: true,
          empty: true,
          expanded: false,
          numberSiblings: components.length + 1,
          id: -1,
          code: '',
        },
      ],
    );
  }

  getSubRowDetails = () => row =>
    !row.group
      ? { group: false, treeDepth: 2, field: 'expand' }
      : {
          group: row.group,
          expanded: row.expanded,
          treeDepth: 1,
          siblingIndex: row.id,
          numberSiblings: row.numberSiblings,
          field: 'expand',
        };

  onCellExpand = () => ({ expandArgs: { expanded }, rowData: { id } }) => {
    let { expandedGroups } = this.state;
    if (!expanded) {
      expandedGroups.add(id);
    } else {
      expandedGroups.delete(id);
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
