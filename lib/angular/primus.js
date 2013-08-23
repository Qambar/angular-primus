(function (){
  'use strict';

  var angularPrimus = angular.module('angularPrimus', []);

  angularPrimus
    .value('primusConfig', {
      host: 'localhost',
      port: '8080'
    })
    .provider('$primus', function(){
      return {
        '$get': function(){
          console.log(arguments);
        }
      };
    })
    .factory('$primus', ['$timeout', 'primusConfig', function ($timeout, primusConfig){
      return {
        '$config': primusConfig,
        '$open': function(){

        },
        '$on': function(){

        },
        '$write': function(){

        },
        '$emit': function(){

        },
        '$set': function(){

        },
        '$hook': function(){

        }
      };
    }]);

})();