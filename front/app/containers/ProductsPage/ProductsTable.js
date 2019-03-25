import EuroetTable from 'components/EuroetTable';
import PropTypes from 'prop-types';
import React from 'react';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({});

class ProductsTable extends React.Component {
  columns = [
    { name: 'Name', options: { filter: false, sort: true } },
    { name: 'Description', options: { filter: false, sort: true } },
  ];

  mapProductsToTableData() {
    const { products, classes } = this.props;

    return products.map(p => [p.name, p.description]);
  }

  render() {
    const data = this.mapProductsToTableData();

    return <EuroetTable title="Products" columns={this.columns} data={data} />;
  }
}

ProductsTable.propTypes = {
  classes: PropTypes.object.isRequired,
  products: PropTypes.array.isRequired,
};

const withStyle = withStyles(styles);

export default compose(withStyle)(ProductsTable);
