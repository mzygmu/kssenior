angular.module('app').controller('loginModalCtrl', function ($scope, $modal, $log) {

  $scope.openLoginWindow = function() {

    var modalInstance = $modal.open({
      templateUrl: '/partials/account/loginModalContent',
      controller: 'mvNavBarLoginCtrl'
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