angular.module('app').factory('kssManageUsers', function($http, kssIdentity, $q, kssUser) {
  return {
    isAdmin: function(user) {
      return user.roles.indexOf('admin') > -1;
    },
    addRights: function(user) {
      var dfd = $q.defer();
      $http.post('/api/users/addRights', {user_id:user._id, rights:'admin'}).then(function(response) {
        if(response.data.success) {
          dfd.resolve(true);
        } else {
          dfd.resolve(false);
        }
      });
      return dfd.promise;
    },
    removeRights: function(user) {
      var dfd = $q.defer();
      $http.post('/api/users/rmRights', {user_id:user._id, rights:'admin'}).then(function(response) {
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
      console.log(user);
      $http.post('/api/users/remove', {user_id:user._id}).then(function(response) {
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