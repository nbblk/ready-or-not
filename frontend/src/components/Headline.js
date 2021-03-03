import React from "react";

const headline = (props) => {
  return (
    <section className="h-3/5 w-full p-20 md:p-24 bg-navy flex-column justify-center items-center md:flex md:justify-end">
      <div className="w-3/4 h-1/4 z-30">
        <p className="my-10 md:my-5 text-pink font-prata text-5xl md:text-6xl">
          Reread articles
        </p>
        <p className="text-pink font-prata text-5xl md:text-6xl">
          Expand your thoughts
        </p>
      </div>
    </section>
  );
};

export default headline;
