angular.module('app').controller('newsListCtrl', function($scope, $modal, $log, newsResource, mvIdentity, publishService, mvNotifier) {
  $scope.news = newsResource.query();
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
      post.title = postData.title;
      post.text = postData.text;
      // TacticsService.saveTactic(tactic).then(function() {
      //   $scope.getTactics(true);
      // });
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