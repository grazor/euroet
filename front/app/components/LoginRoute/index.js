import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const LoginRoute = ({
  location,
  isAuthenticated,
  component: Component,
  ...rest
}) => {
  const from = (location.state && location.state.from) || '/';

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Redirect push to={{ pathname: from }} />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default LoginRoute;
