module.exports = function (primus, primusOptions){
  'use strict';

  var
    angularPrimus = angular.module('ngPrimus', []),
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
    .value('ngPrimusConfig', {
      ssl     : false,
      host    : window.location.hostname,
      port    : window.location.port,
      autoOpen: true
    })
    .factory('$primus', ['$timeout', '$rootScope', 'ngPrimusConfig', function ($timeout, $rootScope, ngPrimusConfig){

      function AngularPrimus(namespace, $scope, options){
        if (!(this instanceof AngularPrimus)) {
          return new AngularPrimus(namespace, $scope, options);
        }
        options = options || {};

        var self = this;

        self.connected = false;
        self.synced = false;
        self.models = {};
        self.namespace = namespace;
        self.$scope = $scope;
        self.primus = primus;
        self.primusOptions = primusOptions;
        self.options = angular.extend(angular.copy(ngPrimusConfig), options);
      }

      AngularPrimus.prototype._watch = function (name, autoSync){
        var self = this;

        if (self.connected === false) {
          if (self.options.autoOpen) {
            self.open(function (){
              self._watch(name, autoSync);
            });
          } else {
            throw new Error('Cant watch for server updates on a closed connection');
          }

          return;
        }

        var channel, update;

        update = function (){
          self.synced = true;
          /*$timeout(function(){

           });*/
          console.log(this, arguments);
        };

        if (typeof self.models[name] !== 'undefined') {
          self.models[name].unregister();

          if (typeof self.models[name].channel !== 'undefined') {
            self.models[name].channel.removeListener('update', update);
          }
        }

        if (typeof self.models[name] !== 'undefined' &&
          typeof self.models[name].channel !== 'undefined') {
          channel = self.models[name].channel;
        } else {
          channel = primus.channel(self.namespace + '::' + name);

          channel.on('update', update);
        }

        self.models[name] = {
          'channel'   : channel,
          'type'      : getType(self.$scope[name]),
          'unregister': self.$scope.$watch(function (){
            return count(self.$scope[name]);
          }, function (newValue, oldValue){
            if (newValue !== oldValue) {
              // we have an update
              self.synced = false;
              channel.emit('update', self.$scope[name]);
            }
          }),
          'name'      : name
        };
      };

      AngularPrimus.prototype.open = function (cb){
        var self = this;
        if (self.primus === false) {
          var url = 'ws' + (self.options.ssl ? 's' : '') + '://' + self.options.host + ':' + self.options.port;

          this.primus = Primus.connect(
            url
          );

          this.primus.on('open', function (){
            self.connected = true;
            cb(url);
          });

          this.primus.on('end', function (){
            self.connected = false;
          });
        }
        return this;
      };

      AngularPrimus.prototype.model = function (name, autoSync){
        var self = this;

        autoSync = autoSync !== undefined ? !!(autoSync) : false;

        if (isArray(name)) {
          for (var i = 0, len = name.length; i < len; i++) {
            if (ohp.call(self.$scope, name[i])) {
              self._watch(name[i], autoSync);
            }
          }
        } else if (typeof name === 'string' && typeof self.$scope[name] !== 'undefined') {
          self._watch(name, autoSync);
        }

        return this;
      };

      AngularPrimus.prototype.on = function (name, cb){
        primus.on(name, cb);

        return this;
      };

      AngularPrimus.prototype.emit = function (name, args){
        primus.emit(name, args);

        return this;
      };

      AngularPrimus.prototype.set = function (model, data){
        var self = this;

        if (model) {
          if (isObject(model)) {
            $timeout(function (){
              for (var k in model) {
                if (ohp.call(model, k)) {
                  self.$scope[k] = isFunction(model[k]) ? model[k].call() : model[k];
                }
              }
            });
          } else {
            if (typeof self.$scope[model] !== 'undefined') {
              $timeout(function (){
                self.$scope[model] = isFunction(data) ? data.call() : data;
              });
            }
          }
        }

        return this;
      };

      return AngularPrimus;
    }]);
};