

app.controller('HomeController', ['$scope', function($scope) { 
  $scope.welcomeMessage = 'Welcome to the angular web app seed!';

  // Check login
if(firebase.auth().currentUser) {
  $("#login").hide();
} else {
  $("#login").show();
}

// Setup buttons
document.querySelector("#btnLogin").addEventListener("click", googleSignIn);
}]);
