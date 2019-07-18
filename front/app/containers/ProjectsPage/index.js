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
import EtBreadcumbs from 'components/Breadcumbs';

import ProjectDialog from './ProjectDialog';
import ProjectsTable from './ProjectsTable';
import reducer from './reducer';
import saga from './saga';
import {
  addProject,
  deleteProject,
  fetchProjects,
  setProjectStar,
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
    bottom: theme.spacing(2),
    right: theme.spacing(2),
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

  setStar = (slug, isSet) => () => {
    this.props.setProjectStar(slug, isSet);
  };

  editProject = slug => () => {
    const project = find(this.props.projects, ['slug', slug]);
    this.setState({ showProjectDialog: true, project });
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
        <EtBreadcumbs />
        <ProjectsTable
          projects={projects}
          setStar={this.setStar}
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
  setProjectStar: PropTypes.func.isRequired,
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
      setProjectStar,
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
