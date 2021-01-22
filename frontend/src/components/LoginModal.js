import React from "react";
import { Link, useHistory } from "react-router-dom";
import { GoogleLogin } from "react-google-login";

import OAuthLoginButton from "./OAuthLoginButton";
import ModalCloseButton from "./ModalCloseButton";
import { useAuth } from "../context/Auth";

const LoginModal = (props) => {
  const GOOGLE_OAUTH_CLIENT_ID = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID;
  const history = useHistory();

  const clickClose = () => history.goBack();
  const auth = useAuth();

  return (
    <div
      className="fixed h-full w-full bg-black bg-opacity-75 z-50 flex justify-center items-center"
      onClick={() => clickClose()}
    >
      <div className="relative h-1/3 md:h-1/3 w-full md:w-1/3 p-3.5 flex flex-col justify-center items-center bg-beige fixed z-50">
        <Link to="/">
          <ModalCloseButton onClick={() => clickClose()} />
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
          onSuccess={(response) => auth.loginSuccess(response)}
          onFailure={(error) => auth.loginFailure(error)}
        />
        <OAuthLoginButton btnText="Apple" />
      </div>
    </div>
  );
};

export default LoginModal;
