// load modules
const _             = require('underscore');
const S             = require('string');
const url           = require('url');
const async         = require('async');
const childProcess  = require('child_process');
const os            = require('os');

// compile regex variable for us to use
var alpnRegex = new RegExp(/alpn\s+protocol\:\s+(.*)/gim);

// handle checking for the cache
module.exports = exports = function(payload, fn) {

  // get the data
  var data              = payload.getData();

  // parse the url
  var uri               = url.parse(data.redirected || data.url);

  // check the cache first
  payload.getCachedResults({

    key:      'alpn',
    subject:  uri.hostname,
    session:  data.session

  }, function(err, cachedResults) {

    // did I get any rules ?
    if(cachedResults) {

      // debugging
      payload.debug('alpn', 'Got ' + cachedResults.length + ' cached results so just adding those')

      // only add if there any, to save a few ms processing time
      if((cachedResults || []).length > 0) {

        // loop and add them
        for(var i = 0; i < cachedResults.length; i++) {

          // add them all
          payload.addRule(cachedResults[i]);

        }

      }

      // done
      return setImmediate(fn, null);

    }

    // the path for timeout
    var platform          = os.platform();
    var timeoutCommand    = 'timeout';

    // fallback to gtimeout on osx
    if(platform === 'linux') {

      // set to gtimeout
      timeoutCommand = 'timeout';

    } else if(platform === 'darwin') {

      // set to gtimeout
      timeoutCommand = 'gtimeout';

    } else {

      // output warning
      payload.warning('Was not able to run ALPN check, supported' + 
        ' platforms are only linux/MacOS at this time');

      // fail right here
      return fn(null);

    }

    // build the commands to send
    var args      = [ 

      'echo', 
      'QUIT', 
      '|', 
      timeoutCommand,
      '5',
      process.env.PASSMARKED_OPENSSL_PATH || '/usr/local/ssl/bin/openssl', // default install for our compiled version
      's_client', 
      '-connect', 
      uri.hostname + ':' + (uri.port || 443), 
      '-alpn', 
      'h2',
      '-servername',
      uri.hostname

    ];

    // debugging
    payload.debug('Running command: ' + args.join(' '));

    // execute the actual process
    childProcess.exec(args.join(' '), {
    }, function(err, stdout, stderr) {

      // generate one big output
      var output = (stdout || '').toString() + 
                    '\n' + 
                      (stderr || '').toString();

      // the protocol we were able to negotiate
      var protocol = null;

      try {

        // try to pull out the ALPN result
        var results = output.match(/alpn\s+protocol\:\s+(.*)/gi);

        // check if we got a result ?
        if(results && results.length > 1) {

          // set the actual protocol
          protocol = S(results[1] || '').slugify().s;

        } else if(results && results.length === 1) {

          // if it ends with the protocol
          if(S(results[0].toLowerCase()).endsWith('h2')) {

            // set the protocol
            protocol = 'h2';

          }

        }

      } catch(err) { /** nothing to see here folks **/ }

      // the rules to report :)
      var reportingRules = [];

      // If not set to h2 it was not renegotiated
      if(protocol !== 'h2') {

        // create the rule
        var ruleMeta = {

          message:  'Unable to negotiate using ALPN',
          key:      'alpn',
          type:     'notice'

        };

        // add the rule
        payload.addRule(ruleMeta);

        // add to the list
        reportingRules.push(ruleMeta);

      }

      // debugging
      payload.debug('alpn', 'Setting ' + reportingRules.length + ' in ALPN cached results so just adding those')

      // set in cache
      payload.setCachedResults({

        body:     reportingRules || [],
        key:      'alpn',
        subject:  uri.hostname,
        session:  data.session

      }, function() {

        // done
        setImmediate(fn, null);

      })

    });

  });

};
