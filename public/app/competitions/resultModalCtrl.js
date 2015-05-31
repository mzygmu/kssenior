angular.module('app').controller('resultModalCtrl', 
  function($scope, $modalInstance, resultService, kssNotifier, result, competitionName, competitionId, resultsCount) {

  $scope.competitionName = competitionName;

  if (result) {
    $scope.name = result.name;
    $scope.total = result.total;
    $scope.place = result.place;
    $scope.series = result.series;
    $scope.club = result.club;
    $scope.notes = result.notes;
  } else {
    $scope.place = resultsCount + 1;
    $scope.series = [];
    $scope.club = 'KS Senior LOK';    
    $scope.notes = '';

  }

  $scope.addSeries = function(s) {
    $scope.series.push(s);
    $scope.s = '';
  };

  $scope.rmSeries = function(index) {
    $scope.series.splice(index, 1);
  };

  var add = function() {
    var content = {
      competition_id: competitionId,
      competition_name: competitionName,
      name: $scope.name,
      total: $scope.total,
      place: $scope.place,
      series: $scope.series,
      club: $scope.club,
      notes: $scope.notes
    };

    resultService.publish(content).then(function() {
      kssNotifier.notify('Opublikowano');
      $modalInstance.close(content);
    }, function(reason) {
      kssNotifier.error(reason);
      $modalInstance.close(content);
    });
    
  }
  
  var update = function() {
    var clone = angular.copy(result);

    var data = {
      competition_id: competitionId,
      name: $scope.name,
      total: $scope.total,
      place: $scope.place,
      series: $scope.series,
      club: $scope.club,
      notes: $scope.notes
    };
    angular.extend(clone, data);

    resultService.update(competitionName, clone).then(function() {
      kssNotifier.notify('Zaktualizowano');
      $modalInstance.close(clone);
    }, function(reason) {
      kssNotifier.error(reason);
      $modalInstance.close(clone);
    });    
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