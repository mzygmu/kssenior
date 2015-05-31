angular.module('app').controller('mvSignupCtrl', function($scope, $modalInstance, kssUser, mvNotifier, mvAuth) {

  $scope.signup = function() {
    var newUserData = {
      username: $scope.email,
      password: $scope.password,
      firstName: $scope.fname,
      lastName: $scope.lname
    };

    mvAuth.createUser(newUserData).then(function() {
      mvNotifier.notify('Twoje konto zostało utworzone!');
    }, function(reason) {
      mvNotifier.error(reason);
    });
    $modalInstance.dismiss('create user');
  }

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
})