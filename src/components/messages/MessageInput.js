import React, { Component } from 'react';
import EmojiPicker from 'emoji-picker-react';
export default class MessageInput extends Component {

	constructor(props) {
		super(props);

		this.state = {
			message: "",
			isTyping: false,
			showEmojiPicker: false
		};

	}

	componentDidMount = () => {
		let emojiButton = document.getElementById("emoji-picker");
		emojiButton.click();
		this.setState({ showEmojiPicker: false })

	}
	toggleEmojiPicker = () => {
		this.setState({ showEmojiPicker: !this.state.showEmojiPicker })
	}

	handleSubmit = (e) => {
		e.preventDefault()
		this.setState({ showEmojiPicker: false })
		this.sendMessage()
		document.getElementById("message").focus();
		this.setState({ message: "" })
	}

	sendMessage = () => {
		this.props.sendMessage(this.state.message)

	}

	componentWillUnmount() {
		this.stopCheckingTyping()
	}

	addToInput = (e) => {
		console.log(e)
		let emoji = String.fromCodePoint('0x' + e)
		this.setState({ message: this.state.message + emoji })
	}

	sendTyping = () => {
		this.lastUpdateTime = Date.now()
		if (!this.state.isTyping) {
			this.setState({ isTyping: true })
			this.props.sendTyping(true)
			this.startCheckingTyping()
		}
	}

	/*
	*	startCheckingTyping
	*	Start an interval that checks if the user is typing.
	*/
	startCheckingTyping = () => {
		this.typingInterval = setInterval(() => {
			if ((Date.now() - this.lastUpdateTime) > 300) {
				this.setState({ isTyping: false })
				this.stopCheckingTyping()
			}
		}, 300)
	}

	/*
	*	stopCheckingTyping
	*	Start the interval from checking if the user is typing.
	*/
	stopCheckingTyping = () => {
		if (this.typingInterval) {
			clearInterval(this.typingInterval)
			this.props.sendTyping(false)
		}
	}


	render() {
		const { message } = this.state
		if (document.getElementById('message-input')) {
			document.getElementById('message-input').onkeydown = e => {
				if (e.keyCode === 13 && this.state.message) {
					this.setState({ showEmojiPicker: false })
					this.sendMessage()
					this.setState({ message: "" })
				}
			};
		}
		return (
			<div id="message-input" className="message-input">
				<form
					onSubmit={this.handleSubmit}
					className="message-form">
					<div className="open-emoji-picker" id="emoji-picker" onClick={this.toggleEmojiPicker}><span>🤣</span></div>
					<input
						id="message"
						ref={"messageinput"}
						type="text"
						className="form-control"
						value={message}
						autoComplete={'off'}
						placeholder="Type a message"
						onKeyUp={e => { e.keyCode !== 13 && this.sendTyping() }}
						onChange={
							({ target }) => {
								this.setState({ message: target.value })
							}
						}
					/>
					{this.state.showEmojiPicker ?
						<EmojiPicker onEmojiClick={this.addToInput} />
						: ''
					}
					<button
						disabled={message.length < 1}
						type="submit"
						className="send"

					> Send </button>
				</form>

			</div>
		);
	}
}
