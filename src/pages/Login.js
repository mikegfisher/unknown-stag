import React, { Component } from 'react';
import firebase from 'firebase'

import fire from '../fire';

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  componentWillMount() {

  }
  logInWithGoogle(e) {
    e.preventDefault();
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
      });
    }).catch(function (error) {
      // An error with sign-in happened
      console.log('Error with sign-in.');
      console.log(error);
    });
  }
  render() {
    return (
      <div>
        <form onSubmit={this.logInWithGoogle.bind(this)}>
          <input type="submit" />
        </form>
      </div>
    );
  }
}

export default LoginPage;