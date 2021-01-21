import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
//import { ProvideAuth, PrivateRoute, useAuth } from './containers/use-auth';

import LoginModal from "./components/LoginModal";
import Navigation from "./components/Navigation";
import Main from "./containers/Main";
import Landing from "./components/Landing";
import Footer from "./components/Footer";

import "./App.css";

function App(props) {

  const loginSuccess = async googleData => {
    const res = await fetch("http://localhost:8080/api/v1/auth/google", {
      method: "POST",
      body: JSON.stringify({ token: googleData.tokenObj['id_token'] }),
      headers: { "Content-Type": "application/json" },
      mode: 'cors'
    });

    const data = await res.json();
    console.log(data);
    }

  const loginFailure = (err) => {
    console.err(err);
  };

  return (
//      <ProvideAuth value={auth}>
        <Router>
          <div className="App m-0 p-0">
            <LoginModal
              loginSuccess={(response) => loginSuccess(response)}
              loginFailure={(response) => loginFailure(response)}

            />
            <Navigation />
            <Switch>
              <Route path="/">
                <Landing />
              </Route>
              {/* <PrivateRoute path="/main">
                <Main />
              </PrivateRoute> */}
            </Switch>
            <Footer />
          </div>
        </Router>
//      </ProvideAuth>
    );
}

export default App;
