import React from "react";

const plusIcon = () => {
  return (
    <svg
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
      width="60"
      height="60"
      viewBox="0 0 60 60"
    >
      <line x1="0" y1="30" x2="60" y2="30" stroke="black" />
      <line x1="30" y1="0" x2="30" y2="60" stroke="black" />
    </svg>
  );
};

export default plusIcon;
