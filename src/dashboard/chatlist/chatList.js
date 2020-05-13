import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import styles from "./styles";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import NotificationImportant from "@material-ui/icons/NotificationImportant";

class ChatList extends Component {
  render() {
    const { classes } = this.props;
    return (
      <main className={classes.root}>
        <Button
          variant="contained"
          fullWidth
          color="primary"
          className={classes.newChatBtn}
          onClick={this.addChat}
        >
          New Message
        </Button>
        <List>
          {this.props.chatDocs.length > 0
            ? this.props.chatDocs.map((doc, index) => {
                return (
                  <div key={index}>
                    <ListItem
                      onClick={() => this.props.onSelectChat(index)}
                      className={classes.listItem}
                      selected={this.props.selectedChat === index}
                      alignItems="flex-start"
                    >
                      <ListItemAvatar>
                        <Avatar>
                          {
                            doc.users
                              .filter(_user => _user !== this.props.user)[0]
                              .split("")[0]
                          }
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          doc.users.filter(
                            _user => _user !== this.props.user
                          )[0]
                        }
                        secondary={
                          <React.Fragment>
                            <Typography component="span" color="textPrimary">
                              {doc.mess[doc.mess.length - 1].text.substring(
                                0,
                                20
                              ) +
                                (doc.mess[doc.mess.length - 1].text.length > 20
                                  ? "..."
                                  : "")}
                            </Typography>
                          </React.Fragment>
                        }
                      ></ListItemText>
                      {!doc.hasSeen && !this.whetherUserIsSender(doc) ? (
                        <ListItemIcon>
                          <NotificationImportant
                            className={classes.unreadMessage}
                          ></NotificationImportant>
                        </ListItemIcon>
                      ) : null}
                    </ListItem>
                    <Divider></Divider>
                  </div>
                );
              })
            : ""}
        </List>
      </main>
    );
  }

  addChat = () => {
    this.props.onAddChat();
  };
  whetherUserIsSender = doc => {
    const messList = doc.mess;
    return messList[messList.length - 1].sender === this.props.user;
  };
}

export default withStyles(styles)(ChatList);
