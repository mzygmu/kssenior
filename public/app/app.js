angular.module('app', ['ngResource', 'ngRoute', 'ui.bootstrap']);

angular.module('app').config(function($routeProvider, $locationProvider) {
  var routeRoleChecks = {
    admin: {auth: function(mvAuth) {
      return mvAuth.authorizeCurrentUserForRoute('admin')
    }},
    user: {auth: function(mvAuth) {
      return mvAuth.authorizeAuthenticatedUserForRoute()
    }}
  }

  $locationProvider.html5Mode(true);
  $routeProvider
      .when('/', { templateUrl: '/partials/main/main', controller: 'mvMainCtrl'})
      .when('/admin/users', { templateUrl: '/partials/admin/user-list',
        controller: 'mvUserListCtrl', resolve: routeRoleChecks.admin
      })
      .when('/profile', { templateUrl: '/partials/account/profile',
        controller: 'mvProfileCtrl', resolve: routeRoleChecks.user
      })
      .when('/courses', { templateUrl: '/partials/courses/course-list',
        controller: 'mvCourseListCtrl'
      })
      .when('/courses/:id', { templateUrl: '/partials/courses/course-details',
        controller: 'mvCourseDetailCtrl'
      })
      .when('/news', { templateUrl: '/partials/pages/news', 
        controller: 'newsListCtrl'
      })
      .when('/zawody', { templateUrl: '/partials/pages/zawody'
      })
      .when('/charges', { templateUrl: '/partials/pages/charges',
        controller: 'pageContentCtrl'
      })
      .when('/join', { templateUrl: '/partials/pages/join'
      })
      .when('/klub', { templateUrl: '/partials/pages/klub'
      })
});

angular.module('app').run(function($rootScope, $location) {
  $rootScope.$on('$routeChangeError', function(evt, current, previous, rejection) {
    if(rejection === 'not authorized') {
      $location.path('/');
    }
  })
})
