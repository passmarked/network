// modules
const assert        = require('assert');
const _             = require('underscore');
const passmarked        = require('passmarked');
const testFunc      = require('../lib/rules/ipv6');

// checks warnings that we check for
describe('ipv6', function() {

  /**

  // handle the error output
  it('Should not return a error if a resource has a ipv6 record present and pingable', function(done) {

    payload = passmarked.createPayload({

        url: 'https://localhost'

      }, {}, null);

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'ipv6'; });

      if(rule) assert.fail('Was not expecting a rule to return: ' + JSON.stringify(rule));

      // done
      done();

    });

  });

  // handle the error output
  it('Should return a error if the resource does not have a ipv6 record present', function(done) {

    payload = passmarked.createPayload({

        url: 'https://localhost' + new Date().getTime()

      }, {}, null);

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'ipv6'; });

      if(!rule) assert.fail('Did not receive a rule while we were waiting for it');

      // done
      done();

    });

  });

  // handle the error output
  it('Should return a error if the configured IP could not be pinged', function(done) {

    this.timeout(5000); 

    payload = passmarked.createPayload({

        url:        'https://localhost',
        testingIP:  '192.168.121.134'

      }, {}, null);

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'ipv6.ping'; });

      if(!rule) assert.fail('Did not receive a rule while we were waiting for it');

      // done
      done();

    });

  });

  // handle the error output
  it('Should not return a error if the target was already a IPv4 address', function(done) {
    
    payload = passmarked.createPayload({

        url:        'http://192.168.0.1'

      }, {}, null);

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // asset that we got no rules
      if(rules.length > 0) assert.fail('Should not have received any rules');

      // done
      done();

    });

  });

  // handle the error output
  it('Should not return a error if the target was already a IPv6 address', function(done) {

    payload = passmarked.createPayload({

        url:        'http://::1'

      }, {}, null);

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // asset that we got no rules
      if(rules.length > 0) assert.fail('Should not have received any rules');

      // done
      done();

    });

  });

  ***/

});
