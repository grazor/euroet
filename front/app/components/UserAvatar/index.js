/**
 *
 * UserAvatar
 *
 */

import Avatar from '@material-ui/core/Avatar';
import PropTypes from 'prop-types';
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

const UserAvatar = ({ user }) => {
  const fullName = `${user.last_name} ${user.first_name}`;

  return (
    <Tooltip title={fullName}>
      <Avatar style={{ backgroundColor: user.color }}>{user.initials}</Avatar>
    </Tooltip>
  );
};

UserAvatar.propTypes = {
  user: PropTypes.object.isRequired,
};

export default UserAvatar;
