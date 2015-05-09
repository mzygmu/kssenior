angular.module('app').factory('competitionsResource', function($resource) {
  var NewsResource = $resource('/api/competitions/:id', {_id: "@id"}, {
    update: {method:'PUT',isArray:false}
  });
  
  return NewsResource;
});