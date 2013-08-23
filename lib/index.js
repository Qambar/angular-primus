'use strict';

var
  PrimusEmitter = require('primus-emitter'),
  PrimusMultiplex = require('primus-multiplex'),
  angularPrimus = {};

angularPrimus.client = function(primus, options){
  primus
    .use('emitter', PrimusEmitter)
    .use('multiplex', PrimusMultiplex);

};

angularPrimus.server = function(primus, options){
  primus
    .use('emitter', PrimusEmitter)
    .use('multiplex', PrimusMultiplex);
};

angularPrimus.library = require('fs').readFileSync(require.resolve('./angular/primus.js'), 'utf-8');

module.exports = angularPrimus;