angular.module('app').controller('kssSignupCtrl', function($scope, $modalInstance, kssUser, kssNotifier, kssAuth) {

  $scope.signup = function() {
    var newUserData = {
      username: $scope.email,
      password: $scope.password,
      firstName: $scope.fname,
      lastName: $scope.lname
    };

    kssAuth.createUser(newUserData).then(function() {
      kssNotifier.notify('Twoje konto zostało utworzone!');
    }, function(reason) {
      kssNotifier.error(reason);
    });
    $modalInstance.dismiss('create user');
  }

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
})