import React from "react";
import { Link, useHistory } from "react-router-dom";

import Logo from "./Logo";
import ToggleMenuButton from "./ToggleMenuButton";
import CtaButton from "./CtaButton";
import { useAuth } from "../context/Auth";

const Navigation = (props) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const auth = useAuth();
  const history = useHistory();

  const redirect = () => {
    history.push("/");
  };

  return (
    <nav className="h-15 w-full px-10 flex justify-between items-center bg-navy fixed z-40">
      {auth.loggedIn && user ? <ToggleMenuButton /> : <Logo />}
      <div className="flex justify-between items-center">
        {auth.loggedIn && user ? (
          <div className="w-30 h-50 mx-8 flex jusitfy-center items-center">
            <p className="m-1.5 text-white">{user.email}</p>
          </div>
        ) : null}
        {auth.loggedIn && user ? (
          <CtaButton
            btnText="logout"
            btnColor="dark"
            click={() => auth.logout(redirect)}
          />
        ) : (
          <Link to="/login">
            <CtaButton btnText="login" btnColor="dark" />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
