import React from "react";

const rectangle = () => {
  return (
    <div className="fixed top-40 right-10 w-1/4 h-2/4 bg-purple hidden md:block">
      <div className="absolute -top-5 -left-5 h-1/3 w-1/2 border border-solid border-pink"></div>
      <div className="absolute -top-10 -left-10 h-1/3 w-1/2 border border-solid border-pink"></div>
      <div className="absolute -top-16 -left-16 h-1/3 w-1/2 border border-solid border-pink"></div>
    </div>
  );
};

export default rectangle;
