angular.module('app').controller('pageContentCtrl', function($scope, $modal, $log, cachedPageContent, mvIdentity, mvNotifier) {
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
     
    modalInstance.result.then(function (postData) {
      newsList.edit(postData);
      $scope.news = newsList.newsList;
    });
  }

  $scope.remove = function(section) {
    publishService.removeNews(section).then(function(res) {
      var index = $scope.news.indexOf(section);
      $scope.news.splice(index, 1);
      mvNotifier.notify('Ogłoszenie zostało usunięte');
    }, function(err){
      mvNotifier.error(err);
      console.log(err);
    });
  }

});