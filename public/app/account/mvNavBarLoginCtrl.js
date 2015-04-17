angular.module('app').controller('mvNavBarLoginCtrl', function($scope, $http, mvIdentity, mvNotifier, mvAuth, $location, $modal, $log) {
  
  $scope.identity = mvIdentity;

  $scope.signout = function() {
    mvAuth.logoutUser().then(function() {
      $scope.username = "";
      $scope.password = "";
      mvNotifier.notify('Wylogowanie się powiodło!');
      $location.path('/');
    })
  }

  $scope.openLoginWindow = function() {

    var modalInstance = $modal.open({
      templateUrl: '/partials/account/loginModalContent',
      controller: 'loginModalCtrl'
    });

    modalInstance.result.then(function () {

    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });

  };

  $scope.openSignUpWindow = function() {

    var modalInstance = $modal.open({
      templateUrl: '/partials/account/signup',
      controller: 'mvSignupCtrl'
    });

    modalInstance.result.then(function () {

    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });

  };

});