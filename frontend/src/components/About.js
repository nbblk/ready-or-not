import React from "react";

const about = () => {
  return (
    <section className="w-full h-full py-40 px-20 md:px-40 flex flex-row justify-center items-center bg-transparent">
      <article className="text-left font-4xl md:font-5xl font-poppins">
        <p>Hello folks. I'm Blake.</p>
        <br />
        <p>
          I created this website to track my memo on the web while browsing
          interesting articles every day. We know the reading is good for
          expanding knowledge via the indirect experience of others.
        </p>
        <br />
        <p>
          But have you ever thinking about <i>the online reading</i> works out?
        </p>
        <br />
        <p>
          For me, I've been just piling up a ton of URLs to my notepad or
          bookmarks folder and don't have a look for them at all. And that's
          where the uncomfortable feeling comes into mind.
        </p>
        <br />
        <p>
          If we have more intention to log our thoughts when reading and jump in
          the flow whenever we like, the reading activity would be more
          enjoyable than it was. I hope you guys enjoy the reading journey also.
        </p>
        <br />
        <p>
          + Any comments, greetings, and feedback to &nbsp;
          <a href="mailto: nbblks@gmail.com" className="underline purple">
            here
          </a>
          &nbsp; are welcome😁
        </p>
      </article>
    </section>
  );
};

export default about;
