import React, { Component } from 'react';
import fire from '../fire';
import './Pages.css';

class SessionsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sessions: {}
        };
        this.removeSession = this.removeSession.bind(this);
        this.closeSession = this.closeSession.bind(this);
        this.openSession = this.openSession.bind(this);
    }
    componentWillMount() {
        fire.auth().onAuthStateChanged((user) => {
            if (!user) {
                return;
            }
            let userId = fire.auth().currentUser.uid;
            let refSessions = fire.database().ref('sessions').orderByChild("creator_uid").equalTo(userId);
            refSessions.on('child_added', snapshot => {
                let session = {
                    title: snapshot.val().title,
                    id: snapshot.key,
                    closed: snapshot.val().closed,
                    url: "/session?uid=" + snapshot.key
                };
                let sessions = this.state.sessions;
                sessions[snapshot.key] = session;
                this.setState({ sessions });
            });
            refSessions.on('child_removed', snapshot => {
                let sessions = this.state.sessions;
                delete sessions[snapshot.key];
                this.setState({ sessions });
            });
        });
    }
    addSession(e) {
        e.preventDefault();
        let newSession = fire.database().ref('sessions').push();
        return newSession.set({
            uid: newSession.key,
            title: this.inputE1.value,
            creator_photoURL: fire.auth().currentUser.photoURL,
            creator_displayName: fire.auth().currentUser.displayName,
            creator_uid: fire.auth().currentUser.uid
        }).then(() => {
            this.inputE1.value = '';
        }, (error) => {
            console.log(error);
        });
    }
    removeSession(e, id) {
        let ref = fire.database().ref('sessions');
        let rmIssue = window.confirm("You are about to delete this session!");
        if (rmIssue) {
            ref.child(id).remove().then(() => {
            }, (error) => {
                console.log(error);
            });
        }
    }
    closeSession(e, id) {
        fire.database().ref('sessions').child(id).update({
            closed: true
        }).then(() => {
        }, (error) => {
            console.log(error);
        });
    }
    openSession(e, id) {
        fire.database().ref('sessions').child(id).update({
            closed: false
        }).then(() => {
        }, (error) => {
            console.log(error);
        });
    }
    render() {
        return (
          <div>
            <div className="page">
                <div className="row">
                    <form className="col s12" onSubmit={this.addSession.bind(this)}>
                        <div className="row">
                            <div className="input-field col l6 s12">
                                <input placeholder="Create a new session to get started..." id="new_session" type="text" className="validate" ref={e1 => this.inputE1 = e1} />
                                <input className="btn waves-effect waves-light" type="submit" value="Go" />
                            </div>
                            <div className="input-field col l6 s12">
                                <ul className="collection with-header">
                                    <li className="collection-header"><h4>Recent Sessions</h4></li>
                                    {
                                        Object.values(this.state.sessions).map(session =>
                                            <li className="collection-item" key={session.id}>
                                                <div>{session.title}
                                                    <a href={session.url} title="go to session" className="secondary-content"><i className="material-icons">arrow_forward</i></a>
                                                    <a hidden={session.closed} href="" onClick={(e) => this.closeSession(e, session.id)} title="close session" id={session.id} className="secondary-content"><i className="material-icons">done_all</i></a>
                                                    <a hidden={!session.closed} href="" onClick={(e) => this.openSession(e, session.id)} title="re-open session" id={session.id} className="secondary-content"><i className="material-icons">cached</i></a>
                                                    <a href="" onClick={(e) => this.removeSession(e, session.id)} title="delete session" id={session.id} className="secondary-content"><i className="material-icons">delete_forever</i></a>
                                                </div>
                                            </li>
                                        )
                                    }
                                </ul>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            </div>
        );
    }
}


export default SessionsPage;
