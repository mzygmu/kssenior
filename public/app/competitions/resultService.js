angular.module('app').factory('resultService', function($http, $q, resultsResource) {
  return {
    getResult: function(competitionId) {
      var dfd = $q.defer();

      $http.get('http://kssenior.herokuapp.com/api/results/'+competitionId)
      .success(function(res) {
        defer.resolve(res);
      })
      .error(function(err, status) {
        defer.reject(err);
      });

      return dfd.promise;
    },
    publish: function(resultData) {
      var results = new resultsResource(resultData);
      var dfd = $q.defer();

      results.$save().then(function() {
        dfd.resolve();
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },
    remove: function(resultData) {
      var dfd = $q.defer();

      $http.post('/api/results/remove', {id:resultData._id}).then(function(response) {
        if(response.data.success) {
          dfd.resolve(true);
        } else {
          dfd.resolve(false);
        }
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },
    update: function(resultData) {
      var dfd = $q.defer();
      var clone = angular.copy(resultData);

      clone.$update().then(function() {
        dfd.resolve();
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    }

  }
});