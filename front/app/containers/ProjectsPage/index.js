/**
 *
 * ProjectsPage
 *
 */

import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withStyles } from '@material-ui/core/styles';

import ProjectsTable from './ProjectsTable';
import reducer from './reducer';
import saga from './saga';
import { fetchProjects } from './actions';
import { makeSelectIsLoading, makeSelectProjects } from './selectors';

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
    createDialog: false,
  };

  componentDidMount() {
    this.props.fetchProjects();
  }

  openProjectPage = slug => () => {
    this.props.history.push(`/project/${slug}`);
  };

  onToggleDialog = isOn => () => {
    this.setState({ createDialog: isOn });
  };

  onSubmitDialog = () => ({ name, description }) => {
    this.setState({ createDialog: false });
  };

  toggleStar = slug => () => {};

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
    const { classes, projects, isLoading } = this.props;

    const loadingView = (
      <Paper className={classes.loadingRoot}>
        <LinearProgress color="primary" />
      </Paper>
    );

    if (isLoading && projects.size === 0) return loadingView;

    return (
      <React.Fragment>
        <ProjectsTable
          projects={projects}
          toggleStar={this.toggleStar}
          openProjectPage={this.openProjectPage}
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
  projects: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  projects: makeSelectProjects(),
  isLoading: makeSelectIsLoading(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ fetchProjects }, dispatch);

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
