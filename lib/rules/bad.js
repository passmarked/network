// load modules
const _             = require('underscore');
const url           = require('url');
const zlib          = require('zlib');
const async         = require('async');
const request       = require('request');
const S             = require('string');

/**
* handle checking for the cache
**/
module.exports = exports = function(payload, fn) {

  // get the data
  var data = payload.getData();

  // get the page content
  payload.getHAR(function(err, har_obj) {

    // did we get a error ?
    if(err) {

      // low out the error
      payload.error('Got a error trying to get the HAR', err);

      // done
      return fn(err);

    }

    // sanity checck
    if(!har_obj) return fn(null);
    if(!har_obj.log) return fn(null);

    // parse the url
    var uri = url.parse(data.url);

    // get the entries
    var entries = har_obj.log.entries || [];

    // loop all the har entries and check for query strings in the proxy
    for(var i = 0; i < entries.length; i++) {

      // create a local entry
      var entry = entries[i];

      // check the status
      if(!entry.response) continue;
      if(!entry.request) continue;

      // must be a number
      if(!entry.response.status) continue;
      if(S('' + entry.response.status).isNumeric() === false) continue;

      // check the status code
      if(entry.response.status <= 300) continue;

      // check the status code
      if(entry.response.status >= 300 && entry.response.status < 400) continue;

      // add the rule
      payload.addRule({

          message: 'Avoid bad requests',
          key: 'bad',
          type: 'warning'

        }, {

            message: '$ returned $',
            identifiers: [ entry.request.url, entry.response.status ],
            url: entry.request.url,
            statuscode: entry.response.status,
            type: 'url'

          });

    }

    // done
    fn(null);

  });

};
