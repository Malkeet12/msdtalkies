import React, { Component } from 'react';
// import { FormattedMessage, injectIntl } from 'react-intl'
//import TextField from 'material-ui/TextField'
import SideBarOption from './SideBarOption'
import { last, get, differenceBy } from 'lodash'
import { createChatNameFromUsers } from '../../Factories'
import { Link } from "react-router-dom";
import { VERIFY_FRIEND, UPDATE_FRIEND_LIST, CHANGE_IMAGE } from '../../Events'
import ImageUploader from 'react-images-upload'

import face1 from '../../images/face1.jpeg'
const uuidv4 = require('uuid/v4')
const UserDetails = ({ className, iconImg, value = 0 }) => {
	return (
		<div className={'avatar-detail-item ' + className} data-layout="row" data-layout-align="start center">
			<img className="icon-image" src={iconImg} />
			<h3 className="text">{value}</h3>
		</div>
	)
}

export default class SideBar extends Component {
	static type = {
		USERS: "users",
		CHATS: "chats"
	}
	constructor(props) {
		super(props)
		this.state = {
			reciever: "",
			showError: '',
			showSuccess: '',
			showLoader: false,
			activeSideBar: SideBar.type.CHATS,
			showOverlay: 'hide',
			file: '',
			userEmail: '',
			imagePreviewUrl: ''
		}
		this.closeOverlay = this.closeOverlay.bind(this)
		this.editImage = this.editImage.bind(this)
	}
	componentDidMount() {
		const { socket } = this.props
		//this.initSocket(socket)
	}

	handleSubmit = (e) => {
		e.preventDefault()
		const { reciever } = this.state
		const { onSendPrivateMessage } = this.props

		onSendPrivateMessage(reciever)
		this.setState({ reciever: "" })
	}
	onAvatarClicked = () => {
		let avatarState = 'create'

		if (this.props.user.avatar_info != null) {
			avatarState = 'modify'
		}
	}
	_handleImgSubmit(e) {
		e.preventDefault();
		// TODO: do something with -> this.state.file
		console.log('handle uploading-', this.state.file);
	}

	_handleImageChange(e) {
		e.preventDefault();

		let reader = new FileReader();
		let file = e.target.files[0];

		reader.onloadend = () => {
			this.setState({
				file: file,
				imagePreviewUrl: reader.result
			});
			const { socket, user } = this.props
			socket.emit(CHANGE_IMAGE, { userName: '', imagePreviewUrl: reader })
		}

		reader.readAsDataURL(file)
	}
	addChatForUser = (reciever) => {
		let index = this.props.chats.findIndex(chat => chat.users[0] === reciever);
		//console.log(this.props.chats, reciever)
		if (index === -1) {
			this.setActiveSideBar(SideBar.type.CHATS)
			this.props.onSendPrivateMessage(reciever)


		} else {
			// const { socket, user } = this.props
			// const { activeChat } = this.state
			// socket.emit(PRIVATE_MESSAGE, { reciever, sender: user.name, activeChat })
			// let chat = {}
			this.props.setActiveChat(this.props.chats[index])
		}
	}
	setActiveSideBar = (type) => {
		this.setState({ activeSideBar: type })
	}
	onAvatarClicked = () => {
		this.setState({ showOverlay: 'show' })
	}

	closeOverlay = () => {
		this.setState({ showOverlay: 'hide' })
	}
	editImage = () => {
		document.getElementById('fileInput').click();
	}
	emptyFunc = () => {

	}
	handleChange = e => {
		this.setState({ userEmail: e.target.value });
	};
	showAddUserOverlay = (e) => {
		this.setState({ showOverlayAddUser: 'show' })
	}
	closeOverlayAddUser = (e) => {
		this.setState({ showOverlayAddUser: 'hide' })
		this.setState({ showSuccess: '', showSuccess: '' });
	}

	verifyUser = (user) => {
		const { socket, chats, activeChat } = this.props;
		const { userEmail } = this.state;
		this.setState({ showLoader: true });
		let index = chats.findIndex(chat => chat.email == userEmail)
		if (index == -1) {
			socket.emit(VERIFY_FRIEND, user.name,user.email, user.id, userEmail, this.addUser);
			setTimeout(() => {
				socket.emit(UPDATE_FRIEND_LIST, user.name, activeChat.name, this.props.resetChat)
			},2000)
		} else {
			this.setState({ showError: 'User linked with this email id is already in friendlist' });

			this.clearMessage('showError')
		}
	}
	addUser = (res) => {
		if (res == null) {
			this.setState({ showError: 'No account is linked with this email id' });
			this.clearMessage('showError')

		} else {
			this.setState({ showSuccess: 'Friend Request sent successfully' });
			this.clearMessage('showSuccess')
		}
	}

