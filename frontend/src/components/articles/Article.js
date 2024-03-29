import React from "react";
import ArticleIcons from "./ArticleIcons";
import TagItem from "../shared/TagItem";

const Article = (props) => {
  return (
    <article className="w-full md:w-1/3 md:h-full md:m-5 my-3 p-3 border border-solid border-black bg-white rounded">
      <div className="w-auto h-2/3 bg-transparent overflow-hidden">
        <ArticleIcons
          isArchived={props.isArchived}
          archive={props.archive}
          add={props.addNote}
          delete={props.delete}
        />
        <img
          className="w-full h-full object-cover"
          src={props.image || "/placeholder.jpg"}
          alt="img"
        />
      </div>
      {props.tags && props.tags.length > 0 ? <TagItem tags={props.tags} /> : null}
      <a
        href={props.url}
        target="_blank"
        rel="noreferrer"
        className="block h-1/3 m-5 text-2xl md:text-lg text-left font-archivo text-black text-left hover:text-purple cursor-pointer"
      >
        {props.title}
      </a>
    </article>
  );
};

export default Article;
