angular.module('app').factory('cachedPageContent', function(pageContentResource) {
  var content;

  return {
    query: function() {
      if(!content) {
        content = pageContentResource.query();
      }

      return content;
    }
  }
})