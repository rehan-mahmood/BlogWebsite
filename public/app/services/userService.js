angular.module('userService', [])

.factory('User', function($http){
  console.log('i am stucking here!!!!!!!');
  var userFactory = {};
  userFactory.create = function(userData) {

    return $http.post('/api/signup', userData);
  }
  console.log("!!!!!!!!!!!!!!!mai kya kru!!!!!!!!");
  userFactory.all = function() {
    return $http.get('/api/users');
  }

  return userFactory;
});
