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
      var dfd = $q.defer();

      $http.post('/api/news/remove', {id:newsData._id}).then(function(response) {
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
    updateNews: function(newsData) {
      var dfd = $q.defer();
      var news = new newsResource(newsData);

      news.$save().then(function() {
        dfd.resolve();
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    }

  }
});