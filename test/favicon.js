// modules
const assert        = require('assert');
const _             = require('underscore');
const passmarked        = require('passmarked');
const testFunc      = require('../lib/rules/favicon');
const http          = require('http');
const fs            = require('fs');
const request       = require('request');

// checks warnings that we check for
describe('favicon', function() {

  // increase the timeouts for this particular test suite,
  // as it runs locally too so can be a slow over ADSL ...
  this.timeout(10000);

  // handle the error output
  it('Should return a error if there is no favicon', function(done) {

    //Create a server
    var server = http.createServer(function(req, res) {

      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/ico');
      res.end();

    });

    //Lets start our server
    server.listen(0, function(){

      var PORT = server.address().port;

      payload = passmarked.createPayload({

        url: 'http://localhost:' + PORT + '/favicon.ico'

      }, {}, null);

      // execute the items
      testFunc(payload, function(err) {

        // check the error
        if(err) assert.fail('Got a error from the function');

        // get the rules
        var rules = payload.getRules();

        // should have one rule
        var rule = _.find(rules || [], function(item) { return item.key === 'favicon.exists'; });

        if(!rule) assert.fail('Did not receive a rule while we were waiting for it');

        // done
        server.close();

        // done
        done();

      });

    });

  });

  // handle the error output
  it('Should return a error if the provided favicon is too big', function(done) {

    //Create a server
    var server = http.createServer(function(req, res) {

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/ico');
      request({
          url: 'http://static.passmarked.com/logo256.png'
      }).on('error', function(e) {
          res.end(e);
      }).pipe(res);

    });

    //Lets start our server
    server.listen(0, function(){

      var PORT = server.address().port;

      payload = passmarked.createPayload({

        url: 'http://localhost:' + PORT + '/favicon.ico'

      }, {}, null);

      // execute the items
      testFunc(payload, function(err) {

        // check the error
        if(err) assert.fail('Got a error from the function');

        // get the rules
        var rules = payload.getRules();

        // should have one rule
        var rule = _.find(rules || [], function(item) { return item.key === 'favicon.size'; });

        if(!rule) assert.fail('Did not receive a error about file size');

        // done
        server.close();

        // done
        done();

      });

    });

  });

  // handle the error output
  it('Should not return a error if the provided favicon is nice and small', function(done) {

    //Create a server
    var server = http.createServer(function(req, res) {

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/ico');
      request({
          url: 'http://static.passmarked.com/logo32.png'
      }).on('error', function(e) {
          res.end(e);
      }).pipe(res);

    });

    //Lets start our server
    server.listen(0, function(){

      var PORT = server.address().port;

      payload = passmarked.createPayload({

        url: 'http://localhost:' + PORT + '/favicon.ico'

      }, {}, null);

      // execute the items
      testFunc(payload, function(err) {

        // check the error
        if(err) assert.fail('Got a error from the function');

        // get the rules
        var rules = payload.getRules();

        // should have one rule
        var rule = _.find(rules || [], function(item) { return item.key === 'favicon.size'; });

        if(rule) assert.fail('Should not receive issue about file size ... ?');

        // done
        server.close();

        // done
        done();

      });

    });

  });

  // handle the error output
  /* it('Should return a error if the favicon tries to redirect away', function(done) {

    //Create a server
    var server = http.createServer(function(req, res) {

      res.statusCode = 302;
      res.setHeader('Location', 'http://localhost:8080/favicon2.ico');
      res.setHeader('Content-Type', 'application/ico');
      res.end('');

    });

    //Lets start our server
    server.listen(0, function(){

      var PORT = server.address().port;

      payload = passmarked.createPayload({

        url: 'http://localhost:' + PORT + '/favicon.ico'

      }, {}, null);

      // execute the items
      testFunc(payload, function(err) {

        // check the error
        if(err) assert.fail('Got a error from the function');

        // get the rules
        var rules = payload.getRules();

        // should have one rule
        var rule = _.find(rules || [], function(item) { return item.key === 'favicon.redirect'; });

        // failed the rule
        if(!rule) assert.fail('Did not receive a rule for the redirected favicon.ico');

        // done
        server.close();

        // done
        done();

      });

    });

  }); */

  // handle the error output
  it('Should not return a error if favicon is present with a 200 status code', function(done) {

    //Create a server
    var server = http.createServer(function(req, res) {

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/ico');
      res.end();

    });

    //Lets start our server
    server.listen(0, function(){

      var PORT = server.address().port;

      payload = passmarked.createPayload({

        url: 'http://localhost:' + PORT + '/favicon.ico'

      }, {}, null);

      // execute the items
      testFunc(payload, function(err) {

        // check the error
        if(err) assert.fail('Got a error from the function');

        // get the rules
        var rules = payload.getRules();

        // should have one rule
        var rule = _.find(rules || [], function(item) { return item.key === 'favicon.redirect'; });

        if(rule) assert.fail('Should not receive the rule');

        // done
        server.close();

        // done
        done();

      });

    });

  });

});
