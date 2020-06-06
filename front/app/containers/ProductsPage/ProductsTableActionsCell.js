import EditIcon from '@material-ui/icons/Edit';
import ForwardIcon from '@material-ui/icons/Forward';
import CopyIcon from '@material-ui/icons/FileCopy';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import React from 'react';

const ActionsCell = ({
  product,
  editProduct,
  copyProduct,
  openProduct,
  ...rest
}) => (
  <div {...rest}>
    <IconButton aria-label="Copy" onClick={copyProduct(product.slug)}>
      <CopyIcon color="inherit" />
    </IconButton>
    <IconButton aria-label="Edit" onClick={editProduct(product.slug)}>
      <EditIcon color="inherit" />
    </IconButton>
    <IconButton aria-label="Open" onClick={openProduct(product.slug)}>
      <ForwardIcon color="inherit" />
    </IconButton>
  </div>
);

ActionsCell.propTypes = {
  product: PropTypes.object.isRequired,
  editProduct: PropTypes.func.isRequired,
  copyProduct: PropTypes.func.isRequired,
  openProduct: PropTypes.func.isRequired,
};

export default ActionsCell;
