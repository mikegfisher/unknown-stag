// Define the controller for this view
app.controller('IssueController',
  function ($scope, $firebaseObject) {
    var sessionUID = getQueryStringParameter("uid");
    var ref = firebase.database().ref().child("estimates/"+sessionUID);
    var syncObject = $firebaseObject(ref);
    syncObject.$bindTo($scope, "estimates");

    // Setup buttons
    document.querySelector("#btnEstimate").addEventListener("click", submitEstimate);
  }
);

function submitEstimate() {
  createEstimate(getQueryStringParameter("uid"), document.querySelector("#new_estimate").value);
}

function getQueryStringParameter(paramToRetrieve) {
  var params = document.URL.split("?")[1].split("&");
  for (var ii in params) {
    var singleParam = params[ii].split("=");
    if (singleParam[0] == paramToRetrieve)
      return singleParam[1];
  }
};