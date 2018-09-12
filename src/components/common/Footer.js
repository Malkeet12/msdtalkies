import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Footer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className="footer">
        <span>
          Developed and Managed by <a className="age-styles-link" href="https://www.linkedin.com/in/malkeet-singh/" target="_blank">
            Malkeet Singh
          </a>
        </span>
      </div>;
  }

}