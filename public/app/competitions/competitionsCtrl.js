angular.module('app').controller('competitionsCtrl', function($scope, $modal, $log, cachedCompetitions, competitionsService, mvIdentity, mvNotifier) {
  $scope.competitions = cachedCompetitions.query();
  $scope.identity = mvIdentity;

  $scope.openCompetitionsWindow = function(comp) {
    var modalInstance = $modal.open({
      templateUrl: '/partials/competitions/competitionsModal',
      controller: 'competitionsModalCtrl',
      resolve: {
        competitions: function () {
          return comp;
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
  }

  $scope.remove = function(comp) {
    competitionsService.remove(comp).then(function(res) {
      var index = $scope.competitions.indexOf(comp);
      $scope.competitions.splice(index, 1);
      mvNotifier.notify('Usunięto');
    }, function(err){
      mvNotifier.error(err);
      console.log(err);
    });
  }

});