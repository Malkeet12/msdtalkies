import React, { Component } from 'react';
import { VERIFY_USER } from '../Events'

export default class LoginForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			nickname: "",
			error: "",
			disabled: true
		};
	}

	setUser = ({ user, isUser }) => {

		if (isUser) {
			this.setError("User name taken")
		} else {
			this.setError("")
			this.props.setUser(user)
		}
	}

	handleSubmit = (e) => {
		e.preventDefault()
		if (this.state.nickname) {
			const { socket } = this.props
			const { nickname } = this.state
			socket.emit(VERIFY_USER, nickname, this.setUser)
		}
	}

	handleChange = (e) => {
		if(e.target.value!=''){
			this.setState({disabled:false})
		}else{
			this.setState({disabled:true})
		}
		this.setState({ nickname: e.target.value })
	}

	setError = (error) => {
		this.setState({ error })
	}

	render() {
		const { nickname, error } = this.state
		return (
			<div className="login">
				<form onSubmit={this.handleSubmit} className="login-form" >

					<label htmlFor="nickname">
						<h2>User Name</h2>
					</label>
					<div>
						<input
							ref={(input) => { this.textInput = input }}
							type="text"
							id="nickname"
							autoComplete={'off'}
							value={nickname}
							onChange={this.handleChange}
							placeholder={'John Doe'}
						/>
						<button style={{ background: this.state.disabled ? '#BDBDBD' : '' }} className="submit-btn">Submit</button>
					</div>
					<div className="error">{error ? error : null}</div>

				</form>
			</div>
		);
	}
}


// for phone number verification

// import React, { Component } from 'react';
// import { VERIFY_USER } from '../Events'
// const uuidv4 = require('uuid/v4')
// let loginFlag = false

// export default class LoginForm extends Component {
// 	constructor(props) {
// 		super(props);

// 		this.state = {
// 			number: "",
// 			error: "",
// 			showAvaialble: false,
// 			randomOtp: '',
// 			user: '',
// 			nickName: '',
// 			tryAgain: ''
// 		};
// 	}

// 	handleVerify = (e) => {
// 		e.preventDefault()
// 		console.log(this.state.otp)
// 		console.log(this.state.randomOtp)
// 		debugger
// 		if (this.state.otp == this.state.randomOtp) {
// 			console.log('done')
// 			this.props.setUser(this.state.user)
// 			this.setState({ tryAgain: false });
// 		} else {

// 			loginFlag = true
// 			this.setState({ tryAgain: "wrong otp, please try again" })
// 		}

// 		// if(isUser){
// 		// 	this.setError("That User name is taken. Try another")
// 		// 	this.setState({showAvaialble:true})
// 		// }else{
// 		// 	this.setError("")
// 		// 	this.props.setUser(user)
// 		// }
// 	}

// 	handleSubmit = (e) => {
// 		e.preventDefault()
// 		const { socket } = this.props
// 		const { nickName, number } = this.state

// 		socket.emit(VERIFY_USER, nickName, number, this.setOtp)
// 	}
// 	setOtp = ({ randomNumber, user }) => {

// 		loginFlag = true
// 		console.log({ randomNumber })
// 		this.setState({ randomOtp: user.otp, user: user })
// 	}
// 	handleChange = (e) => {
// 		this.setState({ number: e.target.value })
// 	}
// 	handleChange2 = (e) => {
// 		this.setState({ nickName: e.target.value })
// 	}

// 	handleChange1 = (e) => {
// 		this.setState({ otp: e.target.value })
// 	}
// 	setError = (error) => {
// 		this.setState({ error })
// 	}

// 	render() {
// 		const { number, error, otp, nickName, tryAgain } = this.state
// 		let hintArray = [uuidv4(), uuidv4(), uuidv4()]
// 		let avilableIdList = hintArray.map(id => number + id.toString().slice(0, 2) + ' ')
// 		return (
// 			<div className="login">
// 				<form className="login-form" >

// 					{/* <label htmlFor="number">
// 						<h2>Got a number?</h2>
// 					</label> */}
// 					<div>
// 						{!loginFlag ?
// 							<div>
// 								<input
// 									ref={(input) => { this.textInput = input }}
// 									type="text"
// 									id="nickName"
// 									autoComplete={'off'}
// 									value={nickName}
// 									onChange={this.handleChange2}
// 									placeholder={'John Doe'}
// 								/>
// 								<input
// 									ref={(input) => { this.textInput = input }}
// 									type="text"
// 									id="number"
// 									autoComplete={'off'}
// 									value={number}
// 									onChange={this.handleChange}
// 									placeholder={'+911234567890'}
// 								/>
// 								<button onClick={this.handleSubmit} className="submit-btn">Send OTP</button></div>
// 							:
// 							<div>
// 								<input
// 									ref={(input) => { this.textInput1 = input }}
// 									type="text"
// 									id="otp"
// 									value={otp}
// 									autoComplete={'off'}
// 									//value={otp}
// 									onChange={this.handleChange1}

// 								/>
// 								<button onClick={this.handleVerify} className="submit-btn">Verify OTP</button>
// 								<div className="error">{tryAgain ? tryAgain : null}</div>
// 							</div>

// 						}
// 					</div>
// 					<div className="error">{error ? error : null}</div>
// 					{this.state.showAvaialble ? <div className="error">Available: {avilableIdList ? avilableIdList : null}</div> : ''}

// 				</form>
// 			</div>
// 		);
// 	}
// }
