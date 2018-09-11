import React, { Component } from 'react';
// import { FormattedMessage, injectIntl } from 'react-intl'
//import TextField from 'material-ui/TextField'
import FAChevronDown from 'react-icons/lib/md/keyboard-arrow-down'
import FAMenu from 'react-icons/lib/fa/list-ul'
import FASearch from 'react-icons/lib/fa/search'
import If from '../common/If'
import MdEject from 'react-icons/lib/md/eject'
import SideBarOption from './SideBarOption'
import { last, get, differenceBy } from 'lodash'
import { createChatNameFromUsers } from '../../Factories'
import { Link } from "react-router-dom";
import { PRIVATE_MESSAGE, CHANGE_IMAGE } from '../../Events'
import ImageUploader from 'react-images-upload'

import face1 from '../../images/face1.jpeg'

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
			activeSideBar: SideBar.type.CHATS,
			showOverlay: 'hide',
			file: '',
			imagePreviewUrl: '',
			hideGuide:localStorage.getItem('hideGuide')
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
		if (index === -1) {
			this.props.onSendPrivateMessage(reciever)
			this.setActiveSideBar(SideBar.type.CHATS)
		} else {
			// const { socket, user } = this.props
			// const { activeChat } = this.state
			// socket.emit(PRIVATE_MESSAGE, { reciever, sender: user.name, activeChat })
			// let chat = {}
			this.props.setActiveChat(this.props.chats[index])
		}
	}
	hideGuide=()=>{
		document.getElementsByClassName("introjs-tooltip")[0].style.display='none'
		localStorage.setItem('hideGuide',true)
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

	render() {

		const { chats, activeChat, user, setActiveChat, logout, users } = this.props
		const { reciever, activeSideBar, imagePreviewUrl } = this.state
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
			<div id="heading" className="heading">
				{/* <div onClick={() => { this.props.handleClick() }} className="menu">
					<FAMenu />
				</div> */}
				<div className="user-details-container" onClick={e => this.onAvatarClicked(e)}>
					<div className="avatar-ripple" />
					{$imagePreview}
					{/* <img className="user-avatar" onClick={this.onAvatarClicked} src={face1} /> */}
				</div>
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
					{user?<div className="app-name">
					{user.name}
					
				</div>:''}
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
				{activeSideBar === SideBar.type.CHATS ? chats.map(chat => {
					return <SideBarOption key={chat.id} chats={chats} showDelete={chat} lastMessage={get(last(chat.messages), "message", "")}
						name={chat.isCommunity ? chat.name : createChatNameFromUsers(chat.users, user.name)} active={activeChat.id === chat.id}
						onClick={() => {
							this.props.setActiveChat(chat);
						}} handleDeleteChat={this.props.handleDeleteChat} />;
				}) : differenceBy(users, [user], "name").map(user => {
					return <SideBarOption key={user.id} name={user.name} onClick={() => {
						this.addChatForUser(user.name);
					}} handleDeleteChat={this.props.handleDeleteChat} />;
				})}
				{!this.state.hideGuide ? <div className="introjs-tooltip" >
				<div className="user-guide" onClick={()=>this.hideGuide()}>X</div>
				<div className="introjs-tooltiptext">Click here to open chat window
            & Click users to see active users</div>
						
                <div className="introjs-progressbar" style={{width:'16.666666666666664%'}}>
                </div><div className="introjs-arrow top" style={{display: 'inherit'}}></div>
								
                </div>:''}
			</div>
			<div className="current-user">
				<span>Help</span>
				<Link className="logout" onClick={() => { logout() }} to="/login" >Logout</Link>
			</div>
		</div>;

	}
}
