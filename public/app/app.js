'use strict';
angular.module('app', ['ngResource', 'ngRoute', 'mainControllers']);

// angular.module('app').config(function($routeProvider, $locationProvider) {
//   $locationProvider.html5Mode(true);
//   $routeProvider
//     .when('/', { 
//       templateUrl: '/partials/main', 
//       controller: 'mainCtrl'
//     });
// });

angular.module('app').config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/main',
        controller: 'mainCtrl'
      });
  }
]);