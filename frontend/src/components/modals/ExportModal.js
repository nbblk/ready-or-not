import React, { useState } from "react";

import Backdrop from "../shared/Backdrop";
import ModalCloseIcon from "../shared/svgIcons/ModalCloseIcon";
import Button from "../shared/CtaButton";
import Spinner from "../shared/spinner/Spinner";

const ExportModal = (props) => {
  const [fileType, setFileType] = useState("pdf");
  const [articleId] = useState(props.location.state.articleId);

  const handleOption = (event) => {
    const value = event.target.value;
    setFileType(value);
  };

  return (
    <Backdrop>
      {props.loading ? <Spinner /> : null}
      <div className="relative w-full md:w-1/5 h-1/3 md:w-1/5 md:h-1/4 p-3.5 bg-beige border border-black flex flex-col justify-around items-center">
        <ModalCloseIcon click={() => window.history.go(-1)} />
        <select
          className="w-2/3 h-1/5 m-3.5 border border-black focus:outline-none"
          defaultValue="pdf"
          onChange={(event) => handleOption(event)}
        >
          {["pdf", "csv", "md"].map((fileType, index) => {
            return (
              <option key={index} value={fileType}>
                {fileType}
              </option>
            );
          })}
        </select>
        <Button
          btnText="export"
          click={() => props.export(fileType, articleId)}
        />
      </div>
    </Backdrop>
  );
};

export default ExportModal;
