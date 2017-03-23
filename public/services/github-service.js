angular.module('app').service('githubService', function($http) {
  console.log('SERVING!');
  this.getFollowing = function() {
    return $http.get('/api/github/following')
    
  }

})
