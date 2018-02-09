import React, { Component } from 'react';
import fire from '../fire';

class SessionsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sessions: {}
        }
        this.removeSession = this.removeSession.bind(this);
    }
    componentWillMount() {
        // Check to see if the user is logged in
        fire.auth().onAuthStateChanged((user) => {
            let userId, dbRef;
            if (!user) {
                // not logged in
                this.setState({sessions: [{id: 1, title: "Please log in"}]});
                return;
            }
            // logged in
            userId = fire.auth().currentUser.uid;
            dbRef = fire.database().ref('sessions').orderByChild("creator_uid").equalTo(userId);
            dbRef.on('child_added', snapshot => {
                let session = {
                    title: snapshot.val().title,
                    id: snapshot.key,
                    url: "/session?uid=" + snapshot.key
                };
                let sessions = this.state.sessions;
                sessions[snapshot.key] = session;
                this.setState({ sessions });
            });
            dbRef.on('child_removed', snapshot => {
                let sessions = this.state.sessions;
                delete sessions[snapshot.key];
                console.log(Object.values(sessions));
                this.setState({ sessions });
            });
        });
    }
    addSession(e) {
        e.preventDefault();
        let newSession = fire.database().ref('sessions').push();
        newSession.set({
            uid: newSession.key,
            title: this.inputE1.value,
            description: '',
            creator_photoURL: fire.auth().currentUser.photoURL,
            creator_displayName: fire.auth().currentUser.displayName,
            creator_uid: fire.auth().currentUser.uid
        });
        this.inputE1.value = '';
    }
    removeSession(e, id) {
        console.log('removing session');
        let ref = fire.database().ref('sessions');
        ref.child(id).remove().then(() => {
            
            console.log('done');
        }, (error) => {
            console.log(error);
        });
    }
    render() {
        return (
            <div class="row">
                <form class="col s12" onSubmit={this.addSession.bind(this)}>
                    <div class="row">
                        <div class="input-field col s6">
                            <input placeholder="Create a new session" id="new_session" type="text" class="validate" ref={e1 => this.inputE1 = e1} />
                            <input class="btn waves-effect waves-light" type="submit" />
                        </div>
                        <div class="input-field col s6">
                            <ul class="collection with-header">
                                <li class="collection-header"><h4>My Sessions</h4></li>
                                {
                                    Object.values(this.state.sessions).map(session =>
                                        <li class="collection-item" key={session.id}>
                                            <div>{session.title}
                                                <a href={session.url} title="go to session" class="secondary-content"><i class="material-icons">arrow_forward</i></a>
                                                <a href="#" onClick={(e) => this.removeSession(e, session.id)} title="delete session" id={session.id} class="secondary-content"><i class="material-icons">cancel</i></a>
                                            </div>
                                        </li>
                                    )
                                }
                            </ul>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}


export default SessionsPage;