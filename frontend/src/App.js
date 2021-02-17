import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { PrivateRoute, useAuth } from "./context/Auth";
import LoginModal from "./components/LoginModal";
import NewArticleModal from "./components/NewArticleModal";
import Navigation from "./components/Navigation";
import Main from "./containers/Main";
import ArticleContainer from "./containers/ArticleContainer";
import Archive from "./components/Archive";
import NoteContainer from "./containers/NoteContainer";
import Landing from "./components/Landing";
import Footer from "./components/Footer";
import "./App.css";

function App(props) {
  const auth = useAuth();

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
            <Main children={<ArticleContainer />} />
          </PrivateRoute>
          <PrivateRoute path="/main">
            <Main children={<ArticleContainer />} />
          </PrivateRoute>
          <PrivateRoute path="/archive">
            <Main children={<Archive />} />
          </PrivateRoute>
          <PrivateRoute path="/notes">
            <Route
              path="/notes"
              render={(props) => <NoteContainer {...props} />}
            />
          </PrivateRoute>
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
