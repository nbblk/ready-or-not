import React from "react";

const searchbar = (props) => {
  return (
    <div className="w-full flex flex-col md:flex-row m-5 justify-center items-center">
      <label className="block md:inline mx-6 my-6 md:my-0 font-archivo text-center md:text-auto text-xl">
        Search
      </label>
      <input
        className="block md:inline py-3 px-6 w-3/4 md:w-1/4 h-10 border border-black rounded-full shadow-bold"
        type="text"
        placeholder="Enter something..."
        onChange={props.change}
        onKeyDown={props.keydown}
      />
    </div>
  );
};

export default searchbar;
