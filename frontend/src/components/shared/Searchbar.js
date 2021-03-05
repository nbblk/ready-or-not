import React from "react";

const searchbar = (props) => {
  return (
    <div className="w-3/4 my-12 md:my-6 flex justify-center">
      <input
        className="w-full md:w-2/5 py-3 px-6 h-10 border border-black rounded-full shadow-bold focus:outline-none"
        type="text"
        placeholder="Enter something..."
        onChange={props.change}
        onKeyDown={props.keydown}
      />
    </div>
  );
};

export default searchbar;
