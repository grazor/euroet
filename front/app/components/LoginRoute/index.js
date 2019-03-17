import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const LoginRoute = props => {
  const { location, isAuthenticated, component: Component, ...rest } = props;
  const from = (location.state && location.state.from) || '/';

  return (
    <Route
      {...rest}
      render={componentProps =>
        isAuthenticated ? (
          <Redirect push to={{ pathname: from }} />
        ) : (
          <Component {...componentProps} />
        )
      }
    />
  );
};

export default LoginRoute;
