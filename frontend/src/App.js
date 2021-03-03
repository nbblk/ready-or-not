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
import ExportModal from "./components/ExportModal";
import { download } from "./modules/exports";

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
      .then(response => response.text())
      .then(content => download(content, `${articleId}.${fileType}`))
      .catch(err => console.error(err));
  };

  return (
    <Router>
      <div className="page-container relative min-h-screen m-0 p-0">
        <Navigation />
        {auth.loggedIn ? (
          <Redirect to="/main">
            <Main children={<ArticleContainer />} />
          </Redirect>
        ) : null}
        <div className="content-container pb-40">
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
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
