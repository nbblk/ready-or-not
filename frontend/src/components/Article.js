import React from "react";
import { useHistory } from "react-router-dom";
import ArticleIcons from "./ArticleIcons";

const Article = (props) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = user.auth.token;

  const history = useHistory();

  const handleArchive = () => {
    fetch(`http://localhost:8080/api/v1/archive/${user._id}`, {
      method: "PUT",
      body: JSON.stringify({
        _id: props._id,
        url: props.url,
        tags: props.tags,
        due: props.due,
      }),
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "X-Access-Token": `${accessToken}`,
      },
    })
      .then((response) => {
        alert("Saved!");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleAdd = () => {
    history.push("/notes");
  };

  const handleDelete = () => {
    fetch(`http://localhost:8080/api/v1/articles/${user._id}`, {
      method: "DELETE",
      body: JSON.stringify({ _id: props._id }),
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "X-Access-Token": `${accessToken}`,
      },
    }).catch((error) => {
      console.error(error);
    });
  };

  return (
    <article className="w-full md:w-1/4 h-56 md:h-48 m-5 border border-solid border-black bg-transparent rounded">
      <div className="w-auto h-2/3 bg-transparent overflow-hidden">
        <ArticleIcons
          archive={() => handleArchive()}
          add={() => handleAdd()}
          delete={() => handleDelete()}
        />
        <img className="w-full h-full object-scale-down" src="" alt="img" />
      </div>
      <h1 className="h-1/3 p-3 text-2xl md:text-lg text-left font-archivo text-black">
        {props.url}
      </h1>
    </article>
  );
};

export default Article;
