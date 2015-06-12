'use strict';

/**
 * @ngdoc function
 * @name kunturApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the kunturApp
 */
angular.module('kunturApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
