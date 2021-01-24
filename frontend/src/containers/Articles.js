import React, { Component } from "react";
import NewArticle from '../components/NewArticle';
import Article from "../components/Article";

class Articles extends Component {
  state = {
    articles: [
      { id: 1, title: "lorem ipsum", imageUrl: "" },
      { id: 2, title: "lorem ipsum", imageUrl: "" },
      { id: 3, title: "lorem ipsum", imageUrl: "" },
    ],
  };
  render() {
    return (
      <section className="w-full h-full p-10 flex flex-col flex-wrap md:flex-row justify-center content-center">
        <NewArticle />
        {this.state.articles.map((article) => {
          return (
            <Article title={article.title} url={article.imageUrl}></Article>
          );
        })}
      </section>
    );
  }
}

export default Articles;
