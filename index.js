#!/usr/bin/env node

var http = require('http'),
  httpProxy = require('http-proxy'),
  slow = require('connect-slow'),
  fs = require('fs'),
  path = require('path');

var pkg = require(path.join(__dirname, 'package.json'));

var configFilename = 'turtles.json';
console.log('looking for config file', configFilename);

var config = JSON.parse(fs.readFileSync(configFilename), 'utf-8');

var slowDowns = Object.keys(config.urls).map(function (urlPattern) {
  var delay = config.urls[urlPattern];
  return slow({
    url: new RegExp(urlPattern),
    delay: delay
  });
});

var proxy = httpProxy.createProxyServer();

http.createServer(function (req, res) {
  var toTarget = proxy.web.bind(proxy, req, res, {
    target: config.target
  });

  var slowPyramid = slowDowns.reduce(function (prev, slowDown) {
    return slowDown.bind(null, req, res, prev);
  }, toTarget);

  slowPyramid();

}).listen(config.port);

console.log(pkg.name, 'listening at port', config.port);
