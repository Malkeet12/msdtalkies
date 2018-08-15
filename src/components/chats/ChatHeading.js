import React, { Component } from 'react';
// import FAMenu from 'react-icons/lib/fa/list-ul'
// import FAVideo from 'react-icons/lib/fa/video-camera'
// import FAUserPlus from 'react-icons/lib/fa/user-plus'
// import MdEllipsisMenu from 'react-icons/lib/md/keyboard-control'

//
//export default function ({ name, numberOfUsers }) {
export default class ChatHeading extends Component {
	// constructor(props) {
	// 	super(props)
	// }
	render() {
		const { name } = this.props
		return (
			<div className="chat-header">

				<div id="menuHeading" onClick={() => { this.props.handleClick() }} className="menuHeading">
				</div>
				<div className="user-info">
					<div className="user-name">{name}</div>
					<div className="status">
						<div className="indicator"></div>
						{/* <span>{numberOfUsers ? numberOfUsers : null}</span> */}
					</div>
				</div>
				{/* <div className="options">
				<FAVideo />
				<FAUserPlus />
				<MdEllipsisMenu />
			</div> */}
			</div>
		);
	}

}
