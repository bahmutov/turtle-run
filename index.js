#!/usr/bin/env node

var http = require('http'),
  httpProxy = require('http-proxy'),
  slow = require('connect-slow'),
  fs = require('fs'),
  path = require('path');

var pkg = require(path.join(__dirname, 'package.json'));

var configFilename = process.argv[2] || 'turtles.json';
console.log('looking for config file', configFilename);

if (!fs.existsSync(configFilename)) {
  console.error('Cannot find config file', configFilename);
  process.exit(-1);
}

var proxy, server;

function startProxy() {
  proxy = httpProxy.createProxyServer();

  var config = JSON.parse(fs.readFileSync(configFilename), 'utf-8');

  var slowDowns = Object.keys(config.urls).map(function (urlPattern) {
    var delay = config.urls[urlPattern];
    return slow({
      url: new RegExp(urlPattern),
      delay: delay
    });
  });

  server = http.createServer(function (req, res) {
    var toTarget = proxy.web.bind(proxy, req, res, {
      target: config.target
    });

    var slowPyramid = slowDowns.reduce(function (prev, slowDown) {
      return slowDown.bind(null, req, res, prev);
    }, toTarget);

    slowPyramid();

  }).listen(config.port);

  console.log(pkg.name, 'listening at port', config.port);
}

var nodemon = require('nodemon');

nodemon({
  script: configFilename,
  ext: 'json'
});

nodemon.on('start', function () {
  if (server) {
    server.close();
  }
  if (proxy) {
    proxy.close();
  }
  startProxy();
}).on('quit', function () {
  server.close();
  proxy.close();
}).on('restart', function (files) {
  console.log('restarting', pkg.name, 'on', configFilename, 'change');
});

console.log('you can edit file', configFilename, 'to restart with new settings');
