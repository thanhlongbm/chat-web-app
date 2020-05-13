import React, { Component } from "react";
import { Link } from "react-router-dom";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "./styles";
import { auth } from "firebase";

const firebase = require("firebase");

class SignUp extends Component {
  state = {
    email: null,
    pass: null,
    confirmPass: null,
    Error: ""
  };

  render() {
    const { classes } = this.props;
    return (
      <main className={classes.main}>
        <CssBaseline></CssBaseline>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <form className={classes.form} onSubmit={e => this.submitSignUp(e)}>
            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="signup_email_input">
                Enter Your Email
              </InputLabel>
              <Input
                autoComplete="email"
                autoFocus
                id="signup_email_input"
                type="email"
                onChange={e => this.onTyping("email", e)}
              ></Input>
            </FormControl>

            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="signup_pass_input">
                Enter Your Password
              </InputLabel>
              <Input
                autoComplete="password"
                autoFocus
                id="signup_pass_input"
                type="password"
                onChange={e => this.onTyping("password", e)}
              ></Input>
            </FormControl>

            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="signup_pass_confirm">
                Confirm Your Password
              </InputLabel>
              <Input
                autoComplete="password"
                autoFocus
                id="signup_pass_confirm"
                type="password"
                onChange={e => this.onTyping("passwordConfirmation", e)}
              ></Input>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              SUBMIT
            </Button>
          </form>

          {this.state.Error ? (
            <Typography
              component="h5"
              variant="h6"
              className={classes.errorText}
            >
              {this.state.Error}
            </Typography>
          ) : null}

          <Typography
            component="h5"
            variant="h6"
            className={classes.hasAcountHeader}
          >
            Already Has An Acount ?
          </Typography>
          <Link className={classes.logInLink} to="/login">
            Log In!
          </Link>
        </Paper>
      </main>
    );
  }

  isValidInput = () => {
    return this.state.confirmPass === this.state.pass;
  };

  submitSignUp = e => {
    e.preventDefault();
    if (!this.isValidInput()) {
      this.setState({ Error: "Your password you confirmed is not correct!!!" });
      return;
    } else this.setState({ Error: "" });

    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.pass)
      .then(
        authRes => {
          const user = { email: authRes.user.email };
          firebase
            .firestore()
            .collection("users")
            .doc(this.state.email)
            .set(user)
            .then(
              () => {
                this.props.history.push("/dashboard");
              },
              dbError => {
                console.log(dbError);
                this.setState({ Error: "Failed to add user" });
              }
            );
        },
        authError => {
          console.log(authError);
          switch (authError.code) {
            case "auth/email-already-in-use":
              this.setState({
                Error: "The email address is already in use by another account."
              });
              break;
            case "auth/weak-password":
              this.setState({
                Error: "Password should be at least 6 characters"
              });
              break;
            default:
              this.setState({ Error: "Failed to add user" });
              break;
          }
        }
      );
  };

  onTyping = (type, e) => {
    switch (type) {
      case "email":
        this.setState({ email: e.target.value });
        break;
      case "password":
        this.setState({ pass: e.target.value });
        break;
      case "passwordConfirmation":
        this.setState({ confirmPass: e.target.value });
        break;
      default:
        break;
    }
  };
}

export default withStyles(styles)(SignUp);
