// Define the controller for this view
app.controller('SessionsController',
  function ($scope, $firebaseObject) {
    var userId = firebase.auth().currentUser.uid;
    var ref = firebase.database().ref().child("sessions").orderByChild("creator_uid").equalTo(userId);
  
    var syncObject = $firebaseObject(ref);
    syncObject.$bindTo($scope, "items");

    // Setup buttons
    document.querySelector("#btnNewSession").addEventListener("click", submitSession);
  }
);

function submitSession() {
  createSession(document.querySelector("#new_session").value, 
    "This session was created by " + firebase.auth().currentUser.displayName + ".");
  console.log('submitted');
  document.querySelector("#new_session").value = "";
}