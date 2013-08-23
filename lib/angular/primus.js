(function (){
  'use strict';

  var
    angularPrimus = angular.module('angularPrimus', []),
    ohp = Object.prototype.hasOwnProperty,
    ots = Object.prototype.toString;

  function getType(obj){
    return ots.call(obj).slice(8, -1).toLowerCase();
  }

  function isArray(obj){
    return !!(obj && getType(obj) === 'array');
  }

  function isFunction(obj){
    return !!(obj && getType(obj) === 'function');
  }

  function isObject(obj){
    return !!(obj && getType(obj) === 'object');
  }

  function count(obj){
    if (!obj) { return 0; }
    if (typeof obj['length'] !== 'undefined') {
      return obj.length;
    } else if ('keys' in Object) {
      return Object.keys(obj).length;
    } else {
      var _count = 0;
      for (var k in obj) {
        if (ohp.call(obj, k)) {
          _count++;
        }
      }
      return _count;
    }
  }

  angularPrimus
    .value('primusConfig', {
      ssl     : false,
      host    : window.location.hostname,
      port    : window.location.port,
      autoOpen: true
    })
    .factory('$primus', ['$timeout', '$rootScope', 'primusConfig', function ($timeout, $rootScope, primusConfig){
      return function ($scope, options){
        options = options || {};
        var
          watch,
          watching = {},
          out = {
            'primus' : false,
            'options': angular.extend(angular.copy(primusConfig), options),
            'open'   : function (){
              if (this.primus === false) {
                this.primus = Primus.connect('ws' + (this.options.ssl ? 's' : '') + '://' + this.options.host + ':' + this.options.port);
              } else {
                this.primus.reconnect();
              }
              return this;
            },
            'model'  : function (name){
              if (isArray(name)) {
                for (var i = 0, len = name.length; i < len; i++) {
                  if (ohp.call($scope, name[i])) {
                    watch(name[i]);
                  }
                }
              } else if (typeof name === 'string' && typeof $scope[name] !== 'undefined') {
                watch(name);
              }
              return this;
            },
            'on'     : function (name, cb){
              this.primus.on(name, cb);
              return this;
            },
            'write'  : function (){
              return this;

            },
            'emit'   : function (){
              return this;

            },
            'set'    : function (model, data){
              return this;

            },
            'get'    : function (model){

            }
          };

        watch = function (name){
          if (typeof watching[name] !== 'undefined') {
            watching[name].unregister();
          }

          watching[name] = {
            'type'      : getType($scope[name]),
            'unregister': $scope.$watch(function (){
                return count($scope[name]);
              }, function (newValue, oldValue){
                if (newValue !== oldValue) {
                  // we have an update

                  console.log(newValue, oldValue);
                }
            }),
            'name'      : name
          };
        };

        return out;
      };
    }]);

})();