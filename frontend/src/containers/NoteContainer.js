import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

import NewNote from "../components/notes/NewNote";
import OldNotes from "../components/notes/OldNotes";
import fetchData from "../modules/httpRequest";
import ExportModal from "../components/modals/ExportModal";
import { download } from "../modules/exports";
import ErrorFallback from "../components/modals/ErrorFallback";
import Backdrop from "../components/shared/Backdrop";

class NoteContainer extends Component {
  state = {
    article: null,
    notes: [],
    loading: false,
    error: false,
    errorMessage: "",
    isArchived: false,
  };

  fetchNotes() {
    const API_SERVER_URI = process.env.REACT_APP_SERVER_URI;
    const user = JSON.parse(sessionStorage.getItem("user"));
    const articleId = this.props.location.state.articleId;
    fetchData(
      `${API_SERVER_URI}/notes?uid=${user._id}&articleId=${articleId}&archived=${this.state.isArchived}`
    )
      .then(async (response) => {
        const list = await response.json();
        this.setState({ notes: list });
      })
      .catch((error) => {
        this.setState({
          error: true,
          errorMessage: error.message,
        });
      });
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

  updateNote(_id) {
    const arr = [...this.state.notes];
    const found = this.findNote(_id);
    if (found !== undefined) {
      arr.splice(found, 1);
      this.setState({ notes: arr });
    } else {
      throw Error(`Note ${_id} not found`);
    }
  }

  handleDelete(_id) {
    const API_SERVER_URI = process.env.REACT_APP_SERVER_URI;
    const user = JSON.parse(sessionStorage.getItem("user"));
    const articleId = this.props.location.state.article[0]._id;
    fetchData(
      `${API_SERVER_URI}/notes?uid=${user._id}&articleId=${articleId}`,
      {
        method: "DELETE",
        body: JSON.stringify({ noteId: _id }),
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        this.updateNote(_id);
      })
      .catch((error) => {
        this.setState({
          error: true,
          errorMessage: error.message,
        });
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
    if (event.key === "Enter" && event.target.name === "tag") {
      event.preventDefault();
      this.updateTag(event.target.value);
    }
  };

  updateTag = (newValue) => {
    const tags = [...this.state.article.tags];
    const isDuplicate =
      tags.length > 0 ? this.checkDuplicateTag(newValue) : false;
    if (isDuplicate || tags.length > 10) {
      return;
    } else {
      tags.push(newValue);
      this.setState({
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
      article: { ...this.state.article, tags: tags },
    });
  };

  handleSubmit = (event) => {
    const API_SERVER_URI = process.env.REACT_APP_SERVER_URI;
    event.preventDefault();
    const user = JSON.parse(sessionStorage.getItem("user"));
    fetchData(`${API_SERVER_URI}/notes/new?uid=${user._id}&archived=${this.state.isArchived}`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ note: this.state.article }),
    })
      .then(async (response) => {
        const data = await response.json();
        const arr = [...this.state.notes];
        arr.push(data);
        this.setState({
          article: { ...this.state.article, note: "" }, // clear textarea
          notes: arr,
        });
      })
      .catch((error) => {
        this.setState({
          error: true,
          errorMessage: error.message,
        });
      });
  };

  handleExport = (fileType, articleId) => {
    const API_SERVER_URI = process.env.REACT_APP_SERVER_URI;
    const user = JSON.parse(sessionStorage.getItem("user"));
    this.setState({ loading: true });
    fetchData(
      `${API_SERVER_URI}/export?uid=${user._id}&articleId=${articleId}&type=${fileType}`
    )
      .then((response) => {
        this.setState({ loading: false });
        return response.text();
      })
      .then((content) => download(content, `${articleId}.${fileType}`))
      .catch((err) => {
        this.setState({
          loading: false,
          error: true,
          errorMessage: err.message,
        });
      });
  };

  componentDidMount() {
    this.fetchNotes();
    this.setState({
      article: this.props.location.state.article[0],
      isArchived: this.props.location.state.isArchived,
    });
  }

  render() {
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {this.state.error ? (
          <Backdrop>
            <ErrorFallback error={{ message: this.state.errorMessage }} />
          </Backdrop>
        ) : null}
        <Router>
          {this.state.notes && this.state.notes.length > 0 ? (
            <Route
              path="/export"
              render={(props) => (
                <ExportModal
                  {...props}
                  export={(fileType, articleId) =>
                    this.handleExport(fileType, articleId)
                  }
                  loading={this.state.loading}
                />
              )}
            />
          ) : null}
          <section className="w-full h-full py-12 flex flex-col md:flex-row">
            <NewNote
              article={
                this.state.article || this.props.location.state.article[0]
              }
              change={(event) => this.handleInputChange(event)}
              keydown={(event) => this.handleEnter(event)}
              removeTag={(index) => this.handleTagClick(index)}
              submit={(event) => this.handleSubmit(event)}
            />
            <div className="absolute hidden lg:block h-2/3 left-1/2 top-64 -ml-3 border border-r-0 border-black bg-black"></div>
            <OldNotes
              notes={this.state.notes}
              delete={(_id) => this.handleDelete(_id)}
            />
          </section>
        </Router>
      </ErrorBoundary>
    );
  }
}

export default NoteContainer;
