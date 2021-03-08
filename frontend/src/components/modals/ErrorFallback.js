import React from "react";
import { Link } from "react-router-dom";

import ModalCloseIcon from "../shared/svgIcons/ModalCloseIcon";

const errorFallback = ({ error, resetErrorBoudnary }) => {
  return (
    <div
      role="alert"
      className="relative h-1/3 md:h-1/3 w-full md:w-1/3 p-3.5 flex flex-col justify-center items-center bg-beige fixed z-50"
    >
      <Link to="/">
        <ModalCloseIcon />
      </Link>
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
    </div>
  );
}

export default errorFallback;
