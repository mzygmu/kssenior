angular.module('app').controller('competitionsModalCtrl', function($scope, $modalInstance, competitionsService, mvNotifier, competitions) {

  if (competitions) {
  	// TODO set all fields
    $scope.title = competitions.title;

    $scope.notes = competitions.notes;
    $scope.description = competitions.description;
  }

  var add = function() {
    var content = {
      title: $scope.title,
      competition: ['3x20', 'Psp 20', 'Pcz 30'],
      date: new Date(),
      notes: $scope.notes,
      description: $scope.description

  // title: {type:String, required:'{PATH} is required!'},
  // competition: {type:[String], required:'{PATH} is required!'},
  // date: {type:Date, required:'{PATH} is required!'},
  // category: [String],
  // types: [String],
  // notes: String,
  // description: String

    };

    competitionsService.publish(content).then(function() {
      mvNotifier.notify('Opublikowano');
    }, function(reason) {
      mvNotifier.error(reason);
    });
    $modalInstance.close(content);
  }
  
  var update = function() {
    var clone = angular.copy(competitions);

    var data = {
      title: $scope.title,
      competition: ['3x10'],
      date: new Date(),
      notes: $scope.notes,
      description: $scope.description

  // title: {type:String, required:'{PATH} is required!'},
  // competition: {type:[String], required:'{PATH} is required!'},
  // date: {type:Date, required:'{PATH} is required!'},
  // category: [String],
  // types: [String],
  // notes: String,
  // description: String
    };
    angular.extend(clone, data);

    competitionsService.update(clone).then(function() {
      mvNotifier.notify('Zaktualizowano');

    }, function(reason) {
      mvNotifier.error(reason);
    })
    $modalInstance.close(clone);
  }

  $scope.publish = function() {
    if (competitions) {
      update();
    } else {
      add();
    }
  }

  $scope.cancel = function () {
    $modalInstance.dismiss(undefined);
  };

})