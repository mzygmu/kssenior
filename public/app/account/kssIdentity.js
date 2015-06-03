'use strict';
angular.module('app').factory('kssIdentity', function($window, kssUser) {
  var currentUser;
  if(!!$window.bootstrappedUserObject) {
    currentUser = new kssUser();
    angular.extend(currentUser, $window.bootstrappedUserObject);
  }
  return {
    currentUser: currentUser,
    isAuthenticated: function() {
      return !!this.currentUser;
    },
    isAuthorized: function(role) {
      return !!this.currentUser && this.currentUser.roles.indexOf(role) > -1;
    }
  }
})