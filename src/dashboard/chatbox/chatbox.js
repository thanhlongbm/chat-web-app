import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Send from "@material-ui/icons/Send";
import styles from "./styles";
import { withStyles } from "@material-ui/core/styles";

class ChatBox extends Component {
  state = {};
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.chatTextBoxContainer}>
        <TextField
          placeholder="Type your message..."
          id="chat-text-box"
          className={classes.chatTextBox}
          onKeyUp={e => this.onTyping(e)}
          onClick={this.props.readMessage}
        ></TextField>
        <Send onClick={this.sendMessage} className={classes.sendBtn}></Send>
      </div>
    );
  }

  onTyping = e => {
    if (e.keyCode == 13) {
      this.sendMessage();
    }
  };

  validMessage = mess => {
    return mess && mess.replace(/\s/g, "").length;
  };

  sendMessage = () => {
    const textField = document.getElementById("chat-text-box");
    const mess = textField.value;
    textField.value = "";
    if (this.validMessage(mess)) this.props.sendMessage(mess);
  };
}

export default withStyles(styles)(ChatBox);
