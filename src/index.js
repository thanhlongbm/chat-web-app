import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { Route, BrowserRouter as Router } from "react-router-dom";
import Login from "./login/login";
import SignUp from "./signup/signup";
import Dashboard from "./dashboard/dashboard";

const firebase = require("firebase");
require("firebase/firestore");

firebase.initializeApp({
  apiKey: "AIzaSyDfFVvsK5SAoIZPSy_EwBtlS5e-SP0Hf-I",
  authDomain: "chat-app-tut-a56d5.firebaseapp.com",
  databaseURL: "https://chat-app-tut-a56d5.firebaseio.com",
  projectId: "chat-app-tut-a56d5",
  storageBucket: "chat-app-tut-a56d5.appspot.com",
  messagingSenderId: "614977662584",
  appId: "1:614977662584:web:073b722ad566c31d81478d",
  measurementId: "G-WNSWEQ9Y1L"
});

class RootPage extends React.Component {
  componentDidMount = () => {
    this.props.history.push("/dashboard");
  };
  render() {
    return <div></div>;
  }
}

export default RootPage;

const routing = (
  <Router>
    <div id="routing-container">
      <Route path="" component={RootPage}></Route>
      <Route path="/login" component={Login}></Route>
      <Route path="/signup" component={SignUp}></Route>
      <Route path="/dashboard" component={Dashboard}></Route>
    </div>
  </Router>
);

ReactDOM.render(routing, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
