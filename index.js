#!/usr/bin/env node

require('lazy-ass');
var check = require('check-more-types');

var http = require('http'),
  httpProxy = require('http-proxy'),
  slow = require('connect-slow'),
  stop = require('connect-stop'),
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
    var action = config.urls[urlPattern];
    // 'app.js': 1000 -> delay request to app.js by 1 second
    if (typeof action === 'number') {
      return slow({
        url: new RegExp(urlPattern),
        delay: action,
        debug: config.debug
      });
    }
    // 'app.js': { response: 404 } -> respond to app.js with 404
    if (typeof action === 'object') {
      la(check.has(action, 'response'), 'url', urlPattern, 'action does not have response', action);
      return stop({
        url: new RegExp(urlPattern),
        response: action.response,
        debug: config.debug
      });
    }
    la(false, 'do not know what to do for url', urlPattern);
  });

  server = http.createServer(function (req, res) {
    if (config.debug) {
      console.log(req.method, req.url);
    }

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
}).on('restart', function () {
  console.log('restarting', pkg.name, 'on', configFilename, 'change');
});

console.log('you can edit file', configFilename, 'to restart with new settings');
