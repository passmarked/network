// modules
const assert              = require('assert');
const _                   = require('underscore');
const passmarked          = require('passmarked');
const testFunc            = require('../lib/rules/http2');
const path                = require('path');
const fs                  = require('fs');

const HTTP2Server         = require(path.join(__dirname, 'utils', 'http2.server'));
const HTTP2NoPushServer   = require(path.join(__dirname, 'utils', 'http2.nopush.server'));
const HTTPServer          = require(path.join(__dirname, 'utils', 'http1.server'));

// checks warnings that we check for
describe('http2', function() {

  // handle the error output
  it('Should not return anything if the HAR is empty', function(done) {

    payload = passmarked.createPayload({

        url: 'https://example.com'

      }, {}, '');

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'charset'; });

      // check for a error
      if(rule) assert.fail('Was not expecting a rule ...');

      // done
      done();

    });

  });

  // handle the error output
  it('Should not return anything if the given page content is null', function(done) {

    payload = passmarked.createPayload({

        url: 'https://example.com'

      }, { log: { entries: [] } }, null);

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the test');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'expire.internal'; });

      // check for a error
      if(rule) assert.fail('No rule should be given');

      // done
      done();

    });

  });

  // handle the error output
  it('Should return a error if protocol was not 2.x', function(done) {

    // start the server to query
    var server = HTTPServer();

    // listen on random port
    server.listen(0, function() {

      // get the port for the redirect
      var randomAssignedPort = server.address().port;

      payload = passmarked.createPayload({

          url: 'https://localhost:' + randomAssignedPort

        }, 
        { log: { entries: [] } }, 
        fs.readFileSync(path.join(__dirname, '/www/index.html'))

      );

      // execute the items
      testFunc(payload, function(err) {

        // check the error
        if(err) assert.fail('Got a error from the test');

        // get the rules
        var rules = payload.getRules();

        // should have one rule
        var rule = _.find(rules || [], function(item) { return item.key === 'h2'; });

        // check for a error
        if(!rule) assert.fail('Was expecting a rule');

        // done
        server.close();

        // done
        done();

      });

    });

  });

  // handle the error output
  it('Should not return a error if protocol was 2.x', function(done) {

    // start the server to query
    var server = HTTP2Server();

    // listen on random port
    server.listen(0, function() {

      // get the port for the redirect
      var randomAssignedPort = server.address().port;

      payload = passmarked.createPayload({

          url: 'https://localhost:' + randomAssignedPort

        }, 
        { log: { entries: [] } }, 
        fs.readFileSync(path.join(__dirname, '/www/index.html'))

      );

      // execute the items
      testFunc(payload, function(err) {

        // check the error
        if(err) assert.fail('Got a error from the test');

        // get the rules
        var rules = payload.getRules();

        // should have one rule
        var rule = _.find(rules || [], function(item) { return item.key === 'h2'; });

        // check for a error
        if(rule) assert.fail('Was not expecting a rule');

        // done
        server.close();

        // done
        done();

      });

    });

  });

  // handle the error output
  it('Should return a error if our blocking static elements were not pushed', function(done) {

    // start the server to query
    var server = HTTP2NoPushServer();

    // listen on random port
    server.listen(0, function() {

      // get the port for the redirect
      var randomAssignedPort = server.address().port;

      payload = passmarked.createPayload({

          url: 'https://localhost:' + randomAssignedPort

        }, 
        { log: { entries: [] } }, 
        fs.readFileSync(path.join(__dirname, '/www/index.html'))

      );

      // execute the items
      testFunc(payload, function(err) {

        // check the error
        if(err) assert.fail('Got a error from the test');

        // get the rules
        var rules = payload.getRules();

        // should have one rule
        var rule = _.find(rules || [], function(item) { return item.key === 'h2.push'; });

        // check for a error
        if(!rule) assert.fail('Was expecting a rule');

        // done
        server.close();

        // done
        done();

      });

    });

  });

  // handle the error output
  it('Should not return a error if our blocking static elements were pushed', function(done) {

    // start the server to query
    var server = HTTP2Server();

    // listen on random port
    server.listen(0, function() {

      // get the port for the redirect
      var randomAssignedPort = server.address().port;

      payload = passmarked.createPayload({

          url: 'https://localhost:' + randomAssignedPort

        }, 
        { log: { entries: [] } }, 
        fs.readFileSync(path.join(__dirname, '/www/index.html'))

      );

      // execute the items
      testFunc(payload, function(err) {

        // check the error
        if(err) assert.fail('Got a error from the test');

        // get the rules
        var rules = payload.getRules();

        // should have one rule
        var rule = _.find(rules || [], function(item) { return item.key === 'h2.push'; });

        // check for a error
        if(rule) assert.fail('Was not expecting a rule');

        // done
        server.close();

        // done
        done();

      });

    });

  });

  // handle the error output
  it('Should not return a error if blocking resource is external and not pushed', function(done) {

    // start the server to query
    var server = HTTP2Server();

    // listen on random port
    server.listen(0, function() {

      // get the port for the redirect
      var randomAssignedPort = server.address().port;

      payload = passmarked.createPayload({

          url: 'https://localhost:' + randomAssignedPort

        }, 
        { log: { entries: [] } }, 
        fs.readFileSync(path.join(__dirname, '/www/external.index.html'))

      );

      // execute the items
      testFunc(payload, function(err) {

        // check the error
        if(err) assert.fail('Got a error from the test');

        // get the rules
        var rules = payload.getRules();

        // should have one rule
        var rule = _.find(rules || [], function(item) { return item.key === 'h2.push'; });

        // check for a error
        if(rule) assert.fail('Was not expecting a rule');

        // done
        server.close();

        // done
        done();

      });

    });

  });

});
