'use strict';
angular.module('app').controller('kssUserListCtrl', function($scope, kssUser, kssManageUsers, ConfirmService) {
  $scope.users = kssUser.query();
  $scope.setAdmin = function(user) {
    if (kssManageUsers.isAdmin(user)) {
      kssManageUsers.removeRights(user).then(function(res) {
        $scope.users = kssUser.query();
      }, function(err){
        console.log(err);
      });
    } else {
      kssManageUsers.addRights(user).then(function(res) {
          $scope.users = kssUser.query();
      }, function(err){
        console.log(err);
      });
    }
  };
  $scope.removeUser = function(user) {
    var doRemove = function() {
      kssManageUsers.removeUser(user).then(function(res) {
        var index = $scope.users.indexOf(user);
        $scope.users.splice(index, 1);

        //$scope.users = kssUser.query();
      }, function(err){
        console.log(err);
      });
    }

    var ask = {
      title: 'usunięcie użytkownika',      
      question: 'usunąć użytkownika z bazy danych',
      text: user.firstName + ' ' + user.lastName
    }
    ConfirmService.confirm(ask, doRemove); 
  };

  $scope.isAdmin = kssManageUsers.isAdmin;
});