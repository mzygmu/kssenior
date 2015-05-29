angular.module('app').factory('cachedPageContent', function(pageContentResource) {
  var content, 
    location;
    
  return {
    query: function(refresh) {
      if(!content || refresh) {
        content = pageContentResource.query();
        // for (i in content) {
        //   console.log(content[i]);
        //   if (content[i].pageId === 'location') {
        //     location = content[i];
        //     break;
        //   }
        // }
      }

      return content;
    },
    getLocation: function() {
      return location;
    }
  }
})