angular.module('app').controller('contentModalCtrl', function($scope, $modalInstance, pageContentService, mvNotifier, pageId, modalTitle, content) {

  $scope.modalTitle = modalTitle;
  if (content) {
    $scope.title = postData.title;
    $scope.text = postData.text;
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
    }, function(reason) {
      mvNotifier.error(reason);
    });
    $modalInstance.close(content);
  }
  
  var update = function() {
    // var clone = angular.copy(postData);

    // var newsData = {
    //   title: $scope.title,
    //   text: $scope.text
    // };
    // angular.extend(clone, newsData);

    // publishService.updateNews(clone).then(function() {
    //   mvNotifier.notify('Ogłoszenie zostało zaktualizowane');

    // }, function(reason) {
    //   mvNotifier.error(reason);
    // })
    // $modalInstance.close(clone);
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