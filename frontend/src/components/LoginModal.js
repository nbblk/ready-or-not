import React from "react";
import { Link, useHistory } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import GitHubLogin from "react-github-login";

import Backdrop from "./Backdrop";
import OAuthLoginButton from "./OAuthLoginButton";
import ModalCloseIcon from "./svgIcons/ModalCloseIcon";

const LoginModal = (props) => {
  const GOOGLE_OAUTH_CLIENT_ID = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID;
  const GITHUB_OAUTH_CLIENT_ID = process.env.REACT_APP_GITHUB_OAUTH_CLIENT_ID;

  const history = useHistory();

  const loginSuccess = async (response, oauthType) => {
    const uri = `http://localhost:8080/api/v1/auth/${oauthType}`;
    if (oauthType === "google") {
      await verifyToken(uri, { token: response.tokenId });
    }

    if (oauthType === "github") {
      verifyToken(uri, response); // code object
    }

    async function verifyToken(uri, tokenId) {
      const response = await fetch(uri, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(tokenId),
        headers: { "Content-Type": "application/json" },
      });
      const user = await response.json();
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          valid: true,
          _id: user._id,
          token: user.token,
          oauth: user.oauth,
          email: user.email,
        })
      );
      history.push("/main");
    }
  };

  const loginFailure = async (error, details) => {
    console.error(error, details);
  };

  return (
    <Backdrop>
      <div className="relative h-1/3 md:h-1/3 w-full md:w-1/3 p-3.5 flex flex-col justify-center items-center bg-beige fixed z-50">
        <Link to="/">
          <ModalCloseIcon />
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
              redirectUri="/main"
            />
          )}
          onSuccess={(response) => loginSuccess(response, "google")}
          onFailure={(error, details) => loginFailure(error, details)}
        />
        <GitHubLogin
          clientId={GITHUB_OAUTH_CLIENT_ID}
          redirectUri=""
          className="flex justify-center items-center h-1/6 w-full md:w-3/4 m-3 border border-solid border-black bg-white text-center font-md poppins"
          onSuccess={(tempCode) => loginSuccess(tempCode, "github")}
          onFailure={(error) => loginFailure(error)}
        />
      </div>
    </Backdrop>
  );
};

export default LoginModal;
