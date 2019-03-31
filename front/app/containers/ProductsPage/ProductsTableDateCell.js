import Moment from 'react-moment';
import PropTypes from 'prop-types';
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

export const getDateSortKey = product => {
  const { updated_at: update, created_at: creation } = product;
  const dates = [update, creation]
    .map(datestr => parseInt(datestr, 10))
    .filter(timestamp => timestamp);
  const lastUpdate = Math.max(...dates);
  if (!lastUpdate) return null;
  return lastUpdate;
};

const DateCell = props => {
  const { product, ...rest } = props;
  const lastUpdate = getDateSortKey(product);

  return (
    <div {...rest}>
      <Tooltip
        title={
          <Moment
            date={lastUpdate}
            locale="ru"
            format="hh:mm DD.MM.YYYY"
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
  product: PropTypes.object.isRequired,
};

export default DateCell;
