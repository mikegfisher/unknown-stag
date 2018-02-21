import React, { Component } from 'react';
import fire from '../../fire';
import './LogOutFAB.css';

class LogOutFAB extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false
        };
    }
    componentWillMount() {
        fire.auth().onAuthStateChanged((user) => {
            if (!user) {
                return;
            }
            this.setState({ loggedIn: true });
        });
    }
    handleClick() {
        fire.auth().signOut().then(() => {
            this.setState({ loggedIn: false });
            window.location.reload(true);
        }).catch(function(error) {});
    }
    render() {
        return (
            <div className="log-out-fab">
                {this.state.loggedIn && (<a onClick={(e) => this.handleClick(e)} title="log out" className="btn-floating btn-large waves-effect waves-light red"><i className="material-icons">exit_to_app</i></a>)}
            </div>
        )
    }
}
export default LogOutFAB;
