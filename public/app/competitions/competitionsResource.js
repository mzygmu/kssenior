'use strict';
angular.module('app').factory('competitionsResource', function($resource) {
  var CompetitionsResource = $resource('/api/competitions/:_id', {_id: "@id"}, {
    update: {method:'PUT',isArray:false}
  });
  
  return CompetitionsResource;
});

angular.module('app').factory('resultsResource', function($resource) {
  var ResultsResource = $resource('/api/results/:_id', {_id: "@id"}, {
    update: {method:'PUT',isArray:false}
  });
  
  return ResultsResource;
});