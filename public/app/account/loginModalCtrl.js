angular.module('app').controller('loginModalCtrl', function ($scope, $modalInstance, $log, kssAuth, kssNotifier) {

  $scope.signin = function(username, password) {
    kssAuth.authenticateUser(username, password).then(function(success) {
      if(success) {
        kssNotifier.notify('Logowanie się powiodło!');
        $modalInstance.close();
      } else {
        kssNotifier.error('Nazwa użytkownika lub hasło jest nieprawidłowe');
      }
    });
  }

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

});