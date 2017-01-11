// modules
const assert        = require('assert');
const _             = require('underscore');
const passmarked        = require('passmarked');
const testFunc      = require('../lib/rules/cache');

// checks warnings that we check for
describe('cache', function() {

  // handle the error output
  it('Should not return anything if the HAR is empty', function(done) {

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
      var rule = _.find(rules || [], function(item) { return item.key === 'charset'; });

      // check for a error
      if(rule) assert.fail('Was not expecting a rule ...');

      // done
      done();

    });

  });

  // handle the error output
  it('Should not return anything if the given page content is null', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      }, require('../samples/cache.local.expire.json'), null);

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the test');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'expire.internal'; });

      // check for a error
      if(rule) assert.fail('No rule should be given');

      // done
      done();

    });

  });

  // handle the error output
  it('Should not return anything if the given page content is blank', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      }, require('../samples/cache.local.expire.json'), '');

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the test');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'expire.internal'; });

      // check for a error
      if(rule) assert.fail('No rule should be given');

      // done
      done();

    });

  });

  // handle the error output
  it('If the maxage is less than 2 days on local assets show a error only if origin matches', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example2.com'

      }, require('../samples/cache.local.expire.json'), '<p>test</p>');

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the test');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'expire.internal'; });

      // check for a error
      if(rule) assert.fail('Origin does not match, should not get the error');

      // done
      done();

    });

  });

  // handle the error output
  it('If the max age is more than 2 days but on seperate domain should not produce a error', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example2.com'

      }, require('../samples/cache.local.expire.json'), '<p>test</p>');

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the test');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'expire.internal'; });

      // check for a error
      if(rule) assert.fail('Should not have returned this rule');

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'expire.external'; });

      // check for a error
      if(!rule) assert.fail('Was expecting a external rule');

      // done
      done();

    });

  });

  // handle the error output
  it('If the max age is more than 2 days it should not produce a error', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      }, require('../samples/cache.local.expire.json'), '<p>test</p>');

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the test');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'expire.internal'; });

      // check for a error
      if(!rule) assert.fail('Was expecting a rule but not given one');

      // done
      done();

    });

  });

  // handle the error output
  it('If the maxage is less than 2 days on local assets show a error', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      }, require('../samples/cache.local.expire.json'), '<p>test</p>');

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the test');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'expire.internal'; });

      // check for a error
      if(!rule) assert.fail('Was expecting a rule but not given one');

      // done
      done();

    });

  });

  // handle the error output
  it('Should not return a error if external resource has a max-age of more than 6 hours', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      }, require('../samples/cache.external.ok.json'), '<p>test</p>');

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the test');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'expire.external'; });

      // check for a error
      if(rule) assert.fail('Should not have gotten a error from the function');

      // done
      done();

    });

  });

  // handle the error output
  it('Should return a error if external resource has a max-age 0', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      }, require('../samples/cache.external.zero.json'), '<p>test</p>');

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the test');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'expire.external'; });

      // check for a error
      if(rule) assert.fail('Was not expecting a error for less than 6 hours');

      // done
      done();

    });

  });

  // handle the error output
  it('Should return a error if external resource has a max-age of less than 6 hours', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      }, require('../samples/cache.external.expire.json'), '<p>test</p>');

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the test');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'expire.external'; });

      // check for a error
      if(!rule) assert.fail('Was expecting a error for less than 6 hours');

      // done
      done();

    });

  });

  // handle the error output
  it('Should return a error if the external resource does not have a cache-control', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      }, require('../samples/cache.local.missing.json'), '<p>test</p>');

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the test');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'cache.internal'; });

      // check for a error
      if(!rule) assert.fail('Was expecting a rule but not given one');

      // done
      done();

    });

  });

  // handle the error output
  it('If cache-control was not given locally, give a error', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      }, require('../samples/cache.local.missing.json'), '<p>test</p>');

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the test');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'cache.internal'; });

      // check for a error
      if(!rule) assert.fail('Was expecting a rule but not given one');

      // done
      done();

    });

  });

  // handle the error output
  it('Local missing cache headers should only be shown when the origin does not match', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      }, require('../samples/cache.local.origin.json'), '<p>test</p>');

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the test');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'cache.internal'; });

      // check for a error
      if(rule) assert.fail('Rule should not be given');

      // done
      done();

    });

  });

  // handle the error output
  it('Should not return a issue if the cache-control missing but on a untracked type', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      }, require('../samples/cache.external.type.json'), '<p>test</p>');

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the test');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'cache.external'; });

      // check for a error
      if(rule) assert.fail('Rule should not be given');

      // done
      done();

    });

  });

  // handle the error output
  it('Should not return a issue if the cache-control missing but on a untracked type', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      }, require('../samples/cache.local.type.json'), '<p>test</p>');

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the test');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'cache.internal'; });

      // check for a error
      if(rule) assert.fail('Rule should not be given');

      // done
      done();

    });

  });

  // handle the error output
  it('Should not return a error if explicitly set on internal resource', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      }, require('../samples/cache.local.invalidate.json'), '<p>test</p>');

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the test');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'cache.internal'; });

      // check for a error
      if(rule) assert.fail('Rule should not be given');

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'expire.internal'; });

      // check for a error
      if(rule) assert.fail('Rule should not be given');

      // done
      done();

    });

  });

  // handle the error output
  it('Should not return a error if explicitly set on external resource', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      }, require('../samples/cache.external.invalidate.json'), '<p>test</p>');

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the test');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'cache.external'; });

      // check for a error
      if(rule) assert.fail('Rule should not be given');

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'expire.external'; });

      // check for a error
      if(rule) assert.fail('Rule should not be given');

      // done
      done();

    });

  });

});
