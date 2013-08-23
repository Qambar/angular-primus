(function (){
  'use strict';

  var angularPrimus = angular.module('angularPrimus', []);

  angularPrimus
    .value('primusConfig', {
      host: window.location.hostname,
      port: window.location.port
    })
    .factory('$primus', ['$timeout', '$rootScope', 'primusConfig', function ($timeout, $rootScope, primusConfig){
      var primus = Primus({manual: true});

      return function($scope, options){
        options = options || {};

        return {
          'options': angular.extend(primusConfig, options),
          'open': function(port, host){

          },
          'watch': function(name){
            if (!name) {
              for(var k in $scope) {
                if (Object.prototype.hasOwnProperty.call($scope, k)) {
                  console.log(k);
                }
              }
            }
          },
          'on': function(){

          },
          'write': function(){

          },
          'emit': function(){

          },
          'set': function(model, data){

          },
          'get': function(model){

          },
          'hook': function(type, fn){

          }
        };
      };
    }]);

})();