'use strict';
angular.module('app').factory('newsResource', function($resource) {
  var NewsResource = $resource('/api/news/:id', {_id: "@id"}, {
    update: {method:'PUT',isArray:false}
  });

  NewsResource.prototype.getDate = function() {
  	var timestamp = this._id.toString().substring(0,8);
  	return new Date( parseInt( timestamp, 16 ) * 1000 );
  }

  return NewsResource;
});