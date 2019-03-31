import PropTypes from 'prop-types';
import React from 'react';
import UserAvatar from 'components/UserAvatar';

export const getUserSortKey = product => {
  const { author, editor } = product;
  const user = editor || author;
  if (!user) {
    return { user: null, fillName: '-' };
  }
  const fullName = user && `${user.last_name} ${user.first_name}`;
  return { user, fullName };
};

const UserCell = props => {
  const { product, ...rest } = props;
  const { user } = getUserSortKey(product);
  if (!user) return null;

  return (
    <div {...rest}>
      <UserAvatar user={user} />
    </div>
  );
};

UserCell.propTypes = {
  product: PropTypes.object.isRequired,
};

export default UserCell;
