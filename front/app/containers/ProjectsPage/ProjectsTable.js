import EuroetTable from 'components/EuroetTable';
import PropTypes from 'prop-types';
import React from 'react';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';

import ActionsCell from './ProjectsTableActionsCell';
import StarCell from './ProjectsTableStarCell';
import DateCell, { getDateSortKey } from './ProjectsTableDateCell';
import OwnerCell, { getOwnerSortKey } from './ProjectsTableOwnerCell';

const styles = () => ({
  dateColumn: {
    minWidth: 100,
  },
  actionsColumn: {
    minWidth: 130,
  },
});

class ProjectsTable extends React.Component {
  columns = [
    { name: 'Starred', options: { filter: false, sort: true } },
    { name: 'Name', options: { filter: false, sort: true } },
    { name: 'Description', options: { filter: false, sort: true } },
    { name: 'Owner', options: { filter: false, sort: true } },
    { name: 'Last update', options: { filter: false, sort: true, sortDirection: 'desc' } },
    { name: '', options: { filter: false, sort: false } },
  ];

  mapProjectsToTableData() {
    const {
      projects,
      setStar,
      openProjectPage,
      editProject,
      classes,
    } = this.props;

    return projects.map(p => [
      <StarCell project={p} sortkey={p.is_starred ? 1 : 0} setStar={setStar} />,
      p.name,
      p.description,
      <OwnerCell project={p} sortkey={getOwnerSortKey(p)} />,
      <DateCell
        project={p}
        sortkey={getDateSortKey(p)}
        className={classes.dateColumn}
      />,
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

    return <EuroetTable title="Projects" columns={this.columns} data={data} />;
  }
}

ProjectsTable.propTypes = {
  classes: PropTypes.object.isRequired,
  projects: PropTypes.array.isRequired,
  setStar: PropTypes.func.isRequired,
  editProject: PropTypes.func.isRequired,
  openProjectPage: PropTypes.func.isRequired,
};

const withStyle = withStyles(styles);

export default compose(withStyle)(ProjectsTable);
