// Get a reference to the database service
var database = firebase.database();

// Write to Sessions object
function createSession(title, description) {
    var sessions_ref = firebase.database().ref('sessions').push();
    sessions_ref.set({
      uid: sessions_ref.key,
      title: title,
      description: description,
      creator_photoURL: firebase.auth().currentUser.photoURL,
      creator_displayName: firebase.auth().currentUser.displayName,
      creator_uid: firebase.auth().currentUser.uid      
    });
  }

  // Write to Issues object
function createIssue(session_uid, title) {
  var ref = firebase.database().ref('issues').push();
  ref.set({
    uid: ref.key,
    session_uid: session_uid,
    title: title,
    creator_photoURL: firebase.auth().currentUser.photoURL,
    creator_displayName: firebase.auth().currentUser.displayName,
    creator_uid: firebase.auth().currentUser.uid      
  });
}

  // Write to Estimates object
  function createEstimate(issue_uid, points) {
    var ref = firebase.database().ref('estimates/' + issue_uid + "/" + firebase.auth().currentUser.uid);
    ref.set({
      issue_uid: issue_uid,
      points: points,
      creator_photoURL: firebase.auth().currentUser.photoURL,
      creator_displayName: firebase.auth().currentUser.displayName,
      creator_uid: firebase.auth().currentUser.uid      
    });
  }

  // Add a user to the 'users' object
function writeUserData(userId, name, email, imageUrl) { 
    firebase.database().ref('users/' + userId).set({
      displayName: name,
      email: email,
      photoURL: imageUrl,
      admin: {
        admin: false,
        license: 0
      }
    });
  }