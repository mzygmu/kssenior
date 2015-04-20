angular.module('app').factory('mvManageUsers', function($http, mvIdentity, $q, mvUser) {
  return {

    setAdmin: function(user) {
      var dfd = $q.defer();
      $http.post('/api/users/rights', {user_id:user._id, rights:'admin'}).then(function(response) {
        if(response.data.success) {
          dfd.resolve(true);
        } else {
          dfd.resolve(false);
        }
      });
      return dfd.promise;
    },
    removeUser: function(user) {
      var dfd = $q.defer();
      $http.delete('/api/users', {user_id:user._id}).then(function(response) {
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