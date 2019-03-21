/**
 *
 * ProjectsPage
 *
 */

import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import LoadingBar from 'components/LoadingBar';
import PropTypes from 'prop-types';
import React from 'react';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { find } from 'lodash';
import { withStyles } from '@material-ui/core/styles';

import ProjectDialog from './ProjectDialog';
import ProjectsTable from './ProjectsTable';
import reducer from './reducer';
import saga from './saga';
import {
  addProject,
  deleteProject,
  fetchProjects,
  toggleProjectStar,
  updateProject,
} from './actions';
import {
  makeSelectIsLoading,
  makeSelectIsUpdating,
  makeSelectProjects,
} from './selectors';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  fab: {
    position: 'fixed',
    bottom: 2 * theme.spacing.unit,
    right: 2 * theme.spacing.unit,
  },
  loadingRoot: {
    flexGrow: 1,
    marginTop: 72,
    height: 64,
    paddingTop: 32,
    paddingLeft: 16,
    paddingRight: 16,
  },
});

class ProjectsPage extends React.Component {
  state = {
    showProjectDialog: false,
    project: null,
  };

  componentDidMount() {
    this.props.fetchProjects();
  }

  openProjectPage = slug => () => {
    this.props.history.push(`/project/${slug}`);
  };

  onToggleDialog = isOn => () => {
    this.setState({ showProjectDialog: isOn, project: null });
  };

  onSubmitAction = ({ originalSlug, ...rest }) => {
    this.setState({ showProjectDialog: false, project: null });
    if (originalSlug == null) {
      this.props.addProject(rest);
    } else {
      this.props.updateProject({ originalSlug, ...rest });
    }
  };

  onDeleteAction = slug => {
    this.setState({ showProjectDialog: false, project: null });
    this.props.deleteProject(slug);
  };

  toggleStar = slug => () => {
    this.props.toggleProjectStar(slug);
  };

  editProject = slug => () => {
    const project = find(this.props.projects, ['slug', slug]);
    this.setState({ showProjectDialog: true, project });
  };

  columns = [
    { name: 'Name', options: { filter: false, sort: true } },
    { name: 'Description', options: { filter: false, sort: true } },
    { name: 'Owner', options: { filter: true, sort: true } },
    { name: 'Last update', options: { filter: false, sort: true } },
    { name: 'Actions', options: { filter: false, sort: false } },
  ];

  options = {
    selectableRows: false,
    rowsPerPage: 30,
    rowsPerPageOptions: [10, 30, 50],
    print: false,
    download: false,
    responsive: 'scroll',
    fixedHeader: true,
  };

  render() {
    const { classes, projects, isLoading, isUpdating } = this.props;

    if ((isLoading && projects.length === 0) || isUpdating) {
      return <LoadingBar />;
    }

    return (
      <React.Fragment>
        <ProjectDialog
          project={this.state.project}
          open={this.state.showProjectDialog}
          onCancel={this.onToggleDialog(false)}
          onSubmit={this.onSubmitAction}
          onDelete={this.onDeleteAction}
        />
        <ProjectsTable
          projects={projects}
          toggleStar={this.toggleStar}
          openProjectPage={this.openProjectPage}
          editProject={this.editProject}
        />
        <Fab
          color="primary"
          aria-label="Add"
          className={classes.fab}
          onClick={this.onToggleDialog(true)}
        >
          <AddIcon />
        </Fab>
      </React.Fragment>
    );
  }
}

ProjectsPage.propTypes = {
  fetchProjects: PropTypes.func.isRequired,
  addProject: PropTypes.func.isRequired,
  updateProject: PropTypes.func.isRequired,
  deleteProject: PropTypes.func.isRequired,
  toggleProjectStar: PropTypes.func.isRequired,
  projects: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  projects: makeSelectProjects(),
  isLoading: makeSelectIsLoading(),
  isUpdating: makeSelectIsUpdating(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchProjects,
      addProject,
      updateProject,
      deleteProject,
      toggleProjectStar,
    },
    dispatch,
  );

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'projects', reducer });
const withSaga = injectSaga({ key: 'projects', saga });
const withStyle = withStyles(styles);

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyle,
)(ProjectsPage);
