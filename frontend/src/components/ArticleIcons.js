import React from "react";
import ArchiveIcon from "./svgIcons/ArchiveIcon";
import AddNoteIcon from "./svgIcons/ArticleAddNoteIcon";
import CloseIcon from "./svgIcons/ArticleCloseIcon";

const articleIcons = () => {
  return (
    <div className="flex justify-end cursor-pointer">
      <ArchiveIcon mobile/>
      <AddNoteIcon />
      <CloseIcon mobile/>
    </div>
  );
};

export default articleIcons;
