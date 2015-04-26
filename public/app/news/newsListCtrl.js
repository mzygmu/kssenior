angular.module('app').controller('newsListCtrl', function($scope, $modal, $log, newsResource) {
  $scope.news = newsResource.query();

  $scope.openNewPostWindow = function() {

    var modalInstance = $modal.open({
      templateUrl: '/partials/news/newPostModal',
      controller: 'publishPostCtrl'
    });

    modalInstance.result.then(function () {

    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });

  };

});