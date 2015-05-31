angular.module('app', ['ngResource', 'ngRoute', 'ui.bootstrap']);

angular.module('app').config(function($routeProvider, $locationProvider, $sceDelegateProvider) {
  var routeRoleChecks = {
    admin: {auth: function(kssAuth) {
      return kssAuth.authorizeCurrentUserForRoute('admin')
    }},
    user: {auth: function(kssAuth) {
      return kssAuth.authorizeAuthenticatedUserForRoute()
    }}
  }

  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain.  Notice the difference between * and **.
    'https://www.google.com/maps/**'
  ]);

  // The blacklist overrides the whitelist so the open redirect here is blocked.
  // $sceDelegateProvider.resourceUrlBlacklist([
  //   'http://myapp.example.com/clickThru**'
  // ]);

  $locationProvider.html5Mode(true);
  $routeProvider
      .when('/', { templateUrl: '/partials/main/main', controller: 'kssMainCtrl'})
      .when('/admin/users', { templateUrl: '/partials/admin/user-list',
        controller: 'kssUserListCtrl', resolve: routeRoleChecks.admin
      })
      .when('/profile', { templateUrl: '/partials/account/profile',
        controller: 'kssProfileCtrl', resolve: routeRoleChecks.user
      })
      .when('/news', { templateUrl: '/partials/pages/news', 
        controller: 'newsListCtrl'
      })
      .when('/events', { templateUrl: '/partials/competitions/competitions', 
        controller: 'competitionsCtrl'
      })
      .when('/events/:id', { templateUrl: '/partials/competitions/competition', 
        controller: 'competitionsCtrl'
      })
      .when('/charges', { templateUrl: '/partials/pages/charges',
        controller: 'pageContentCtrl'
      })
      .when('/join', { templateUrl: '/partials/pages/join',
        controller: 'pageContentCtrl'
      })
      .when('/about', { templateUrl: '/partials/pages/about',
        controller: 'pageContentCtrl'
      })
});

angular.module('app').run(function($rootScope, $location) {
  $rootScope.$on('$routeChangeError', function(evt, current, previous, rejection) {
    if(rejection === 'not authorized') {
      $location.path('/');
    }
  })
})
