import EuroetTable from 'components/EuroetTable';
import PropTypes from 'prop-types';
import React from 'react';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';

import ActionsCell from './ProductsTableActionsCell';
import DateCell, { getDateSortKey } from './ProductsTableDateCell';
import UserCell, { getUserSortKey } from './ProductsTableUserCell';

const styles = () => ({
  dateColumn: {
    minWidth: 120,
  },
  actionsColumn: { minWidth: 100 },
});

class ProductsTable extends React.Component {
  columns = [
    { name: 'Name', options: { filter: false, sort: true } },
    { name: 'Description', options: { filter: false, sort: true } },
    { name: 'qty', options: { filter: false, sort: true } },
    { name: 'Updated by', options: { filter: false, sort: true } },
    {
      name: 'Last update',
      options: { filter: false, sort: true, sortDirection: 'desc' },
    },
    { name: '', options: { filter: false, sort: false } },
  ];

  mapProductsToTableData() {
    const { products, classes, editProduct, openProductPage } = this.props;

    return products.map(p => [
      p.name,
      p.description,
      p.qty,
      <UserCell product={p} sortkey={getUserSortKey(p).fullName} />,
      <DateCell
        product={p}
        sortkey={getDateSortKey(p)}
        className={classes.dateColumn}
      />,
      <ActionsCell
        product={p}
        editProduct={editProduct}
        openProduct={openProductPage}
        className={classes.actionsColumn}
      />,
    ]);
  }

  render() {
    const data = this.mapProductsToTableData();

    return <EuroetTable title="Products" columns={this.columns} data={data} />;
  }
}

ProductsTable.propTypes = {
  classes: PropTypes.object.isRequired,
  products: PropTypes.array.isRequired,
  openProductPage: PropTypes.func.isRequired,
  editProduct: PropTypes.func.isRequired,
};

const withStyle = withStyles(styles);

export default compose(withStyle)(ProductsTable);
