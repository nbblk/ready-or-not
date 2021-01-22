import React from "react";

const ctaButton = (props) => {
  const theme =
    props.btnColor === "dark"
      ? "text-white hover:text-black hover:bg-white"
      : "text-black hover:text-white hover:bg-purple";
  return (
    <button
      className={theme.concat(
        " w-32 h-10 bg-transparent border border-gray-500 focus:outline-none rounded uppercase font-archivo"
      )}
      onClick={props.click}
    >
      {props.btnText}
    </button>
  );
};
export default ctaButton;
