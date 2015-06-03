'use strict';
angular.module('app').controller('competitionsCtrl', function($scope, $modal, $log, $routeParams, cachedCompetitions, resultsResource, resultService, competitionsService, kssIdentity, kssNotifier, ConfirmService) {
  $scope.competitions = cachedCompetitions.query();
  $scope.identity = kssIdentity;

  cachedCompetitions.query().$promise.then(function(collection) {
    collection.forEach(function(comp) {
      if(comp._id === $routeParams.id) {
        $scope.details = comp;
      }
    })
  })

  var getResults = function() {
    resultService.getResult($routeParams.id).then(function(res) {
      $scope.results = res;
    });
  }
  getResults();

  $scope.openResultWindow = function(c, result) {
    var modalInstance = $modal.open({
      templateUrl: '/partials/competitions/resultModal',
      controller: 'resultModalCtrl',
      resolve: {
        result: function () {
          return angular.copy(result);
        },
        competitionName: function () {
          return angular.copy(c);
        },
        competitionId: function () {
          return angular.copy($routeParams.id);
        },
        resultsCount: function () {
          var count = 0;
          if ($scope.results) for (i in $scope.results) {
            if ($scope.results[i].competition_name === c) {
              count += 1;
            }
          }
          return count;
        }
      }
    });
     
    modalInstance.result.then(function (data) {
      if (result) {
        var index = $scope.results.indexOf(result);
        $scope.results[index] = data;
      } else {
        getResults();
      }
    });
  };

  $scope.removeResult = function(result) {
    var doRemove = function() {
      resultService.remove(result).then(function(res) {
        var index = $scope.results.indexOf(result);
        $scope.results.splice(index, 1);
        kssNotifier.notify('Usunięto');
      }, function(err){
        kssNotifier.error(err);
        console.log(err);
      });
    }

    var ask = {
      title: 'usunięcie wyniku',      
      question: 'usunąć wynik z '+ result.competition_name,
      text: result.name
    }
    ConfirmService.confirm(ask, doRemove);   
  }

  $scope.openCompetitionsWindow = function(comp, copy) {
    var modalInstance = $modal.open({
      templateUrl: '/partials/competitions/competitionsModal',
      controller: 'competitionsModalCtrl',
      resolve: {
        competitions: function () {
          return angular.copy(comp);
        },
        copy: function () {
          return copy;
        }
      }
    });
     
    modalInstance.result.then(function (data) {
      if (!copy && comp) {
        var index = $scope.competitions.indexOf(comp);
        $scope.competitions[index] = data;
      } else {
        $scope.competitions = cachedCompetitions.query(true);
      }
    });
  };

  $scope.remove = function(comp) {
    var doRemove = function() {
      competitionsService.remove(comp).then(function(res) {
        var index = $scope.competitions.indexOf(comp);
        $scope.competitions.splice(index, 1);
        kssNotifier.notify('Usunięto');
      }, function(err){
        kssNotifier.error(err);
        console.log(err);
      });
    }

    var ask = {
      title: 'usunięcie zawodów',      
      question: 'usunąć zawody z listy',
      text: comp.title
    }
    ConfirmService.confirm(ask, doRemove);   
  }

});
