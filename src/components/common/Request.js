import React, { Component } from 'react';
import { REQUEST_SENT } from '../../Events'
//import requestImg from '../../images/requestImage.jpg'
const imgStyles = { height: '100%', width: '100%', objectFit: 'contain', maxHeight: '600px', marginBottom: '15px' }
export default class Request extends Component {
  constructor(props) {
    super(props)
    this.state = {
      message: '',
      showAcceptButton: true
    }
  }

  acceptRequest = () => {
    this.setState({ showAcceptButton: false })
    this.setState({ message: 'You can now send him message. Happy talkies ' })
    const { socket, activeChat, user } = this.props;
    socket.emit(REQUEST_SENT, true, user.name, activeChat, this.startChat);
  }
  startChat = (accepted) => {

    if (accepted) {
      //this.setState({ message: 'Please login again to talk to this user (will fix in next release) ' })
      this.props.requestAccepted()
    }
  }
  ignoreRequest = () => {
    this.setState({ showAcceptButton: false })
    const { socket, activeChat, user } = this.props;
    socket.emit(REQUEST_SENT, false, user.name, activeChat, this.startChat);
  }

  render() {
    const { socket, activeChat, user, sender } = this.props;
    let { showAcceptButton }=this.state
    return <div>
        {this.props.sender == true && showAcceptButton && <div>
              {/* <img className="user-avatar" style={imgStyles} src={requestImg} /> */}
              <div style={{ color: "blue", textAlign: "center", marginBottom: "20px" }}>
                Let's chat on MsdTalkies <br />
                {this.state.message}
              </div>
              <div className="friend-request">
                <input className="btn btn-danger request" type="button" onClick={() => this.ignoreRequest()} value="Ignore" />
                <input className="btn btn-success request" type="button" onClick={() => this.acceptRequest()} value="Accept" />
              </div>
            </div>}
        {this.props.sender == false && <div
            style={{ textAlign: "center", color: "blue", margin: "17px" }}
          >
            Friend request is pending with {activeChat.name}
          </div>}
      </div>;
  }

}

