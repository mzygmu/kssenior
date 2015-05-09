angular.module('app').factory('cachedCompetitions', function(competitionsResource) {
  var competitions;

  return {
    query: function(refresh) {
      if(!competitions || refresh) {
        competitions = competitionsResource.query();
      }

      return competitions;
    }
  }
})