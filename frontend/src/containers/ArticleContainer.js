import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import NewArticleIcon from "../components/articles/NewArticle";
import Article from "../components/articles/Article";
import fetchData from "../modules/httpRequest";
import Spinner from "../components/shared/spinner/Spinner";

class ArticleContainer extends Component {
  state = {
    articles: [],
    isSearchedResult: false,
    isRedirect: false,
    redirectId: null,
    loading: false
  };

  async fetchArticles() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    this.setState({ ...this.state, loading: true });
    fetchData(`http://localhost:8080/api/v1/articles?uid=${user._id}`)
      .then(async (response) => {
        const list = await response.json();
        if (list) {
          this.setState({
            ...this.state,
            articles: list[0].articles,
            mode: "list",
            loading: false
          });
        }
      })
      .catch((error) => {
        this.setState({ ...this.state, loading: false });
        console.log(error);
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
      arr.splice(found);
      this.setState({ articles: arr });
    } else {
      throw Error(`article ${_id} not found`);
    }
  }

  handleArchive(article) {
    const user = JSON.parse(sessionStorage.getItem("user"));
    fetchData(
      `http://localhost:8080/api/v1/archive?uid=${user._id}`,
      {
        method: "PUT",
        body: JSON.stringify(article),
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then(async (response) => {
      await this.updateArticle(article._id);
    })
    .catch((error) => {
      console.error(error);
    })
  }

  handleAddNote = (_id) => {
    this.setState({ isRedirect: true, redirectId: _id });
  };

  handleDelete(_id) {
    const user = JSON.parse(sessionStorage.getItem("user"));

    fetchData(
      `http://localhost:8080/api/v1/articles?uid=${user._id}`,
      {
        method: "DELETE",
        body: JSON.stringify({ _id: _id }),
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then(async (response) => {
        await this.updateArticle(_id);
    })
    .catch((error) => {
      console.error(error);
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
    let articles = null;

    if (this.props.articles.length > 0) {
      articles = this.getArticles(this.props.articles);
    } else {
      if (this.state.articles && this.state.articles.length > 0) {
        articles = this.getArticles(this.state.articles);
      }
    }
    return articles;
  }

  componentDidMount() {
    if (this.props.articles.length > 0) {
      this.setState({ articles: this.props.articles, isSearchedResult: true, loading: this.props.loading });
    } else {
      this.fetchArticles();
    }
  }
  
  render() {
    return (
      <section className="w-full h-full p-10 flex flex-col flex-wrap md:flex-row justify-center itmes-center">
        {this.state.loading ? <Spinner /> : null}
        {this.state.isRedirect ? (
          <Redirect
            to={{
              pathname: `/notes/${this.state.redirectId}`,
              state: { articleId: this.state.redirectId, article: this.getArticle() },
            }}
          />
        ) : null}
        {this.props.articles.length > 0 ? null : <NewArticleIcon />}
        {this.renderArticles()}
      </section>
    );
  }
}

export default ArticleContainer;
