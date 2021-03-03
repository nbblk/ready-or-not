import React from "react";
import { useHistory } from "react-router-dom";

const Logo = () => {
  const history = useHistory();
  return (
    <div className="w-auto h-auto" onClick={() => history.replace("/")}>
      <img alt="logo" src="/Logo.png"></img>
    </div>
  );
};

export default Logo;
