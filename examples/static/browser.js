(function(){
  'use strict';

  var App = angular.module('DemoApp', ['angularPrimus']);

  /* this is bad practice, but it's only reuse the same $primus instance */
  App.run(['$rootScope', '$primus', function($rootScope, $primus){
    $rootScope.$primus = $primus;
  }]);

  var Main = App.controller('Main', ['$scope', function($scope){
    $scope.history = [];
    $scope.$primus.$watch('history');
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
        console.log($scope);
      }
    };
  }]);

})();