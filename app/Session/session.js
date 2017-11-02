// Define the controller for this view
app.controller('SessionsController',
  function ($scope, $firebaseObject) {
    var userId = firebase.auth().currentUser.uid;
    var ref = firebase.database().ref().child("users").child(userId).child("sessions");
    var syncObject = $firebaseObject(ref);
    syncObject.$bindTo($scope, "items");

    // Setup buttons
    document.querySelector("#btnNewSession").addEventListener("click", submitSession);
  }
);

function submitSession() {
  createSession(document.querySelector("#new_session").value, "No history yet.");
  console.log('submitted');
  document.querySelector("#new_session").value = "";
}