angular.module('app').factory('competitionsService', function($http, $q, competitionsResource) {
  return {

    publish: function(competitionsData) {
      var competitions = new competitionsResource(competitionsData);
      var dfd = $q.defer();

      competitions.$save().then(function() {
        dfd.resolve();
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },
    remove: function(competitionsData) {
      var dfd = $q.defer();

      $http.post('/api/competitions/remove', {id:competitionsData._id}).then(function(response) {
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
    update: function(competitionsData) {
      var dfd = $q.defer();
      var clone = angular.copy(competitionsData);

      clone.$update().then(function() {
        dfd.resolve();
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    }

  }
});