import React from "react";
import { Link, useHistory } from "react-router-dom";

import Logo from "./Logo";
import CtaButton from "./CtaButton";
import { useAuth } from "../context/Auth";

const Navigation = (props) => {
  const auth = useAuth();
  const history = useHistory();
  const user = auth.user ? JSON.parse(localStorage.getItem("user")) : null;

  return (
    <nav className="h-15 w-screen px-10 flex justify-between items-center bg-navy fixed z-40">
      <Logo />
      <div className="flex justify-between items-center">
        {user ? (
          <div className="w-30 h-50 mx-8 flex jusitfy-center items-center">
            <p className="m-1.5 text-white">{user.email}</p>
            <div className="m-1.5 rounded-full overflow-hidden">
              <img
                width="40px"
                height="40px"
                src={user.picture}
                alt="profile"
              />
            </div>
          </div>
        ) : null}
        <Link to={auth.user ? "/logout" : "/login"}>
          <CtaButton
            btnText={auth.user ? "logout" : "login"}
            btnColor="dark"
            click={auth.user ? () => auth.logout(history) : null}
          />
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
