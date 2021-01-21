import React from "react";

const modalCloseButton = () => {
  return (
    <div className="absolute top-0 right-0 w-8 h-8 m-3">
      <svg viewBox="0 0 40 40">
        <path fill="none" stroke="black" d="M 10,10 L 30,30 M 30,10 L 10,30"></path>
      </svg>
    </div>
  );
};

export default modalCloseButton;
