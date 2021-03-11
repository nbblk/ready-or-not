import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

import Article from "../components/articles/Article";
import fetchData from "../modules/httpRequest";
import Spinner from "../components/shared/spinner/Spinner";
import Backdrop from "../components/shared/Backdrop";
import ErrorFallback from "../components/modals/ErrorFallback";

class ArchiveContainer extends Component {
  state = {
    result: [],
    articles: [],
    isRedirect: false,
    redirectId: null,
    loading: false,
    error: false,
    errorMessage: "",
  };

  async fetchArchived() {
    const isSearch = this.props.isSearch;// || this.props.location.state.isSearch;
    if (isSearch) {
      this.setState({ ...this.state, result: this.props.result });
    } else {
      const user = JSON.parse(sessionStorage.getItem("user"));
      this.setState({ ...this.state, result: null, loading: true });
      await fetchData(`${API_SERVER_URI}/archive?uid=${user._id}`)
        .then(async (response) => {
          this.setState({ loading: false });
          const list = await response.json();
          if (list) this.setState({ articles: list[0].archived });
        })
        .catch((error) => {
          this.setState({
            error: true,
            errorMessage: error.message,
          });
        });
    }
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

  handleAddNote = (_id) => {
    this.setState({ ...this.state, isRedirect: true, redirectId: _id });
  };

  handleDelete(_id) {
    const user = JSON.parse(sessionStorage.getItem("user"));
    fetchData(`${API_SERVER_URI}/archive?uid=${user._id}`, {
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

  getArticle = () => {
    const found = this.state.articles.filter(
      (article) => article._id === this.state.redirectId
    );
    return found;
  };

  getArticles(articles) {
    return articles.map((article) => {
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
    });
  }

  renderArticles() {
    const result = this.props.result;
    const articles = this.state.articles;
    let articlesToRender = null;

    if (result && result.length > 0) {
      articlesToRender = this.getArticles(result);
    } else {
      if (articles && articles.length > 0) {
        articlesToRender = this.getArticles(articles);
      }
    }
    return articlesToRender;
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
          {this.state.loading ? <Spinner /> : null}
          {this.state.isRedirect ? (
            <Redirect
              to={{
                pathname: `/notes/${this.state.redirectId}`,
                state: {
                  articleId: this.state.redirectId,
                  article: this.getArticle(),
                  isArchived: true,
                },
              }}
            />
          ) : null}
          {this.renderArticles()}
        </section>
      </ErrorBoundary>
    );
  }

  componentDidMount() {
    // const result = this.props.result;
    // if (result && result.length > 0) {
    //   this.setState({
    //     ...this.state,
    //     result: this.props.result,
    //   });
    // } else {
    this.fetchArchived();
    //    }
  }
}

export default ArchiveContainer;
