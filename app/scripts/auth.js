// Sign in the user with their Google account via redirect
function googleSignIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // Sign-in was successful. Update the UI
        $("#login").hide();
        $("#login_side").hide();
        $("#logout").show();
        $("#logout_side").show();
        console.log('Signed in with Google.');
        var currentUser = firebase.auth().currentUser;
        var userId = currentUser.uid;
        return firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
            var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
            // If we have a new user then add a new user object for the account. Otherwise, login.
            if (username === 'Anonymous') {
                writeUserData(userId, currentUser.displayName, currentUser.email, currentUser.photoURL);
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

// Sign the user out
function googleSignOut() {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        $("#login").show();
        $("#login_side").show();
        $("#logout").hide();
        $("#logout_side").hide();
        console.log('Signed out.')
    }).catch(function (error) {
        // An error with sign-out happened
        console.log('Error with sign-out.');
        console.log(error);
    });
}