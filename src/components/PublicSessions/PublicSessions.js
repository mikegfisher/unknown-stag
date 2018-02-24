import React, { Component } from 'react';
import Session from '../Session/Session';
import fire from '../../fire';

class PublicSessions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sessions: {}
    }
  }
  componentWillMount() {
          let dbRef = fire.database().ref('sessions').orderByChild('public').equalTo(true);
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
  }
  render() {
    return(
      <ul className="collection with-header">
          <li className="collection-header grey lighten-4"><h4>Public</h4></li>
          {
              Object.values(this.state.sessions).map((session, index) =>
                <Session sessionObject={session} key={"publicSession_" + index} />
              )
          }
      </ul>
    );
  }
}
export default PublicSessions;
