import React, { Component } from "react";
import io from "socket.io-client";
import { USER_CONNECTED, LOGOUT } from "../Events";
import LoginForm from "./LoginForm";
import ChatContainer from "./chats/ChatContainer";

import SignUp from "./SignUp";

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const socketUrl = "http://localhost:3231";
export default class Layout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      socket: null,
      user: null
    };
  }

  componentWillMount() {
    this.initSocket();
  }

  /*
	*	Connect to and initializes the socket.
	*/
  initSocket = () => {
    const socket = io(socketUrl);
    //const socket = io.connect()
    socket.on("connect", () => {
      console.log("Connected");
    });

    this.setState({ socket });
  };

  /*
	* 	Sets the user property in state 
	*	@param user {id:number, name:string}
	*/
  setUser = user => {
    console.log(user)
    const { socket } = this.state;
    socket.emit(USER_CONNECTED, user);
    this.setState({ user });
  };

  /*
	*	Sets the user property in state to null.
	*/
  logout = () => {
    const { socket } = this.state;
    socket.emit(LOGOUT);
    this.setState({ user: null });
  };

  render() {
    const { socket, user } = this.state;
    return (
      <div className="chat-container">
        <Router>
          <div className="default-styles">
            <Route exact path="/" render={(props) => <LoginForm socket={socket} setUser={this.setUser} />} />
            {/* <Route path="/login" component={LoginForm} /> */}
            <Route path="/login" render={(props) => <LoginForm socket={socket} setUser={this.setUser} />}  />
            <Route path="/signup" render={(props) => <SignUp socket={socket} setUser={this.setUser} />}  />
            <Route path="/chat" render={()=><ChatContainer socket={socket} user={user} logout={this.logout} />} />
          </div>
        </Router>
        {/* {
					!user ?
						<LoginForm socket={socket} setUser={this.setUser} />
						:
						<ChatContainer socket={socket} user={user} logout={this.logout} />
				} */}
      </div>
    );
  }
}
