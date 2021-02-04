import React, { Component } from "react";
import NewArticleIcon from "./NewArticle";
import Article from "./Article";

const user = JSON.parse(sessionStorage.getItem("user"));

class Articles extends Component {
  state = {
    articles: [],
  };

  async fetchData() {
    const response = await fetch(
      `http://localhost:8080/api/v1/articles?uid=${user._id}&oauth=${user.oauth}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "X-Access-Token": `${user.token}`,
        },
      }
    );
    const list = await response.json();
    if (list) this.setState({ articles: list[0].articles });
  }

  findArticle(_id) {
    const arr = [...this.state.articles];
    let idx;
    arr.map((article, index) => {
      if (article._id === _id) {
        idx = index;
      }
      return idx;
    });
    return idx;
  }

  async updateArticle(_id) {
    const arr = [...this.state.articles];
    const found = this.findArticle(_id);
    if (found !== undefined) {
        arr.splice(found);
        await this.setState({ articles: arr });
    } else {
        throw Error(`article ${_id} not found`);
    }
  }

  async handleArchive(article) {
    const repsonse = await fetch(
      `http://localhost:8080/api/v1/archive?uid=${user._id}&oauth=${user.oauth}`,
      {
        method: "PUT",
        body: JSON.stringify(article),
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "X-Access-Token": `${user.token}`,
        },
      }
    );
    if (repsonse.status === 201) {
      await this.updateArticle(article._id);
    } 
  };

  handleAddNote = () => {
    this.props.history.push("/notes");
  };

  async handleDelete(_id) {
    const user = JSON.parse(sessionStorage.getItem("user"));

    fetch(
      `http://localhost:8080/api/v1/articles?uid=${user._id}&oauth=${user.oauth}`,
      {
        method: "DELETE",
        body: JSON.stringify({ _id: _id }),
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "X-Access-Token": `${user.token}`,
        },
      }
    )
      .then(async (response) => {
        if (response.status === 200) {
         await this.updateArticle(_id);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  componentDidMount() {
    this.fetchData();
  }

  render() {
    return (
      <section className="w-full h-full p-10 flex flex-col flex-wrap md:flex-row justify-center content-center">
        <NewArticleIcon />
        {this.state.articles
          ? this.state.articles.map((article, index) => {
              return (
                <Article
                  key={article._id}
                  _id={article._id}
                  url={article.url}
                  due={article.due}
                  tags={article.tags}
                  title={article.title}
                  image={article.image}
                  archive={() => this.handleArchive(article)}
                  addNote={() => this.handleAddNote(article._id)}
                  delete={() => this.handleDelete(article._id)}
                />
              );
            })
          : null}
      </section>
    );
  }
}

export default Articles;