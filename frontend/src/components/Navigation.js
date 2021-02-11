import React from "react";
import { Link, useHistory } from "react-router-dom";

import Logo from "./Logo";
import ToggleMenuButton from "./ToggleMenuButton";
import CtaButton from "./CtaButton";

const Navigation = (props) => {
  const history = useHistory();
  const user = JSON.parse(sessionStorage.getItem('user'));

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    history.push("/");
  };

  return (
    <nav className="fixed h-15 w-screen lg:w-full p-3.5 flex justify-between items-center bg-navy z-40">
      {user ? <ToggleMenuButton /> : <Logo />}
      <div className="flex justify-between items-center">
        {user ? (
          <div className="w-30 h-50 mx-8 flex jusitfy-center items-center">
            <p className="hidden m-1.5 text-white md:block">
              {user.email}
            </p>
          </div>
        ) : null}
        {user && props.auth ? (
          <CtaButton
            btnText="logout"
            btnColor="dark"
            click={() => handleLogout()}
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
