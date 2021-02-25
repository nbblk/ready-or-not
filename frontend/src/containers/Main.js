import React, { Component } from "react";
import Archive from "../components/Archive";
import Searchbar from "../components/Searchbar";
import ArticleContainer from "./ArticleContainer";


class Main extends Component {
  state = {
    keyword: null,
    result: [],
    submit: false,
  };

  async fetchResult() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    await fetch(
      `http://localhost:8080/api/v1/search?uid=${user._id}&oauth=${user.oauth}&keyword=${this.state.keyword}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "X-Access-Token": `${user.token}`,
        },
      }
    )
      .then(async (response) => {
        const result = await response.json();
        await this.setState({
          ...this.state,
          result: result,
          submit: false,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  componentDidUpdate() {
    if (this.state.submit) {
      this.fetchResult();
    }
  }

  handleInputChange = event => {
    this.setState({ ...this.state, keyword: event.target.value.trim() });
  };

  handleEnter = event => {
    if (event.keycode === 13 || event.key === "Enter") {
      this.setState({ ...this.state, submit: true });
    }
  };

  render() {
    const content = this.props.content;
    let el = null;
    if (content === "archive") {
      el = <Archive />;
    }

    if (content === "article") {
      el = <ArticleContainer articles={this.state.result} />
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
