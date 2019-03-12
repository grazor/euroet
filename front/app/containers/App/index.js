/**
 *
 * App
 */

import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';

import {
  makeSelectUser,
  makeSelectIsAuthenticated,
  makeSelectLocation,
} from './selectors';

import LoginPage from 'containers/LoginPage/Loadable';

import LoginRoute from 'components/LoginRoute';
import PrivateRoute from 'components/PrivateRoute';

/* eslint-disable react/prefer-stateless-function */
export class App extends React.Component {
  render() {
    const { isAuthenticated: auth } = this.props;

    return (
      <div>
        <Helmet titleTemplate="%s - Euroet" defaultTitle="Euroet">
          <meta name="description" content="Euroet engineering application" />
        </Helmet>
        <Switch>
          <LoginRoute
            exact
            path="/login"
            component={LoginPage}
            isAuthenticated={auth}
          />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  user: makeSelectUser(),
  isAuthenticated: makeSelectIsAuthenticated(),
  location: makeSelectLocation(),
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(App);
