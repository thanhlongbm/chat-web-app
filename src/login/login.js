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

class Login extends Component {
  state = {
    email: null,
    pass: null,
    Error: ""
  };

  render() {
    const { classes } = this.props;
    return (
      <main className={classes.main}>
        <CssBaseline></CssBaseline>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">
            Log In
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
            className={classes.noAcountHeader}
          >
            Don't Have An Acount ?
          </Typography>
          <Link className={classes.signUpLink} to="/signup">
            Sign Up!
          </Link>
        </Paper>
      </main>
    );
  }

  submitSignUp = e => {
    e.preventDefault();
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.pass)
      .then(
        () => {
          this.props.history.push("/dashboard");
        },
        authError => {
          console.log(authError);
          switch (authError.code) {
            case "auth/wrong-password":
              this.setState({
                Error: "The password is invalid."
              });
              break;
            case "auth/user-not-found":
              this.setState({
                Error:
                  "The user's email is wrong or this user may have been deleted."
              });
              break;
            default:
              this.setState({ Error: "Failed to log in" });
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

export default withStyles(styles)(Login);
