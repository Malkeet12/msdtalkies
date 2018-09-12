import React, { Component } from "react";
import { LOGIN_USER } from "../Events";
import Header from './Header'
import { createHashHistory } from 'history'
import { Link, Redirect } from "react-router-dom";
export const history = createHashHistory()

export default class RemindUsername extends Component {
	

	render() {
		return (
			<div>Coming soon, Untill then try to remember your username</div>
		);
	}
}