import React from "react";

const oAuthLoginButton = (props) => {
  return (
    <button
      className="flex justify-center items-center h-1/6 w-full md:w-3/4 m-3 border border-solid border-black bg-white text-center font-md poppins"
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {"Login with " + props.btnText}
    </button>
  );
};

export default oAuthLoginButton;
