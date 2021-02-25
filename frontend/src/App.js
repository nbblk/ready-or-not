import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { PrivateRoute, useAuth } from "./context/Auth";
import LoginModal from "./components/LoginModal";
import NewArticleModal from "./components/NewArticleModal";
import Navigation from "./components/Navigation";
import Main from "./containers/Main";
import ArticleContainer from "./containers/ArticleContainer";
import NoteContainer from "./containers/NoteContainer";
import Landing from "./components/Landing";
import Footer from "./components/Footer";
import "./App.css";
import ExportModal from "./components/ExportModal";

function App() {
  const auth = useAuth();

  const handleExport = (fileType, articleId) => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    fetch(
      `http://localhost:8080/api/v1/export?uid=${user._id}&oauth=${user.oauth}&articleId=${articleId}&type=${fileType}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "X-Access-Token": `${user.token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((responseData) => {
        switch (fileType) {
          case "pdf":
            break;
          case "markdown":
            break;
          case "json":
            break;
          default:
            break;
        }
      })
      .catch();
  };

  return (
    <Router>
      <div className="App m-0 p-0">
        <Navigation />
        {auth.loggedIn ? (
          <Redirect to="/main">
            <Main children={<ArticleContainer />} />
          </Redirect>
        ) : null}
        <Switch>
          <Route exact path="/">
            <Landing />
          </Route>
          <Route path="/login">
            <LoginModal />
            <Landing />
          </Route>
          <PrivateRoute path="/new">
            <NewArticleModal />
            <Main />
          </PrivateRoute>
          <PrivateRoute path="/main">
            <Main content="article" />
          </PrivateRoute>
          <PrivateRoute path="/archive">
            <Main content="archive" />
          </PrivateRoute>
          <PrivateRoute path="/notes">
            <Route
              path="/notes"
              render={(props) => <NoteContainer {...props} />}
            />
          </PrivateRoute>
          <PrivateRoute path="/export">
            <Route
              path="/export"
              render={(props) => (
                <ExportModal
                  {...props}
                  export={(fileType, articleId) => handleExport(fileType, articleId)}
                />
              )}
            />
          </PrivateRoute>
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
