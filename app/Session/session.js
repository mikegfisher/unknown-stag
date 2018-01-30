// Define the controller for this view
app.controller('SessionController',
  function ($scope, $firebaseObject) {
    
    function whenLoaded() {
      var sessionUID = getQueryStringParameter("uid");
    var ref = firebase.database().ref().child("issues").orderByChild("session_uid").equalTo(sessionUID);
    var syncObject = $firebaseObject(ref);
    syncObject.$bindTo($scope, "issues");
    }
    // This function is executed when the view loads
    $scope.$on('$viewContentLoaded', function() {
      // Setup buttons
      document.querySelector("#btnIssue").addEventListener("click", submitIssue);

      // check auth
      var auth;
      if(firebase.auth().currentUser) {
        whenLoaded();
      } else {
        auth = confirm("You are not currently logged in - click OK to log in now using Google.");
        if(auth) {
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
        }).then(whenLoaded());
    }).catch(function (error) {
        // An error with sign-in happened
        console.log('Error with sign-in.');
        console.log(error);
    });
        } else {
          // Do nothing, return to page
        }
      }
  });
  }
);

function submitIssue() {
  createIssue(getQueryStringParameter("uid"), document.querySelector("#new_issue").value);
  document.querySelector("#new_issue").value = "";
}

function getQueryStringParameter(paramToRetrieve) {
  var params = document.URL.split("?")[1].split("&");
  for (var ii in params) {
    var singleParam = params[ii].split("=");
    if (singleParam[0] == paramToRetrieve)
      return singleParam[1];
  }
};