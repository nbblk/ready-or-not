import React, { useContext, createContext, useState, useEffect } from "react";
import { Redirect, Route } from "react-router-dom";

const authContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export function useAuth() {
  return useContext(authContext);
}

function useProvideAuth(value) {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("user")) {
      setLoggedIn(true);
    }
  }, []);

  const loginSuccess = async (response, oauthType) => {
    if (oauthType === "google") {
      await verifyToken({
        oauthType: oauthType,
        token: response.tokenId,
        accessToken: response.accessToken,
      });
    }

    if (oauthType === "github") {
      await verifyToken({ oauthType: oauthType, code: response }); // code object
    }
  };

  async function verifyToken(data) {
    const uri = `http://localhost:8080/api/v1/auth`;
    const res = await fetch(uri, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    let response = await res.json();
    sessionStorage.setItem("user", JSON.stringify(response));
    setLoggedIn(true);
  }

  const loginFailure = async (error, detail) => {
    console.error(error, detail);
  };

  const logout = (redirect) => {
    sessionStorage.removeItem("user");
    setLoggedIn(false);
    redirect();
  };

  return {loggedIn, loginSuccess, loginFailure, logout };
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
