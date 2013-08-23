'use strict';

var
  angularPrimus = require('../lib'),
  Primus = require('primus'),
  express = require('express'),
  app = express(),
  port = 27699,
  http = require('http'),
  server = http.createServer(app),
  primus = new Primus(server, { transformer: 'socket.io', parser: 'JSON' });

// Add angular functionality to primus
primus.use('angularPrimus', angularPrimus);

app.set('view options', {layout: false});
app.use(express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/bower_components'));

app.get('/', function(req, res){
  res.render('index.html');
});

server.listen(port, function(){
  console.log('Listening on http://localhost:' + port + '/');
});