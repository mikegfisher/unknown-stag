// Define the controller for this view
app.controller('SessionsController', ['$scope', function ($scope) {
  // For single data items, add them to the scope like this
  $scope.title = 'Angular-Web-App-Seed';
  // For arrays of data, add them to the scope like this
  $scope.items = [
    {
      id: 1,
      name: 'Sample 1',
      likes: 0
    },
    {
      id: 2,
      name: 'Sample 2',
      likes: 0
    }
  ];
  // Add functions to the scope like this
  $scope.likeFunction = function (index) {
    $scope.items[index].likes += 1;
  }
}]);