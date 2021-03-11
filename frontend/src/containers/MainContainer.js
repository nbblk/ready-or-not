import React, { Component } from "react";
import { ErrorBoundary } from "react-error-boundary";

import Searchbar from "../components/shared/Searchbar";
import ArchiveContainer from "./ArchiveContainer";
import ArticleContainer from "./ArticleContainer";
import fetchData from "../modules/httpRequest";
import ErrorFallback from "../components/modals/ErrorFallback";
import Backdrop from "../components/shared/Backdrop";

class Main extends Component {
  state = {
    keyword: "",
    result: [],
    submit: false,
    loading: false,
    error: false,
    errorMessage: "",
    isSearch: false,
  };

  fetchSearchResult() {
    const API_SERVER_URI = process.env.REACT_APP_SERVER_URI;
    const fetchFrom = this.props.content;
    const fieldName = fetchFrom === "archive" ? "archived" : "articles";
    const user = JSON.parse(sessionStorage.getItem("user"));

    fetchData(
      `${API_SERVER_URI}/search?uid=${user._id}&keyword=${
        this.state.keyword
      }&archived=${fetchFrom === "archive"}`
    )
      .then(async (response) => {
        const jsonData = await response.json();
        const results = [];
        for (let i = 0; i < jsonData.length; i++) {
          results.push(jsonData[i][fieldName]);
        }

        this.setState({
          ...this.state,
          keyword: "",
          result: results,
          submit: false,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          ...this.state,
          loading: false,
          submit: false,
          error: true,
          errorMessage: error.message,
        });
      });
  }

  handleInputChange = (event) => {
    this.setState({ keyword: event.target.value.trim() });
  };

  handleEnter = (event) => {
    if (event.keycode === 13 || event.key === "Enter") {
      this.setState({
        ...this.state,
        submit: true,
        loading: true,
        isSearch: true,
      });
    }
  };

  componentDidUpdate() {
    if (this.state.submit) {
      this.fetchSearchResult();
    }
  }

  render() {
    const content = this.props.content;
    let el = null;
    switch (content) {
      case "article":
        el = (
          <ArticleContainer
            result={this.state.result}
            isSearch={this.state.isSearch}
          />
        );
        break;
      case "archive":
        el = (
          <ArchiveContainer
            result={this.state.result}
            isSearch={this.state.isSearch}
          />
        );
        break;
      default:
        break;
    }

    return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {this.state.error ? (
          <Backdrop>
            <ErrorFallback error={{ message: this.state.errorMessage }} />
          </Backdrop>
        ) : null}
        <main className="w-full h-full py-20 md:py-40 bg-beige-yellowish flex flex-col justify-center items-center">
          <Searchbar
            value={this.state.keyword}
            change={(event) => this.handleInputChange(event)}
            keydown={(event) => this.handleEnter(event)}
          />
          {el}
        </main>
      </ErrorBoundary>
    );
  }
}
export default Main;
