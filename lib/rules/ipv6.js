// load modules
const _             = require('underscore');
const S             = require('string');
const url           = require('url');
const zlib          = require('zlib');
const async         = require('async');
const request       = require('request');
const dns           = require('dns');
const ping          = require ("net-ping");

// handle checking for the cache
module.exports = exports = function(payload, fn) {

  // get the data
  var data      = payload.getData();

  // parse the url
  var uri       = url.parse(data.redirected || data.url);
  var hostname  = uri.hostname || '';

  // should not be blank
  if(S(hostname || '').isEmpty() === true)
    return fn(null);

  // if the host taget is a ip, skip it
  if(
    hostname.match(/[\d]+\.[\d]+\.[\d]+\.[\d]+/gi) ||
    hostname.match(/(([a-zA-Z0-9]{1,4}|):){1,7}([a-zA-Z0-9]{1,4}|:)/gi)) {

    // done
    return fn(null);

  }

  // get the IPv6 address
  dns.resolve6(hostname, function(err, ips) {

    // override with our testing ip
    if(data.testingIP) 
      ips = [ data.testingIP ];

    // ok so was there a error ?
    if(err) {

      // was this error related to not getting data from the servers ?
      if((err || {}).code || '' === 'ENODATA') {

        // report the error
        payload.addRule({

          key:            'ipv6',
          message:        'IPv6 address was not resolved',
          type:           'notice'

        });

      } else {

        // this is a problem, but we don't want the entire
        // test to fail because one DNS query failed which
        // was only a notice too. So returning no error.

        // only log out internal error for now
        payload.error('Something went wrong while trying to resolve ipv6 address', err);

      }

      // finish exec
      return fn(null);

    }

    // Default options
    var options = {

        networkProtocol: ping.NetworkProtocol.IPv6,
        packetSize: 16,
        retries: 0,
        sessionId: (process.pid % 65535),
        timeout: 2000,
        ttl: 128

    };

    // create a "ping" session
    var session = ping.createSession (options);

    // ping all the ipv6 hosts
    async.each(ips || [], function(ip, cb) {

      // do not ping for now
      // return cb(null);

      // do a ping
      session.pingHost (ip, function (err, target, sent, rcvd) {

        console.dir(err);

        // check if this was a valid host ?
        if(err) {

          // add the rule
          payload.addRule({

            message:      'Configured IPv6 address could not be reached',
            key:          'ipv6.ping',
            type:         'error'

          }, {

            message:      'The configured IP $ on the domain could not be reached',
            identifiers:  [ ip ]

          })

        }

        // done
        cb(null);

      });

    }, function() {

      // close the session
      session.close();

      // done
      fn(null);

    });

    

  });

};
