import React, { Component } from 'react';
import { DropzoneArea } from 'material-ui-dropzone';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'redux';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  legendRoot: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  area: {
    minHeight: '150px !important',
  },
  importButton: {
    marginTop: theme.spacing(2),
  },
  table: {
    minWidth: 650,
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
      <React.Fragment>
        <Paper elevation={3} className={classes.legendRoot}>
          <Table className={classes.table} aria-label="import file structure">
            <TableHead>
              <TableRow>
                <TableCell align="center"></TableCell>
                <TableCell align="center">code</TableCell>
                <TableCell align="center">name</TableCell>
                <TableCell align="center">price</TableCell>
                <TableCell align="center">description</TableCell>
                <TableCell align="center">collection</TableCell>
                <TableCell align="center">manufacturer</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key="required">
                <TableCell align="left">Required?</TableCell>
                <TableCell align="center">Yes</TableCell>
                <TableCell align="center">Yes</TableCell>
                <TableCell align="center">Yes</TableCell>
                <TableCell align="center">No</TableCell>
                <TableCell align="center">No</TableCell>
                <TableCell align="center">No</TableCell>
              </TableRow>
              <TableRow key="example">
                <TableCell align="left">Example</TableCell>
                <TableCell align="center">001490</TableCell>
                <TableCell align="center">
                  Nedbox Набор креплений для сухих перегородок для щитов{' '}
                </TableCell>
                <TableCell align="center">500.10</TableCell>
                <TableCell align="center"></TableCell>
                <TableCell align="center">Legrand</TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
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
      </React.Fragment>
    );
  }
}

ImportArea.propTypes = {
  classes: PropTypes.object.isRequired,
  importFile: PropTypes.func.isRequired,
};

const withStyle = withStyles(styles);

export default compose(withStyle)(ImportArea);
