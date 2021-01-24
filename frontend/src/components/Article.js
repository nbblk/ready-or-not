import React from "react";
import ArticleIcons from "./ArticleIcons";

const article = (props) => {
  return (
    <article className="w-full md:w-1/4 h-56 md:h-48 m-5 border border-solid border-black bg-transparent rounded">
      <div className="w-auto h-2/3 bg-transparent overflow-hidden">
        <ArticleIcons />
        <img
          className="w-full h-full object-scale-down"
          src={props.url}
          alt="img"
        />
      </div>
      <h1 className="h-1/3 p-3 text-2xl md:text-lg text-left font-archivo text-black">
        {props.title}
      </h1>
    </article>
  );
};

export default article;
