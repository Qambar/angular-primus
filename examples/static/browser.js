(function(){
  'use strict';

  var App = angular.module('DemoApp', ['angularPrimus']);

  var Main = App.controller('Main', ['$scope', '$primus', function($scope, $primus){
    $scope.$primus = $primus($scope);
    $scope.history = [];

    $scope.$primus.watch();
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