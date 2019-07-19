import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDataGrid from 'react-data-grid';
import { compose } from 'redux';
import { flatMapDeep, union } from 'lodash';
import { withStyles } from '@material-ui/core/styles';

import CodeEditor from './ComponentsGridCodeEditor';
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

RowRenderer.propTypes = {
  renderBaseRow: PropTypes.func.isRequired,
  row: PropTypes.object.isRequired,
};

class ComponentsGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = { expandedGroups: new Set() };
    this.paperRef = React.createRef();
  }

  columns = [
    { key: 'expand', width: 58, editable: false },
    {
      key: 'code',
      name: 'Group / Code',
      editable: rowData => rowData.group || rowData.empty,
      width: 340,
    },
    { key: 'name', name: 'Name', editable: false },
    {
      key: 'qty',
      name: 'Qty',
      editable: rowData => !rowData.group && !rowData.empty,
      width: 100,
      editor: QtyEditor,
    },
    { key: 'price', name: 'Price', editable: false, width: 100 },
    { key: 'discount', name: 'Discount, %', editable: false, width: 100 },
    { key: 'total', name: 'Total price', editable: false, width: 120 },
  ];

  onQtyUpdated = (fromRow, toRow, rows, qty) => {
    const codes = rows
      .slice(fromRow, toRow + 1)
      .filter(c => !c.group && !c.empty && c.qty !== qty)
      .map(c => c.code);
    if (codes.length === 0) {
      return;
    }
    if (qty > 0) {
      this.props.bulkUpdateQty(codes, qty);
    } else {
      for (let i = 0; i < codes.length; i += 1) {
        this.props.deleteComponent(codes[i]);
      }
    }
  };

  onGroupUdated = (row, name) => {
    const trimmedName = name.trim();
    if (row.empty) {
      if (trimmedName !== '') {
        this.props.addGroup(trimmedName);
      }
      return;
    }
    if (trimmedName === '') {
      if (confirm(`Delete group "${row.code}" and its components?`)) {
        this.props.deleteGroup(row.id);
      }
      return;
    }
    if (trimmedName !== row.code.trim()) {
      this.props.renameGroup(row.id, trimmedName);
    }
  };

  onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    if ('qty' in updated) {
      const rows = this.mapComponentsToGridData();
      this.onQtyUpdated(fromRow, toRow, rows, updated.qty);
    }

    if (fromRow !== toRow || !('code' in updated)) {
      // Supporting groups or codes only
      // Not supporting bulk updates for groups and components
      return;
    }

    const rows = this.mapComponentsToGridData();
    const row = rows[fromRow];
    if (row.group) {
      this.onGroupUdated(row, updated.code);
    }
  };

  getPaperWidth = () =>
    (this.paperRef.current && this.paperRef.current.clientWidth) || 0;

  getCodeEditor = () => {
    const { getSuggestions, addComponent } = this.props;
    return (
      <CodeEditor
        height={35}
        getPaperWidth={this.getPaperWidth}
        getSuggestions={getSuggestions}
        addComponent={addComponent}
      />
    );
  };

  mapComponentsToGridData() {
    const { components } = this.props;
    this.columns[1].editor = this.getCodeEditor();
    return union(
      flatMapDeep(components, group => [
        {
          group: true,
          empty: false,
          expanded: this.state.expandedGroups.has(group.id),
          numberSiblings: components.length,
          id: group.id,
          code: group.name,
          total: group.total_price || 0,
        },
        !this.state.expandedGroups.has(group.id)
          ? []
          : union(
              group.entries.map(c => ({
                id: c.id,
                groupId: group.id,
                code: c.code,
                empty: false,
                name: c.name,
                price: c.price,
                collectionName: c.collection_name,
                discount: c.collection_discount,
                qty: c.qty,
                total: c.total_price,
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
    const { expandedGroups } = this.state;
    if (!expanded) {
      expandedGroups.add(id);
    } else {
      expandedGroups.delete(id);
    }
    this.setState({ expandedGroups });
  };

  render() {
    const { classes } = this.props;
    const components = this.mapComponentsToGridData();
    return (
      <Paper className={classes.root} ref={this.paperRef} elevation={3}>
        <ReactDataGrid
          columns={this.columns}
          rowGetter={i => components[i]}
          rowsCount={components.length}
          minHeight={(components.length + 1) * 35 + 10}
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
  getSuggestions: PropTypes.func.isRequired,
  addGroup: PropTypes.func.isRequired,
  renameGroup: PropTypes.func.isRequired,
  deleteGroup: PropTypes.func.isRequired,
  addComponent: PropTypes.func.isRequired,
  deleteComponent: PropTypes.func.isRequired,
};

const withStyle = withStyles(styles);

export default compose(withStyle)(ComponentsGrid);
