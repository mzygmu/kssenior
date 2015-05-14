angular.module('app').controller('resultModalCtrl', function($scope, $modalInstance, resultService, mvNotifier, result, competitionName, competitionId) {

  if (result) {
    $scope.title = result.title;
    $scope.date = result.date.toString().substring(0, 10);
    $scope.result = result.competition;
    $scope.category = result.category;
    $scope.types = result.types;
    $scope.notes = result.notes;
    $scope.description = result.description;
  } else {
    $scope.result = [];
    $scope.category = [];
    $scope.types = [];
    $scope.notes = '';
    $scope.description = '';
  }

  $scope.addSeries = function(s) {
    $scope.result.push(s);
    $scope.s = '';
  };

  $scope.rmSeries = function(s) {
    var index = $scope.result.indexOf(s);
    $scope.result.splice(index, 1);
  };

  var add = function() {
    var content = {
      title: $scope.title,
      competition: $scope.result,
      date: $scope.date,
      category: $scope.category,
      types: $scope.types,
      notes: $scope.notes,
      description: $scope.description
    };

    resultService.publish(content).then(function() {
      mvNotifier.notify('Opublikowano');
    }, function(reason) {
      mvNotifier.error(reason);
    });
    $modalInstance.close(content);
  }
  
  var update = function() {
    var clone = angular.copy(result);

    var data = {
      title: $scope.title,
      competition: $scope.result,
      date: $scope.date,
      category: $scope.category,
      types: $scope.types,
      notes: $scope.notes,
      description: $scope.description
    };
    angular.extend(clone, data);

    resultService.update(clone).then(function() {
      mvNotifier.notify('Zaktualizowano');

    }, function(reason) {
      mvNotifier.error(reason);
    })
    $modalInstance.close(clone);
  }

  $scope.publish = function() {
    if (result) {
      update();
    } else {
      add();
    }
  }

  $scope.cancel = function () {
    $modalInstance.dismiss(undefined);
  };

})