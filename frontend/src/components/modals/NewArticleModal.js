import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useErrorHandler } from "react-error-boundary";

import Backdrop from "../shared/Backdrop";
import ModalCloseIcon from "../shared/svgIcons/ModalCloseIcon";
import Input from "../shared/InputText";
import TagItem from "../shared/TagItem";
import CtaButton from "../shared/CtaButton";
import fetchData from "../../modules/httpRequest";
import Spinner from "../shared/spinner/Spinner";

const NewArticleModal = (props) => {
  const API_SERVER_URI = process.env.REACT_APP_SERVER_URI;

  const history = useHistory();
  const handleError = useErrorHandler();
  const [article, setArticle] = useState({
    url: "",
    tag: "",
    tags: [],
    due: new Date().toISOString().substr(0, 10),
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const user = JSON.parse(sessionStorage.getItem("user"));
    setLoading(true);
    fetchData(
      `${API_SERVER_URI}/article/new?uid=${user._id}`,
      {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ article }),
      }
    )
      .then(() => {
        setLoading(false);
        history.replace("/main");
      })
      .catch((error) => {
        handleError(error);
        console.error(error);
      });
  };

  const handleTagClick = (index) => {
    const tags = [...article.tags];
    if (tags) {
      tags.splice(index);
    }
    setArticle({ ...article, tags: tags });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && event.target.name === "tag") {
      event.preventDefault();
      updateTag(event.target.value);
    }
  };

  const updateTag = (newValue) => {
    const tags = [...article.tags];
    const isDuplicate = tags ? checkDuplicateTag(newValue) : true;
    if (isDuplicate || tags.length > 10) {
      return;
    } else {
      tags.push(newValue);
      setArticle({
        ...article,
        tag: "",
        tags: tags,
      });
    }
  };

  const checkDuplicateTag = (newValue) => {
    let isDuplicate = false;
    [...article.tags].forEach((oldValue) => {
      if (newValue === oldValue) {
        isDuplicate = true;
      }
    });
    return isDuplicate;
  };

  const handleChange = (event) => {
    setArticle({ ...article, [event.target.name]: event.target.value });
  };

  return (
    <Backdrop>
      {loading ? <Spinner /> : null}
      <div className="relative h-3/4 xl:h-3/5 w-full xl:w-1/3 p-3.5 flex flex-col justify-center items-center bg-beige fixed z-10">
        <Link to="/">
          <ModalCloseIcon />
        </Link>
        <h1 className="m-2.5 self-start font-archivo text-2xl">New Article</h1>
        <form
          onSubmit={(event) => event.preventDefault()}
          className="w-full m-3 flex flex-col justify-center items-center"
        >
          <Input
            type="text"
            label="url"
            placeholder="ex : https://medium.com/12417374"
            change={(event) => handleChange(event)}
          />
          <Input
            type="text"
            label="tag"
            name="tag"
            placeholder="ex : tech"
            change={(event) => handleChange(event)}
            keydown={(event) => handleKeyDown(event)}
            value={article.tag}
          />
          <TagItem
            tags={article.tags}
            click={(index) => handleTagClick(index)}
          />
          <Input
            type="date"
            label="due"
            change={(event) => handleChange(event)}
          />
          <div className="m-10 text-center">
            <CtaButton btnText="Add" click={(event) => handleSubmit(event)} />
          </div>
        </form>
      </div>
    </Backdrop>
  );
};

export default NewArticleModal;
