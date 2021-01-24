import React, { Component } from "react";
import Searchbar from "../components/Searchbar";
import Articles from "../containers/Articles";

class Main extends Component {
  render() {
    return (
      <main className="w-full h-full py-20 md:py-40 bg-beige-yellowish flex flex-col justify-center content-center">
        <Searchbar />
        <Articles />
      </main>
    );
  }
}

export default Main;
