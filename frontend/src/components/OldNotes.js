import React from "react";
import ArticleCloseIcon from "./svgIcons/ArticleCloseIcon";

const oldNotes = (props) => {
  return (
    <section className="w-full md:w-1/2 h-full p-10 flex flex-col justify-center items-center overflow-scroll">
      <h1 className="w-full self-start m-5 font-archivo text-3xl">Notes</h1>
      <ul className="w-full h-full bg-transparent list-none">
        {props.notes.map((note) => {
          return (
            <li className="w-full h-auto m-5 p-5 flex flex-col border border-black bg-white rounded font-poppins">
              <ArticleCloseIcon />
              <p className="p-3">{note.content}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default oldNotes;
