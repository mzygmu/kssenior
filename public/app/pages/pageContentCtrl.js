angular.module('app').controller('pageContentCtrl', function($scope, $modal, $log, cachedPageContent, pageContentService, mvIdentity, mvNotifier) {
  $scope.content = cachedPageContent.query();
  $scope.identity = mvIdentity;

  $scope.openChargesWindow = function(section) {
    var modalInstance = $modal.open({
      templateUrl: '/partials/pages/contentModal',
      controller: 'contentModalCtrl',
      resolve: {
      	pageId: function() {
      		return 'charges';
      	},
      	modalTitle: function() {
      		return 'Opłaty i składki';
      	},
        content: function () {
          return section;
        }
      }
    });
     
    modalInstance.result.then(function (data) {
      if (section) {
        var index = $scope.content.indexOf(section);
        $scope.content[index] = data;
      } else {
        $scope.content = cachedPageContent.query(true);
      }
    });
  }

  $scope.openJoinWindow = function(section) {
    var modalInstance = $modal.open({
      templateUrl: '/partials/pages/contentModal',
      controller: 'contentModalCtrl',
      resolve: {
        pageId: function() {
          return 'join';
        },
        modalTitle: function() {
          return 'Jak zostać zawodnikiem Klubu';
        },
        content: function () {
          return section;
        }
      }
    });
     
    modalInstance.result.then(function (data) {
      if (section) {
        var index = $scope.content.indexOf(section);
        $scope.content[index] = data;
      } else {
        $scope.content = cachedPageContent.query(true);
      }
    });
  }

  $scope.remove = function(section) {
    pageContentService.remove(section).then(function(res) {
      var index = $scope.content.indexOf(section);
      $scope.content.splice(index, 1);
      mvNotifier.notify('Usunięto');
    }, function(err){
      mvNotifier.error(err);
      console.log(err);
    });
  }

});