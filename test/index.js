// modules
const assert      = require('assert');
const _           = require('underscore');
const fs          = require('fs');
const passmarked  = require('passmarked');

// handle the settings
describe('module', function() {

  // handle the error output
  it('Should load in the rules without a problem', function(done) {

    const rules = require('../lib');
    if(rules.length === 0) assert.fail('Problem loading rules');
    done();

  });

});