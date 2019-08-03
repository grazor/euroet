import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import { compose } from 'redux';
import { slugify } from 'transliteration';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  buttonsRoot: {
    display: 'flex',
  },
  grow: {
    flexGrow: 1,
  },
});

const getInitialState = () => ({
  name: '',
  slug: '',
  description: '',
  qty: 1,

  autoSlug: true,
  originalSlug: undefined,
});

class ProductDialog extends React.Component {
  state = getInitialState();

  onChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  onNameChange = event => {
    const { value } = event.target;
    if (this.state.autoSlug) {
      const slug = this.getEtSlug(value);
      this.setState({ name: value, slug });
    } else {
      this.setState({ name: value });
    }
  };

  onSlugChange = event => {
    const { value } = event.target;
    if (value) {
      this.setState({ slug: value, autoSlug: false });
    } else {
      this.setState(state => ({
        slug: this.getEtSlug(state.name),
        autoSlug: true,
      }));
    }
  };

  componentWillReceiveProps(nextProps) {
    const { product } = nextProps;
    if ((product || {}).slug === this.state.originalSlug) {
      return;
    }
    if (product == null) {
      this.setState(getInitialState());
    } else {
      this.setState({
        name: product.name,
        slug: product.slug,
        description: product.description,
        qty: product.qty,
        originalSlug: product.slug,
        autoSlug: false,
      });
    }
  }

  onCancel = () => {
    this.setState(getInitialState());
    this.props.onCancel();
  };

  onSubmit = () => {
    this.props.onSubmit(this.state);
    this.setState(getInitialState());
  };

  onDelete = () => {
    const confirmDelete = window.confirm('Confirm product deletion'); // eslint-disable-line no-alert
    if (!confirmDelete) return;
    this.props.onDelete(this.state.originalSlug);
    this.setState(getInitialState());
  };

  getEtSlug = (name, maxLength = 50) =>
    slugify(name.slice(-maxLength), {
      trim: true,
      lowercase: true,
      separator: '_',
    });

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this.onCancel}
          aria-labelledby="form-dialog-title"
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle id="form-dialog-title">
            {this.props.product ? 'Update' : 'Create'} product
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Product name"
              onChange={this.onNameChange}
              value={this.state.name}
              fullWidth
            />
            <TextField
              margin="dense"
              id="slug"
              label="Product code"
              onChange={this.onSlugChange}
              value={this.state.slug}
              fullWidth
            />
            <TextField
              margin="dense"
              id="description"
              label="Product description"
              onChange={this.onChange('description')}
              value={this.state.description}
              multiline
              fullWidth
            />
            <TextField
              margin="dense"
              id="qty"
              label="Quantity"
              onChange={this.onChange('qty')}
              value={this.state.qty}
              type="number"
              inputProps={{ min: 1 }}
              fullWidth
            />
          </DialogContent>
          <DialogActions className={classes.buttonsRoot}>
            <div className={classes.grow}>
              {this.props.product ? (
                <Button onClick={this.onDelete} color="secondary">
                  Delete
                </Button>
              ) : null}
            </div>

            <Button onClick={this.onCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={this.onSubmit} color="primary">
              {this.props.product ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

ProductDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  product: PropTypes.object,
  classes: PropTypes.object.isRequired,
};

const withStyle = withStyles(styles);

export default compose(withStyle)(ProductDialog);
