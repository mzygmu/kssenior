angular.module('app').controller('publishPostCtrl', function($scope, $modalInstance, mvNotifier, publishService, newsList, postData) {

  if (postData) {
    $scope.title = postData.title;
    $scope.text = postData.text;
  }

  var addPost = function() {
    var newsData = {
      title: $scope.title,
      text: $scope.text
    };

    publishService.publishNews(newsData).then(function() {
      mvNotifier.notify('Opublikowano wiadomość');
      newsList.add(newsData);
    }, function(reason) {
      mvNotifier.error(reason);
    });
    $modalInstance.dismiss('posted');
  }
  
  var update = function() {
    var clone = angular.copy(postData);

    var newsData = {
      title: $scope.title,
      text: $scope.text
    };
    angular.extend(clone, newsData);

    publishService.updateNews(clone).then(function() {
      mvNotifier.notify('Ogłoszenie zostało zaktualizowane');

    }, function(reason) {
      mvNotifier.error(reason);
    })
    $modalInstance.dismiss('posted');
  }

  $scope.publish = function() {
    if (postData) {
      update();
    } else {
      addPost();
    }
  }

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

})