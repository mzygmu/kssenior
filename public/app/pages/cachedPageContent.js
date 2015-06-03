'use strict';
angular.module('app').factory('cachedPageContent', function(pageContentResource) {
  var content;

  return {
    query: function(refresh) {
      if(!content || refresh) {
        content = pageContentResource.query();
      }

      return content;
    }
  }
})