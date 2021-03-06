/**
 *
 * App
 */

import ComponentsCatalog from 'containers/ComponentsCatalog/Loadable';
import ComponentsPage from 'containers/ComponentsPage/Loadable';
import EuroetNav from 'components/EuroetNav';
import LoginPage from 'containers/LoginPage/Loadable';
import LoginRoute from 'components/LoginRoute';
import PrivateRoute from 'components/PrivateRoute';
import ProductsPage from 'containers/ProductsPage/Loadable';
import ProjectsPage from 'containers/ProjectsPage/Loadable';
import ComponentImportPage from 'containers/ComponentImportPage/Loadable';
import PropTypes from 'prop-types';
import React from 'react';
import injectSaga from 'utils/injectSaga';
import { DAEMON } from 'utils/constants';
import { Helmet } from 'react-helmet';
import { Route, Switch, Redirect } from 'react-router-dom';
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
        <Helmet titleTemplate="%s - Engineering" defaultTitle="Engineering">
          <meta
            name="description"
            content="Engineering engineering application"
          />
        </Helmet>
        <Notifier />
        <EuroetNav isAuthenticated={auth} user={user} logout={doLogout}>
          <Switch>
            <Route exact path="/">
              <Redirect to="/projects" />
            </Route>
            <LoginRoute
              exact
              path="/login"
              component={LoginPage}
              isAuthenticated={auth}
            />
            <PrivateRoute
              exact
              path="/components"
              component={ComponentsCatalog}
              isAuthenticated={auth}
            />
            <PrivateRoute
              exact
              path="/import"
              isAuthenticated={auth}
              component={ComponentImportPage}
            />
            <PrivateRoute
              exact
              path="/projects"
              component={ProjectsPage}
              isAuthenticated={auth}
            />
            <PrivateRoute
              exact
              path="/project/:slug"
              component={ProductsPage}
              isAuthenticated={auth}
            />
            <PrivateRoute
              exact
              path="/project/:projectSlug/:productSlug"
              component={ComponentsPage}
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

const withSaga = injectSaga({ key: 'global', saga: authSaga, mode: DAEMON });

export default compose(
  withConnect,
  withSaga,
)(App);
