# turtle-run

> Http proxy for testing with per request delay and responses

[![NPM][turtle-run-icon] ][turtle-run-url]

[![Build status][turtle-run-ci-image] ][turtle-run-ci-url]
[![dependencies][turtle-run-dependencies-image] ][turtle-run-dependencies-url]
[![devdependencies][turtle-run-devdependencies-image] ][turtle-run-devdependencies-url]

[turtle-run-icon]: https://nodei.co/npm/turtle-run.png?downloads=true
[turtle-run-url]: https://npmjs.org/package/turtle-run
[turtle-run-ci-image]: https://travis-ci.org/bahmutov/turtle-run.png?branch=master
[turtle-run-ci-url]: https://travis-ci.org/bahmutov/turtle-run
[turtle-run-dependencies-image]: https://david-dm.org/bahmutov/turtle-run.png
[turtle-run-dependencies-url]: https://david-dm.org/bahmutov/turtle-run
[turtle-run-devdependencies-image]: https://david-dm.org/bahmutov/turtle-run/dev-status.png
[turtle-run-devdependencies-url]: https://david-dm.org/bahmutov/turtle-run#info=devDependencies

Read [Robustness testing using proxies](http://bahmutov.calepin.co/robustness-testing-using-proxies.html)
and [Give browser a chance](http://bahmutov.calepin.co/give-browser-a-chance.html).

Uses [connect-slow](https://github.com/bahmutov/connect-slow) and 
[connect-stop](https://github.com/bahmutov/connect-stop) internally.

Install `npm install -g turtle-run`

Run `turtle-run <config json file | turtle.json by default>`

Create `turtle.json` local config file. Example:

```json
{
  "target": "http://localhost:3003",
  "port": 8008,
  "debug": true,
  "urls": {
    ".js$": 2000,
    "app.js": 2000,
    ".html$": 1000,
    "foo.js$": { "response": 500 }
  }
}
```

Start *turtle-run* in the folder with *turtle.json*. The proxy watches the file and restarts on any changes.
In the above case, the proxy will listen on local port 8008 and forward any requests to `http://localhost:3003`.
Requests containing `.js` at the end will be delayed by 2 seconds. JavaScript file `app.js` will be delayed by
4 seconds (2 seconds for every js file and 2 seconds because it matches `app.js`). HTML files will be delayed 
by 1 second. All other requests will not be delayed.

The proxy will also return code 500 for resource `foo.js`.

`debug` flag tells proxy to output request information to console log.

### Small print

Author: Gleb Bahmutov &copy; 2014

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](http://glebbahmutov.com)
* [blog](http://bahmutov.calepin.co/)

License: MIT - do anything with the code, but don't blame me if it does not work.

Spread the word: tweet, star on github, etc.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/turtle-run/issues) on Github

## MIT License

The MIT License (MIT)

Copyright (c) 2014 Gleb Bahmutov

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
