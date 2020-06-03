import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDataGrid from 'react-data-grid';
import { compose } from 'redux';
import { flatMapDeep, union } from 'lodash';
import { withStyles } from '@material-ui/core/styles';

import CodeEditor from './ComponentsGridCodeEditor';
import NameEditor from './ComponentsGridNameEditor';
import PriceEditor from './ComponentsGridPriceEditor';
import QtyEditor from './ComponentsGridQtyEditor';

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

const parsePaste = str =>
  str.split(/\r\n|\n|\r/).map(row => row.split('\t').filter(r => r));

const splitPaste = data => {
  const nogroup = [];
  const group = [];
  let inGroup = false;
  for (let i = 0; i < data.length; i += 1) {
    const entry = data[i];
    if (entry.length === 1 && entry[0].trim() !== '') {
      inGroup = true;
      group.push({ name: entry[0], entries: [] });
      continue;
    }
    if (inGroup) {
      group[group.length - 1].entries.push(entry);
    } else {
      nogroup.push(entry);
    }
  }
  return { group, nogroup };
};

class ComponentsGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsedGroups: new Set(),
      groupsInitialized: false,
      selectedRow: null,
      selectedTop: null,
      selectedBottom: null,
    };
    this.paperRef = React.createRef();

    document.addEventListener('copy', this.handleCopy);
    document.addEventListener('paste', this.handlePaste);
  }

  componentWillUnmount = () => {
    this.removeAllListeners();
  };

  componentWillMount = () => {
    if (this.state.groupsInitialized) {
      return;
    }
    const { components } = this.props;
    const groups = new Set();
    components.forEach(group => {
      groups.add(group.id);
    });
    this.setState({ collapsedGroups: groups, groupsInitialized: true });
  };

  removeAllListeners = () => {
    document.removeEventListener('copy', this.handleCopy);
    document.removeEventListener('paste', this.handlePaste);
  };

  onCellsSelected = selection => {
    if (!selection || !selection.startCell) {
      return;
    }
    this.setState({
      selectedRow: selection.startCell.rowIdx,
      selectedTop: selection.topLeft.rowIdx,
      selectedBottom: selection.bottomRight.rowIdx,
    });
  };

  handleCopy = e => {
    const { selectedTop, selectedBottom } = this.state;
    if (selectedTop === undefined || selectedBottom === undefined) {
      return;
    }
    e.preventDefault();
    const { components } = this.props;
    const rows = this.mapComponentsToGridData();
    const selectedRows = rows.slice(selectedTop, selectedBottom + 1);
    const copied = [];
    do {
      const row = selectedRows.shift();
      if (!row.empty && (row.group || row.code)) {
        copied.push([row.code, row.qty, row.collectionName].join('\t'));

        if (row.group && !row.expanded) {
          let group;
          for (let i = 0; i < components.length; i++) {
            if (components[i].id == row.id) {
              group = components[i];
              break;
            }
          }
          if (group) {
            for (let i = 0; i < group.entries.length; i++) {
              const e = group.entries[i];
              if (e.code) {
                copied.push([e.code, e.qty, e.collection_name].join('\t'));
              }
            }
          }
        }
      }
    } while (selectedRows.length > 0);
    e.clipboardData.setData('text/plain', ' \n' + copied.join('\n'));
  };

  pasteIntoGroup = items => {
    if (!items || items.length == 0) {
      return;
    }
    const { selectedRow } = this.state;
    if (selectedRow === null) {
      return;
    }
    const row = this.mapComponentsToGridData()[selectedRow];
    if (row.group && row.empty) {
      return;
    }
    items.forEach(entry => {
      const qty = parseInt(entry[1], 10);
      if ((entry.length !== 2 && entry.length !== 3) || isNaN(qty)) {
        return;
      }
      this.props.addComponentByCode(row.groupId, entry[0], qty, entry[2]);
    });
    const { collapsedGroups } = this.state;
    collapsedGroups.delete(row.groupId);
    this.setState({ collapsedGroups });
  };

  pasteGroupWithContents = items => {
    const { addGroupWithContents } = this.props;
    if (!items || items.length === 0) {
      return;
    }
    items
      .filter(e => e.entries.length > 0)
      .forEach(e => {
        const items = e.entries.map(i => ({
          code: i[0],
          qty: i[1],
          collection: i.length >= 3 ? i[2] : '',
        }));
        addGroupWithContents(e.name, items);
      });
  };

  handlePaste = e => {
    const data = e.clipboardData.getData('text/plain');
    if (!data.includes('\t')) {
      return true;
    }
    e.preventDefault();

    const pasteData = parsePaste(data);
    const { group, nogroup } = splitPaste(pasteData);
    this.pasteGroupWithContents(group);
    this.pasteIntoGroup(nogroup);
    return false;
  };

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
      !('code' in updated || 'name' in updated || 'price' in updated) ||
      ((!updated.code || updated.code.trim() === '') &&
        (!updated.name || updated.name.trim() === '') &&
        (!updated.price || updated.price.trim === ''))
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
          expanded: !this.state.collapsedGroups.has(group.id),
          numberSiblings: components.length,
          id: group.id,
          groupId: group.id,
          code: group.name,
          total: group.total_price !== null ? group.total_price : '',
        },
        this.state.collapsedGroups.has(group.id)
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
    const { collapsedGroups } = this.state;
    if (!expanded) {
      collapsedGroups.delete(id);
    } else {
      collapsedGroups.add(id);
    }
    this.setState({ collapsedGroups });
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
          cellRangeSelection={{ onComplete: this.onCellsSelected }}
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
  addComponentByCode: PropTypes.func.isRequired,
  addGroupWithContents: PropTypes.func.isRequired,
  addGroupWithContents: PropTypes.func.isRequired,
  newComponent: PropTypes.func.isRequired,
  updateCustomComponent: PropTypes.func.isRequired,
  deleteComponent: PropTypes.func.isRequired,
};

const withStyle = withStyles(styles);

export default compose(withStyle)(ComponentsGrid);
