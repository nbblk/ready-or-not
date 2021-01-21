import React from "react";
import { Route, Link, useHistory } from "react-router-dom";
import { GoogleLogin } from "react-google-login";

import OAuthLoginButton from "./OAuthLoginButton";
import ModalCloseButton from "./ModalCloseButton";

const LoginModal = (props) => {
  const GOOGLE_OAUTH_CLIENT_ID = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID;
  const history = useHistory();

  const clickBackdrop = () => history.goBack();

  return (
    <Route path="/login">
      <div
        className="fixed h-full w-full bg-black bg-opacity-75 z-50 flex justify-center items-center"
        onClick={() => clickBackdrop()}
      >
        <div className="relative h-1/3 md:h-1/3 w-full md:w-1/3 p-3.5 flex flex-col justify-center items-center bg-beige fixed z-50">
          <Link to="/">
            <ModalCloseButton />
          </Link>
          <GoogleLogin
            clientId={GOOGLE_OAUTH_CLIENT_ID}
            buttonText="Login with Google"
            render={(renderProps) => (
              <OAuthLoginButton
                btnText="Google"
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                isSignedIn={true}
              />
            )}
            onSuccess={props.loginSuccess}
            onFailure={props.loginFailure}
          />
          <OAuthLoginButton btnText="Apple" />
        </div>
      </div>
    </Route>
  );
};

export default LoginModal;
