import React, { Component } from 'react';
import fire from '../../fire';

class Session extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: ''
    };
    this.removeSession = this.removeSession.bind(this);
    this.closeSession = this.closeSession.bind(this);
    this.openSession = this.openSession.bind(this);
    this.makeSessionPublic = this.makeSessionPublic.bind(this);
    this.makeSessionPrivate = this.makeSessionPrivate.bind(this);
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
    let owner = (this.props.sessionObject.creatorUid === this.state.userId);
    return(
      <li className="collection-item" key={this.props.sessionObject.id}>
          <div>{this.props.sessionObject.title}
              <a href={this.props.sessionObject.url} title="go to session" className="secondary-content"><i className="material-icons">arrow_forward</i></a>
              {owner && !this.props.sessionObject.public && (<a href="" onClick={(e) => this.makeSessionPublic(e, this.props.sessionObject.id)} title="make this session public" className="secondary-content"><i className="material-icons">share</i></a>)}
              {owner && this.props.sessionObject.public && (<a href="" onClick={(e) => this.makeSessionPrivate(e, this.props.sessionObject.id)} title="make this session private" className="secondary-content"><i className="material-icons">lock</i></a>)}
              {owner && !this.props.sessionObject.closed && (<a href="" onClick={(e) => this.closeSession(e, this.props.sessionObject.id)} title="close session" className="secondary-content"><i className="material-icons">done_all</i></a>)}
              {owner && this.props.sessionObject.closed && (<a href="" onClick={(e) => this.openSession(e, this.props.sessionObject.id)} title="re-open session" className="secondary-content"><i className="material-icons">cached</i></a>)}
              {owner && (<a href="" onClick={(e) => this.removeSession(e, this.props.sessionObject.id)} title="delete session" className="secondary-content"><i className="material-icons">delete_forever</i></a>)}
          </div>
          <div className="chip" title={this.props.sessionObject.name} >
              <img src={this.props.sessionObject.photo} alt="img" />
              {this.props.sessionObject.name}
           </div>
      </li>
    );
  }
}
export default Session;
