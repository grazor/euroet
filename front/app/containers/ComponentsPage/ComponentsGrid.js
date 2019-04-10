import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDataGrid from 'react-data-grid';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';

import GridToolbar from './ComponentsGridToolbar';
import QtyEditor from './ComponentsGridQtyEditor';

const styles = theme => ({
  root: {
    padding: 0,
    marginBottom: theme.spacing.unit * 2,
  },
});

class ComponentsGrid extends React.Component {
  columns = [
    { key: 'code', name: 'Code', editable: false, width: 300 },
    { key: 'description', name: 'Description', editable: false },
    { key: 'price', name: 'Price', editable: false, width: 100 },
    { key: 'collectionName', name: 'Collection', editable: false, width: 300 },
    { key: 'discount', name: 'Discount, %', editable: false, width: 100 },
    { key: 'qty', name: 'Qty', editable: true, width: 100, editor: QtyEditor },
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
    return components.map(c => ({
      code: c.component.code,
      description: c.component.description,
      price: c.component.price,
      collectionName:
        (c.component.collection && c.component.collection.name) || '',
      discount:
        (c.component.collection && c.component.collection.discount) || '',
      qty: c.qty,
      total: c.aggregated_price,
    }));
  }

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
          minHeight={(components.length + 1) * 35}
          enableCellAutoFocus={false}
          onGridRowsUpdated={this.onGridRowsUpdated}
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