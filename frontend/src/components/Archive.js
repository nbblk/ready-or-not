import React, { Component } from "react";
import Article from "./Article";

const user = JSON.parse(sessionStorage.getItem("user"));

class Archive extends Component {
  state = {
    articles: [],
  };

  async fetchData() {
    const response = await fetch(
      `http://localhost:8080/api/v1/archive?uid=${user._id}&oauth=${user.oauth}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "X-Access-Token": `${user.token}`,
        },
      }
    );
    const list = await response.json();
    if (list) this.setState({ articles: list[0].archived });
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
        arr.splice(found, 1);
        await this.setState({ articles: arr });
    } else {
        throw Error(`article ${_id} not found`);
    }
  }

  handleAddNote = () => {
    this.props.history.push("/notes");
  };

  async handleDelete(_id) {
    fetch(
      `http://localhost:8080/api/v1/archive?uid=${user._id}&oauth=${user.oauth}`,
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
  }

  componentDidMount() {
    this.fetchData();
  }

  render() {
    return (
      <section>
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
                  addNote={() => this.handleAddNote(article._id)}
                  delete={() => this.handleDelete(article._id)}
                  isArchived={true}
                />
              );
            })
          : null}
      </section>
    );
  }
}

export default Archive;
