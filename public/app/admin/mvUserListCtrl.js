angular.module('app').controller('mvUserListCtrl', function($scope, mvUser, mvManageUsers) {
  $scope.users = mvUser.query();
  $scope.setAdmin = function(user) {
    if (mvManageUsers.isAdmin(user)) {
      mvManageUsers.removeRights(user).then(function(res) {
        $scope.users = mvUser.query();
      }, function(err){
        console.log(err);
      });
    } else {
      mvManageUsers.addRights(user).then(function(res) {
          $scope.users = mvUser.query();
      }, function(err){
        console.log(err);
      });
    }
  }
  $scope.removeUser = function(user) {
    mvManageUsers.removeUser(user).then(function(res) {
        $scope.users = mvUser.query();
    }, function(err){
      console.log(err);
    });
  $scope.isAdmin = mvManageUsers.isAdmin;
});