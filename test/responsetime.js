// modules
const assert        = require('assert');
const _             = require('underscore');
const passmarked        = require('passmarked');
const testFunc      = require('../lib/rules/responsetime');

// checks warnings that we check for
describe('response times', function() {

  // handle the error output
  it('Should not return anything if the HAR is empty', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      }, { log: { entries: [] } }, '<p>test</p>');

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // check for a error
      if(rules.length > 0) assert.fail('Was not expecting a rule ...');

      // done
      done();

    });

  });

  // handle the error output
  it('Should not return anything if the content is empty', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      }, {}, '');

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // check for a error
      if(rules.length > 0) assert.fail('Was not expecting a rule ...');

      // done
      done();

    });

  });

  // handle the error output
  it('Should not return anything if the content is null', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      }, {}, null);

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // check for a error
      if(rules.length > 0) assert.fail('Was not expecting a rule ...');

      // done
      done();

    });

  });

  // handle the error output
  it('Should not return a error if the page was < 1s', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      }, require('../samples/responsetime.fast.json'), '<p>test</p>');

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // check for a error
      if(rules.length > 0) assert.fail('Was not expecting a rule ...');

      // done
      done();

    });

  });

  // handle the error output
  it('Should return a error if page was >1s but <3s', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      }, require('../samples/responsetime.fast.json'), '<p>test</p>');

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'pagespeed.warn'; });

      // check if we got a rule
      if(rule) assert.fail('Was expecting a error');

      // done
      done();

    });

  });

  // handle the error output
  it('Should return a error if page was >3s', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      }, require('../samples/responsetime.fast.json'), '<p>test</p>');

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'pagespeed.slow'; });

      // check if we got a rule
      if(rule) assert.fail('Was expecting a error');

      // done
      done();

    });

  });

});
