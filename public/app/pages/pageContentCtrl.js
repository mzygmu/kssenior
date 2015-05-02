angular.module('app').controller('pageContentCtrl', function($scope, cachedPageContent) {
  $scope.content = cachedPageContent.query();

  // $scope.sortOptions = [{value:"title",text: "Sort by Title"},
  //   {value: "published",text: "Sort by Publish Date"}];
  // $scope.sortOrder = $scope.sortOptions[0].value;
});