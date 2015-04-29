angular.module('app').factory('newsList', function(newsResource) {
  var newsList = newsResource.query();

  return {
    newsList: newsList,
    add: function(news) {
        console.log(news);
    },
    edit: function(news) {
        console.log(news);
    },
    remove: function(news) {
        console.log(news);
    }
  }
})