angular.module('app').controller('contentModalCtrl', function($scope, $modalInstance, pageContentService, mvNotifier, pageId, modalTitle, content) {

  $scope.modalTitle = modalTitle;
  if (content) {
    $scope.sectionTitle = content.sectionTitle;
    $scope.text1 = content.text[0];

    if (content.text[1]) {
      $scope.text2 = content.text[1];
    }
    if (content.text[2]) {
      $scope.text3 = content.text[2];
    }
    if (content.text[3]) {
      $scope.text4 = content.text[3];
    }
    if (content.text[4]) {
      $scope.text5 = content.text[4];
    }
    if (content.text[5]) {
      $scope.text6 = content.text[5];
    }
    if (content.text[6]) {
      $scope.text7 = content.text[6];
    }
    if (content.text[7]) {
      $scope.text8 = content.text[7];
    }
  }

  var getArray = function() {
    var array = [];
    if ($scope.text1) {
      array.push($scope.text1);
    }
    if ($scope.text2) {
      array.push($scope.text2);
    }
    if ($scope.text3) {
      array.push($scope.text3);
    }
    if ($scope.text4) {
      array.push($scope.text4);
    }
    if ($scope.text5) {
      array.push($scope.text5);
    }
    if ($scope.text6) {
      array.push($scope.text6);
    }
    if ($scope.text7) {
      array.push($scope.text7);
    }
    if ($scope.text8) {
      array.push($scope.text8);
    }
    return array;
  }

  var add = function() {
    var content = {
      pageId: pageId,
      sectionTitle: $scope.sectionTitle,
      text: getArray(),
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
      text: getArray()
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