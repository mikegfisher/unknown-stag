import React, { Component } from 'react';
import LatestSessions from '../components/LatestSessions/LatestSessions';
import OpenSessions from '../components/OpenSessions/OpenSessions';
import PublicSessions from '../components/PublicSessions/PublicSessions';
import fire from '../fire';
import './Pages.css';

class SessionsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    addSession(e) {
        e.preventDefault();
        let newSession = fire.database().ref('sessions').push();
        return newSession.set({
            uid: newSession.key,
            title: this.inputE1.value,
            creator_photoURL: fire.auth().currentUser.photoURL,
            creator_displayName: fire.auth().currentUser.displayName,
            creator_uid: fire.auth().currentUser.uid,
            public: false,
            closed: false,
            created: new Date()
        }).then(() => {
            this.inputE1.value = '';
        }, (error) => {
            console.log(error);
        });
    }
    render() {
        return (
            <div className="page">
                <div className="row">
                    <form className="col s12" onSubmit={this.addSession.bind(this)}>
                        <div className="row">
                            <div className="input-field col l6 s12">
                                <input placeholder="Create a new session to get started..." id="new_session" type="text" className="validate" ref={e1 => this.inputE1 = e1} />
                                <input className="btn waves-effect waves-light" type="submit" value="Go" />
                            </div>
                            <div className="col l6 s12">
                                <LatestSessions />
                            </div>
                        </div>
                    </form>
                </div>
                <div className="row">
                  <div className="col l6 s12">
                    <OpenSessions />
                  </div>
                  <div className="col l6 s12">
                    <PublicSessions />
                  </div>
                </div>
            </div>
        );
    }
}


export default SessionsPage;
