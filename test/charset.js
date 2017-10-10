// modules
const assert        = require('assert');
const _             = require('underscore');
const passmarked        = require('passmarked');
const testFunc      = require('../lib/rules/charset');

// checks warnings that we check for
describe('charset', function() {

  // handle the error output
  it('Should return a error if the charset is missing from the HAR', function(done) {

    payload = passmarked.createPayload({

        url: 'http://jacqueskleynhans.com'

      }, require('../samples/charset.missing.json'), null);

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'charset'; });

      if(!rule) assert.fail('Did not receive a rule while we were waiting for it');

      // done
      done();

    });

  });

  // handle the error output
  it('Should return a error if the content-type is not correct [text/html,charset=utf8]', function(done) {

    payload = passmarked.createPayload({

        url: 'http://jacqueskleynhans.com'

      }, require('../samples/charset.wrong.json'), null);

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'charset'; });

      if(!rule) assert.fail('Did not receive a rule while we were waiting for it');

      // done
      done();

    });

  });

  // handle the error output
  it('Should not return a error if the charset was not set on a != 200 response', function(done) {

    payload = passmarked.createPayload({

        url: 'http://jacqueskleynhans.com'

      }, require('../samples/charset.status.json'), null);

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'charset'; });

      if(rule) assert.fail('Was not expecting a error');

      // done
      done();

    });

  });

  // handle the error output
  it('Should not return a error if the charset was set [text/html,charset=utf-8]', function(done) {

    payload = passmarked.createPayload({

        url: 'http://jacqueskleynhans.com'

      }, require('../samples/charset.good.json'), null);

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'charset'; });

      if(rule) assert.fail('Was not expecting a error');

      // done
      done();

    });

  });

});
