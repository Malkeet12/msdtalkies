import React, { Component } from 'react';
import FAChevronDown from 'react-icons/lib/md/keyboard-arrow-down'
import FAMenu from 'react-icons/lib/fa/list-ul'
import FASearch from 'react-icons/lib/fa/search'
import MdEject from 'react-icons/lib/md/eject'
import SideBarOption from './SideBarOption'
import { last, get, differenceBy } from 'lodash'
import { createChatNameFromUsers } from '../../Factories'
import { PRIVATE_MESSAGE } from '../../Events'
export default class SideBar extends Component {
	static type = {
		USERS: "users",
		CHATS: "chats"
	}
	constructor(props) {
		super(props)
		this.state = {
			reciever: "",
			activeSideBar: SideBar.type.CHATS
		}
	}
	handleSubmit = (e) => {
		e.preventDefault()
		const { reciever } = this.state
		const { onSendPrivateMessage } = this.props

		onSendPrivateMessage(reciever)
		this.setState({ reciever: "" })
	}

	addChatForUser = (reciever) => {

		let index = this.props.chats.findIndex(chat => chat.users[0] === reciever);
		if (index === -1) {
			this.props.onSendPrivateMessage(reciever)
			this.setActiveSideBar(SideBar.type.CHATS)
			// const { socket, user } = this.props
			// const { activeChat } = this.state
			// socket.emit(PRIVATE_MESSAGE, { reciever, sender: user.name, activeChat })
			// let chat = {}
			// /this.props.setActiveChat(this.props.chats[this.props.chats.length - 1])
		}
	}
	setActiveSideBar = (type) => {
		this.setState({ activeSideBar: type })
	}

	render() {
		const { chats, activeChat, user, setActiveChat, logout, users } = this.props
		const { reciever, activeSideBar } = this.state
		return (
			<div id="side-bar">
				<div className="heading">
					<div className="app-name">MSD Talkies<FAChevronDown /></div>
					<div onClick={() => { this.props.handleClick() }} className="menu">
						<FAMenu />
					</div>
				</div>
				<form onSubmit={this.handleSubmit} className="search">
					<i className="search-icon"><FASearch /></i>
					<input
						placeholder="Search"
						type="text"
						value={reciever}
						onChange={(e) => { this.setState({ reciever: e.target.value }) }} />
					<div className="plus" onClick={() => { this.setActiveSideBar(SideBar.type.USERS) }}></div>
				</form>
				<div className="side-bar-select">
					<div
						onClick={() => { this.setActiveSideBar(SideBar.type.CHATS) }}
						className={`side-bar-select__option side-bar-chats ${activeSideBar === SideBar.type.CHATS ? 'active' : ''}`}>
						<span>Chats</span>
					</div>
					<div
						onClick={() => { this.setActiveSideBar(SideBar.type.USERS) }}
						className={`side-bar-select__option side-bar-users ${activeSideBar === SideBar.type.USERS ? 'active' : ''}`}>
						<span>Users</span>
					</div>
				</div>
				<div
					className="users"
					ref='users'
					onClick={(e) => { (e.target === this.refs.user) && setActiveChat(e.target) }}>

					{
						activeSideBar === SideBar.type.CHATS ?
							chats.map((chat) => {
								return (
									<SideBarOption
										key={chat.id}
										lastMessage={get(last(chat.messages), 'message', '')}
										name={chat.isCommunity ? chat.name : createChatNameFromUsers(chat.users, user.name)}
										active={activeChat.id === chat.id}
										onClick={() => { this.props.setActiveChat(chat) }}
									/>
								)
							})

							:
							differenceBy(users, [user], 'name').map((user) => {
								return <SideBarOption
									key={user.id}
									name={user.name}
									onClick={() => { this.addChatForUser(user.name) }}
								/>
							})
					}
				</div>
				<div className="current-user">
					<span>{user.name}</span>
					<div onClick={() => { logout() }} title="Logout" className="logout">
						<MdEject />
					</div>
				</div>
			</div>
		);

	}
}
