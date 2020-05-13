import React, { Component } from "react";
import {
  FormControl,
  InputLabel,
  Input,
  Button,
  Paper,
  withStyles,
  CssBaseline,
  Typography
} from "@material-ui/core";
import styles from "./styles";
const firebase = require("firebase");

class NewChat extends Component {
  state = {
    friend: null,
    mess: null,
    errorText: ""
  };
  render() {
    const { classes } = this.props;
    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">
            {" "}
            Send A Message
          </Typography>
          <form className={classes.form} onSubmit={e => this.submit(e)}>
            <FormControl fullWidth>
              <InputLabel htmlFor="new-chat-user">
                Enter Your Friend's Email
              </InputLabel>
              <Input
                required
                className={classes.input}
                autoFocus
                onChange={e => this.onTyping("user", e)}
                id="new-chat-user"
              ></Input>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="new-chat-user">
                Enter Your Message
              </InputLabel>
              <Input
                required
                className={classes.input}
                autoFocus
                onChange={e => this.onTyping("message", e)}
                id="new-chat-user"
              ></Input>
            </FormControl>
            {this.state.errorText ? (
              <Typography
                component="h5"
                variant="h6"
                className={classes.errorText}
              >
                {this.state.errorText}
              </Typography>
            ) : null}
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              type="submit"
            >
              Send
            </Button>
          </form>
        </Paper>
      </main>
    );
  }

  onTyping = (mess, e) => {
    if (mess === "user") this.setState({ friend: e.target.value });
    else this.setState({ mess: e.target.value });
  };

  isValidUser = async () => {
    const userList = await firebase
      .firestore()
      .collection("users")
      .get();
    const exist = userList.docs
      .map(doc => doc.data().email)
      .includes(this.state.friend);
    return exist && this.state.friend != this.props.user;
  };

  isValidMess = () => {
    return this.state.mess && this.state.mess.replace(/\s/g, "").length;
  };

  submit = async e => {
    e.preventDefault();
    if (!(await this.isValidUser())) {
      if (this.state.friend === this.props.user)
        this.setState({ errorText: "Cannot send message to you" });
      else this.setState({ errorText: "User does not exist" });
    } else if (!(await this.isValidMess())) {
      this.setState({ errorText: "Please type the message" });
    } else {
      await this.setState({ errorText: "" });
      this.props.onSubmit(this.state.friend, this.state.mess);
    }
  };
}

export default withStyles(styles)(NewChat);
