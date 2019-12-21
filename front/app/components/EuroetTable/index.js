/**
 *
 * EuroetTable
 *
 */

import MUIDataTable from 'mui-datatables';
import PropTypes from 'prop-types';
import React from 'react';

class EuroetTable extends React.Component {
  sortTable = (data, colIndex, order) => {
    const getKey = item =>
      item && item.props && 'sortkey' in item.props ? item.props.sortkey : item;

    return data.sort(
      (a, b) =>
        (getKey(a.data[colIndex]) < getKey(b.data[colIndex]) ? -1 : 1) *
        (order === 'desc' ? 1 : -1),
    );
  };

  options = {
    selectableRows: 'none',
    rowsPerPage: 30,
    rowsPerPageOptions: [10, 30, 50],
    print: false,
    download: false,
    filter: false,
    responsive: 'scroll',
    fixedHeader: false,
    customSort: this.sortTable,
  };

  render() {
    const { columns, title, data, options, ...rest } = this.props;

    const tableOptions = { ...this.options, ...options };

    return (
      <MUIDataTable
        title={title}
        columns={columns}
        options={tableOptions}
        data={data}
        {...rest}
      />
    );
  }
}

EuroetTable.propTypes = {
  columns: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  options: PropTypes.object,
};

export default EuroetTable;
