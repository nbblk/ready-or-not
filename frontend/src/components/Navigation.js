import React from "react";
import { Link, useHistory } from "react-router-dom";

import Logo from "./Logo";
import Profile from './Profile';
import ToggleMenuButton from "./ToggleMenuButton";
import CtaButton from "./CtaButton";
import { useAuth } from "../context/Auth";

const Navigation = (props) => {
  const auth = useAuth();
  const history = useHistory();
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <nav className="h-15 w-screen px-10 flex justify-between items-center bg-navy fixed z-40">
      {auth.valid ? <ToggleMenuButton /> : <Logo />}
      <div className="flex justify-between items-center">
        {auth.valid && user ? (
          <div className="w-30 h-50 mx-8 flex jusitfy-center items-center">
            <p className="m-1.5 text-white">{user.email}</p>
            <Profile imgUrl={user.imageUrl} />
          </div>
        ) : null}
        {auth.valid && user ? (
          <CtaButton
            btnText="logout"
            btnColor="dark"
            click={() => auth.logout(history)}
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
