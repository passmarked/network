// modules
const assert        = require('assert');
const _             = require('underscore');
const passmarked    = require('passmarked');
const testFunc      = require('../lib/rules/redirect');
const moment        = require('moment');
const fs            = require('fs');

// checks warnings that we check for
describe('redirect.count', function() {

  // handle the error output
  it('Should not trigger a error if there are no redirects', function(done) {

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
      var rule = _.find(rules, function(rule) { return rule.key == 'redirect.count' });

      if(rule) assert.fail('Was not expecting a error');

      // done
      done();

    });

  });

  // handle the error output
  it('Should not trigger a error if there is 1 redirect', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com/testing',
        documents:  [

          {

            url:    'http://example.com',
            type:   'server'

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
      var rule = _.find(rules, function(rule) { return rule.key == 'redirect.count' });

      if(rule) assert.fail('Was not expecting a error');

      // done
      done();

    });

  });

  // handle the error output
  it('Should trigger a error if there is 2 redirects', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com/testing3',
        documents:  [

          {

            url:    'http://example.com',
            type:   'server'

          },
          {

            url:    'http://example.com/testing2',
            type:   'server'

          },
          {

            url:    'http://example.com/testing',
            type:   'server'

          },
          {

            url:    'http://example.com/testing3',
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
      var rule = _.find(rules, function(rule) { return rule.key == 'redirect.count' });

      if(!rule) assert.fail('Was expecting a error');

      // done
      done();

    });

  });

});
