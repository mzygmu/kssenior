angular.module('app').directive('ksNews', function() {
  return {
    restrict: 'E',
    templateUrl: '/partials/news/newsTemplate',
    scope: true
  }
});