angular.module('app').controller('newsListCtrl', function($scope, $modal, $log, newsResource, mvIdentity, publishService) {
  $scope.news = newsResource.query();
  $scope.identity = mvIdentity;

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

  $scope.editPost = function(post) {

  }
  $scope.removePost = function(post) {
    publishService.removeNews(post).then(function(res) {
      var index = $scope.news.indexOf(post);
      $scope.news.splice(index, 1);
    }, function(err){
      console.log(err);
    });
  }

});