/**
 *
 * ProjectsPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import AddIcon from '@material-ui/icons/Add';

///import AddProjectDialog from 'components/AddProjectDialog/Loadable';

import { fetchProjects } from './actions';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { makeSelectProjects, makeSelectIsLoading } from './selectors';
import ProjectsTable from './ProjectsTable';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

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

  onFabClick = event => {
    this.setState({ createDialog: true });
  };

  onCancelDialog = () => {
    this.setState({ createDialog: false });
  };

  onSubmitDialog = values => {
    const { name, description } = values;
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

    if (isLoading && projects.size == 0) return loadingView;

    /*<AddProjectDialog
          open={this.state.createDialog}
          onCancel={this.onCancelDialog}
          onSubmit={this.onSubmitDialog}
        />*/
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
          onClick={this.onFabClick}
        >
          <AddIcon />
        </Fab>
      </React.Fragment>
    );
  }
}

ProjectsPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  fetchProjects: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  projects: makeSelectProjects(),
  isLoading: makeSelectIsLoading(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    fetchProjects: () => dispatch(fetchProjects()),
  };
}

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
