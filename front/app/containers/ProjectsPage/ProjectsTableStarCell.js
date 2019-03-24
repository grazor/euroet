import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import React from 'react';

const StarCell = ({ project, toggleStar, ...rest }) => (
  <div sortkey={project.is_starred ? 1 : 0} {...rest}>
    <IconButton aria-label="Favorite" onClick={toggleStar(project.slug)}>
      {project.is_starred ? (
        <FavoriteIcon color="primary" />
      ) : (
        <FavoriteBorderIcon />
      )}
    </IconButton>
  </div>
);

StarCell.propTypes = {
  project: PropTypes.object.isRequired,
  toggleStar: PropTypes.func.isRequired,
};

export default StarCell;
