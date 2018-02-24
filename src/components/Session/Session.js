import React, { Component } from 'react';
import fire from '../../fire';

class Session extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: ''
    };
    this.removeSession = this.removeSession.bind(this);
    this.updateSession = this.updateSession.bind(this);
  }
  componentWillMount() {
    fire.auth().onAuthStateChanged((user) => {
        if (user) {
            this.setState({userId: fire.auth().currentUser.uid});
        }
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
  updateSession(e, id, updateObject) {
      fire.database().ref('sessions').child(id).update(updateObject).then(() => {
      }, (error) => {
          console.log(error);
      });
  }
  render() {
    let owner = (this.props.sessionObject.creator_uid === this.state.userId);
    return(
      <li className="collection-item" key={this.props.sessionObject.uid}>
          <div>{this.props.sessionObject.title}
              <a href={"/session?uid=" + this.props.sessionObject.uid} title="go to session" className="secondary-content"><i className="material-icons">arrow_forward</i></a>
              {owner && !this.props.sessionObject.public && (<a href="" onClick={(e) => this.updateSession(e, this.props.sessionObject.uid, { public: true })} title="make this session public" className="secondary-content"><i className="material-icons">share</i></a>)}
              {owner && this.props.sessionObject.public && (<a href="" onClick={(e) => this.updateSession(e, this.props.sessionObject.uid, { public: false })} title="make this session private" className="secondary-content"><i className="material-icons">lock</i></a>)}
              {owner && !this.props.sessionObject.closed && (<a href="" onClick={(e) => this.updateSession(e, this.props.sessionObject.uid, { closed: true })} title="close session" className="secondary-content"><i className="material-icons">done_all</i></a>)}
              {owner && this.props.sessionObject.closed && (<a href="" onClick={(e) => this.updateSession(e, this.props.sessionObject.uid, { closed: false })} title="re-open session" className="secondary-content"><i className="material-icons">cached</i></a>)}
              {owner && (<a href="" onClick={(e) => this.removeSession(e, this.props.sessionObject.uid)} title="delete session" className="secondary-content"><i className="material-icons">delete_forever</i></a>)}
          </div>
          <div className="chip" title={this.props.sessionObject.creator_displayName} >
              <img src={this.props.sessionObject.creator_photoURL} alt="img" />
              {this.props.sessionObject.creator_displayName}
           </div>
      </li>
    );
  }
}
export default Session;
