import React from "react";
import NewArticle from "./NewArticle";
import Article from "./Article";

function Articles(props) {
  return (
    <section className="w-full h-full p-10 flex flex-col flex-wrap md:flex-row justify-center content-center">
      <NewArticle />
      {props.articles.map((article, index) => {
        return (
          <Article
            key={article._id}
            _id={article._id}
            url={article.url}
            due={article.due}
            tags={article.tags}
          ></Article>
        );
      })}
    </section>
  );
}

export default Articles;
