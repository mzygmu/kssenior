angular.module('app').factory('newsList', function(newsResource) {
  var newsList = newsResource.query();

  return {
    newsList: newsList,
    add: function(news) {
        console.log('newsList add');
        console.log(news);
    },
    edit: function(news) {
        newsList = newsResource.query();
    },
    remove: function(news) {
        console.log('newsList remove');
        console.log(news);
    }
  }
})