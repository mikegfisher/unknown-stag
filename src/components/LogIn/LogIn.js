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
        console.log(this.state.loggedIn);
        fire.auth().onAuthStateChanged((user) => {
            if (!user) {
                this.setState({ loggedIn: false });
                return;
            }
        });
    }
    logInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        fire.auth().signInWithPopup(provider).then(function (result) {
            console.log('Signed in with Google.');
            const currentUser = fire.auth().currentUser;
            const userId = currentUser.uid;
            return fire.database().ref('/users/' + userId).once('value').then(function (snapshot) {
                const username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
                // If we have a new user then add a new user object for the account. Otherwise, login.
                if (username === 'Anonymous') {
                    // Write user object
                    fire.database().ref('users/' + userId).set({
                        displayName: currentUser.displayName,
                        email: currentUser.email,
                        photoURL: currentUser.photoURL,
                        admin: {
                            admin: false,
                            license: 0
                        }
                    });
                    // Log that the user signing-in was not recognized and a new user object was created. 
                    console.log('Added new user.');
                } else {
                    // Log that the user was recognized and logged in without overwriting their existing account data. 
                    console.log('Recognized user.');
                }
                this.setState({ loggedIn: true });
            });
        }).catch(function (error) {
            // An error with sign-in happened
            console.log('Error with sign-in.');
            console.log(error);
        });
    }
    render() {
        return (
            <div hidden={this.state.loggedIn} >
                <div className="row">
                    <div className="col s12 m6">
                        <div className="card blue-grey darken-1">
                            <div className="card-content white-text">
                                <span className="card-title">Welcome</span>
                                <p>Please log in or sign up with Google to start using Unknown Stag for your points poker session. </p>
                            </div>
                            <div className="card-action">
                                <a href="" onClick={this.logInWithGoogle.bind(this)}>Log In / Sign Up</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default LogIn