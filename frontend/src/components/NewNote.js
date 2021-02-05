import React from 'react';
import Input from './InputText';
import CtaButton from './CtaButton';

const newNote = (props) => {
    return <section className="w-full md:w-1/2 h-full p-10 flex flex-col justify-center items-start">
        <h1 className="w-full self-start m-5 font-archivo text-3xl">New Note</h1>
        <form className="w-full h-full m-5 flex flex-col justify-start items-left">
          <Input
            type="text"
            label="url"
            defaultValue={props.url}
            change={props.change}
            disabled
          />
          <Input
            type="text"
            label="tag"
            placeholder="ex : tech"
//            change={props.change}
//            keydown={props.keyDown}
//            value={props.tag}
          />
          {/* <ul className="m-3 w-3/4 flex flex-row justify-start items-center">
            {article.tags.map((tag, index) => {
              return (
                <TagItem
                  key={index}
                  tagValue={tag}
                  click={props.removeTag}
                />
              );
            })}
          </ul> */}
          <Input
            type="date"
            label="due"
//            change={props.change}
//            value={props.date}
          />
          <Input type="textarea" label="note"/>
          <div className="m-10 text-center">
            <CtaButton btnText="Add"/> 
            {/* //click={props.submit} */}
          </div>
        </form>
    </section>
};

export default newNote;