import React, { Component } from 'react';
import Session from '../Session/Session';
import fire from '../../fire';

class OpenSessions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sessions: {}
    }
  }
  componentWillMount() {
      fire.auth().onAuthStateChanged((user) => {
          if (!user) {
              return;
          }
          let userId = fire.auth().currentUser.uid;
          let dbRef = fire.database().ref('sessions').orderByChild('creator_uid').equalTo(userId);
          dbRef.on('child_added', snapshot => {
              let sessions = this.state.sessions;
              if (!snapshot.val().closed) { // client side filtering for only open sessions
                sessions[snapshot.key] = snapshot.val();
                this.setState({ sessions });
              }
          });
          dbRef.on('child_removed', snapshot => {
              let sessions = this.state.sessions;
              delete sessions[snapshot.key];
              this.setState({ sessions });
          });
      });
  }
  render() {
    return(
      <ul className="collection with-header">
          <li className="collection-header grey lighten-4"><h4>Open</h4></li>
          {
              Object.values(this.state.sessions).map((session, index) =>
                <Session sessionObject={session} key={"openSession_" + index} />
              )
          }
      </ul>
    );
  }
}
export default OpenSessions;
