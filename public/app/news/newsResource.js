angular.module('app').factory('newsResource', function($resource) {
  var NewsResource = $resource('/api/news', {
    update: {method:'PUT',isArray:false}
  });

  NewsResource.prototype.getDate = function() {
    return new Date(this._id);
  }

  return NewsResource;
});