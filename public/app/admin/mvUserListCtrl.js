angular.module('app').controller('mvUserListCtrl', function($scope, mvUser, mvManageUsers) {
  $scope.users = mvUser.query();
  $scope.setAdmin = function(user) {
  	if (mvManageUsers.isAdmin(user)) {
  		mvManageUsers.removeRights(user);
  	} else {
  		mvManageUsers.addRights(user);
  	}
  }
  $scope.removeUser = mvManageUsers.removeUser;
  $scope.isAdmin = mvManageUsers.isAdmin;
});