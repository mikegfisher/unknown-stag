// Declare the app variable that will be used be each controller
var app = angular.module("myApp", ["ngRoute","firebase"]);
// Configure the routing for each view
app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      controller: 'HomeController',
      templateUrl: 'Home/home.html'
    })
    .when('/sessions', {
      controller: 'SessionsController',
      templateUrl: 'Sessions/sessions.html'
    })
    .otherwise({
      redirectTo: '/'
    });
});

// Initialize collapse button 
$(".button-collapse").sideNav();

// Check auth
if (firebase.auth().currentUser) {
  $("#logout").show();
  $("#logout_side").show();
} else {
  $("#logout").hide();
  $("#logout_side").hide();
}
document.querySelector("#logout").addEventListener("click", googleSignOut);
document.querySelector("#logout_side").addEventListener("click", googleSignOut);