// modules
const assert        = require('assert');
const _             = require('underscore');
const passmarked        = require('passmarked');
const testFunc      = require('../lib/rules/bad');

// checks warnings that we check for
describe('bad requests', function() {

  // handle the error output
  it('Should return a error if 404 present in HAR', function(done) {

    payload = passmarked.createPayload({

        url: 'http://jacqueskleynhans.com'

      }, require('../samples/badrequests.bad.404.json'), null);

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'bad'; });

      if(!rule) assert.fail('Did not receive a rule while we were waiting for it');

      // done
      done();

    });

  });

  // handle the error output
  it('Should return a error if 502 present in HAR', function(done) {

    payload = passmarked.createPayload({

        url: 'http://jacqueskleynhans.com'

      }, require('../samples/badrequests.bad.502.json'), null);

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'bad'; });

      if(!rule) assert.fail('Did not receive a rule while we were waiting for it');

      // done
      done();

    });

  });

  // handle the error output
  it('Should not return a error if 200 in HAR', function(done) {

    payload = passmarked.createPayload({

        url: 'http://jacqueskleynhans.com'

      }, require('../samples/badrequests.good.json'), null);

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'bad'; });

      if(rule) assert.fail('Was not expecting a error');

      // done
      done();

    });

  });

});
