import FavoriteBorderIcon from '@material-ui/icons/StarBorder';
import FavoriteIcon from '@material-ui/icons/Star';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import React from 'react';

const StarCell = ({
  project: { slug, is_starred: isStarred },
  setStar,
  ...rest
}) => (
  <div {...rest}>
    <IconButton aria-label="Favorite" onClick={setStar(slug, !isStarred)}>
      {isStarred ? <FavoriteIcon color="primary" /> : <FavoriteBorderIcon />}
    </IconButton>
  </div>
);

StarCell.propTypes = {
  project: PropTypes.object.isRequired,
  setStar: PropTypes.func.isRequired,
};

export default StarCell;
