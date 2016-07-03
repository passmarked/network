// modules
const assert        = require('assert');
const _             = require('underscore');
const passmarked        = require('passmarked');
const testFunc      = require('../lib/rules/gzip.images');

// checks warnings that we check for
describe('gzip images', function() {

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
      var rule = _.find(rules || [], function(item) { return item.key === 'compress.images'; });

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
      var rule = _.find(rules || [], function(item) { return item.key === 'compress.images'; });

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
      var rule = _.find(rules || [], function(item) { return item.key === 'compress.images'; });

      // check for a error
      if(rule) assert.fail('Was not expecting a rule ...');

      // done
      done();

    });

  });

  // handle the error output
  it('Should return a error if using GZIP on image', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      }, require('../samples/gzip.images.gzip.json'), '<p>test</p>');

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'compress.images'; });

      if(!rule) assert.fail('Was expecting a error');

      // done
      done();

    });

  });

  // handle the error output
  it('Should return a error if using COMPRESS on image', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      }, require('../samples/gzip.images.compress.json'), '<p>test</p>');

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'compress.images'; });

      if(!rule) assert.fail('Was expecting a error');

      // done
      done();

    });

  });

  // handle the error output
  it('Should return a error if using DEFLATE on image', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      }, require('../samples/gzip.images.deflate.json'), '<p>test</p>');

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'compress.images'; });

      if(!rule) assert.fail('Was expecting a error');

      // done
      done();

    });

  });

  // handle the error output
  it('Should return a error if using IDENTITY on image', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      }, require('../samples/gzip.images.identity.json'), '<p>test</p>');

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'compress.images'; });

      if(!rule) assert.fail('Was expecting a error');

      // done
      done();

    });

  });

  // handle the error output
  it('Should return a error if using BR on image', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      }, require('../samples/gzip.images.br.json'), '<p>test</p>');

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'compress.images'; });

      if(!rule) assert.fail('Was expecting a error');

      // done
      done();

    });

  });

  // handle the error output
  it('Should not return error if image is not using compression', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      }, require('../samples/gzip.images.ok.json'), '<p>test</p>');

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'compress.images'; });

      if(rule) assert.fail('Was not expecting a error');

      // done
      done();

    });

  });

  // handle the error output
  it('Should not return a error if type other than image has GZIP enabled', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      }, require('../samples/gzip.images.type.json'), '<p>test</p>');

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'compress.images'; });

      if(rule) assert.fail('Was not expecting a error');

      // done
      done();

    });

  });

  // handle the error output
  it('Should not return a error if the image is on a different domain', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example2.com'

      }, require('../samples/gzip.images.gzip.json'), '<p>test</p>');

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'compress.images'; });

      if(rule) assert.fail('Should not have been given a error ...');

      // done
      done();

    });

  });


});
