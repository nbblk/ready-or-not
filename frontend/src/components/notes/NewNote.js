import React from "react";
import Input from "../shared/InputText";
import TagItem from "../shared/TagItem";
import CtaButton from "../shared/CtaButton";

const NewNote = (props) => {
  return (
    <section className="w-full md:w-1/2 h-full p-10 flex flex-col justify-center items-start">
      <h1 className="w-full self-start m-5 font-archivo text-3xl">New Note</h1>
      <form className="w-full h-full m-5 flex flex-col justify-start items-left">
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
         <TagItem
            tags={props.article.tags}
            click={(index) => props.removeTag(index)}
          />
        <Input
          type="date"
          label="due"
          change={props.change}
          value={props.article.due}
        />
        <Input type="textarea" label="note" value={props.article.note} change={props.change}/>
        <div className="m-10 text-center">
          <CtaButton btnText="Add" click={props.submit}/>
        </div>
      </form>
    </section>
  );
};

export default NewNote;
