import React, { Component } from 'react';
import fire from '../../fire';
import firebase from 'firebase';

class LogIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: true
        }
    }
    componentWillMount() {
        fire.auth().onAuthStateChanged((user) => {
            if (!user) {
                this.setState({ loggedIn: false });
                return;
            }
        });
    }
    logInWithGoogle(e) {
        this.setState({ loggedIn: true });
        e.preventDefault();
        const provider = new firebase.auth.GoogleAuthProvider();
        fire.auth().signInWithPopup(provider).then(function (result) {
            const currentUser = fire.auth().currentUser;
            const userId = currentUser.uid;
            return fire.database().ref('/users/' + userId).once('value').then(function (snapshot) {
                const username = (snapshot.val() && snapshot.val().displayName) || 'Anonymous';
                if (username === 'Anonymous') {
                    fire.database().ref('users/' + userId).set({
                        displayName: currentUser.displayName,
                        email: currentUser.email,
                        photoURL: currentUser.photoURL,
                        admin: {
                            admin: false,
                            license: 0
                        }
                    });
                } else {}
            });
        }).catch((error) => {
            console.log(error);
            this.setState({ loggedIn: false });
        });
    }
    render() {
        return (
          <div>
            {
              !this.state.loggedIn && (
                    <div className="row">
                        <div className="col s12 m6">
                            <div className="card grey darken-4">
                                <div className="card-content white-text">
                                    <span className="card-title">Welcome</span>
                                      <p>Please log in or sign up with Google to start using Unknown Stag for your points poker session. </p>
                                </div>
                            </div>
                            <form className="col s12" onSubmit={this.logInWithGoogle.bind(this)}>
                              <input className="btn waves-effect waves-light red" type="submit" value="Log In / Sign Up" />
                            </form>
                        </div>
                    </div>
            )
          }
          </div>
        );
    }
}
export default LogIn
