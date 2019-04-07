import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDataGrid from 'react-data-grid';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';

import QtyEditor from './ComponentsGridQtyEditor';

const styles = theme => ({
  root: {
    padding: 0,
    marginBottom: theme.spacing.unit * 2,
  },
});

class ComponentsGrid extends React.Component {
  columns = [
    { key: 'code', name: 'Code', editable: true, width: 300 },
    { key: 'description', name: 'Description', editable: true },
    { key: 'price', name: 'Price', editable: false, width: 100 },
    { key: 'collectionName', name: 'Collection', editable: false, width: 300 },
    { key: 'discount', name: 'Discount, %', editable: false, width: 100 },
    { key: 'qty', name: 'Qty', editable: true, width: 100, editor: QtyEditor },
    { key: 'total', name: 'Total price', editable: false, width: 120 },
  ];

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
    const { classes } = this.props;
    const components = this.mapComponentsToGridData();
    return (
      <Paper className={classes.root} elevation={3}>
        <ReactDataGrid
          columns={this.columns}
          rowGetter={i => components[i]}
          rowsCount={components.length}
          onGridRowsUpdated={() => {}}
          minHeight={800}
        />
      </Paper>
    );
  }
}

ComponentsGrid.propTypes = {
  classes: PropTypes.object.isRequired,
  components: PropTypes.array.isRequired,
};

const withStyle = withStyles(styles);

export default compose(withStyle)(ComponentsGrid);
