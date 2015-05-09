angular.module('app').controller('mvUserListCtrl', function($scope, mvUser, mvManageUsers, ConfirmService) {
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
  };
  $scope.removeUser = function(user) {
    var doRemove = function() {
      mvManageUsers.removeUser(user).then(function(res) {
        var index = $scope.users.indexOf(user);
        $scope.users.splice(index, 1);

        //$scope.users = mvUser.query();
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

  $scope.isAdmin = mvManageUsers.isAdmin;
});