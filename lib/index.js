'use strict';

var
  PrimusEmitter = require('primus-emitter'),
  angularPrimus = {};

angularPrimus.client = function(primus, options){

};

angularPrimus.server = function(primus, options){
  primus.use('emitter', PrimusEmitter);
};

angularPrimus.library = require('fs').readFileSync(require.resolve('./angular/primus.js'), 'utf-8');

module.exports = angularPrimus;