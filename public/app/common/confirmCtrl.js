angular.module('app').controller('ConfirmCtrl', function ($scope, $modalInstance, ask) {
  $scope.confirmTitle = ask.title;
  $scope.confirmText = ask.text;
  $scope.confirmQuestion = ask.question;

  $scope.ok = function () {   
    $modalInstance.close('confirmed');
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});


angular.module('app').factory('ConfirmService', function($modal) {
  return {
    confirm: function(content, confirmCallback) {
        var modalInstance = $modal.open({
          templateUrl: '/partials/common/confirm',
          controller: 'ConfirmCtrl',
          resolve: {
            ask: function () {
              return content;
            }
          }
        });
         
        modalInstance.result.then(function (confirmed) {
          confirmCallback();
        });
    }
  }
});
