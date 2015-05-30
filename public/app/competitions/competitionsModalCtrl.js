angular.module('app').controller('competitionsModalCtrl', function($scope, $modalInstance, competitionsService, mvNotifier, competitions, copy) {

  if (competitions) {
    $scope.title = competitions.title;
    $scope.date = competitions.date.toString().substring(0, 10);
    $scope.competitions = competitions.competition;
    $scope.category = competitions.category;
    $scope.types = competitions.types;
    $scope.notes = competitions.notes;
    $scope.description = competitions.description;
  } else {
    $scope.competitions = [];
    $scope.category = [];
    $scope.types = [];
    $scope.notes = '';
    $scope.description = '';
  }

  $scope.addComp = function(comp) {
    $scope.competitions.push(comp);
    $scope.comp = '';
  };

  $scope.rmComp = function(index) {
    $scope.competitions.splice(index, 1);
  };

  var add = function() {
    var content = {
      title: $scope.title,
      competition: $scope.competitions,
      date: $scope.date,
      category: $scope.category,
      types: $scope.types,
      notes: $scope.notes,
      description: $scope.description,
      resultsOn: false
    };

    competitionsService.publish(content).then(function() {
      mvNotifier.notify('Opublikowano');
      $modalInstance.close(content);
    }, function(reason) {
      mvNotifier.error(reason);
      $modalInstance.close(content);
    });    
  }
  
  var update = function() {
    var clone = angular.copy(competitions);

    var data = {
      title: $scope.title,
      competition: $scope.competitions,
      date: $scope.date,
      category: $scope.category,
      types: $scope.types,
      notes: $scope.notes,
      description: $scope.description
    };
    angular.extend(clone, data);

    competitionsService.update(clone).then(function() {
      mvNotifier.notify('Zaktualizowano');
      $modalInstance.close(clone);
    }, function(reason) {
      mvNotifier.error(reason);
      $modalInstance.close(clone);
    });    
  }

  $scope.publish = function() {
    if (!copy && competitions) {
      update();
    } else {
      add();
    }
  }

  $scope.cancel = function () {
    $modalInstance.dismiss(undefined);
  };

})