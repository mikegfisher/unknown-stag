// Define the controller for this view
app.controller('SessionController',
  function ($scope, $firebaseObject) {
    var sessionUID = getQueryStringParameter("uid");
    var ref = firebase.database().ref().child("issues").orderByChild("session_uid").equalTo(sessionUID);
    var syncObject = $firebaseObject(ref);
    syncObject.$bindTo($scope, "issues");

    // Setup buttons
    document.querySelector("#btnIssue").addEventListener("click", submitIssue);
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