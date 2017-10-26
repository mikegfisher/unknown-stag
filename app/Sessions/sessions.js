// Define the controller for this view
app.controller('SessionsController', ['$scope', function ($scope) {
  // Redirect non-logged in users back to home
  redirect();
  
  // For single data items, add them to the scope like this
  $scope.name = firebase.auth().currentUser.email;
  // For arrays of data, add them to the scope like this
  $scope.items = [
    {
      title: 'Sprint Poker Session 4',
      description: 'Planning session for Sprint 4. Submitting hours.'
    },
    {
      title: 'Project Poker Session - Oslo',
      description: 'Planning session for the Oslo project. Submitting story points.'
    }
  ];
  // Add functions to the scope like this
  $scope.likeFunction = function (index) {
    //$scope.items[index].likes += 1;
  }
}]);