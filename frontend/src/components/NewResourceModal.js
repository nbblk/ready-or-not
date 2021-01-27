import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Backdrop from "../components/Backdrop";
import ModalCloseIcon from "../components/svgIcons/ModalCloseIcon";
import Input from "../components/InputText";
import TagItem from "../components/TagItem";
import CtaButton from "../components/CtaButton";

const NewResourceModal = (props) => {
  const history = useHistory();
  const d = new Date().toISOString().substr(0, 10);
  const [resource, setResource] = useState({
    url: "",
    tag: "",
    tags: [],
    due: d,
  });

  const addResource = (event) => {
    event.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    const accessToken = user.auth.token;
    fetch("http://localhost:8080/api/v1/article/new", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "X-Access-Token": `${accessToken}`,
      },
      body: JSON.stringify({resource, _id: user._id}),
    }).then((response) => {
      console.log(response);
      history.replace('/main');
    }).catch((error) => {
      console.error(error);
    })
  };

  const handleKeyDown = (event) => {
    const arr = [...resource.tags];
    arr.push(event.target.value);
    if (event.key === "Enter") {
      setResource({ ...resource, tags: arr });
    }
  };

  const handleChange = (event, label) => {
    setResource({ ...resource, [label]: event.target.value });
  };

  return (
    <Backdrop>
      <div className="relative h-2/3 xl:h-2/3 w-full xl:w-1/3 p-3.5 flex flex-col justify-between items-center bg-beige fixed z-50">
        <Link to="/">
          <ModalCloseIcon />
        </Link>
        <h1 className="m-2.5 self-start font-archivo text-2xl">New Resource</h1>
        <form className="w-full flex flex-col justify-center items-center">
          <Input
            type="text"
            label="url"
            placeholder="ex : https://medium.com/12417374"
            change={(event) => handleChange(event, "url")}
          />
          <Input
            type="text"
            label="tag"
            placeholder="ex : tech"
            change={(event) => handleChange(event, "tag")}
            keydown={(event) => handleKeyDown(event)}
          />
          <ul className="m-6 w-full flex flex-row">
            {resource.tags.map((tag, index) => {
              console.log(tag);
              return <TagItem key={index} tagValue={tag} />;
            })}
          </ul>
          <Input
            type="date"
            label="due"
            change={(event) => handleChange(event, "due")}
          />
          <div className="m-20 text-center">
            <CtaButton btnText="Add" click={(event) => addResource(event)} />
          </div>
        </form>
      </div>
    </Backdrop>
  );
};

export default NewResourceModal;
