angular.module('app').controller('competitionsCtrl', function($scope, $modal, $log, $routeParams, cachedCompetitions, resultsResource, competitionsService, mvIdentity, mvNotifier, ConfirmService) {
  $scope.competitions = cachedCompetitions.query();
  $scope.identity = mvIdentity;

  cachedCompetitions.query().$promise.then(function(collection) {
    collection.forEach(function(comp) {
      if(comp._id === $routeParams.id) {
        $scope.details = comp;
      }
    })
  })

  console.log(resultsResource);
  $scope.results = resultsResource.query($routeParams.id);

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
        }
      }
    });
     
    modalInstance.result.then(function (data) {
      if (result) {
        // var index = $scope.competitions.indexOf(comp);
        // $scope.competitions[index] = data;
      } else {
        $scope.results = resultsResource.query();
      }
    });
  };

  $scope.openCompetitionsWindow = function(comp) {
    var modalInstance = $modal.open({
      templateUrl: '/partials/competitions/competitionsModal',
      controller: 'competitionsModalCtrl',
      resolve: {
        competitions: function () {
          return angular.copy(comp);
        }
      }
    });
     
    modalInstance.result.then(function (data) {
      if (comp) {
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
        mvNotifier.notify('Usunięto');
      }, function(err){
        mvNotifier.error(err);
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
