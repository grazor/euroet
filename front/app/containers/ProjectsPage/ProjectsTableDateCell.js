import Moment from 'react-moment';
import PropTypes from 'prop-types';
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

export const getDateSortKey = project => {
  const {
    last_update_at: update,
    modified_at: modification,
    created_at: creation,
  } = project;
  const dates = [update, modification, creation]
    .map(datestr => parseInt(datestr, 10))
    .filter(timestamp => timestamp);
  const lastUpdate = Math.max(...dates);
  if (!lastUpdate) return null;
  return lastUpdate;
};

const DateCell = ({ project, ...rest }) => {
  const lastUpdate = getDateSortKey(project);
  return (
    <div {...rest}>
      <Tooltip
        title={
          <Moment
            date={lastUpdate}
            locale="ru"
            format="HH:mm DD.MM.YYYY"
            unix
          />
        }
      >
        <Moment date={lastUpdate} fromNow locale="ru" unix />
      </Tooltip>
    </div>
  );
};

DateCell.propTypes = {
  project: PropTypes.object.isRequired,
};

export default DateCell;
