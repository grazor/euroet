import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import ReactDataGrid from 'react-data-grid';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
});

const ProductDetail = props => {
  const { classes, product, totalPrice } = props;

  return (
    <div>
      <Paper className={classes.root} elevation={3}>
        <Typography variant="h5" component="h3">
          {product.name}
        </Typography>
        <Typography component="p">{product.description}</Typography>
        <Typography component="p">
          Total price: € {totalPrice.toFixed(2)}
        </Typography>
      </Paper>
    </div>
  );
};

ProductDetail.propTypes = {
  classes: PropTypes.object.isRequired,
  product: PropTypes.object.isRequired,
  totalPrice: PropTypes.number.isRequired,
};

const withStyle = withStyles(styles);

export default compose(withStyle)(ProductDetail);
