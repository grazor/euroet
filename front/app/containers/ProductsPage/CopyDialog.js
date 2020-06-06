import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import { compose } from 'redux';
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
  slug: '',
  copySlug: '',
  originalSlug: undefined,
});

class CopyDialog extends React.Component {
  state = getInitialState();

  componentWillReceiveProps(nextProps) {
    const { product } = nextProps;
    if ((product || {}).slug === this.state.originalSlug) {
      return;
    }
    if (product) {
      this.setState({
        originalSlug: product.slug,
        copySlug: `${product.slug}_copy`,
      });
    }
  }

  onChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  onCancel = () => {
    this.setState(getInitialState());
    this.props.onCancel();
  };

  onSubmit = () => {
    this.props.onSubmit(this.state);
    this.setState(getInitialState());
  };

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
          <DialogTitle id="form-dialog-title">Copy product</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Target"
              onChange={this.onChange('slug')}
              value={this.state.slug}
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Target product slug"
              onChange={this.onChange('copySlug')}
              value={this.state.copySlug}
              fullWidth
            />
          </DialogContent>
          <DialogActions className={classes.buttonsRoot}>
            <Button onClick={this.onCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={this.onSubmit} color="primary">
              Copy
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

CopyDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  product: PropTypes.object,
  classes: PropTypes.object.isRequired,
};

const withStyle = withStyles(styles);

export default compose(withStyle)(CopyDialog);
