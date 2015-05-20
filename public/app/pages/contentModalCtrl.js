angular.module('app').controller('contentModalCtrl', function($scope, $modalInstance, pageContentService, mvNotifier, pageId, modalTitle, content) {

  $scope.modalTitle = modalTitle;
  if (content) {
    $scope.sectionTitle = content.sectionTitle;
    $scope.text = content.text;
  }

  var add = function() {
    var content = {
      pageId: pageId,
      sectionTitle: $scope.sectionTitle,
      text: $scope.text,
      position: 0
    };

    pageContentService.publish(content).then(function() {
      mvNotifier.notify('Opublikowano');
      $modalInstance.close(content);
    }, function(reason) {
      mvNotifier.error(reason);
      $modalInstance.close(content);
    });
  }
  
  var update = function() {
    var clone = angular.copy(content);

    var data = {
      sectionTitle: $scope.sectionTitle,
      text: $scope.text
    };
    angular.extend(clone, data);

    pageContentService.update(clone).then(function() {
      mvNotifier.notify('Zaktualizowano');
      $modalInstance.close(clone);
    }, function(reason) {
      mvNotifier.error(reason);
      $modalInstance.close(clone);
    });    
  }

  $scope.publish = function() {
    if (content) {
      update();
    } else {
      add();
    }
  }

  $scope.cancel = function () {
    $modalInstance.dismiss(undefined);
  };

})