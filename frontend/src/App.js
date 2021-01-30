import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect, useLocation } from "react-router-dom";
import { PrivateRoute, useAuth } from "./context/Auth";

import NewResourceModal from "./components/NewResourceModal";
import LoginModal from "./components/LoginModal";
import Navigation from "./components/Navigation";
import Main from "./containers/Main";
import Landing from "./components/Landing";
import Footer from "./components/Footer";

import "./App.css";

function App(props) {
  const auth = useAuth();

  return (
    <Router>
      <div className="App m-0 p-0">
        <Route path="/login">
          <LoginModal />
        </Route>
        <Navigation />
        {auth.valid ? <Redirect to="/main" /> : <Landing />}
        <Switch>
          <Route exact path="/">
            <Landing />
          </Route>
          <PrivateRoute path="/main">
            <Main />
          </PrivateRoute>
          <PrivateRoute path="/new">
            <NewResourceModal />
          </PrivateRoute>
          <PrivateRoute path="/archive">
            <Main />
          </PrivateRoute>
          <PrivateRoute path="/notes">
            <Main />
          </PrivateRoute>
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
