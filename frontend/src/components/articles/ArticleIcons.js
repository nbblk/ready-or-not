import React from "react";
import ArchiveIcon from "../shared/svgIcons/ArchiveIcon";
import AddNoteIcon from "../shared/svgIcons/ArticleAddNoteIcon";
import CloseIcon from "../shared/svgIcons/ArticleCloseIcon";

const articleIcons = (props) => {
  let icons = null;
  if (props.isArchived) {
    icons = (
      <div className="flex justify-end cursor-pointer">
        <AddNoteIcon click={props.add} />
        <CloseIcon click={props.delete} />
      </div>
    );
  } else {
    icons = (
      <div className="flex justify-end cursor-pointer">
        <ArchiveIcon click={props.archive} />
        <AddNoteIcon click={props.add} />
        <CloseIcon click={props.delete} />
      </div>
    );
  }
  return icons;
};

export default articleIcons;
