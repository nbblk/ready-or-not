import React from "react";

const toggledMenu = (props) => {
  return (
    <ul
      className={
        props.opened
          ? "w-2/3 md:w-1/5 p-10 fixed font-poppins no-underline text-black border border-black bg-white shadow-bold"
          : "hidden"
      }
    >
      {["main", "archive", "about"].map((menu, index) => {
        return (
          <li
            key={index}
            className="m-5 hover:text-purple uppercase text-lg"
            onClick={() => window.location.replace(`/${menu}`)}
          >
            {menu}
          </li>
        );
      })}
    </ul>
  );
};

export default toggledMenu;
