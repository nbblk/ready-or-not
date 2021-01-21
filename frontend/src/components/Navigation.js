import React from "react";
import { Link } from "react-router-dom";

import Logo from "./Logo";
import CtaButton from "./CtaButton";

const navigation = (props) => {
  return (
    <nav className="h-15 w-screen px-10 flex justify-between items-center bg-navy fixed z-40">
      <Logo />
      <Link to="/login">
        <CtaButton btnText="login" btnColor="dark" />
      </Link>
    </nav>
  );
};

export default navigation;
