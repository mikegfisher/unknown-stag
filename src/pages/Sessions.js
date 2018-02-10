import React, { Component } from 'react';
import fire from '../fire'; // 🔥

class SessionsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sessions: {} // yeah so all we care about here are sessions - pretty simple
        };
        this.removeSession = this.removeSession.bind(this); // "this" is a thing
    }
    componentWillMount() {
        // Check to see if the user is logged in
        fire.auth().onAuthStateChanged((user) => {
            if (!user) {
                // bro come on, LOG THE FRIK IN
                this.setState({ sessions: { id: 1, title: "Please log in." } });
                return;
            }
            // this dude / dudette / gender neutral surfer is logged in
            let userId = fire.auth().currentUser.uid; // so... who are you?
            let refSessions = fire.database().ref('sessions').orderByChild("creator_uid").equalTo(userId); // oh - ok cool, we only want YOUR sessions
            // so, funny story 👇 this is actually relative to the DOM aaaannd the DB, but in a really cool Firebase way that would take WAY more than one line to explain (I mean technically not, but you know...)
            refSessions.on('child_added', snapshot => {
                let session = {
                    title: snapshot.val().title,
                    id: snapshot.key,
                    url: "/session?uid=" + snapshot.key // ok if you convert this to redux (or whatever) I'll buy you a 🍺
                };
                let sessions = this.state.sessions;
                sessions[snapshot.key] = session;
                this.setState({ sessions });
            });
            // ok, every time we remove something (whether from in the app or some other way) update the DOM
            refSessions.on('child_removed', snapshot => {
                let sessions = this.state.sessions;
                delete sessions[snapshot.key];
                this.setState({ sessions });
            });
        });
    }
    addSession(e) {
        e.preventDefault(); // 🙏🏻 don't do this when the component loads
        let newSession = fire.database().ref('sessions').push(); // get the key for a new empty db object
        return newSession.set({
            uid: newSession.key, // sometimes the key is easier to grab from here
            title: this.inputE1.value, // literally, why are you even doing this?
            creator_photoURL: fire.auth().currentUser.photoURL, // so we can quickly plaster mugs all over d'place
            creator_displayName: fire.auth().currentUser.displayName, // "Well he's gotta have a name dun'he?" - @hagrid 
            creator_uid: fire.auth().currentUser.uid // yeah I see you!
        }).then(() => {
            this.inputE1.value = ''; // whoop! we're done, ready for the next one!
        }, (error) => {
            console.log(error); // because errors
        });
    }
    removeSession(e, id) {
        let ref = fire.database().ref('sessions'); // get ready to delete the thing
        let rmIssue = window.confirm("You are about to delete this session!");
        if (rmIssue) {
            ref.child(id).remove().then(() => {
                // successfully removed session 👍
            }, (error) => {
                console.log(error); // because errors
            });
        }
    }
    render() {
        return (
            <div>
                <div className="row">
                    <form className="col s12" onSubmit={this.addSession.bind(this)}>
                        <div className="row">
                            <div className="input-field col s6">
                                <input placeholder="Create a new session" id="new_session" type="text" className="validate" ref={e1 => this.inputE1 = e1} />
                                <input className="btn waves-effect waves-light" type="submit" value="Let's roll!" />
                            </div>
                            <div className="input-field col s6">
                                <ul className="collection with-header">
                                    <li className="collection-header"><h4>Recent Sessions</h4></li>
                                    {
                                        Object.values(this.state.sessions).map(session =>
                                            <li className="collection-item" key={session.id}>
                                                <div>{session.title}
                                                    <a href={session.url} title="go to session" className="secondary-content"><i className="material-icons">arrow_forward</i></a>
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
        );
    }
}


export default SessionsPage;