import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({
  location,
  isAuthenticated,
  component: Component,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            push
            to={{ pathname: '/login', state: { from: location.pathname } }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
