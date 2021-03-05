import React from "react";

const tagItem = (props) => {
  return (
    <li
      className="w-auto h-5 m-0.5 p-0.5 bg-pink border border-black text-black text-center text-xs cursor-pointer leading-3"
      onClick={props.click}
    >
      #{props.tagValue}
    </li>
  );
};

export default tagItem;
