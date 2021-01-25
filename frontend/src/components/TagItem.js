import React from "react";

const tagItem = (props) => {
  return (
    <li className="w-10 h-5 mx-0.5 bg-pink border border-black text-black text-center text-xs">
      #{props.tagValue}
    </li>
  );
};

export default tagItem;
