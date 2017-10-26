// Get a reference to the database service
var database = firebase.database();

// Create a new idea
function createSession(title, description) {
    // Write a new idea to /ideas
    var ideasRef = firebase.database().ref('ideas').push();
    ideasRef.set({
      title: title,
      description: description,
      owner: firebase.auth().currentUser.uid
    });
    console.log('we pushed an idea');
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