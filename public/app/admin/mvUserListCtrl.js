angular.module('app').controller('mvUserListCtrl', function($scope, mvUser, mvManageUsers) {
  $scope.users = mvUser.query();
  $scope.setAdmin = mvManageUsers.setAdmin;
  $scope.removeUser = mvManageUsers.removeUser;
  $scope.isAdmin = mvManageUsers.isAdmin;
});