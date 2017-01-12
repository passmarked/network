// modules
const assert        = require('assert');
const _             = require('underscore');
const passmarked    = require('passmarked');
const fs            = require('fs');
const testFunc      = require('../lib/rules/whitespace');

// checks warnings that we check for
describe('whitespace', function() {

  // handle the error output
  it('Should just run if page content was null', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      }, require('../samples/html.min.blank.json'), null);

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // done
      done();

    });

  });

  // handle the error output
  it('Should just run if page content was blank', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      }, require('../samples/html.min.blank.json'), '');

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // done
      done();

    });

  });

  // handle the error output
  it('Should return a error if not minified', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      },
      {

        log: {

          entries: [

            {

              request:  {},
              response: {

                status: 200,
                headers: [

                  {

                    name: 'content-type',
                    value:  'text/html'

                  }

                ],
                content: {

                  text: fs.readFileSync('./samples/html.bad.html').toString()

                }

              }

            }

          ]

        }

      }, fs.readFileSync('./samples/html.bad.html').toString());

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'whitespace'; });

      if(!rule) assert.fail('Should have returned a error as the HTML was not minified');

      // done
      done();

    });

  });

  // handle the error output
  it('Should not return a error if already minified', function(done) {

    payload = passmarked.createPayload({

        url: 'http://example.com'

      }, require('../samples/html.min.good.json'), fs.readFileSync('./samples/html.good.html').toString());

    // execute the items
    testFunc(payload, function(err) {

      // check the error
      if(err) assert.fail('Got a error from the function');

      // get the rules
      var rules = payload.getRules();

      // should have one rule
      var rule = _.find(rules || [], function(item) { return item.key === 'whitespace'; });

      if(rule) assert.fail('Was not expecting a error');

      // done
      done();

    });

  });

});
