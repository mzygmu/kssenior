angular.module('app').controller('publishPostCtrl', function($scope, $modalInstance, mvNotifier, publishService) {

  $scope.addPost = function() {
    var newsData = {
      title: $scope.title,
      text: $scope.text
    };

    publishService.publishNews(newsData).then(function() {
      mvNotifier.notify('Opublikowano wiadomość');
    }, function(reason) {
      mvNotifier.error(reason);
    });
    $modalInstance.dismiss('posted');
  }

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
})