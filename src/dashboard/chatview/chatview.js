import React, { Component } from "react";
import styles from "./styles";
import { withStyles } from "@material-ui/core/styles";

class ChatView extends Component {
  componentDidUpdate = () => {
    const container = document.getElementById("chatview-container");
    if (container) container.scrollTo(0, container.scrollHeight);
  };

  render() {
    const { chat, classes, user } = this.props;
    if (chat == undefined) {
      return <main id="chatview-container" className={classes.content}></main>;
    }
    return (
      <div>
        <div className={classes.chatHeader}>
          Conversation with {chat.users.filter(_user => _user !== user)[0]}
        </div>
        <main id="chatview-container" className={classes.content}>
          {chat.mess.map((_mess, index) => (
            <div
              key={index}
              className={
                _mess.sender === user ? classes.userSent : classes.friendSent
              }
            >
              {_mess.text}
            </div>
          ))}
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(ChatView);
