import React from "react";
import Input from "./InputText";
import TagItem from "./TagItem";
import CtaButton from "./CtaButton";

const newNote = (props) => {
  return (
    <section className="w-full md:w-1/2 h-full p-10 flex flex-col justify-center items-start">
      <h1 className="w-full self-start m-5 font-archivo text-3xl">New Note</h1>
      <form
        onSubmit={(event) => event.preventDefault()}
        className="w-full h-full m-5 flex flex-col justify-start items-left"
      >
        <Input
          type="text"
          label="url"
          value={props.article.url}
          change={props.change}
          disabled={true}
        />
        <Input
          type="text"
          label="tag"
          placeholder="ex : tech"
          change={props.change}
          keydown={props.keydown}
          value={props.article.tag}
        />
        <ul className="m-3 w-3/4 flex flex-row justify-start items-center">
          {props.article.tags
            ? props.article.tags.map((tag, index) => {
                return (
                  <TagItem
                    key={index}
                    tagValue={tag}
                    click={() => props.removeTag(index)}
                  />
                );
              })
            : null}
        </ul>
        <Input
          type="date"
          label="due"
          change={props.change}
          value={props.article.due}
        />
        <Input type="textarea" label="note" change={props.change} />
        <div className="m-10 text-center">
          <CtaButton btnText="Add" click={props.submit}/>
        </div>
      </form>
    </section>
  );
};

export default newNote;
