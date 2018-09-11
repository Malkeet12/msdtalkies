import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class LoginForm extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="header">
        <svg className="logo-item" version="1.1" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" viewBox="594 335 185 135"><g data-item-type="text" data-item="Business" id="logo__item--business" >
          <g className="logo__item__inner" transform="translate(595.5625 467.7254943798355) scale(1 1) rotate(0 0 0)">
            <text data-part-id="logo__item--business" dy="0" dominantBaseline="auto" alignmentBaseline="auto" fontFamily="Montserrat" fontSize="32px" fill="#29A5DE" letterSpacing="0" fontWeight="bold" fontStyle="normal" data-font-family="Montserrat" data-font-weight="bold" data-font-style="normal" data-ttf-url="/builder_assets/fontsttf/font-montserrat-bold-normal.ttf">MsdTalkies</text>
          </g>
        </g><g data-item-type="image" data-item="Image" data-logo-item="" id="logo__item--logo_0" className="logo__item">
            <g className="logo__item__inner" transform="translate(616.0012780495342 324.5) scale(0.8792363655430735 0.8792363655430735) rotate(0 0 0)">

              <g>
                <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="6.7845" y1="62.6357" x2="74.3794" y2="62.6357">

                </linearGradient>
                <path fill="url(#SVGID_1_)" d="M19.9,58.6l29.6-31.2l-3-2c-5-3.4-13.2-1.5-16.2,3.6L8.8,65.4c-3.7,6.3-2.1,13.2,3.9,17.3l27.8,18.8   l-22-24.9C14,71.4,14.6,64.2,19.9,58.6z" data-part-id="logo__item--logo_0__0"></path>
                <path fill="#87AA56" d="M70.1,27.2c-0.9-1-2.1-1.8-3.4-2.3c-4.1-1.6-9.8-0.5-13.1,3l-1.4,1.4L22.7,60.4c-5.3,5.6-5.8,12.8-1.3,18   l22.2,25.2l4.1,4.7c0.2,0.2,0.4,0.3,0.6,0.5c0.4,0.4,0.9,0.8,1.4,1.1c-0.4-0.3-0.7-0.6-1-1c-0.4-0.5-0.7-1-1-1.5l-0.7-1.5   L31.3,72.9c-2.8-6-0.2-13.1,6.4-17.8L63.6,37l8.6-6l0.8-0.6L70.1,27.2z" data-part-id="logo__item--logo_0__1"></path>
                <path fill="#80A7A4" d="M100.3,33.4c-1.2-3.1-4.6-4.9-8.4-5.1c-0.3,0-0.7,0-1,0c-2.1,0.1-4.3,0.6-6.2,1.8l-7.9,4.7L76,35.2L68,40   L44.1,54.2c-7,4.2-10.1,11.1-7.7,17.2l13.8,35.7c0.1,0.2,0.1,0.3,0.2,0.5c0.3,0.7,0.7,1.3,1.2,1.8c0.5,0.5,1.1,1,1.7,1.3   c-0.2-0.4-0.4-0.8-0.5-1.3c0,0,0-0.1,0-0.1l-0.3-1.3l-9-35.8c-1.6-6.4,2.3-12.9,9.8-16.2l23.4-10.3l6.2-2.7l0.9-0.4l11.9-5.2   l0.7-0.3c0.1-0.1,0.2-0.1,0.4-0.1c1.5-0.6,3-0.9,4.5-0.9L100.3,33.4z" data-part-id="logo__item--logo_0__2"></path>
                <path fill="#26A7DF" d="M101.9,97.1l13-33.7l-3.7-12.9c-1.7-5.6-8.9-9-14.3-6.6L76.8,53l1.6-0.1L101.9,97.1z" data-part-id="logo__item--logo_0__3"></path>
                <path fill="#26A7DF" d="M58.8,61.1c-6.5,2.9-9.6,9.6-7.6,16.4l7.2,24.9l10.7-45.9L58.8,61.1z" data-part-id="logo__item--logo_0__4"></path>
                <path fill="#26A7DF" d="M119.1,77.7L106.5,111l8.7-3.9c6.5-2.9,9.6-9.6,7.6-16.4L119.1,77.7z" data-part-id="logo__item--logo_0__5"></path>
                <path fill="#26A7DF" d="M77.7,74.4l-16,38.8l1.3,4.4c1.6,5.7,8.9,9,14.3,6.6l23.6-10.6l-2.4,0.2L77.7,74.4z" data-part-id="logo__item--logo_0__6"></path>
                <polygon fill="#26A7DF" points="48.6,144.7 61.6,113.2 58.5,102.4" data-part-id="logo__item--logo_0__7"></polygon>
                <path fill="#26A7DF" d="M142.9,35.1c-0.1-2.1-0.3-5.6-0.5-7.8l-0.5-9.1c-0.1-2.1-1.7-2.9-3.5-1.7l-7.6,5c-1.8,1.2-4.7,3.1-6.5,4.3   l-7.6,5c-1.8,1.2-1.7,2.9,0.2,3.9l7.6,3.8l-9.7,24.9l4.1,14.3l2.5-6.5l0,0l11.3-28.6l7.3,3.7c1.9,1,3.4,0,3.3-2.1L142.9,35.1z" data-part-id="logo__item--logo_0__8"></path>
              </g>

            </g>
          </g></svg>
        <Link className="header-button" to={this.props.redirectTo}>{this.props.title}</Link>
      </div>
    )
  }

}