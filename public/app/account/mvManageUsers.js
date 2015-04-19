angular.module('app').factory('mvManageUsers', function($http, mvIdentity, $q, mvUser) {
  return {

    setAdmin: function(username) {
      var dfd = $q.defer();
      $http.post('/api/users/rights', {username:username, rights:'admin'}).then(function(response) {
        if(response.data.success) {
          dfd.resolve(true);
        } else {
          dfd.resolve(false);
        }
      });
      return dfd.promise;
    },
    removeUser: function(username) {
      var dfd = $q.defer();
      $http.delete('/api/users', {username:username}).then(function(response) {
        if(response.data.success) {
          dfd.resolve(true);
        } else {
          dfd.resolve(false);
        }
      });
      return dfd.promise;
    }
  }

});