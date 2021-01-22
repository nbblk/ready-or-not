import React, { useContext, createContext, useState } from "react";
import { Redirect, Route } from "react-router-dom";

const authContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export function useAuth() {
  return useContext(authContext);
}

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const loginSuccess = async (googleData) => {
    const res = await fetch("http://localhost:8080/api/v1/auth/google", {
      method: "POST",
      body: JSON.stringify({ token: googleData.tokenObj["id_token"] }),
      headers: { "Content-Type": "application/json" },
      mode: "cors",
    });

    const data = await res.json();
    setUser(data.value);
    localStorage.setItem('user', JSON.stringify(data.value));
  };

  const loginFailure = async error => {
    console.error(error);
  };

 const logout = (history) => {
   debugger;
      setUser(null);
      localStorage.removeItem('user');
      history.replace("/");
  }

  return {
    user,
    loginSuccess,
    loginFailure,
    logout
  };
}

export function PrivateRoute({ children, ...rest }) {
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) => 
        auth.user ? 
        children
        : (
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
