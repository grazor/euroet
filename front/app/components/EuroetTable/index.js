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
      (item.type && item.type === 'div' ? item.props.sortkey : item) || 0;

    return data.sort(
      (a, b) =>
        (getKey(a.data[colIndex]) < getKey(b.data[colIndex]) ? -1 : 1) *
        (order === 'desc' ? 1 : -1),
    );
  };

  options = {
    selectableRows: false,
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
    const { columns, title, data } = this.props;

    return (
      <MUIDataTable
        title={title}
        columns={columns}
        options={this.options}
        data={data}
      />
    );
  }
}

EuroetTable.propTypes = {
  columns: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
};

export default EuroetTable;
