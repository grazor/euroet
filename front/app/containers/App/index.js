/**
 *
 * App
 */

import EuroetNav from 'components/EuroetNav';
import IndexPage from 'containers/IndexPage/Loadable';
import LoginPage from 'containers/LoginPage/Loadable';
import LoginRoute from 'components/LoginRoute';
import PrivateRoute from 'components/PrivateRoute';
import ProjectsPage from 'containers/ProjectsPage/Loadable';
import PropTypes from 'prop-types';
import React from 'react';
import injectSaga from 'utils/injectSaga';
import { Helmet } from 'react-helmet';
import { Route, Switch } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Notifier from './Notifier';
import authSaga from './saga';
import { fetchUser, logout } from './actions';
import {
  makeSelectIsAuthenticated,
  makeSelectLocation,
  makeSelectUser,
} from './selectors';

/* eslint-disable react/prefer-stateless-function */
export class App extends React.Component {
  componentDidMount() {
    if (this.props.isAuthenticated) {
      this.props.fetchUser();
    }
  }

  render() {
    const { isAuthenticated: auth, user, logout: doLogout } = this.props;

    return (
      <div>
        <Helmet titleTemplate="%s - Euroet" defaultTitle="Euroet">
          <meta name="description" content="Euroet engineering application" />
        </Helmet>
        <Notifier />
        <EuroetNav isAuthenticated={auth} user={user} logout={doLogout}>
          <Switch>
            <Route exact path="/" component={IndexPage} />
            <LoginRoute
              exact
              path="/login"
              component={LoginPage}
              isAuthenticated={auth}
            />
            <PrivateRoute
              exact
              path="/projects"
              component={ProjectsPage}
              isAuthenticated={auth}
            />
          </Switch>
        </EuroetNav>
      </div>
    );
  }
}

App.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  fetchUser: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  user: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  user: makeSelectUser(),
  isAuthenticated: makeSelectIsAuthenticated(),
  location: makeSelectLocation(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ fetchUser, logout }, dispatch);

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'global', saga: authSaga });

export default compose(
  withConnect,
  withSaga,
)(App);
