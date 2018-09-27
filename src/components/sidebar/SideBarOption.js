import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import face1 from '../../images/face1.jpeg'
import { CLEAR_CHAT } from '../../Events'
export default class SideBarOption extends PureComponent {
    constructor(props) {
        super(props)
        this.state = { isOpen: false };
    }

    static propTypes = {
        name: PropTypes.string.isRequired,
        lastMessage: PropTypes.string,
        active: PropTypes.bool,
        onClick: PropTypes.func
    }
    componentDidMount = () => {
        this.setClickEvent()
    }
    setClickEvent = () => {
        document.addEventListener('click', (event) => {
            var iconContainer = document.getElementsByClassName('openOverlay')
            if (iconContainer.length != 0) {
                var isclickIconArray = []
                for (var index = 0; index < iconContainer.length; index++) {
                    isclickIconArray.push(iconContainer[index].contains(event.target));
                }

                var listItems = document.getElementById('listItems');
                if (!isclickIconArray.includes(true) && this.state.isOpen && listItems) {
                    var isClickInside = listItems.contains(event.target);

                    if (!isClickInside) {
                        //the click was outside the listItems, do something
                        this.setState({ isOpen: false });
                    }
                }
            }
        });
    }

    static defaultProps = {
        lastMessage: "",
        active: false,
        onClock: () => { }
    }
    openOverlay = (e) => {
        this.setState({ isOpen: true })
        e.stopPropagation()
        e.preventDefault();
    }
    toggleOverlay = (e) => {
        //this.setClickEvent()
        this.setState({ isOpen: !this.state.isOpen });
        e.stopPropagation()
        e.preventDefault();
    }
    clearChat = () => {
        const { socket, chatObj, user } = this.props

        socket.emit(CLEAR_CHAT, user.name, chatObj.name)
        this.props.clearChat(chatObj.name)
    }
    deleteChat=()=>{
        const { socket, chatObj, user } = this.props
        socket.emit(CLEAR_CHAT, user.name, chatObj.name)
        this.props.deleteChat(chatObj.name)
    }

    render() {
        const { active, lastMessage, name, onClick, imagePreviewUrl, showDelete, userStatus, chatObj } = this.props

        let name1 = name
        if (name1 == "Empty Chat" && chatObj) {
            name1 = chatObj.name.split('&')[0]
        }
        let $imagePreview = null;
        if (imagePreviewUrl) {
            $imagePreview = (<img className="user-avatar" src={imagePreviewUrl} />);
        } else {
            $imagePreview = (<img id="user-pic" className="user-avatar" src={face1} />);
        }
        return (
            <div
                className={`user ${active ? 'active' : ''}`}
                onClick={onClick}
            >

                <div className="user-photo">
                    {$imagePreview}
                    <div className={userStatus ? 'user-status-on' : 'user-status-off'}></div>
                </div>

                <div className="user-info">
                    <div className="name">{name1}</div>
                    <div className="last-message">{lastMessage}</div>
                </div>
                <div className="openOverlay">

                    <a href="#">
                        <span className="cust-icon glyphicon glyphicon-chevron-down" onClick={(e) => this.toggleOverlay(e)}></span>
                    </a>
                </div>
                {this.state.isOpen
                    ? <ul id="listItems" className="chat-list-items">
                        <li className="list-item" onClick={(e) => this.clearChat()}>Clear chat</li>
                        {/* <li className="list-item" onClick={(e) => this.deleteChat()}>Delete chat</li> */}
                    </ul> : ''
                }
            </div>
        )
    }
}
