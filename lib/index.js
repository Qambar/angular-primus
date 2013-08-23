'use strict';

var
  PrimusEmitter = require('primus-emitter'),
  PrimusMultiplex = require('primus-multiplex'),
  angularPrimus = {};

angularPrimus.client = function(primus, options){

};

angularPrimus.server = function(primus, options){
  primus
    .use('emitter', PrimusEmitter)
    .use('multiplex', PrimusMultiplex);

  var chan = primus.channel('Main::history');

  chan.on('connection', function(spark){
    spark.emit('update', [1,2,3]);

    spark.on('update', function(){
      console.log(arguments);
    });
  });
};

angularPrimus.library = require('fs').readFileSync(require.resolve('./angular/primus.js'), 'utf-8');

module.exports = angularPrimus;