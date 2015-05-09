angular.module('app').factory('newsList', function(newsResource) {
  var newsList;

  return {
    query: function(refresh) {
      if(!content || refresh) {
        newsList = newsResource.query();
      }

      return newsList;
    }
  }  
})