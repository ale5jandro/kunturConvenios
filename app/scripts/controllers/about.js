'use strict';

/**
 * @ngdoc function
 * @name kunturApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the kunturApp
 */
angular.module('kunturApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
