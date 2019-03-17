/**
 *
 * LoadingBar
 *
 */

import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  root: {
    flexGrow: 1,
    marginTop: 72,
    height: 64,
    paddingTop: 32,
    paddingLeft: 16,
    paddingRight: 16,
  },
});

const LoadingBar = ({ classes }) => (
  <Paper className={classes.root}>
    <LinearProgress color="primary" />
  </Paper>
);

LoadingBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

const withStyle = withStyles(styles);

export default compose(withStyle)(LoadingBar);
