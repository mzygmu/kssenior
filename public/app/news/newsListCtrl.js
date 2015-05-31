angular.module('app').controller('newsListCtrl', function($scope, $modal, $log, newsList, kssIdentity, publishService, kssNotifier, ConfirmService) {
  $scope.news = newsList.query();
  $scope.identity = kssIdentity;

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
        kssNotifier.notify('Ogłoszenie zostało usunięte');
      }, function(err){
        kssNotifier.error(err);
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