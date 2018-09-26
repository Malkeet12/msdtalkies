import React, { Component } from 'react';
import SideBar from '../sidebar/SideBar'
import {
	COMMUNITY_CHAT, FRIENDS_CHAT, MESSAGE_SENT, MESSAGE_RECIEVED,
	TYPING, PRIVATE_MESSAGE, USER_CONNECTED, USER_DISCONNECTED,
	NEW_CHAT_USER
} from '../../Events'
import ChatHeading from './ChatHeading'
import Messages from '../messages/Messages'
import MessageInput from '../messages/MessageInput'
import { values, difference, differenceBy } from 'lodash'

export default class ChatContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			chats: [],
			users: [],
			activeChat: null
		}
	}

	componentDidMount() {
		const { socket } = this.props
		this.initSocket(socket)
	}

	componentWillUnmount() {
		const { socket } = this.props
		socket.off(PRIVATE_MESSAGE)
		socket.off(USER_CONNECTED)
		socket.off(USER_DISCONNECTED)
		socket.off(NEW_CHAT_USER)
	}

	initSocket(socket) {
		socket.emit(COMMUNITY_CHAT, this.resetChat)
		socket.emit(FRIENDS_CHAT, this.resetChat)
		socket.on(PRIVATE_MESSAGE, this.addChat)
		socket.on('connect', () => {
			socket.emit(COMMUNITY_CHAT, this.resetChat)
			socket.emit(FRIENDS_CHAT, this.resetChat)

		})
		socket.on(USER_CONNECTED, (users, allUsers, socketId, user) => {
			console.log({ users })
			//this.setState({ users: allUsers })
			let tempArr = allUsers.map(user => {
				if (user && user.name && users[user.name] != undefined && users[user.name].socketId) {
					user.socketId = users[user.name].socketId
					return user
				} else {
					return user
				}
			})
			if (tempArr.length > 0) {
				this.setState({ users: tempArr })
			}

		})
		socket.on(USER_DISCONNECTED, (users) => {
			const removedUsers = differenceBy(this.state.users, values(users), 'id')
			this.removeUsersFromChat(removedUsers)
			//	this.setState({ users: values(users) })
		})
		socket.on(NEW_CHAT_USER, this.addUserToChat)
	}

	sendOpenPrivateMessage = (reciever) => {
		const { socket, user } = this.props
		const { activeChat } = this.state
		// if (user && user.id) {
		// 	activeChat.id = user.id
		// }

		//console.log({ activeChat }, { user })
		socket.emit(PRIVATE_MESSAGE, { reciever, sender: user, activeChat })

	}
	addUserToChat = ({ chatId, newUser }) => {
		const { chats } = this.state
		const newChats = chats.map(chat => {
			if (chat.id === chatId) {
				return Object.assign({}, chat, { users: [...chat.users, newUser] })
			}
			return chat
		})
		// let index=this.state.users.findIndex(item=>item.name=newUser.name)
		// newChats.socketId=this.state.users[index].socketId
		this.setState({ chats: newChats })
	}
	removeUsersFromChat = removedUsers => {
		const { chats } = this.state
		const newChats = chats.map(chat => {
			let newUsers = difference(chat.users, removedUsers.map(u => u.name))
			return Object.assign({}, chat, { users: newUsers })
		})
		//	this.setState({ chats: newChats })
	}

	/*
	*	Reset the chat back to only the chat passed in.
	* 	@param chat {Chat}
	*/
	resetChat = (chat) => {
		if (Array.isArray(chat)) {
			chat.map(item => {
				this.addChat(item, false);
			})
		} else if (chat != null) {
			return this.addChat(chat, chat && chat.name == 'Community' ? true : false);
		}

	}

	/*
	*	Adds chat to the chat container, if reset is true removes all chats
	*	and sets that chat to the main chat.
	*	Sets the message and typing socket events for the chat.
	*	
	*	@param chat {Chat} the chat to be added.
	*	@param reset {boolean} if true will set the chat as the only chat.
	*/
	addChat = (chat, reset = false) => {
		const { socket, user } = this.props
		const { chats } = this.state
		let getMesString=''
		if(user&&chat){
			getMesString = user.name + '-messages-' + chat.name
		}
		 
		if (localStorage.getItem(getMesString)) {
			chat.messages=JSON.parse(localStorage.getItem(getMesString))
		}
		const newChats = reset ? [chat] : [...chats, chat]
		this.setState({ chats: newChats, activeChat: reset ? chat : this.state.activeChat })

		const messageEvent = `${MESSAGE_RECIEVED}-${chat.id}`
		const typingEvent = `${TYPING}-${chat.id}`

		socket.on(typingEvent, this.updateTypingInChat(chat.id))
		socket.on(messageEvent, this.addMessageToChat(chat.id))
	}

	/*
	* 	Returns a function that will 
	*	adds message to chat with the chatId passed in. 
	*
	* 	@param chatId {number}
	*/
	addMessageToChat = (chatId) => {
		return message => {
			const { chats } = this.state
			let newChats = chats.map((chat) => {
				if (chat.id === chatId)
					chat.messages.push(message)
				return chat
			})

			this.setState({ chats: newChats })
		}
	}

	revealDeleteOptions = (showDelete) => {
		// this.setState({ showDeleteOption: !this.state.showDeleteOption, isOpen: !this.state.isOpen })
		let updatedArr = this.state.chats.filter(chat => chat.id != showDelete.id);
		//	this.setState({ chats: updatedArr })
	}
	toggleMenu = (showChat) => {
		if (document.getElementsByClassName("introjs-tooltip")[0]) {
			document.getElementsByClassName("introjs-tooltip")[0].style.display = 'none'
		}
		if (window.innerWidth < 600) {
			if (showChat) {
				document.getElementById('side-bar').style.width = 0;
				document.getElementById('chat-room-container').style.width = '100%';
				document.getElementById('side-bar').style.display = 'none';
			} else {
				document.getElementById('side-bar').style.width = '100%'
				document.getElementById('chat-room-container').style.width = 0;
				document.getElementById('side-bar').style.display = 'grid';
			}
		}
	}
	/*
	*	Updates the typing of chat with id passed in.
	*	@param chatId {number}
	*/
	updateTypingInChat = (chatId) => {
		return ({ isTyping, user }) => {
			if (this.props.user && user !== this.props.user.name) {

				const { chats } = this.state

				let newChats = chats.map((chat) => {
					if (chat.id === chatId) {
						if (isTyping && !chat.typingUsers.includes(user)) {
							chat.typingUsers.push(user)
						} else if (!isTyping && chat.typingUsers.includes(user)) {
							chat.typingUsers = chat.typingUsers.filter(u => u !== user)
						}
					}
					return chat
				})
				this.setState({ chats: newChats })
			}
		}
	}

	/*
	*	Adds a message to the specified chat
	*	@param chatId {number}  The id of the chat to be added to.
	*	@param message {string} The message to be added to the chat.
	*/
	sendMessage = (chat, message, user) => {
		const { socket } = this.props
		let { id } = chat
		console.log({ user }, { message })
		
		socket.emit(MESSAGE_SENT, { id, message, user })
	}

	/*
	*	Sends typing status to server.
	*	chatId {number} the id of the chat being typed in.
	*	typing {boolean} If the user is typing still or not.
	*/
	sendTyping = (chatId, isTyping) => {
		const { socket } = this.props
		socket.emit(TYPING, { chatId, isTyping })
	}
	handler = (e) => {
		e.preventDefault()
		console.log('user')
		// this.setState({
		//   request: 'accepted'
		// })
	}

	setActiveChat = (activeChat) => {
		this.toggleMenu(true)
		this.setState({ activeChat })
	}
	render() {
		const { user, logout, socket } = this.props
		const { chats, activeChat, users } = this.state
		console.log(activeChat)
		return (
			<div className="chat-container">
				<SideBar
					logout={logout}
					chats={chats}
					user={user}
					users={users}
					activeChat={activeChat}
					socket={socket}
					setActiveChat={this.setActiveChat}
					onSendPrivateMessage={this.sendOpenPrivateMessage}
					handleClick={() => this.toggleMenu(false)}
					handleDeleteChat={this.revealDeleteOptions}
				/>
				<div id="chat-room-container" className="chat-room-container">
					{
						activeChat !== null ? (

							<div className="chat-room">
								<ChatHeading handleClick={this.toggleMenu} />
								<Messages
									socket={socket}
									activeChat={activeChat}
									user={user}
									typingUsers={activeChat.typingUsers}
								/>
								<MessageInput
									sendMessage={
										(message) => {
											this.sendMessage(activeChat, message, user)
										}
									}
									sendTyping={
										(isTyping) => {
											this.sendTyping(activeChat.id, isTyping)
										}
									}
								/>

							</div>
						) :
							<div className="chat-room choose">
								<h3>Choose a chat!</h3>
							</div>
					}
				</div>

			</div>
		);
	}
}
