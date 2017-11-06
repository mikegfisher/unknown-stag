

app.controller('HomeController', ['$scope', function($scope) { 
  //$scope.welcomeMessage = 'Welcome to the ';

  // Check login
if(firebase.auth().currentUser) {
  $("#login").hide();
  $("#logout").show();
} else {
  $("#login").show();
}

// Setup buttons
document.querySelector("#btnLogin").addEventListener("click", googleSignIn);
}]);
