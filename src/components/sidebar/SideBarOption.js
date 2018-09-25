import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import face1 from '../../images/face1.jpeg'

export default class SideBarOption extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            showDeleteOption: false,
            isOpen: false
        }
    }

    static propTypes = {
        name: PropTypes.string.isRequired,
        lastMessage: PropTypes.string,
        active: PropTypes.bool,
        onClick: PropTypes.func
    }
    static defaultProps = {
        lastMessage: "",
        active: false,
        onClock: () => { }
    }
    render() {
        const { active, lastMessage, name, onClick, imagePreviewUrl, showDelete,userStatus,chatObj } = this.props
        console.log(userStatus)
        let name1=name
        if(name1=="Empty Chat" && chatObj){
            name1=chatObj.name.split('&')[0]
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
                    <div className={userStatus?'user-status-on':'user-status-off'}></div>
                </div>

                <div className="user-info">
                    <div className="name">{name1}</div>
                    <div className="last-message">{lastMessage}</div>
                </div>
                {/* {
                        this.props.showDelete ? 
                    <div>{
                        this.state.isOpen && this.props.showDelete ? <a href="#">
                            <span className="cust-icon glyphicon glyphicon-chevron-up" onClick={this.props.handleDeleteChat.bind(this, showDelete)}></span>
                        </a>
                            :
                            <a href="#">
                                <span className="cust-icon glyphicon glyphicon-chevron-down" onClick={this.props.handleDeleteChat.bind(this, showDelete)}></span>
                            </a>
                    }
                   </div>:
                   ''
                }

                <div className="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                ...
                </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.showDeleteOption ?
                    <ul className="chat-list-items">
                        <li className="list-item" data-toggle="modal" data-target="#exampleModal">Clear chat</li>
                        <li className="list-item" data-toggle="modal" data-target="#exampleModal">Delete chat</li>
                    </ul>
                    : ''
                } */}
            </div>
        )
    }
}
