
angular.module('authService', [])

//fetch an api from server

.factory('Auth', function($http, $q, AuthToken){

  var authFactory = {};

  authFactory.login = function(username, password){

    return $http.post('/api/login', {
      username: username,
      password: password
    })
    .then(function(data){
      console.log(data);
      //AuthToken.setToken(data.token);
      window.localStorage.setItem('token',data.data.token);
      return data;
    })
  }

  authFactory.logout = function(){
    AuthToken.setToken();
    //window.localStorage.setItem();
  }

authFactory.isLoggedIn = function(){
  if(AuthToken.getToken())
        return true;
  else
    return false;

}
  authFactory.getUser = function() {
    //if(window.localStorage.getItem('token'))
    var token='/api/me?token=' + window.localStorage.getItem('token')
    console.log('token:', window.localStorage.getItem('token'));
    if(AuthToken.getToken())
     return $http.get(token);
    else
      return $q.reject({ message: "User has no token"});

  }
  return authFactory;
})

.factory('AuthToken', function($window){
  var authTokenFactory = {};
  authTokenFactory.getToken = function(){
    return $window.localStorage.getItem('token');
  }
  authTokenFactory.setToken = function(token) {
    if(token)
      $window.localStorage.setItem('token', token);
    else
      $window.localStorage.removeItem('token');
  }

  return authTokenFactory;
})

.factory('AuthInterceptor', function($q, $location, AuthToken){

  var interceptorFactory = {};
  interceptorFactory.request = function(config){
    var token = AuthToken.getToken();
    if(token){
      config.headers['x-access-token'] = token;
    }
    return config;
  };
  interceptorFactory.responseError = function(response){
    if(response.status == 403)
     $location.path('/login');

     return $q.reject(response);
  }
  return interceptorFactory;
});


























/*
We are going to call authentication api  that will call all the authentication api that we wrote in routes
we are gonna call the token.
Angular will call the json value from server and basically we will render it to html
And service will do just that it will effect all the data and we r gonna paas it to controller
ANd controller will do some logic and stuff and when controller will pass it to route and route will render
the view as view is the htm so there is normal mvc patternl*/
