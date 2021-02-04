import React from "react";
import Searchbar from "../components/Searchbar";

function Main(props) {
  return (
    <main className="w-full h-full py-20 md:py-40 bg-beige-yellowish flex flex-col justify-center content-center">
      <Searchbar />
      {props.children}
    </main>
  );
}
export default Main;
