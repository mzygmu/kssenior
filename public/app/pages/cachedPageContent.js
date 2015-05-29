angular.module('app').factory('cachedPageContent', function(pageContentResource) {
  var content, 
    location = 'https://www.google.com/maps/embed?pb=!1m18!1m8!1m3!1d9301.657440974026!2d18.66766415986781!3d54.34965854257815!3m2!1i1024!2i768!4f13.1!4m7!1i0!3e0!4m3!3m2!1d54.3467007!2d18.6722847!4m0!5e0!3m2!1spl!2spl!4v1427534684402';

  return {
    query: function(refresh) {
      if(!content || refresh) {
        content = pageContentResource.query();
      }

      return content;
    },
    getLocation: function() {
      return location;
    }
  }
})