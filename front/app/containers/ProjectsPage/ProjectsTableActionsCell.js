import EditIcon from '@material-ui/icons/Edit';
import ForwardIcon from '@material-ui/icons/Forward';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import React from 'react';

const ActionsCell = ({ project, editProject, openProject, ...rest }) => (
  <div {...rest}>
    <IconButton aria-label="Edit" onClick={editProject(project.slug)}>
      <EditIcon color="inherit" />
    </IconButton>
    <IconButton aria-label="Open" onClick={openProject(project.slug)}>
      <ForwardIcon color="inherit" />
    </IconButton>
  </div>
);

ActionsCell.propTypes = {
  project: PropTypes.object.isRequired,
  editProject: PropTypes.func.isRequired,
  openProject: PropTypes.func.isRequired,
};

export default ActionsCell;
