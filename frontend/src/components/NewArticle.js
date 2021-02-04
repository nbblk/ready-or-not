import React from "react";
import { Link } from "react-router-dom";

import PlusIcon from "./svgIcons/NewArticlePlusIcon";

const newArticle = (props) => {
  return (
    <article className="relative w-full md:w-1/3 h-56 md:h-48 m-5 border border-solid border-black bg-beige rounded">
      <Link to="/new">
        <PlusIcon />
      </Link>
    </article>
  );
};

export default newArticle;
