angular.module('app').factory('pageContentService', function($http, $q, pageContentResource) {
  return {

    publish: function(data) {
      var content = new pageContentResource(data);
      var dfd = $q.defer();

      content.$save().then(function() {
        dfd.resolve();
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    // },
    // remove: function(newsData) {
    //   var dfd = $q.defer();

    //   $http.post('/api/news/remove', {id:newsData._id}).then(function(response) {
    //     if(response.data.success) {
    //       dfd.resolve(true);
    //     } else {
    //       dfd.resolve(false);
    //     }
    //   }, function(response) {
    //     dfd.reject(response.data.reason);
    //   });

    //   return dfd.promise;
    // },
    // update: function(newsData) {
    //   var dfd = $q.defer();
    //   var clone = angular.copy(newsData);

    //   clone.$update().then(function() {
    //     dfd.resolve();
    //   }, function(response) {
    //     dfd.reject(response.data.reason);
    //   });

    //   return dfd.promise;
    }

  }
});