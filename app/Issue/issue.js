// Define the controller for this view
app.controller('IssueController',
  function ($scope, $firebaseObject) {
    var sessionUID = getQueryStringParameter("uid");
    var ref = firebase.database().ref().child("estimates/"+sessionUID);
    var syncObject = $firebaseObject(ref);
    syncObject.$bindTo($scope, "estimates");

    // Setup buttons
    document.querySelector("#btnEstimate").addEventListener("click", submitEstimate);
    document.querySelector("#estimatesCard").addEventListener("click", generateAverage);
    document.querySelector("#backLink").href="#/session?uid=" + getQueryStringParameter("session");;
  }
);

function submitEstimate() {
  createEstimate(getQueryStringParameter("uid"), document.querySelector("#new_estimate").value);
}
function generateAverage() {
  var est = document.querySelectorAll("#estimate");
  var values = [];
  var sum = 0;
  for (i = 0; i < est.length; i++) { 
    values.push(Number(est[i].innerHTML));
    sum += Number(values[i]);
}
  var avg = sum / values.length;
  document.querySelector("#average").innerHTML = avg;
  console.log(values);
  console.log(sum);
  console.log(avg);
}
function getQueryStringParameter(paramToRetrieve) {
  var params = document.URL.split("?")[1].split("&");
  for (var ii in params) {
    var singleParam = params[ii].split("=");
    if (singleParam[0] == paramToRetrieve)
      return singleParam[1];
  }
};