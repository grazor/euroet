import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const PrivateRoute = props => {
  const { location, isAuthenticated, component: Component, ...rest } = props;
  return (
    <Route
      {...rest}
      render={componentProps =>
        isAuthenticated ? (
          <Component {...componentProps} />
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
