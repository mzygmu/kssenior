angular.module('app').controller('pageContentCtrl', function($scope, $modal, $log, cachedPageContent, pageContentService, mvIdentity, mvNotifier) {
  $scope.content = cachedPageContent.query();
  $scope.identity = mvIdentity;

  $scope.openNewChargesWindow = function() {
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
          return undefined;
        }
      }
    });

    modalInstance.result.then(function () {

    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.editCharges = function(section) {
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
      
    });
  }

  $scope.openNewJoinWindow = function() {
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
          return undefined;
        }
      }
    });

    modalInstance.result.then(function () {

    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.editJoin = function(section) {
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