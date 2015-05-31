angular.module('app').controller('kssProfileCtrl', function($scope, kssAuth, kssIdentity, kssNotifier) {
  $scope.email = kssIdentity.currentUser.username;
  $scope.fname = kssIdentity.currentUser.firstName;
  $scope.lname = kssIdentity.currentUser.lastName;

  $scope.update = function() {
    var newUserData = {
      username: $scope.email,
      firstName: $scope.fname,
      lastName: $scope.lname
    }
    if($scope.password && $scope.password.length > 0) {
      newUserData.password = $scope.password;
    }

    kssAuth.updateCurrentUser(newUserData).then(function() {
      kssNotifier.notify('Twoje konto zostało zaktualizowane');
    }, function(reason) {
      kssNotifier.error(reason);
    })
  }
})