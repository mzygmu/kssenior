'use strict';
angular.module('app').factory('kssAuth', function($http, kssIdentity, $q, kssUser) {
  return {
    authenticateUser: function(username, password) {
      var dfd = $q.defer();
      $http.post('/login', {username:username, password:password}).then(function(response) {
        if(response.data.success) {
          var user = new kssUser();
          angular.extend(user, response.data.user);
          kssIdentity.currentUser = user;
          dfd.resolve(true);
        } else {
          dfd.resolve(false);
        }
      });
      return dfd.promise;
    },

    createUser: function(newUserData) {
      var newUser = new kssUser(newUserData);
      var dfd = $q.defer();

      newUser.$save().then(function() {
        kssIdentity.currentUser = newUser;
        dfd.resolve();
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },

    updateCurrentUser: function(newUserData) {
      var dfd = $q.defer();

      var clone = angular.copy(kssIdentity.currentUser);
      angular.extend(clone, newUserData);
      clone.$update().then(function() {
        kssIdentity.currentUser = clone;
        dfd.resolve();
      }, function(response) {
        dfd.reject(response.data.reason);
      });
      return dfd.promise;
    },

    logoutUser: function() {
      var dfd = $q.defer();
      $http.post('/logout', {logout:true}).then(function() {
        kssIdentity.currentUser = undefined;
        dfd.resolve();
      });
      return dfd.promise;
    },
    authorizeCurrentUserForRoute: function(role) {
      if(kssIdentity.isAuthorized(role)) {
        return true;
      } else {
        return $q.reject('not authorized');
      }

    },
    authorizeAuthenticatedUserForRoute: function() {
      if(kssIdentity.isAuthenticated()) {
        return true;
      } else {
        return $q.reject('not authorized');
      }
    }
  }
});