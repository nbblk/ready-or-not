import React from "react";

const features = (props) => {
  return (
    <section className="h-full md:h-3/5 w-full bg-beige p-16 md:p-24 flex-column justify-center items-center md:flex md:justify-end">
      <article className="w-full md:w-1/3 p-3 mb-20 md:mb-0">
        <div className="w-20 h-20 rounded-full overflow-hidden">
          <img className="object-cover h-20 w-full" alt="profile" src="reading-cat.jpg"></img>
        </div>
        <h1 className="text-3xl w-full my-3.5 font-suez">We read mindlessly, <br/>everyday. </h1>
      </article>
      <article className="w-full md:w-1/3 p-3 mb-20 md:mb-0">
        <h1 className="text-2xl my-3.5 font-suez">Organize articles</h1>
        <p className="text-md font-poppins">
          Tired of being bombarded by online texts?
          <br />
          Set aside them and revisit when you feel free.
        </p>
      </article>
      <article className="w-full md:w-1/3 p-3">
        <h1 className="text-2xl my-3.5 font-suez">Track your thoughts</h1>
        <p className="text-md font-poppins">
          Keeping and tracking your notes helps to broaden the knowledge
          and generate new ideas.
        </p>
      </article>
    </section>
  );
};

export default features;
