// modules
const assert        = require('assert');
const _             = require('underscore');
const passmarked        = require('passmarked');
const testFunc      = require('../lib/rules/gzip');

// checks warnings that we check for
describe('gzip', function() {

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

  describe('internal', function() {

    // handle the error output
    it('Should not return a error if the [internal] resources were gzipped', function(done) {

      payload = passmarked.createPayload({

          url: 'http://example.com'

        }, require('../samples/gzip.internal.good.json'), '<p>test</p>');

      // execute the items
      testFunc(payload, function(err) {

        // check the error
        if(err) assert.fail('Got a error from the function');

        // get the rules
        var rules = payload.getRules();

        // should have one rule
        var rule = _.find(rules || [], function(item) { return item.key === 'gzip.internal'; });

        if(rule) assert.fail('Was not expecting a error');

        // done
        done();

      });

    });

    // handle the error output
    it('Should not return a error if gzipping the [internal] content would have saved less than 10%', function(done) {

      payload = passmarked.createPayload({

          url: 'http://example.com'

        }, require('../samples/gzip.internal.size.json'), '<p>test</p>');

      // execute the items
      testFunc(payload, function(err) {

        // check the error
        if(err) assert.fail('Got a error from the function');

        // get the rules
        var rules = payload.getRules();

        // should have one rule
        var rule = _.find(rules || [], function(item) { return item.key === 'gzip.internal'; });

        if(rule) assert.fail('Was not expecting a error');

        // done
        done();

      });

    });

    // handle the error output
    it('Should return a error if gzipping the [internal] content could save more 10%', function(done) {

      payload = passmarked.createPayload({

          url: 'http://example.com'

        }, require('../samples/gzip.internal.bad.json'), '<p>test</p>');

      // execute the items
      testFunc(payload, function(err) {

        // check the error
        if(err) assert.fail('Got a error from the function');

        // get the rules
        var rules = payload.getRules();

        // should have one rule
        var rule = _.find(rules || [], function(item) { return item.key === 'gzip.internal'; });

        if(!rule) assert.fail('Was expecting a error');

        // done
        done();

      });

    });

  });

  describe('alias', function() {

    // handle the error output
    it('Should not return a error if the [internal] resources were gzipped, even if on subdomain of same domain', function(done) {

      payload = passmarked.createPayload({

          url: 'http://example.com'

        }, require('../samples/gzip.alias.good.json'), '<p>test</p>');

      // execute the items
      testFunc(payload, function(err) {

        // check the error
        if(err) assert.fail('Got a error from the function');

        // get the rules
        var rules = payload.getRules();

        // should have one rule
        var rule = _.find(rules || [], function(item) { return item.key === 'gzip.internal'; });

        if(rule) assert.fail('Was not expecting a error');

        // done
        done();

      });

    });

    // handle the error output
    it('Should not return a error if gzipping the [internal] content would have saved less than 10%, even if on subdomain of same domain', function(done) {

      payload = passmarked.createPayload({

          url: 'http://example.com'

        }, require('../samples/gzip.alias.size.json'), '<p>test</p>');

      // execute the items
      testFunc(payload, function(err) {

        // check the error
        if(err) assert.fail('Got a error from the function');

        // get the rules
        var rules = payload.getRules();

        // should have one rule
        var rule = _.find(rules || [], function(item) { return item.key === 'gzip.internal'; });

        if(rule) assert.fail('Was not expecting a error');

        // done
        done();

      });

    });

    // handle the error output
    it('Should return a error if gzipping the [internal] content could save more 10%, even if on subdomain of same domain', function(done) {

      payload = passmarked.createPayload({

          url: 'http://example.com'

        }, require('../samples/gzip.alias.bad.json'), '<p>test</p>');

      // execute the items
      testFunc(payload, function(err) {

        // check the error
        if(err) assert.fail('Got a error from the function');

        // get the rules
        var rules = payload.getRules();

        // should have one rule
        var rule = _.find(rules || [], function(item) { return item.key === 'gzip.internal'; });

        if(!rule) assert.fail('Was expecting a error');

        // done
        done();

      });

    });

  });

  describe('external', function() {

    // handle the error output
    it('Should not return a error if the [external] resources were gzipped', function(done) {

      payload = passmarked.createPayload({

          url: 'http://example.com'

        }, require('../samples/gzip.external.good.json'), '<p>test</p>');

      // execute the items
      testFunc(payload, function(err) {

        // check the error
        if(err) assert.fail('Got a error from the function');

        // get the rules
        var rules = payload.getRules();

        // should have one rule
        var rule = _.find(rules || [], function(item) { return item.key === 'gzip.external'; });

        if(rule) assert.fail('Was not expecting a error');

        // done
        done();

      });

    });

    // handle the error output
    it('Should not return a error if gzipping the [external] content would have saved less than 10%', function(done) {

      payload = passmarked.createPayload({

          url: 'http://example.com'

        }, require('../samples/gzip.external.size.json'), '<p>test</p>');

      // execute the items
      testFunc(payload, function(err) {

        // check the error
        if(err) assert.fail('Got a error from the function');

        // get the rules
        var rules = payload.getRules();

        // should have one rule
        var rule = _.find(rules || [], function(item) { return item.key === 'gzip.external'; });

        if(rule) assert.fail('Was not expecting a error');

        // done
        done();

      });

    });

    // handle the error output
    it('Should return a error if gzipping the [external] content could save more 10%', function(done) {

      payload = passmarked.createPayload({

          url: 'http://example.com'

        }, require('../samples/gzip.external.bad.json'), '<p>test</p>');

      // execute the items
      testFunc(payload, function(err) {

        // check the error
        if(err) assert.fail('Got a error from the function');

        // get the rules
        var rules = payload.getRules();

        // should have one rule
        var rule = _.find(rules || [], function(item) { return item.key === 'gzip.external'; });

        if(!rule) assert.fail('Was expecting a error');

        // done
        done();

      });

    });

  });

});
