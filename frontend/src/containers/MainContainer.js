import React, { Component } from "react";
import Archive from "../components/Archive";
import Searchbar from "../components/shared/Searchbar";
import ArticleContainer from "./ArticleContainer";
import fetchData from "../modules/httpRequest";

class Main extends Component {
  state = {
    keyword: null,
    result: [],
    submit: false,
    loading: false,
  };

  fetchSearchResult() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    fetchData(
      `http://localhost:8080/api/v1/search?uid=${user._id}&keyword=${this.state.keyword}`
    )
      .then(async (response) => {
        const jsonData = await response.json();
        const results = [];
        for (let i = 0; i < jsonData.length; i++) {
          results.push(jsonData[i].articles);
        }
        this.setState({
          ...this.state,
          result: results,
          submit: false,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({ ...this.state, loading: false });
        console.error(error);
      });
  }

  componentDidUpdate() {
    if (this.state.submit) {
      this.fetchSearchResult();
    }
  }

  handleInputChange = (event) => {
    this.setState({ ...this.state, keyword: event.target.value.trim() });
  };

  handleEnter = (event) => {
    if (event.keycode === 13 || event.key === "Enter") {
      this.setState({ ...this.state, submit: true, loading: true });
    }
  };

  render() {
    const content = this.props.content;
    let el = null;
    if (content === "archive") {
      el = <Archive />;
    }

    if (content === "article") {
      el = <ArticleContainer articles={this.state.result} />;
    }

    return (
      <main className="w-full h-full py-20 md:py-40 bg-beige-yellowish flex flex-col justify-center items-center">
        <Searchbar
          change={(event) => this.handleInputChange(event)}
          keydown={(event) => this.handleEnter(event)}
        />
        {el}
      </main>
    );
  }
}
export default Main;
