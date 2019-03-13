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
import injectSaga from 'utils/injectSaga';

import {
  makeSelectUser,
  makeSelectIsAuthenticated,
  makeSelectLocation,
} from './selectors';

import IndexPage from 'containers/IndexPage/Loadable';
import LoginPage from 'containers/LoginPage/Loadable';
import { fetchUser } from './actions';
import authSaga from './saga';

import LoginRoute from 'components/LoginRoute';
import PrivateRoute from 'components/PrivateRoute';
import EuroetNav from 'components/EuroetNav';

/* eslint-disable react/prefer-stateless-function */
export class App extends React.Component {
  componentDidMount() {
    if (this.props.isAuthenticated) {
      this.props.getUser();
    }
  }

  render() {
    const { isAuthenticated: auth, user, dispatch } = this.props;

    return (
      <div>
        <Helmet titleTemplate="%s - Euroet" defaultTitle="Euroet">
          <meta name="description" content="Euroet engineering application" />
        </Helmet>
        <EuroetNav isAuthenticated={auth} user={user} dispatch={dispatch}>
          <Switch>
            <Route exact path="/" component={IndexPage} />
            <LoginRoute
              exact
              path="/login"
              component={LoginPage}
              isAuthenticated={auth}
            />
          </Switch>
        </EuroetNav>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  user: makeSelectUser(),
  isAuthenticated: makeSelectIsAuthenticated(),
  location: makeSelectLocation(),
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  getUser: () => dispatch(fetchUser()),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'auth', saga: authSaga });

export default compose(
  withConnect,
  withSaga,
)(App);
