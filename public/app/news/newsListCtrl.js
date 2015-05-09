angular.module('app').controller('newsListCtrl', function($scope, $modal, $log, newsList, mvIdentity, publishService, mvNotifier, ConfirmService) {
  $scope.news = newsList.query();
  $scope.identity = mvIdentity;

  $scope.openPostWindow = function(post) {
    var modalInstance = $modal.open({
      templateUrl: '/partials/news/newPostModal',
      controller: 'publishPostCtrl',
      resolve: {
        postData: function () {
          return post;
        }
      }
    });
     
    modalInstance.result.then(function (data) {
      if (post) {
        var index = $scope.news.indexOf(post);
        $scope.news[index] = data;
      } else {
        $scope.news = newsList.query(true);
      }
    });
  }

  $scope.removePost = function(post) {
    var doRemove = function() {
      publishService.removeNews(post).then(function(res) {
        var index = $scope.news.indexOf(post);
        $scope.news.splice(index, 1);
        mvNotifier.notify('Ogłoszenie zostało usunięte');
      }, function(err){
        mvNotifier.error(err);
        console.log(err);
      });
    }

    var ask = {
      title: 'usunięcie ogłoszenia',      
      question: 'usunąć ogłoszenie z listy aktualności',
      text: post.title
    }
    ConfirmService.confirm(ask, doRemove); 
  }

});