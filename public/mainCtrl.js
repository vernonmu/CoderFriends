angular.module('app').controller('mainCtrl', function($scope, githubService) {
  $scope.test = 'working bihg'
  $scope.getFollowing = githubService.getFollowing()
    .then(function(response){
      console.log(response);
      $scope.followers = response.data
      console.log($scope.followers);
    })



  })
