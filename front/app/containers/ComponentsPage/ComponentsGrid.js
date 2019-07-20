import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDataGrid from 'react-data-grid';
import { compose } from 'redux';
import { flatMapDeep, union } from 'lodash';
import { withStyles } from '@material-ui/core/styles';

import CodeEditor from './ComponentsGridCodeEditor';
import QtyEditor from './ComponentsGridQtyEditor';
import NameEditor from './ComponentsGridNameEditor';
import PriceEditor from './ComponentsGridPriceEditor';

const styles = theme => ({
  root: {
    padding: 0,
    marginTop: theme.spacing(4),
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
    {
      key: 'name',
      name: 'Name',
      editable: rowData =>
        !rowData.group && (rowData.empty || !rowData.hasPrototype),
      editor: NameEditor,
    },
    {
      key: 'qty',
      name: 'Qty',
      editable: rowData => !rowData.group && !rowData.empty,
      width: 100,
      editor: QtyEditor,
    },
    {
      key: 'price',
      name: 'Price',
      editable: rowData => !rowData.empty && !rowData.hasPrototype,
      editor: PriceEditor,
      width: 100,
    },
    { key: 'discount', name: 'Discount, %', editable: false, width: 100 },
    { key: 'total', name: 'Total price', editable: false, width: 120 },
  ];

  onQtyUpdated = (fromRow, toRow, rows, qty) => {
    const ids = rows
      .slice(fromRow, toRow + 1)
      .filter(c => !c.group && !c.empty && c.qty !== qty)
      .map(c => ({ id: c.id, group: c.groupId }));
    if (ids.length === 0) {
      return;
    }
    if (qty > 0) {
      this.props.bulkUpdateQty(ids.map(c => c.id), qty);
    } else {
      for (let i = 0; i < ids.length; i += 1) {
        this.props.deleteComponent(ids[i].group, ids[i].id);
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

  onCreateFromName = (group, name) => {
    const trimmedName = name.trim();
    if (trimmedName === '') {
      return;
    }
    this.props.newComponent(group, trimmedName);
  };

  onUpdateCustom = (group, entry, name, price) => {
    if (!name && !price) {
      return;
    }
    this.props.updateCustomComponent(group, entry, name, price);
  };

  onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    if ('qty' in updated) {
      const rows = this.mapComponentsToGridData();
      this.onQtyUpdated(fromRow, toRow, rows, updated.qty);
    }

    if (
      fromRow !== toRow ||
      !('code' in updated || 'name' in updated || 'price' in updated)
    ) {
      // Supporting groups or codes or names or prices
      // Not supporting bulk updates for groups and components
      return;
    }

    const rows = this.mapComponentsToGridData();
    const row = rows[fromRow];
    if (row.group && 'code' in updated) {
      // Update or create group
      this.onGroupUdated(row, updated.code);
    } else if (!row.group && 'name' in updated && row.empty) {
      // Create component from name
      this.onCreateFromName(row.groupId, updated.name);
    } else if (
      !row.group &&
      !row.empty &&
      !row.hasPrototype &&
      ('name' in updated || 'price' in updated)
    ) {
      if ('name' in updated && updated.name === '') {
        this.onQtyUpdated(fromRow, toRow, rows, 0);
      }
      this.onUpdateCustom(row.groupId, row.id, updated.name, updated.price);
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
          total: group.total_price !== null ? group.total_price : '',
        },
        !this.state.expandedGroups.has(group.id)
          ? []
          : union(
              group.entries.map(c => ({
                id: c.id,
                groupId: group.id,
                hasPrototype: Boolean(c.prototype_id),
                code: c.code,
                empty: false,
                name: c.name,
                price: parseFloat(c.price).toFixed(2),
                collectionName: c.collection_name,
                discount: c.collection_discount,
                qty: c.qty,
                total: c.total_price,
              })),
              [{ empty: true, groupId: group.id }],
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
  newComponent: PropTypes.func.isRequired,
  updateCustomComponent: PropTypes.func.isRequired,
  deleteComponent: PropTypes.func.isRequired,
};

const withStyle = withStyles(styles);

export default compose(withStyle)(ComponentsGrid);
