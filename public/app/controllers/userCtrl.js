angular.module('userCtrl', [])

.controller('UserController', function(User){

  var vm = this;

  User.all()
  .then(function(data){
    vm.users = data;
  })


})

.controller('UserCreateController', function(User, $location, $window){

  var vm=this;
   console.log("----i am stucking here also -----");
  vm.signupUser = function() {
    console.log("i am stucking here");
    vm.message = '';
    User.create(vm.userData)
    .then(function(response){
      vm.userData = {};
      vm.message = response.data.message;

      $window.localStorage.setItem('token', response.data.token);
      $location.path('/');
    })
  }
})
