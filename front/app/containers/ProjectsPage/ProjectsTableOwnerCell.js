import PropTypes from 'prop-types';
import React from 'react';
import UserAvatar from 'components/UserAvatar';

export const getOwnerSortKey = project => {
  const { owner } = project;
  if (!owner) return null;
  return `${owner.last_name} ${owner.first_name}`;
};

const OwnerCell = ({ project, ...rest }) => {
  const fullName = getOwnerSortKey(project);
  if (!fullName) return null;
  return (
    <div {...rest}>
      <UserAvatar user={project.owner} />
    </div>
  );
};

OwnerCell.propTypes = {
  project: PropTypes.object.isRequired,
};

export default OwnerCell;
