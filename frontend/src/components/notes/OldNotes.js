import React from "react";
import { Link, useLocation } from "react-router-dom";
import ArticleCloseIcon from "../shared/svgIcons/ArticleCloseIcon";

const OldNotes = (props) => {
  const location = useLocation();
  const articleId = location.pathname.split("/").pop();

  return (
    <section className="w-full md:w-1/2 h-full p-10 flex flex-col justify-center items-center overflow-scroll">
      <h1 className="w-full self-start m-5 font-archivo text-3xl">Notes</h1>
      <Link className="self-end" to={{ pathname: "/export", state: { articleId: articleId } }} >
        <small className="underline hover:text-purple">Export...</small>
      </Link>
      <ul className="w-full h-full bg-transparent list-none">
        {props.notes && props.notes.length > 0 ? props.notes.map((note) => {
          return (
            <li
              key={note._id}
              className="w-full h-auto m-5 p-5 flex flex-col border border-black bg-white rounded font-poppins"
            >
              <ArticleCloseIcon click={() => props.delete(note._id)} />
              <p className="p-3">{note.content}</p>
            </li>
          );
        }) : null }
      </ul>
    </section>
  );
};

export default OldNotes;
