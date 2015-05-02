angular.module('app').controller('pageContentCtrl', function($scope, $modal, $log, cachedPageContent, mvIdentity, mvNotifier) {
  $scope.content = cachedPageContent.query();
  $scope.identity = mvIdentity;

  $scope.openNewChargesWindow = function() {

    var modalInstance = $modal.open({
      templateUrl: '/partials/pages/contentModal',
      controller: 'contentModalCtrl',
      resolve: {
      	pageId: function() {
      		return 'charges';
      	},
      	modalTitle: function() {
      		return 'Opłaty i składki';
      	},
        content: function () {
          return undefined;
        }
      }
    });

    modalInstance.result.then(function () {

    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });

  };

});