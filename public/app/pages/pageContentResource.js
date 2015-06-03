'use strict';
angular.module('app').factory('pageContentResource', function($resource) {
  var PageContentResource = $resource('/api/content/:id', {_id: "@id"}, {
    update: {method:'PUT',isArray:false}
  });

  return PageContentResource;
});