import React from "react";
import { Redirect, Route } from "react-router-dom";

export function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={() => 
        sessionStorage.getItem('user')
        ? children
        : <Redirect to={{ pathname: "/" }} />}
    />
  )
};


