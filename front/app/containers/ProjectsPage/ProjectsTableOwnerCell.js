import Avatar from '@material-ui/core/Avatar';
import PropTypes from 'prop-types';
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

const OwnerCell = ({ project: { owner }, ...rest }) => {
  if (!owner) return null;
  const fullName = `${owner.last_name} ${owner.first_name}`;

  return (
    <div sortkey={fullName} {...rest}>
      <Tooltip title={fullName}>
        <Avatar style={{ backgroundColor: owner.color }}>
          {owner.initials}
        </Avatar>
      </Tooltip>
    </div>
  );
};

OwnerCell.propTypes = {
  project: PropTypes.object.isRequired,
};

export default OwnerCell;
