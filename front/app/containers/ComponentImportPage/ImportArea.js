import React, { Component } from 'react';
import { DropzoneArea } from 'material-ui-dropzone';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'redux';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  area: {
    minHeight: '150px !important',
  },
  importButton: {
    marginTop: theme.spacing(2),
  },
});

class ImportArea extends Component {
  state = { files: [], key: 1 };

  handleChange = files => {
    this.setState({ files });
  };

  initiateImport = () => {
    const { files } = this.state;
    if (files.length !== 1) {
      return;
    }
    this.setState(state => ({ files: [], key: state.key + 1 }));
    this.props.importFile(files[0]);
  };

  render() {
    const { classes } = this.props;

    return (
      <Paper elevation={3} className={classes.root}>
        <DropzoneArea
          onChange={this.handleChange}
          acceptedFiles={[
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/csv',
          ]}
          dropzoneText="Select .xlsx or .csv files to import"
          filesLimit={1}
          useChipsForPreview
          showFileNamesInPreview
          showAlerts
          dropzoneClass={classes.area}
          key={this.state.key}
        />
        <Button
          fullWidth
          disabled={this.state.files.length === 0}
          variant="outlined"
          color="primary"
          className={classes.importButton}
          onClick={this.initiateImport}
        >
          Import
        </Button>
      </Paper>
    );
  }
}

ImportArea.propTypes = {
  classes: PropTypes.object.isRequired,
  importFile: PropTypes.func.isRequired,
};

const withStyle = withStyles(styles);

export default compose(withStyle)(ImportArea);
