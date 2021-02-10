import React from "react";
import { Link } from "react-router-dom";

const toggledMenu = (props) => {
  return (
    <ul
      className={
        props.opened
          ? "w-2/3 md:w-1/5 p-10 fixed font-poppins no-underline text-black bg-beige shadow-bold"
          : "font-poppins no-underline text-white hidden"
      }
    >
      {["main", "archive", "export"].map((menu, index) => {
        return (
          <Link to={`/${menu}`}>
            <li key={index} className="m-5 hover:text-purple uppercase text-lg">
              {menu}
            </li>
          </Link>
        );
      })}
    </ul>
  );
};

export default toggledMenu;
