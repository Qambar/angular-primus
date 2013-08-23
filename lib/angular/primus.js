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
      return function (namespace, $scope, options){
        options = options || {};

        var
          watch,
          watching = {},
          out = {
            'primus' : false,
            'synced': false,
            'connected': false,
            'options': angular.extend(angular.copy(primusConfig), options),
            'open'   : function (cb){
              if (this.primus === false) {
                this.primus = Primus.connect('ws' + (this.options.ssl ? 's' : '') + '://' + this.options.host + ':' + this.options.port);

                this.primus.on('open', function(){
                  out.connected = true;
                  cb();
                });

                this.primus.on('end', function(){
                  out.connected = false;
                });
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
            'emit'   : function (name, args){
              this.primus.emit(name, args);

              return this;
            },
            'set'    : function (model, data){
              if (model) {
                if (isObject(model)) {
                  $timeout(function(){
                    for(var k in model) {
                      if (ohp.call(model, k)) {
                        $scope[k] = model[k];
                      }
                    }
                  });
                } else {
                  if (typeof $scope[model] !== 'undefined') {
                    $timeout(function(){
                      $scope[model] = data;
                    });
                  }
                }
              }

              return this;
            },
            'get'    : function (model){
              if (model) {

              }
            }
          };

        watch = function (name){
          if (out.connected === false) {
            if (out.options.autoOpen) {
              out.open(function(){
                watch(name);
              });
            } else {
              throw new Error('Cant watch for server updates on a closed connection');
            }
            return;
          }

          var channel, update;

          update = function(){
            out.synced = true;
            /*$timeout(function(){

            });*/
            console.log(this, arguments);
          };

          if (typeof watching[name] !== 'undefined') {
            watching[name].unregister();
            if (typeof watching[name].channel !== 'undefined') {
              watching[name].channel.removeListener('update', update);
            }
          }

          if (typeof watching[name] !== 'undefined' &&
            typeof watching[name].channel !== 'undefined') {
            channel = watching[name].channel;
          } else {
            channel = out.primus.channel(namespace + '::' + name);

            channel.on('update', update);
          }

          watching[name] = {
            'channel'   : channel,
            'type'      : getType($scope[name]),
            'unregister': $scope.$watch(function (){
                return count($scope[name]);
              }, function (newValue, oldValue){
                if (newValue !== oldValue) {
                  // we have an update
                  out.synced = false;
                  channel.emit('update', $scope[name]);
                }
            }),
            'name'      : name
          };
        };

        return out;
      };
    }]);

})();