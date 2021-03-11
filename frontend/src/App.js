import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { PrivateRoute, useAuth } from "./context/Auth";
import LoginModal from "./components/modals/LoginModal";
import NewArticleModal from "./components/modals/NewArticleModal";
import Navigation from "./components/shared/Navigation";
import Main from "./containers/MainContainer";
import NoteContainer from "./containers/NoteContainer";
import Landing from "./components/landingPage/Landing";
import Footer from "./components/shared/Footer";
import About from "./components/About";
import Spinner from "./components/shared/spinner/Spinner";

function App() {
  const auth = useAuth();
  return (
    <Router>
      {auth.loggedOut ? <Spinner /> : null}
      <div className="page-container relative min-h-screen m-0 p-0 bg-beige-yellowish">
        <Navigation />
        <div className="content-container pb-40">
          <Switch>
            <Route exact path="/">
              <Landing />
            </Route>
            <Route path="/login">
              <LoginModal />
              <Landing />
            </Route>
            <Route path="/about">
              <About />
            </Route>
            <PrivateRoute path="/new">
              <NewArticleModal />
              <Main />
            </PrivateRoute>
            <PrivateRoute exact path="/main" content="article">
              <Main content="article" isSearch={false}/>
            </PrivateRoute>
            <PrivateRoute path="/archive" content="archive">
              <Main content="archive" isSearch={false}/>
            </PrivateRoute>
            <PrivateRoute path="/notes">
              <Route
                path="/notes"
                render={(props) => <NoteContainer {...props} />}
              />
            </PrivateRoute>
            <PrivateRoute path="/export" />
          </Switch>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
