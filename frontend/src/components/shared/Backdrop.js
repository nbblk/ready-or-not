import React from "react";

const Backdrop = ({ children }) => {
  return (
    <div className="fixed h-full w-full bg-black bg-opacity-75 z-50 flex justify-center items-center">
      {children}
    </div>
  );
};

export default Backdrop;
