import MUIDataTable from 'mui-datatables';
import PropTypes from 'prop-types';
import React from 'react';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';

import ActionsCell from './ProjectsTableActionsCell';
import DateCell from './ProjectsTableDateCell';
import OwnerCell from './ProjectsTableOwnerCell';
import StarCell from './ProjectsTableStarCell';

const styles = () => ({
  starColumn: {
    maxWidth: 20,
  },
  dateColumn: {
    minWidth: 80,
  },
  actionsColumn: {
    minWidth: 130,
  },
});

class ProjectsTable extends React.Component {
  columns = [
    { name: '', options: { filter: false, sort: true } },
    { name: 'Name', options: { filter: false, sort: true } },
    { name: 'Description', options: { filter: false, sort: true } },
    { name: 'Owner', options: { filter: true, sort: true } },
    { name: 'Last update', options: { filter: false, sort: true } },
    { name: '', options: { filter: false, sort: false } },
  ];

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
    responsive: 'scroll',
    fixedHeader: false,
    customSort: this.sortTable,
  };

  mapProjectsToTableData() {
    const {
      projects,
      toggleStar,
      openProjectPage,
      editProject,
      classes,
    } = this.props;

    return projects.map(p => [
      <StarCell
        project={p}
        toggleStar={toggleStar}
        className={classes.starColumn}
      />,
      p.name,
      p.description,
      <OwnerCell project={p} />,
      <DateCell project={p} className={classes.dateColumn} />,
      <ActionsCell
        project={p}
        editProject={editProject}
        openProject={openProjectPage}
        className={classes.actionsColumn}
      />,
    ]);
  }

  render() {
    const data = this.mapProjectsToTableData();

    return (
      <MUIDataTable
        title="Projects"
        columns={this.columns}
        options={this.options}
        data={data}
      />
    );
  }
}

ProjectsTable.propTypes = {
  classes: PropTypes.object.isRequired,
  projects: PropTypes.array.isRequired,
  toggleStar: PropTypes.func.isRequired,
  editProject: PropTypes.func.isRequired,
  openProjectPage: PropTypes.func.isRequired,
};

const withStyle = withStyles(styles);

export default compose(withStyle)(ProjectsTable);
