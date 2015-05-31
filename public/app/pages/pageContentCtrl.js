angular.module('app').controller('pageContentCtrl', function($scope, $modal, $log, $sce, cachedPageContent, pageContentService, kssIdentity, kssNotifier, ConfirmService) {
  $scope.content = cachedPageContent.query();
  $scope.identity = kssIdentity;

  $scope.getLocation = function(section) {    
    return $sce.getTrustedResourceUrl(section.text);
  }

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

  $scope.openAboutWindow = function(section) {
    var modalInstance = $modal.open({
      templateUrl: '/partials/pages/contentModal',
      controller: 'contentModalCtrl',
      resolve: {
        pageId: function() {
          return 'about';
        },
        modalTitle: function() {
          return 'O klubie';
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

  $scope.openFooterWindow = function(section) {
    var modalInstance = $modal.open({
      templateUrl: '/partials/pages/contentModal',
      controller: 'contentModalCtrl',
      resolve: {
        pageId: function() {
          return 'footer';
        },
        modalTitle: function() {
          return 'Stopka';
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
    var doRemove = function() {
      pageContentService.remove(section).then(function(res) {
        var index = $scope.content.indexOf(section);
        $scope.content.splice(index, 1);
        kssNotifier.notify('Usunięto');
      }, function(err){
        kssNotifier.error(err);
        console.log(err);
      });
    }

    var ask = {
      title: 'usunięcie zawartości strony',      
      question: 'usunąć ten akapit ze strony',
      text: section.sectionTitle
    }
    ConfirmService.confirm(ask, doRemove); 
  }

  $scope.move = function(section) {
    section.position++;
    pageContentService.update(section)
      .then(function(res) {
        // var index = $scope.content.indexOf(section);
        // $scope.content.splice(index, 1);
        $scope.content = cachedPageContent.query(true);
        console.log(res);
        kssNotifier.notify('Przesunięto zawartość');
      }, function(err){
        kssNotifier.error(err);
        console.log(err);
      });

    // console.log(section);
    // for (var i in $scope.content) {
    //   if ($scope.content[i]._id === section._id) {
    //     $scope.content[i].position =+ 1;
    //     console.log($scope.content[i].position);
    //   }
    // }

    // $scope.content.sort(function(a, b){return a.position - b.position});


    // console.log(section);
    //
  }

});