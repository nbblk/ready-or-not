import React from "react";
import ArticleIcons from "./ArticleIcons";
import TagItem from "./TagItem";

const Article = (props) => {
  return (
    <article className="w-full md:w-1/3 m-5 p-3 border border-solid border-black bg-white rounded">
      <div className="w-auto h-2/3 bg-transparent overflow-hidden">
        <ArticleIcons
          archive={props.archive}
          add={props.addNote}
          delete={props.delete}
        />
        <img className="w-full h-full object-cover" src={props.image} alt="img" />
      </div>
      <TagItem tags={props.tags}/>
      <h1 className="h-1/3 m-5 text-2xl md:text-lg text-left font-archivo text-black text-left">
        {props.title}
      </h1>
    </article>
  );
};

export default Article;
