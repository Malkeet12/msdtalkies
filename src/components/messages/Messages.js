import React, { Component } from 'react';
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

	render() {
		const { activeChat, user, typingUsers } = this.props
		let messages = activeChat.messages
		console.log(messages)
		return (
			<div ref='container'
				className="thread-container">
				<div className="thread">
					{
						user && messages && messages.map((mes) => {
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
