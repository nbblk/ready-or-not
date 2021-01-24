import React from "react";
import PlusIcon from "./svgIcons/NewArticlePlusIcon";

const newArticle = (props) => {
  return (
    <article className="relative w-full md:w-1/4 h-56 md:h-48 m-5 border border-solid border-black bg-beige rounded">
        <PlusIcon />
    </article>
  );
};

export default newArticle;
