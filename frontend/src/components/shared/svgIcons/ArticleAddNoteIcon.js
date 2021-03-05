import React from "react";

const articleAddNoteIcon = (props) => {
  return (
    <svg className="m-2" width="15" height="15" viewBox="0 0 15 15" onClick={props.click}>
      <line x1="0" y1="7.5" x2="15" y2="7.5" stroke="black" />
      <line x1="7.5" y1="0" x2="7.5" y2="15" stroke="black" />
    </svg>
  );
};

export default articleAddNoteIcon;
