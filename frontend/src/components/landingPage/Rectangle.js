import React from "react";

const rectangle = () => {
  return (
    <div className="absolute top-40 right-40 w-1/4 h-2/5 bg-purple hidden md:block">
      <div className="absolute -top-5 -right-3 h-1/3 w-1/2 border border-solid border-pink"></div>
      <div className="absolute -top-10 -right-6 h-1/3 w-1/2 border border-solid border-pink"></div>
      <div className="absolute -top-16 -right-9 h-1/3 w-1/2 border border-solid border-pink"></div>
      <div className="absolute -top-20 -right-12 h-1/3 w-1/2 border border-solid border-pink"></div>
    </div>
  );
};

export default rectangle;
