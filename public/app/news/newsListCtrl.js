angular.module('app').controller('newsListCtrl', function($scope, $modal, newsService) {
  $scope.news = newsService.query();

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