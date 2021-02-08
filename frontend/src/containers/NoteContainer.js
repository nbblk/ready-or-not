import React, { Component } from "react";
import NewNote from "../components/NewNote";
import OldNotes from "../components/OldNotes";

const user = JSON.parse(sessionStorage.getItem("user"));

class NoteContainer extends Component {
  state = {
    article: null,
    notes: [],
  };

  async fetchData() {
    const articleId = this.props.location.state.article[0]._id;
    const response = await fetch(
      `http://localhost:8080/api/v1/notes?uid=${user._id}&oauth=${user.oauth}&articleId=${articleId}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "X-Access-Token": `${user.token}`,
        },
      }
    );
    const list = await response.json();
    if (list.length > 0) this.setState({ notes: list[0].notes });
  }

  findNote(_id) {
    const arr = [...this.state.notes];
    let idx;
    arr.map((note, index) => {
      if (note._id === _id) {
        idx = index;
      }
      return idx;
    });
    return idx;
  }

  async updateNote(_id) {
    const arr = [...this.state.notes];
    const found = this.findNote(_id);
    if (found !== undefined) {
      arr.splice(found);
      await this.setState({ notes: arr });
    } else {
      throw Error(`Note ${_id} not found`);
    }
  }

  async handleDelete(_id) {
    await fetch(
      `http://localhost:8080/api/v1/notes?uid=${user._id}&oauth=${user.oauth}`,
      {
        method: "DELETE",
        body: JSON.stringify({ noteId: _id }),
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "X-Access-Token": `${user.token}`,
        },
      }
    )
      .then(async (response) => {
        if (response.status === 201) {
          await this.updateNote(_id);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  handleInputChange = (event) => {
    this.setState({
      ...this.state.notes,
      article: {
        ...this.state.article,
        [event.target.name]: event.target.value,
      },
    });
  };

  handleEnter = (event) => {
    if ((event.charCode || event.keyCode) === 13) {
      event.preventDefault();
      if (event.target.name === "tag") {
        this.updateTag(event.target.value);
      }
    } else {
      return;
    }
  };

  updateTag = (newValue) => {
    const tags = [...this.state.article.tags];
    const isDuplicate = tags ? this.checkDuplicateTag(newValue) : true;
    if (isDuplicate || tags.length > 10) {
      return;
    } else {
      tags.push(newValue);
      this.setState({
        ...this.state.notes,
        article: {
          ...this.state.article,
          tag: "",
          tags: tags,
        },
      });
    }
  };

  checkDuplicateTag = (newValue) => {
    let isDuplicate = false;
    [...this.state.article.tags].forEach((oldValue) => {
      if (newValue === oldValue) {
        isDuplicate = true;
      }
    });
    return isDuplicate;
  };

  handleTagClick = (index) => {
    const tags = [...this.state.article.tags];
    if (tags) {
      tags.splice(index);
    }
    this.setState({
      ...this.state.notes,
      article: { ...this.state.article, tags: tags },
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    fetch(
      `http://localhost:8080/api/v1/notes/new?uid=${user._id}&oauth=${user.oauth}`,
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "X-Access-Token": `${user.token}`,
        },
        credentials: "include",
        body: JSON.stringify({ note: this.state.article }),
      }
    )
      .then(async (response) => {
        const updated = await response.json();
        const arr = [...this.state.notes];
        arr.push(updated.note.note);
        await this.setState({ ...this.state.article, notes: arr });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  async componentDidMount() {
    await this.fetchData();
    await this.setState({
      ...this.state.notes,
      article: this.props.location.state.article[0],
    });
    await this.setState({
      ...this.state.notes,
      article: { ...this.state.article, tag: "", note: "" },
    });
  }

  render() {
    return (
      <section className="w-full h-screen bg-beige-yellowish flex flex-col md:flex-row">
        <NewNote
          article={
            !this.state.article
              ? this.props.location.state.article[0]
              : this.state.article
          }
          change={(event) => this.handleInputChange(event)}
          keydown={(event) => this.handleEnter(event)}
          removeTag={(index) => this.handleTagClick(index)}
          submit={(event) => this.handleSubmit(event)}
        />
        <div className="absolute hidden lg:block h-full left-1/2 top-64 -ml-3 border border-r-0 border-black bg-black"></div>
        <OldNotes
          notes={this.state.notes}
          delete={(_id) => this.handleDelete(_id)}
        />
      </section>
    );
  }
}

export default NoteContainer;
