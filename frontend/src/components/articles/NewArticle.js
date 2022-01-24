import React from "react";
import { Link } from "react-router-dom";

import PlusIcon from "../shared/svgIcons/NewArticlePlusIcon";

const newArticle = (props) => {
  return (
    <article className="relative w-full md:w-1/3 h-80 md:h-auto md:m-5 my-5 border border-solid border-black bg-beige hover:bg-opacity-25 cursor-pointer rounded">
      <Link to="/new">
        <PlusIcon />
      </Link>
    </article>
  );
};

export default newArticle;
