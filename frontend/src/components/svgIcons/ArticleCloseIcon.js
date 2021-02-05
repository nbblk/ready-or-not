import React from "react";

const articleCloseIcon = (props) => {
  return (
    <svg className="m-2 self-end" width="15" height="15" viewBox="0 0 15 15" onClick={props.click}>
      <line x1="0" y1="0" x2="15" y2="15" stroke="black"></line>
      <line x1="15" y1="0" x2="0" y2="15" stroke="black"></line>
    </svg>
  );
};

export default articleCloseIcon;
