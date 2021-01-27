import React from "react";

const archiveIcon = (props) => {
  return (
    <svg className="m-2" width="15" height="15" viewBox="0.5 0 15 16" onClick={props.click}>
      <rect width="15" height="15" stroke="black" fill="transparent" />
      <line x1="0" y1="0" x2="7.5" y2="7.5" stroke="black"></line>
      <line x1="7.5" y1="7.5" x2="15" y2="0" stroke="black"></line>
    </svg>
  );
};

export default archiveIcon;
