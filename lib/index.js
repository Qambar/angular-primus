'use strict';

var
  PrimusEmitter = require('primus-emitter'),
  PrimusMultiplex = require('primus-multiplex'),
  AngularPrimus = function(){};

AngularPrimus.prototype.client = require('./angular/primus.js');

AngularPrimus.prototype.server = function (primus, options){
  primus
    .use('emitter', PrimusEmitter)
    .use('multiplex', PrimusMultiplex);

  var chan = primus.channel('Main::history');

  chan.on('connection', function (spark){
    spark.emit('update', [1, 2, 3]);

    spark.on('update', function (){
    });
  });
};

AngularPrimus.prototype.model = function (name, autoSync){

};

//AngularPrimus.library = require('fs').readFileSync(require.resolve('./angular/primus.js'), 'utf-8');

module.exports = new AngularPrimus();