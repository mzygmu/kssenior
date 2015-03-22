'use strict';
var mainControllers = angular.module('mainControllers', []);

mainControllers.controller('mainCtrl', ['$scope', '$http',
  function ($scope, $http) {
    // $http.get('phones/phones.json').success(function(data) {
    //   $scope.phones = data;
    // });

    $scope.myVar = "Hello Angular";
  }
]);

