// modules
const assert        = require('assert');
const _             = require('underscore');
const passmarked        = require('passmarked');
const testFunc      = require('../lib/rules/consistent');

// checks warnings that we check for
describe('consistent', function() {

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
      var rule = _.find(rules || [], function(item) { return item.key === 'consistent'; });

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
      var rule = _.find(rules || [], function(item) { return item.key === 'consistent'; });

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
      var rule = _.find(rules || [], function(item) { return item.key === 'consistent'; });

      // check for a error
      if(rule) assert.fail('Was not expecting a rule ...');

      // done
      done();

    });

  });

  // handle the error output
  it('Should return a error if 2 urls supplied to the same image but on different domains', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      }, require('../samples/consistent.bad.json'), '<p>test</p>');

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'consistent'; });

      // check for a error
      if(!rule) assert.fail('Was expecting a rule ...');

      // done
      done();

    });

  });

  // handle the error output
  it('Should return no errors if we are using the same hostname and path', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      }, require('../samples/consistent.multiple.json'), '<p>test</p>');

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'consistent'; });

      // check for a error
      if(rule) assert.fail('Was not expecting a rule ...');

      // done
      done();

    });

  });

  // handle the error output
  it('Should return no errors if the resource was called a single time', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      }, require('../samples/consistent.ok.json'), '<p>test</p>');

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'consistent'; });

      // check for a error
      if(rule) assert.fail('Was not expecting a rule ...');

      // done
      done();

    });

  });

});
