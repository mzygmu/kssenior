angular.module('app').controller('mvNavBarLoginCtrl', function($scope, $modalInstance, $http, mvNotifier, mvAuth, $location) {
  
  $scope.signin = function(username, password) {
    mvAuth.authenticateUser(username, password).then(function(success) {
      if(success) {
        mvNotifier.notify('Logowanie się powiodło!');
      } else {
        mvNotifier.error('Nazwa użytkownika lub hasło jest nieprawidłowe');
      }
      $modalInstance.close();
    });
  }

  $scope.signout = function() {
    mvAuth.logoutUser().then(function() {
      $scope.username = "";
      $scope.password = "";
      mvNotifier.notify('Wylogowanie się powiodło!');
      $location.path('/');
    })
  }

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

});