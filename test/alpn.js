// modules
const assert        = require('assert');
const _             = require('underscore');
const passmarked        = require('passmarked');
const fs            = require('fs');
const testFunc      = require('../lib/rules/alpn');

// checks warnings that we check for
describe('alpn', function() {

  // handle the error output
  it('Should not return a error if the server has ALPN enabled', function(done) {

    payload = passmarked.createPayload({

        url: 'https://www.google.com'

      }, {}, null);

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'alpn'; });

      // check for a error
      if(rule) assert.fail('Was not expecting a error');

      // done
      done();

    });

  });

  // handle the error output
  it('Should return a error if the server does not have ALPN enabled', function(done) {

    this.timeout(8000);

    payload = passmarked.createPayload({

        url: 'https://example2.com/'

      }, {}, null);

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'alpn'; });

      // check for a error
      if(!rule) assert.fail('Was expecting a error');

      // done
      done();

    });

  });

});
