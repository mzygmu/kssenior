angular.module('app').factory('newsResource', function($resource) {
  var NewsResource = $resource('/api/news', {
    update: {method:'PUT',isArray:false}
  });

  NewsResource.prototype.getDate = function() {
  	console.log('DATE FROM ID '+this._id);
    return new ObjectId(this._id).getTimestamp();
  }

  return NewsResource;
});