import React, { useState } from "react";
import ToggledMenu from "./ToggledMenu";

const ToggleMenuButton = (props) => {
  const [opened, setOpened] = useState(false);

  return (
    <div
      id="slider"
      className="relative left-5 z-10 select-none cursor-pointer"
      onClick={() => setOpened(!opened)}
    >
      <span className="relative block w-8 h-1 mb-1 bg-gray border border-4"></span>
      <span className="relative block w-8 h-1 mb-1 bg-gray border border-4"></span>
      <span className="relative block w-8 h-1 mb-1 bg-gray border border-4"></span>
      <ToggledMenu opened={opened} />
    </div>
  );
};

export default ToggleMenuButton;
