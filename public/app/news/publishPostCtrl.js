'use strict';
angular.module('app').controller('publishPostCtrl', function($scope, $modalInstance, kssNotifier, publishService, newsList, postData) {

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
      kssNotifier.notify('Opublikowano wiadomość');
      $modalInstance.close(newsData);
    }, function(reason) {
      kssNotifier.error(reason);
      $modalInstance.close(newsData);
    });
    
  }
  
  var update = function() {
    var clone = angular.copy(postData);

    var newsData = {
      title: $scope.title,
      text: $scope.text
    };
    angular.extend(clone, newsData);

    publishService.updateNews(clone).then(function() {
      kssNotifier.notify('Ogłoszenie zostało zaktualizowane');
      $modalInstance.close(clone);
    }, function(reason) {
      kssNotifier.error(reason);
      $modalInstance.close(clone);
    });    
  }

  $scope.publish = function() {
    if (postData) {
      update();
    } else {
      addPost();
    }
  }

  $scope.cancel = function () {
    $modalInstance.dismiss(undefined);
  };

})
