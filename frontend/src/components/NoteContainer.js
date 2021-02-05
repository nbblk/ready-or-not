import React from "react";
import NewNote from "./NewNote";
import OldNotes from "./OldNotes";

const NoteContainer = (props) => {
  let content = `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
    enim ad minim veniam, quis nostrud exercitation ullamco laboris
    nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
    reprehenderit in voluptate velit esse cillum dolore eu fugiat
    nulla pariatur. Excepteur sint occaecat cupidatat non proident,
    sunt in culpa qui officia deserunt mollit anim id est laborum.
    `;
  return (
    <section className="w-full h-screen bg-beige-yellowish flex flex-col md:flex-row">
      <NewNote />
      <div className="absolute hidden lg:block h-full left-1/2 top-64 -ml-3 border border-r-0 border-black bg-black"></div>
      <OldNotes notes={[{ content: content }]} />
    </section>
  );
};

export default NoteContainer;
