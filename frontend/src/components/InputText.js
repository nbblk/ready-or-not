import React from "react";

const inputText = (props) => {
  const setDefaultDate = () => {
    return new Date().toISOString().substr(0, 10);
  };

  return (
    <div className="m-2.5">
      <label className="font-poppins uppercase">{props.label}</label>
      <input
        name={props.label}
        className="w-80 mx-2.5 bg-transparent border-black border-b placeholder-gray"
        type={props.type}
        placeholder={props.placeholder ? props.placeholder : null}
        defaultValue={props.type === "date" ? setDefaultDate() : null}
        onChange={props.change}
        onKeyDown={props.keydown}
      />
    </div>
  );
};

export default inputText;
