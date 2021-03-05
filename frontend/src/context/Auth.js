import React, { useContext, createContext, useState, useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import fetchData from "../modules/httpRequest";

const authContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export function useAuth() {
  return useContext(authContext);
}

function useProvideAuth() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (sessionStorage.getItem("user")) {
      setLoggedIn(true);
    }
  }, []);

  const loginSuccess = async (response, oauthType) => {
    await authenticate({ oauthType: oauthType, token: response });
  };

  async function authenticate(data) {
    const uri = `http://localhost:8080/api/v1/auth`;

    await fetchData(uri, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })
      .then(async (response) => {
        const jsonData = await response.json();
        sessionStorage.setItem("user", JSON.stringify(jsonData));
        setLoggedIn(true);
      })
      .catch((error) => {
        setError(error.statusText);
      });
  }

  const loginFailure = async (error, detail) => {
    console.error(error, detail);
  };

  const logout = (redirect) => {
    sessionStorage.removeItem("user");
    setLoggedIn(false);
    redirect();
  };

  return { loggedIn, error, loginSuccess, loginFailure, logout };
}

export function PrivateRoute({ children, ...rest }) {
  const auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.loggedIn ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
