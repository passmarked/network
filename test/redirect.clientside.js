// modules
const assert        = require('assert');
const _             = require('underscore');
const passmarked    = require('passmarked');
const testFunc      = require('../lib/rules/redirect');
const fs            = require('fs');

// checks warnings that we check for
describe('redirect.clientside', function() {

  // handle the error output
  it('Should not trigger a error if no client side redirects are found', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com/',
        documents:  [

          {

            url:    'http://example.com',
            type:   'server'

          }

        ]

      }, {}, null);

    // execute the items
    testFunc(payload, function(err) {

      // did we get a error
      if(err) assert.fail('Got a JS error from the rule');

      // get the rules
      var rules = payload.getRules();

      // check for a error
      var rule = _.find(rules, function(rule) { return rule.key == 'redirect.clientside' });

      if(rule) assert.fail('Was not expecting a error');

      // done
      done();

    });

  });

  // handle the error output
  it('Should not trigger a error if the client-side "redirect" did not cause a server request', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com/testing',
        documents:  [

          {

            url:    'http://example.com',
            type:   'server'

          },
          {

            url:    'http://example.com/testing',
            type:   'client'

          }

        ]

      }, {}, null);

    // execute the items
    testFunc(payload, function(err) {

      // did we get a error
      if(err) assert.fail('Got a JS error from the rule');

      // get the rules
      var rules = payload.getRules();

      // check for a error
      var rule = _.find(rules, function(rule) { return rule.key == 'redirect.clientside' });

      if(rule) assert.fail('Was not expecting a error');

      // done
      done();

    });

  });

  // handle the error output
  it('Should trigger a warning if a client-side redirect that caused a hit is found', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com/testing',
        documents:  [

          {

            url:    'http://example.com',
            type:   'server'

          },
          {

            url:    'http://example.com/testing',
            type:   'client'

          },
          {

            url:    'http://example.com/testing',
            type:   'server'

          }

        ]

      }, {}, null);

    // execute the items
    testFunc(payload, function(err) {

      // did we get a error
      if(err) assert.fail('Got a JS error from the rule');

      // get the rules
      var rules = payload.getRules();

      // check for a error
      var rule = _.find(rules, function(rule) { return rule.key == 'redirect.clientside' });

      if(!rule) assert.fail('Was expecting a error');

      // done
      done();

    });

  });

});
