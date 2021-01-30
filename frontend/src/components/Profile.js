import React from "react";

const profile = (props) => {
  return (
    <div className="m-1.5 rounded-full overflow-hidden">
      {props.imgUrl ? (
        <img width="30px" height="30px" src={props.imgUrl} alt="profile" />
      ) : null}
    </div>
  );
};

export default profile;
