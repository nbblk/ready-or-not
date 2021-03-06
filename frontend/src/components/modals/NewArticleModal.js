import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Backdrop from "../shared/Backdrop";
import ModalCloseIcon from "../shared/svgIcons/ModalCloseIcon";
import Input from "../shared/InputText";
import TagItem from "../shared/TagItem";
import CtaButton from "../shared/CtaButton";
import fetchData from "../../modules/httpRequest";
import Spinner from "../shared/spinner/Spinner";

const NewArticleModal = (props) => {
  const history = useHistory();
  const [article, setArticle] = useState({
    url: "",
    tag: "",
    tags: [],
    due: new Date().toISOString().substr(0, 10)
  });
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const user = JSON.parse(sessionStorage.getItem("user"));
    setLoading(true);
    fetchData(
      `http://localhost:8080/api/v1/article/new?uid=${user._id}&oauth=${user.oauth}`,
      {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ article }),
      }
    )
      .then(() => {
        setLoading(false);
        history.replace("/main");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const removeTag = (index) => {
    const tags = [...article.tags];
    tags.splice(index);
    setArticle({ ...article, tags: tags });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      const tagValue = event.target.value;
      const arr = [...article.tags]; 
      let isDuplicate = false;
      arr.forEach(oldTagValue => {
        if (tagValue === oldTagValue) {
          isDuplicate = true;
        }
      });
      if (!isDuplicate && arr.length < 10) {
        arr.push(tagValue);
      }
      setArticle({ ...article, tags: arr, tag: "" });
    }
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
        <form className="w-full m-3 flex flex-col justify-center items-center">
          <Input
            type="text"
            label="url"
            placeholder="ex : https://medium.com/12417374"
            change={(event) => handleChange(event)}
          />
          <Input
            type="text"
            label="tag"
            placeholder="ex : tech"
            change={(event) => handleChange(event)}
            keydown={(event) => handleKeyDown(event)}
            value={article.tag}
          />
          <ul className="m-3 w-3/4 flex flex-row justify-start items-center">
            {article.tags.map((tag, index) => {
              return (
                <TagItem
                  key={index}
                  tagValue={tag}
                   click={() => removeTag(index)}
                />
              );
            })}
          </ul>
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
