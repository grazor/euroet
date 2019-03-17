import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import { slugify } from 'transliteration';

class ProjectDialog extends React.Component {
  state = {
    name: '',
    slug: '',
    description: '',

    autoSlug: true,
    originalSlug: undefined,
  };

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
    // You don't have to do this check first, but it can help prevent an unneeded render
    const { project } = nextProps;
    if ((project || {}).slug === this.state.originalSlug) {
      return;
    }
    if (project == null) {
      this.setState({
        name: '',
        slug: '',
        description: '',
        originalSlug: undefined,
        autoSlug: true,
      });
    } else {
      this.setState({
        name: project.name,
        slug: project.slug,
        description: project.description,
        originalSlug: project.slug,
        autoSlug: false,
      });
    }
  }

  onCancel = () => {
    this.setState({
      name: '',
      description: '',
      slug: '',
      originalSlug: undefined,
      autoSlug: true,
    });
    this.props.onCancel();
  };

  onSubmit = () => {
    this.props.onSubmit(this.state);
    this.setState({
      name: '',
      description: '',
      slug: '',
      originalSlug: undefined,
      autoSlug: true,
    });
  };

  onDelete = () => {
    this.props.onDelete(this.state.originalSlug);
    this.setState({
      name: '',
      description: '',
      slug: '',
      originalSlug: undefined,
      autoSlug: true,
    });
  };

  getEtSlug = (name, maxLength = 50) =>
    slugify(name.slice(-maxLength), {
      trim: true,
      lowercase: true,
      separator: '_',
    });

  render() {
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this.onCancel}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {this.props.project ? 'Update' : 'Create'} project
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Project name"
              onChange={this.onNameChange}
              value={this.state.name}
              fullWidth
            />
            <TextField
              margin="dense"
              id="slug"
              label="Project code"
              onChange={this.onSlugChange}
              value={this.state.slug}
              fullWidth
            />
            <TextField
              margin="dense"
              id="description"
              label="Project description"
              onChange={this.onChange('description')}
              value={this.state.description}
              multiline
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            {this.props.project ? (
              <Button onClick={this.onDelete} color="primary">
                Delete
              </Button>
            ) : null}

            <Button onClick={this.onCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={this.onSubmit} color="primary">
              {this.props.project ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

ProjectDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  project: PropTypes.object,
};

export default ProjectDialog;
