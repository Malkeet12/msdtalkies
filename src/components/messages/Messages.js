import React, { Component } from 'react';
import Request from '../common/Request'

const uuidv4 = require('uuid/v4')


export default class Messages extends Component {
	constructor(props) {
		super(props);

		this.scrollDown = this.scrollDown.bind(this)
	}

	scrollDown() {
		const { container } = this.refs
		container.scrollTop = container.scrollHeight
	}

	componentDidMount() {
		this.scrollDown()
	}

	componentDidUpdate(prevProps, prevState) {
		this.scrollDown()
	}
	acceptRequest = () => {
		console.log('acc')
	}
	

	render() {
		const { activeChat, user, typingUsers, socket } = this.props
		let messages = activeChat.messages
		console.log({user},{activeChat})
		return (
			<div ref='container'
				className="thread-container">
				<div className="thread">
					{activeChat.friendRequest == 'receiver' ? <Request user={user} handler={this.props.handler} activeChat={activeChat} socket={socket} sender={false} /> : ''}
					{activeChat.friendRequest == 'sender' ? <Request user={user} handler={this.props.handler} activeChat={activeChat} socket={socket} sender={true} /> : ''}
					{
						user && messages && (activeChat.friendRequest == true || !activeChat.friendRequest) && messages.map((mes) => {
							return (
								<div
									key={uuidv4()}
									className={`message-container ${mes.sender === user.name && 'right'} ${mes.sender !== user.name && 'left'}`}
								>
									<div className="time">{mes.time}</div>
									<div className="data">
										<div className="message">{mes.message}</div>
										{activeChat.isCommunity ? <div className="name">{mes.sender}</div>
											: ''}
									</div>
								</div>

							)
						})
					}
					{
						typingUsers && typingUsers.map((name) => {
							return (
								<div key={uuidv4()} className="typing-user">
									{`${name} is typing . . .`}
								</div>
							)
						})
					}
				</div>


			</div>
		);
	}
}
