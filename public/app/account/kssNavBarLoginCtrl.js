'use strict';
angular.module('app').controller('kssNavBarLoginCtrl', function($scope, $http, kssIdentity, kssNotifier, kssAuth, $location, $modal, $log) {
  
  $scope.identity = kssIdentity;

  $scope.signout = function() {
    kssAuth.logoutUser().then(function() {
      $scope.username = "";
      $scope.password = "";
      kssNotifier.notify('Wylogowanie się powiodło!');
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
      controller: 'kssSignupCtrl'
    });

    modalInstance.result.then(function () {

    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });

  };

});