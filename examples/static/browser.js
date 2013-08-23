(function(){
  'use strict';

  var App = angular.module('DemoApp', ['angularPrimus']);

  var Main = App.controller('Main', ['$scope', '$primus', '$timeout', function($scope, $primus, $timeout){
    $scope.$primus = $primus('Main', $scope);
    $scope.history = [];

    $scope.$primus.model(['history']); // the scope variable must exist before

    // Don't allow arbitrary updating server data like this,
    // this is an example only
    $timeout(function(){
      $scope.history.push({}); // this will update
    }, 1000);

    $timeout(function(){
      $scope.history.push({}); // this will update
    }, 1000);

  }]);

  Main.directive('main', [function(){
    return {
      restrict: 'A',
      link: function($scope){

      }
    };
  }]);

  var Side = App.controller('Side', ['$scope', function($scope){
    $scope.lists = [];
  }]);

  Side.directive('side', [function(){
    return {
      restrict: 'A',
      link: function($scope){

      }
    };
  }]);

})();