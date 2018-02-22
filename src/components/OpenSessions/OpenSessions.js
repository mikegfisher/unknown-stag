import React, { Component } from 'react';
import fire from '../../fire';

class OpenSessions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sessions: {}
    }
    this.removeSession = this.removeSession.bind(this);
    this.closeSession = this.closeSession.bind(this);
    this.openSession = this.openSession.bind(this);
    this.makeSessionPublic = this.makeSessionPublic.bind(this);
    this.makeSessionPrivate = this.makeSessionPrivate.bind(this);
  }
  componentWillMount() {
      fire.auth().onAuthStateChanged((user) => {
          if (!user) {
              return;
          }
          let userId = fire.auth().currentUser.uid;
          let refSessions = fire.database().ref('sessions').orderByChild('creator_uid').equalTo(userId);
          refSessions.on('child_added', snapshot => {
              let session = {
                  title: snapshot.val().title,
                  id: snapshot.key,
                  closed: snapshot.val().closed,
                  url: "/session?uid=" + snapshot.key,
                  public: snapshot.val().public
              };
              let sessions = this.state.sessions;
              if (!session.closed) {
                sessions[snapshot.key] = session;
              }
              this.setState({ sessions });
          });
          refSessions.on('child_removed', snapshot => {
              let sessions = this.state.sessions;
              delete sessions[snapshot.key];
              this.setState({ sessions });
          });
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
  makeSessionPublic(e, id) {
    fire.database().ref('sessions').child(id).update({
        public: true
    }).then(() => {
    }, (error) => {
        console.log(error);
    });
  }
  makeSessionPrivate(e, id) {
    fire.database().ref('sessions').child(id).update({
        public: false
    }).then(() => {
    }, (error) => {
        console.log(error);
    });
  }
  render() {
    return(
      <ul className="collection with-header">
          <li className="collection-header grey lighten-4"><h4>Open</h4></li>
          {
              Object.values(this.state.sessions).map(session =>
                  <li className="collection-item" key={session.id}>
                      <div>{session.title}
                          <a href={session.url} title="go to session" className="secondary-content"><i className="material-icons">arrow_forward</i></a>
                          {!session.public && (<a href="" onClick={(e) => this.makeSessionPublic(e, session.id)} title="make this session public" className="secondary-content"><i className="material-icons">share</i></a>)}
                          {session.public && (<a href="" onClick={(e) => this.makeSessionPrivate(e, session.id)} title="make this session private" className="secondary-content"><i className="material-icons">lock</i></a>)}
                          {!session.closed && (<a href="" onClick={(e) => this.closeSession(e, session.id)} title="close session" id={session.id} className="secondary-content"><i className="material-icons">done_all</i></a>)}
                          {session.closed && (<a href="" onClick={(e) => this.openSession(e, session.id)} title="re-open session" id={session.id} className="secondary-content"><i className="material-icons">cached</i></a>)}
                          <a href="" onClick={(e) => this.removeSession(e, session.id)} title="delete session" id={session.id} className="secondary-content"><i className="material-icons">delete_forever</i></a>
                      </div>
                  </li>
              )
          }
      </ul>
    );
  }
}
export default OpenSessions;
