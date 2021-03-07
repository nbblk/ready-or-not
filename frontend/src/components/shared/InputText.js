import React from "react";

const inputText = (props) => {
  const setDefaultDate = () => {
    return new Date().toISOString().substr(0, 10);
  };

  const setDefaultValue = () => {
    let value = null;
    if (props.type === "date") {
      value = setDefaultDate();
    }

    if (props.value) {
      value = props.value;
    }
    return value;
  }

  let element;
  if (props.type === "textarea") {
    element = (
      <div className="m-3 flex flex-col">
        <label className="block font-poppins uppercase">{props.label}</label>
        <textarea
          className="w-7/8 h-full md:h-3/4 flex-shrink md:flex-shrink-0 m-5 p-5 border border-black bg-beige rounded font-poppins"
          cols="80"
          rows="10"
          wrap="hard"
          name={props.label}
          value={props.value}
          onChange={props.change}
        ></textarea>
      </div>
    );
  } else {
    element = (
      <div className="m-3">
        <label className="font-poppins uppercase">{props.label}</label>
        <input
          name={props.label}
          className="w-80 mx-2.5 bg-transparent border-black border-b placeholder-gray"
          type={props.type}
          placeholder={props.placeholder ? props.placeholder : null}
          defaultValue={setDefaultValue()}
          onChange={props.change}
          onKeyDown={props.keydown}
          disabled={props.disabled}
        />
      </div>
    );
  }

  return element;
};

export default inputText;
