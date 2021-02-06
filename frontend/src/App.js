import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { PrivateRoute } from "./context/Auth";
import LoginModal from "./components/LoginModal";
import NewArticleModal from "./components/NewArticleModal";
import Navigation from "./components/Navigation";
import Main from "./containers/Main";
import Articles from "./components/Articles";
import Archive from "./components/Archive";
import NoteContainer from "./components/NoteContainer";
import Landing from "./components/Landing";
import Footer from "./components/Footer";

import "./App.css";

function App(props) {
  return (
    <Router>
      <div className="App m-0 p-0">
        <Route path="/login">
          <LoginModal />
        </Route>
        <Navigation />
        {sessionStorage.getItem("user") ? <Redirect to="/main" /> : <Landing />}
        <Switch>
          <Route exact path="/">
            <Landing />
          </Route>
          <PrivateRoute path="/new">
            <NewArticleModal />
          </PrivateRoute>
          <PrivateRoute path="/main">
            <Main children={<Articles />} />
          </PrivateRoute>
          <PrivateRoute path="/archive">
            <Main children={<Archive />} />
          </PrivateRoute>
          <PrivateRoute path="/notes">
            <Route path="/notes" render={(props) => <NoteContainer {...props} />}/>
          </PrivateRoute>
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
