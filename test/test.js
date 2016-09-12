// modules
const assert        = require('assert');
const _             = require('underscore');
const passmarked    = require('passmarked');

// checks warnings that we check for
describe('worker', function() {

  // handle the error output
  it('Load in all the rules and no error should be thrown', function(done) {

    // try to load all the rules
    require('../lib/rules');

    // done
    done();

  });

});
