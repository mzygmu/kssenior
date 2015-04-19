angular.module('app').controller('loginModalCtrl', function ($scope, $modalInstance, $log, mvAuth, mvNotifier) {

  $scope.signin = function(username, password) {
    mvAuth.authenticateUser(username, password).then(function(success) {
      if(success) {
        mvNotifier.notify('Logowanie się powiodło!');
        $modalInstance.close();
      } else {
        mvNotifier.error('Nazwa użytkownika lub hasło jest nieprawidłowe');
      }
    });
  }

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

});