// load modules
const _             = require('underscore');
const S             = require('string');
const url           = require('url');
const async         = require('async');
const childProcess  = require('child_process');

// compile regex variable for us to use
var alpnRegex = new RegExp(/alpn\s+protocol\:\s+(.*)/gim);

// handle checking for the cache
module.exports = exports = function(payload, fn) {

  // get the data
  var data      = payload.getData();

  // parse the url
  var uri       = url.parse(data.redirected || data.url);

  // build the commands to send
  var args      = [ 

    'echo', 
    'QUIT', 
    '|', 
    '/usr/local/ssl/bin/openssl', // default install for our compiled version
    's_client', 
    '-connect', 
    uri.host + ':' + (uri.port || 443), 
    '-alpn', 
    'h2'

  ];

  // debugging
  payload.debug('Running command: ' + args.join(' '));

  // execute the actual process
  childProcess.exec(args.join(' '), {
  }, function(err, stdout, stderr) {

    // check for a error ?
    if(err) {

      // debugging
      payload.error('Something went wrong while trying to run OPENSSL', err);

    }

    // generate one big output
    var output = (stdout || '').toString() + 
                  '\n' + 
                    (stderr || '').toString();

    // the protocol we were able to negotiate
    var protocol = null;

    try {

      // try to pull out the ALPN result
      var results = alpnRegex.exec(output);

      // check if we got a result ?
      if(results && results.length > 1) {

        // set the actual protocol
        protocol = S(results[1] || '').slugify().s;

      }

    } catch(err) { /** nothing to see here folks **/ }

    // If not set to h2 it was not renegotiated
    if(protocol !== null && protocol !== 'h2') {

      // add the rule
      payload.addRule({

        message:          'Unable to negotiate using ALPN',
        key:              'alpn',
        type:             'notice'

      })

    }

    // done
    fn(null);

  });

};
