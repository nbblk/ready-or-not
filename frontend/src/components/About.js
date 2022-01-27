import React from "react";

const about = () => {
  return (
    <section className="w-full h-full py-40 px-20 md:px-40 flex flex-row justify-center items-center bg-transparent">
      <article className="text-left font-4xl md:font-5xl font-poppins">
        <p>Hello,</p>
        <br />
        <p>
          I created this website to collect interesting articles and memos. We
          know reading is the most valuable activity, but only a few people
          float a question whether mere reading itself teaches us something.
        </p>
        <br />
        <p>
          As for me, I've been just piling up a ton of URLs on my note app or
          bookmarks folder and haven't taken a look for them at all. And that's
          where an uncomfortable feeling had been kicking in.
        </p>
        <br />
        <p>
          If we become more intentional while reading and collecting resources
          on the web, reading would become a more pleasurable activity than it
          was.
        </p>
        <br />
        <p>Happy reading!</p>
      </article>
    </section>
  );
};

export default about;
