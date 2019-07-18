import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
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

const ProjectDetail = props => {
  const { classes, project } = props;

  return (
    <div>
      <Paper className={classes.root} elevation={3}>
        <Typography variant="h5" component="h3">
          {project.name}
        </Typography>
        <Typography component="p">{project.description}</Typography>
      </Paper>
    </div>
  );
};

ProjectDetail.propTypes = {
  classes: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
};

const withStyle = withStyles(styles);

export default compose(withStyle)(ProjectDetail);
