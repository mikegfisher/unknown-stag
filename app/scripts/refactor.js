// Get a reference to the database service
var database = firebase.database();

// Create a new thing
function createSession(title, description) {
  // Write to /Sessions object
    var sessions_ref = firebase.database().ref('sessions').push();
    sessions_ref.set({
      title: title,
      description: description,
      creator: firebase.auth().currentUser.uid
    });
    // Write to Users/Sessions object for easy queries
    var user_sessions_ref = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/sessions').push();
    user_sessions_ref.set({
      id: sessions_ref.key,
      title: title,
      description: description
    });
  }

  // Add a user to the 'users' object
function writeUserData(userId, name, email, imageUrl) {
    // Write public information to public object  
    firebase.database().ref('users/' + userId).set({
      username: name,
      email: email,
      profile_picture: imageUrl,
      admin: {
        admin: false,
        license: 0
      }
    });
  }