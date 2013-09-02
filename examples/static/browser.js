(function(){
  'use strict';

  var primus = Primus();

  var App = angular.module('DemoApp', ['ngPrimus']);

  var Main = App.controller('Main', ['$scope', '$primus', '$timeout', function($scope, $primus, $timeout){
    console.log(this);
    // First parameter is the current controller name, so you can differentiate on the server
    // Second parameter is the current $scope
    $scope.$primus = $primus('Main', $scope);

    $scope.history = [];

    // first parameter on 'model' method is/are the $scope variables that should be watched, accepts an array
    // or an string

    // second parameter indicates if the model should be synced automatically to the server on modification
    // otherwise, you should change your model value using $scope.primus.set('history', 'value');

    // the scope variable must exist before the model call since, you know better your variable types
    $scope.$primus.model(['history'], true);

    // Don't allow arbitrary updating server data like this,
    // this is an example only.
    $timeout(function(){
      $scope.history.push({data: true}); // this will update the data in the server
    }, 1000);

    $timeout(function(){
      $scope.history.push({url:'yes'}); // this will update the data in the server
    }, 1500);
    // everytime the model changes, the server gets an update

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