	clearMessage = (type) => {
		var newState = {};
		newState[type] = '';
		this.setState({ showLoader: false });
		setTimeout(() => {
			this.setState(newState);
			//this.setState({ userEmail: '' })
		}, 3000)
	}
	render() {

		const { chats, activeChat, user, setActiveChat, logout, socket } = this.props
		const { reciever, activeSideBar, imagePreviewUrl, userEmail, showError, showSuccess } = this.state
		let $imagePreview = null;
		if (imagePreviewUrl) {
			$imagePreview = (<img className="user-avatar" src={imagePreviewUrl} />);
		} else {
			$imagePreview = (<img id="user-pic" className="user-avatar" src={face1} />);
		}
		return <div id="side-bar">
			<div className={`overlay-container ${this.state.showOverlay}`} >
				<div className="overlay" onClick={e => this.emptyFunc(e)} />
				<div className="avatar-home" data-layout="column" data-layout-align="center center">
					<i className="material-icons close" onClick={this.closeOverlay} >x</i>
					<div className="avatar-container" onClick={this.onEditAvatarClicked}>
						{$imagePreview}
						{/* <img id="user-pic" className="avatar" src={face1} /> */}
						<h6 className="edit-label" onClick={this.editImage}>
							Edit
          </h6>


						<input className="fileInput" id="fileInput"
							type="file"
							onChange={(e) => this._handleImageChange(e)} />
						{/* <button className="submitButton"
								type="submit"
								onClick={(e) => this._handleImgSubmit(e)}>Upload Image</button> */}
					</div>
					<div className="edit-name-container">

					</div>
				</div>
			</div>

			<div className={`overlay-container ${this.state.showOverlayAddUser}`} >
				<div className="overlay" onClick={e => this.emptyFunc(e)} />
				<div className="avatar-home overlay-add-user" data-layout="column" data-layout-align="center center">
					<i className="material-icons close" onClick={this.closeOverlayAddUser} >x</i>
					<div className="container" onClick={this.onEditAvatarClicked}>


						<div className="add-user-form">
							{showError ? <div className="error-block">{showError}</div> : ""}
							{showSuccess ? <div className="success-block">{showSuccess}</div> : ""}
							{this.state.showLoader ? (
								<div style={{ marginBottom: '25px' }} className="loader-container" ></div>
							) : (<div><div className="input-container">
								<input
									ref={input => {
										this.textInput = input;
									}}
									type="text"
									id="userEmail"
									autoComplete={"off"}
									value={userEmail}
									style={{ color: 'white' }}
									onChange={this.handleChange}
									placeholder={"JohnDoe@msdtalkies.com"}
								/>
							</div>
								<button onClick={() => this.verifyUser(user)}
									className={this.state.nickname == "" || this.state.password == "" ? 'disabled-button' : "submit-btn"}
								>
									SEND REQUEST
                </button>
							</div>)
							}
						</div>






					</div>
				</div>
			</div>
			<div id="heading" className="heading">
				{/* <div onClick={() => { this.props.handleClick() }} className="menu">
					<FAMenu />
				</div> */}
				<div className="user-details-container" onClick={e => this.onAvatarClicked(e)}>
					<div className="avatar-ripple" />
					{$imagePreview}
					{/* <img className="user-avatar" onClick={this.onAvatarClicked} src={face1} /> */}
					{user ? <div className="app-name">
						{user.name}

					</div > : ''}
				</div>
				<div className="app-name">Chats</div>
				<span className="add-user" onClick={(e) => this.showAddUserOverlay(e)} >+</span>
				{/*<form onSubmit={this.handleSubmit} className="search">
					<i className="search-icon">
						<FASearch />
					</i>
					<input placeholder="Search" type="text" value={reciever} onChange={e => {
						this.setState({ reciever: e.target.value });
					}} />
					{/* <div className="plus" onClick={() => { this.setActiveSideBar(SideBar.type.USERS) }}></div> 
				</form>
					*/}

			</div>

			<div className="side-bar-select">
				<div onClick={() => {
					this.setActiveSideBar(SideBar.type.CHATS);
				}} className={`side-bar-select__option side-bar-chats ${activeSideBar === SideBar.type.CHATS ? "active" : ""}`}>
					<span>Chats</span>
				</div>
				<div onClick={() => {
					this.setActiveSideBar(SideBar.type.USERS);
				}} className={`side-bar-select__option side-bar-users ${activeSideBar === SideBar.type.USERS ? "active" : ""}`}>
					<span>Users</span>
				</div>
			</div>
			<div className="users" ref="users" onClick={e => {
				e.target === this.refs.user && setActiveChat(e.target);
			}}>
				{activeSideBar === SideBar.type.CHATS ? chats.map((chat, index) => {
					if (chat != null) {
						return <SideBarOption key={uuidv4()} userStatus={chat.socketId == undefined ? false : true} chatObj={chats[index]} 
						showDelete={chat} lastMessage={get(last(chat.messages), "message", "")}
							name={chat.isCommunity ? chat.name : createChatNameFromUsers(chat.users, user.name)}
							active={activeChat.id === chat.id} userStatus={chat.online} user={user} socket={socket}
							clearChat={this.props.clearChat}
							deleteChat={this.props.deleteChat}
							onClick={() => {
								this.props.setActiveChat(chat);
							}} handleDeleteChat={this.props.handleDeleteChat} />;
					}
				}) : ''
				}
			</div>
			<div className="current-user">
				<span>Help</span>
				<Link className="logout" onClick={() => { this.props.logout() }} to="/login" >Logout</Link>
			</div>
		</div>;

	}
}
