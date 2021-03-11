import React, { Component } from "react";
import { Redirect, withRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

import NewArticleIcon from "../components/articles/NewArticle";
import Article from "../components/articles/Article";
import fetchData from "../modules/httpRequest";
import Spinner from "../components/shared/spinner/Spinner";
import ErrorFallback from "../components/modals/ErrorFallback";
import Backdrop from "../components/shared/Backdrop";

class ArticleContainer extends Component {
  state = {
    result: [],
    articles: [],
    isRedirect: false,
    redirectId: null,
    loading: false,
    error: false,
    errorMessage: "",
  };

  fetchArticles() {
    const isSearch = this.props.isSearch;
    if (isSearch) {
      this.setState({ ...this.state, result: this.props.result });
    } else {      
      const user = JSON.parse(sessionStorage.getItem("user"));
      this.setState({ ...this.state, result: null, loading: true });
      fetchData(`${API_SERVER_URI}/articles?uid=${user._id}`)
        .then(async (response) => {
          const list = await response.json();
          if (list) {
            this.setState({
              ...this.state,
              articles: list[0].articles,
              loading: false,
            });
          }
        })
        .catch((error) => {
          this.setState({
            loading: false,
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
      arr.splice(found);
      this.setState({ articles: arr });
    } else {
      throw Error(`article ${_id} not found`);
    }
  }

  handleArchive(article) {
    const user = JSON.parse(sessionStorage.getItem("user"));
    this.setState({ loading: true });
    fetchData(`${API_SERVER_URI}/archive?uid=${user._id}`, {
      method: "PUT",
      body: JSON.stringify(article),
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        await this.updateArticle(article._id);
      })
      .catch((error) => {
        this.setState({
          loading: false,
          error: true,
          errorMessage: error.message,
        });
      });
  }

  handleAddNote = (_id) => {
    this.setState({ isRedirect: true, redirectId: _id });
  };

  handleDelete(_id) {
    const user = JSON.parse(sessionStorage.getItem("user"));
    this.setState({ loading: true });
    fetchData(`${API_SERVER_URI}/articles?uid=${user._id}`, {
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
          loading: false,
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
          archive={() => this.handleArchive(article)}
          addNote={() => this.handleAddNote(article._id)}
          delete={() => this.handleDelete(article._id)}
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
      <ErrorBoundary FallbackComponent={ErrorFallback}>
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
                  isArchived: false,
                },
              }}
            />
          ) : null}
          <NewArticleIcon />
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
    //} else {
      this.fetchArticles();
    //}
  }
}

export default withRouter(ArticleContainer);
