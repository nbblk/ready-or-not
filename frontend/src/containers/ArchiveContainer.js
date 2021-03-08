import React, { Component } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Article from "../components/articles/Article";
import fetchData from "../modules/httpRequest";
import Backdrop from "../components/shared/Backdrop";
import ErrorFallback from "../components/modals/ErrorFallback";

const user = JSON.parse(sessionStorage.getItem("user"));

class ArchiveContainer extends Component {
  state = {
    articles: [],
    error: false,
    errorMessage: "",
  };

  fetchArchived() {
    fetchData(`http://localhost:8080/api/v1/archive?uid=${user._id}`)
      .then(async (response) => {
        const list = await response.json();
        if (list) this.setState({ articles: list[0].archived });
      })
      .catch((error) => {
        this.setState({
          ...this.state,
          error: true,
          errorMessage: error.message,
        });
      });
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

  updateArticle(_id) {
    const arr = [...this.state.articles];
    const found = this.findArticle(_id);
    if (found !== undefined) {
      arr.splice(found, 1);
      this.setState({ ...this.state, articles: arr });
    } else {
      throw Error(`article ${_id} not found`);
    }
  }

  handleAddNote = () => {
    this.props.history.push("/notes");
  };

  async handleDelete(_id) {
    fetchData(`http://localhost:8080/api/v1/archive?uid=${user._id}`, {
      method: "DELETE",
      body: JSON.stringify({ _id: _id }),
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        await this.updateArticle(_id);
      })
      .catch((error) => {
        this.setState({
          ...this.state,
          error: true,
          errorMessage: error.message,
        });
      });
  }

  componentDidMount() {
    this.fetchArchived();
  }

  render() {
    return (
      <ErrorBoundary>
        {this.state.error ? (
          <Backdrop>
            <ErrorFallback error={{ message: this.state.errorMessage }} />
          </Backdrop>
        ) : null}
        <section className="w-full h-full p-10 flex flex-col flex-wrap md:flex-row justify-center itmes-center">
          {this.state.articles
            ? this.state.articles.map((article) => {
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
      </ErrorBoundary>
    );
  }
}

export default ArchiveContainer;
