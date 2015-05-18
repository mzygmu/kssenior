angular.module('app').controller('resultModalCtrl', function($scope, $modalInstance, resultService, mvNotifier, result, competitionName, competitionId) {

  $scope.competitionName = competitionName;

  if (result) {
    $scope.name = result.name;
    $scope.total = result.total;
    $scope.place = result.place;
    $scope.series = result.series;
    $scope.club = result.club;
    $scope.notes = result.notes;
  } else {
    $scope.series = [];
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
    var pClub = $scope.club;
    if (!pClub) {
      pClub = 'KS Senior LOK';
    }

    var content = {
      competition_id: competitionId,
      competition_name: competitionName,
      name: $scope.name,
      total: $scope.total,
      place: $scope.place,
      series: $scope.series,
      club: pClub,
      notes: $scope.notes
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