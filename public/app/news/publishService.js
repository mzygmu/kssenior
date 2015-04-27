angular.module('app').factory('publishService', function($http, $q, newsResource) {
  return {

    publishNews: function(newsData) {
      var news = new newsResource(newsData);
      var dfd = $q.defer();

      news.$save().then(function() {
        dfd.resolve();
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },
    removeNews: function(newsData) {
      var news = new newsResource(newsData);
      var dfd = $q.defer();

      news.$remove().then(function() {
        dfd.resolve();
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    }
  }
});