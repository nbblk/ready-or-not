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
  const [valid, setValid] = useState(false);
  const loginSuccess = async (response, oauthType) => {
    const uri = `http://localhost:8080/api/v1/auth/${oauthType}`;
    if (oauthType === "google") {
      localStorage.setItem(
        "user",
        JSON.stringify({
          token: response.accessToken,
          imageUrl: response.profileObj.imageUrl,
          email: response.profileObj.email,
        })
      );
      verifyToken(uri, { token: response.tokenId });
    }

    if (oauthType === "github") {
      localStorage.setItem("user", JSON.stringify({_id: null, oauth: null, email: null}));
      verifyToken(uri, response); // code object
    }
  };

  async function verifyToken(uri, tokenId) {
    const res = await fetch(uri, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(tokenId),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
  
    const user = JSON.parse(localStorage.getItem("user"));
    user.oauth = data.oauth;
    user._id = data._id;
    user.email = data.email; 
    localStorage.setItem("user", JSON.stringify(user));
    await setValid(true);
  };

  const loginFailure = async (error) => {
    console.error(error);
  };

  const logout = async (history) => {
    localStorage.removeItem("user");
    await setValid(false);
    history.replace("/");
  };

  return {
    valid,
    loginSuccess,
    loginFailure,
    logout,
  };
}

export function PrivateRoute({ children, ...rest }) {
  const auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
      auth.valid ? (
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
