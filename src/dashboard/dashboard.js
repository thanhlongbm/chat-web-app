import React, { Component } from "react";
import ChatList from "./chatlist/chatList";
import ChatView from "./chatview/chatview";
import ChatBox from "./chatbox/chatbox";
import NewChat from "./newchat/newchat";
import styles from "./styles";
import { Button, withStyles } from "@material-ui/core";
const firebase = require("firebase");

class Dashboard extends Component {
  state = {
    user: null,
    selectedChat: null,
    chatDocs: [],
    newChatForm: false
  };
  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <ChatList
          history={this.props.history}
          user={this.state.user}
          chatDocs={this.state.chatDocs}
          onSelectChat={this.selectChat}
          onAddChat={this.onAddNewChatClick}
          selectedChat={this.state.selectedChat}
        ></ChatList>
        {this.state.newChatForm ? (
          <NewChat
            onSubmit={this.submitNewChat}
            user={this.state.user}
          ></NewChat>
        ) : (
          <ChatView
            user={this.state.user}
            chat={this.state.chatDocs[this.state.selectedChat]}
          ></ChatView>
        )}
        {this.state.selectedChat !== null ? (
          <ChatBox
            sendMessage={this.sendMessage}
            readMessage={this.readMessage}
          ></ChatBox>
        ) : null}
        <Button className={classes.signOutBtn} onClick={this.signOut}>
          Sign Out
        </Button>
      </React.Fragment>
    );
  }

  getDocKey = () => {
    return this.state.chatDocs[this.state.selectedChat].users.sort().join(":");
  };

  whetherUserIsSender = () => {
    const messList = this.state.chatDocs[this.state.selectedChat].mess;
    return messList[messList.length - 1].sender === this.state.user;
  };

  readMessage = () => {
    const docKey = this.getDocKey();
    if (!this.whetherUserIsSender())
      firebase
        .firestore()
        .collection("chats")
        .doc(docKey)
        .update({ hasSeen: true });
  };

  sendMessage = _mess => {
    const docKey = this.getDocKey();
    firebase
      .firestore()
      .collection("chats")
      .doc(docKey)
      .update({
        mess: firebase.firestore.FieldValue.arrayUnion({
          sender: this.state.user,
          text: _mess
          //timestamp: Date.now()
        }),
        hasSeen: false
      });
  };

  signOut = () => {
    firebase.auth().signOut();
  };

  selectChat = async id => {
    await this.setState({ selectedChat: id, newChatForm: false });
    this.readMessage();
  };

  onAddNewChatClick = () => {
    this.setState({ newChatForm: true, selectedChat: null });
  };

  addNewChat = async (docKey, _mess) => {
    const _users = docKey.split(":");
    await firebase
      .firestore()
      .collection("chats")
      .doc(docKey)
      .set({
        hasSeen: false,
        mess: [
          {
            sender: this.state.user,
            text: _mess
          }
        ],
        users: _users
      });
    this.setState({ newChatForm: false });
    this.selectChat(this.state.chatDocs.length - 1);
  };

  gotoChat = async (docKey, mess) => {
    const _users = docKey.split(":");
    const chat = this.state.chatDocs.find(_chat =>
      _users.every(_user => _chat.users.includes(_user))
    );
    const index = this.state.chatDocs.indexOf(chat);
    await this.selectChat(index);
    this.sendMessage(mess);
  };

  submitNewChat = async (friend, mess) => {
    const docKey = [friend, this.state.user].sort().join(":");
    const keyExist = await firebase
      .firestore()
      .collection("chats")
      .doc(docKey)
      .get();
    if (keyExist.exists) this.gotoChat(docKey, mess);
    else this.addNewChat(docKey, mess);
  };

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(async _user => {
      if (!_user) {
        this.props.history.push("/login");
      } else {
        await firebase
          .firestore()
          .collection("chats")
          .where("users", "array-contains", _user.email)
          .onSnapshot(async res => {
            const chats = res.docs.map(doc => doc.data());
            this.setState({ user: _user.email, chatDocs: chats });
          });
      }
    });
  };
}

export default withStyles(styles)(Dashboard);
