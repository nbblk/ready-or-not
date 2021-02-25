import React from "react";
import { Link } from "react-router-dom";

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
          <Link key={index} to={`/${menu}`}>
            <li className="m-5 hover:text-purple uppercase text-lg">
              {menu}
            </li>
          </Link>
        );
      })}
    </ul>
  );
};

export default toggledMenu;
