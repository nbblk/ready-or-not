import React from "react";

const tagItem = (props) => {
  return (
    <ul className="table my-2">
      {props.tags.map((tag, index) => {
        return (
          <li
            key={index}
            className="inline w-auto h-5 m-0.5 p-0.5 bg-pink border border-black text-black text-center text-xs cursor-pointer leading-3"
            onClick={props.click}
          >
            #{tag}
          </li>
        );
      })}
    </ul>
  );
};

export default tagItem;
