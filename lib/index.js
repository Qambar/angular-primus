'use strict';

var
  Primus = require('primus'),
  PrimusEmitter = require('primus-emitter');

module.exports = {
  client: function (primus, options){
  },
  server: function (primus, options){
  },
  library: require('fs').readFileSync(require.resolve('./angular/primus.js'), 'utf-8')
};