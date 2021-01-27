import React, { Component } from "react";
import Searchbar from "../components/Searchbar";
import Articles from "../components/Articles";

class Main extends Component {
  state = {
    articles: [],
  };

  async componentDidMount() {
    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = user.auth.token;

    const response = await fetch(
      `http://localhost:8080/api/v1/articles/${user._id}`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "X-Access-Token": `${accessToken}`,
        },
      }
    );
    const articles = await response.json();
    articles
      ? this.setState({ articles: articles[0].articles })
      : this.setState({ articles: [] });
  }

  render() {
    return (
      <main className="w-full h-full py-20 md:py-40 bg-beige-yellowish flex flex-col justify-center content-center">
        <Searchbar />
        <Articles articles={this.state.articles} />
      </main>
    );
  }
}
export default Main;
