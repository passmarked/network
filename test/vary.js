// modules
const assert        = require('assert');
const _             = require('underscore');
const passmarked        = require('passmarked');
const testFunc      = require('../lib/rules/vary');

// checks warnings that we check for
describe('vary', function() {

  // handle the error output
  it('Should not return anything if the HAR is empty', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      }, {}, '<p>test</p>');

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'vary'; });

      // check for a error
      if(rule) assert.fail('Was not expecting a rule ...');

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

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'vary'; });

      // check for a error
      if(rule) assert.fail('Was not expecting a rule ...');

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

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'vary'; });

      // check for a error
      if(rule) assert.fail('Was not expecting a rule ...');

      // done
      done();

    });

  });

  // handle the error output
  it('Should return a error if no Vary header is present', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      }, require('../samples/vary.missing.json'), '<p>test</p>');

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'vary'; });

      // check for a error
      if(!rule) assert.fail('Was expecting a rule ...');

      // done
      done();

    });

  });

  // handle the error output
  it('Should return a error if the vary header is present but does not invalid accept-encoding', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      }, require('../samples/vary.bad.json'), '<p>test</p>');

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'vary'; });

      // check for a error
      if(!rule) assert.fail('Was expecting a rule ...');

      // done
      done();

    });

  });

  // handle the error output
  it('Should not return a rule if the vary header is correct', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      }, require('../samples/vary.ok.json'), '<p>test</p>');

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'vary'; });

      // check for a error
      if(rule) assert.fail('Was not expecting a rule ...');

      // done
      done();

    });

  });

});
