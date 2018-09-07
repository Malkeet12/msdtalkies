import React, { Component } from "react";
import { VERIFY_USER } from "../Events";
import appLogo from '../images/app-logo.png'
export default class LoginForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			nickname: "",
			password: '',
			error: "",
			disabled: true,
			showLoader: false,
			showError: false
		};
	}

	setUser = ({ user, isUser, error }) => {
		if (error) {
			this.setState({ showError: error });
		} else {
			this.props.setUser(user);
			console.log({ user });
		}
		this.setState({ showLoader: false });
		if (document.getElementById("login")) {
			document.getElementById("login").classList.remove("blur-background");
		}
	};

	handleSubmit = e => {
		e.preventDefault();
		if (this.state.nickname && this.state.password) {
			const { socket } = this.props;
			const { nickname, password } = this.state;
			socket.emit(VERIFY_USER, nickname, password, this.setUser);
			this.setState({ showLoader: true });
			document.getElementById("login").classList.add("blur-background");
		}
	};

	handleChange = e => {
		this.setState({ nickname: e.target.value });
	};

	handlePwdChange = e => {
		this.setState({ password: e.target.value });
	};

	setError = error => {
		this.setState({ error });
	};

	render() {
		const { nickname, password, showError } = this.state;
		return (
			<div className="login-container">
				<section className="login-leftbar">
					<div>
						<a href="/">
							<img src={appLogo} alt="MSDTalkies Logo" className="styles-logo" />
            </a>
						<h1 className="styles-header">Log in</h1>
					</div>
					<p className="styles-description">
						<span>
							Having trouble signing in? {" "}
              <a className="page-styles-link" href="/remind-usernames/">
								Retrieve your username(s)
              </a>{" "}
							or{" "}
              <a className="page-styles-link" href="/reset-password/">
								reset your password.
              </a>
						</span>
					</p>
				</section>
				<section id="login" className="login">
					{this.state.showLoader ? (
						<div className="loader-container" />
					) : (
							<form onSubmit={this.handleSubmit} className="login-form">
								{showError ? <div className="error-block">{showError}</div> : ""}

								<div className="input-container">
								{/* <label className="form-label" for="nickname">What is your name?</label> */}
									<input
										ref={input => {
											this.textInput = input;
										}}
										type="text"
										id="nickname"
										autoComplete={"off"}
										value={nickname}
										onChange={this.handleChange}
										placeholder={"John Doe"}
									/>
								{/* <label className="form-label" for="password">What is your name?</label> */}
									<input
										ref={input => {
											this.textInput = input;
										}}
										type="password"
										id="password"
										autoComplete={"off"}
										value={password}
										onChange={this.handlePwdChange}
										placeholder={"********"}
									/>

								</div>
								<div>
									<button
										className={this.state.nickname == "" || this.state.password == "" ? 'disabled-button' : "submit-btn"}
									>
										Submit
                </button>
								</div>
							</form>
						)}
				</section>
				<div className="styles-altText"><span>Don't have an MsdTalkies account yet? <a className="page-styles-link" href="/signup/">Sign up now!</a></span></div>
			</div>
		);
	}
}

// for phone number verification

// import React, {Component} from 'react';
// import {VERIFY_USER} from '../Events'
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
