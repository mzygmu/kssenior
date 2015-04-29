angular.module('app').controller('newsListCtrl', function($scope, $modal, $log, newsList, mvIdentity, publishService, mvNotifier) {
  $scope.news = newsList.newsList;
  $scope.identity = mvIdentity;

  $scope.openNewPostWindow = function() {

    var modalInstance = $modal.open({
      templateUrl: '/partials/news/newPostModal',
      controller: 'publishPostCtrl',
      resolve: {
        postData: function () {
          return undefined;
        }
      }
    });

    modalInstance.result.then(function () {

    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });

  };

  $scope.editPost = function(post) {
    var modalInstance = $modal.open({
      templateUrl: '/partials/news/newPostModal',
      controller: 'publishPostCtrl',
      resolve: {
        postData: function () {
          return post;
        }
      }
    });
     
    modalInstance.result.then(function (postData) {
      newsList.edit(postData);
      $scope.news = newsList.newsList;
    });
  }

  $scope.removePost = function(post) {
    publishService.removeNews(post).then(function(res) {
      var index = $scope.news.indexOf(post);
      $scope.news.splice(index, 1);
      mvNotifier.notify('Ogłoszenie zostało usunięte');
    }, function(err){
      mvNotifier.error(err);
      console.log(err);
    });
  }

});