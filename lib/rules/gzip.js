// load modules
const _             = require('underscore');
const url           = require('url');
const zlib          = require('zlib');
const async         = require('async');
const request       = require('request');
const S             = require('string');

/**
* List of allowed types (css/javascript)
**/
var knownTypes = [

  'text/css',
  'text/javascript',
  'text/plain',
  'application/x-javascript'

];

/**
* Known list of encodings
**/
var knownEncodings = [
  
  'gzip',
  'compress',
  'deflate',
  'identity',
  'br'

];

/**
* handle checking for the cache
**/
module.exports = exports = function(payload, fn) {

  // get the data
  var data = payload.getData();

  // parse our url
  var uri = url.parse(data.redirected || data.url || '');

  // get the page content
  payload.getHAR(function(err, har_obj) {

    // did we get a error ?
    if(err) {

      // low out the error
      payload.error('Got a error trying to get the HAR', err);

      // done
      return fn(null);

    }

    // sanity checck
    if(!har_obj) return fn(null);
    if(!har_obj.log) return fn(null);

    // parse the url
    var uri = url.parse(data.url);

    // get the entries
    var entries = har_obj.log.entries || [];

    // loop all the har entries and check for query strings in the proxy
    async.eachLimit(entries || [], 10, function(entry, cb) {

      // check the status
      if(!entry.response) return cb(null);
      if(!entry.request) return cb(null);

      // build a list of headers based on keys we can use
      var headers = {};

      // check if this was for a image
      for(var a = 0; a < (entry.response.headers || []).length; a++) {

        // get the content-encoding header if it exists
        var name          = (entry.response.headers[a].name || '').toLowerCase();
        var value         = (entry.response.headers[a].value || '').toLowerCase().split(',')[0];

        // trim out value
        value             = S(value).trim().s

        // must be in our list of approved names to present
        // spending too much CPU cycles on this loop ...
        if([

          'content-type', 'content-encoding'

        ].indexOf(name) == -1) continue;

        // set as names
        headers[name]     = value;

      }

      // right so if the content type is set
      if(!headers['content-type']) return cb(null);

      // check if it's a image
      if(knownTypes.indexOf(headers['content-type']) === -1) return cb(null);

      // right so is this gzipped ?
      if(knownEncodings.indexOf(headers['content-encoding'] || '') !== -1) return cb(null);

      // check if empty
      if(S(entry.response.body || '').isEmpty() === true) return cb(null);

      // parse the domain
      var entryUri = url.parse(entry.response.url || entry.request.url);

      // compress them then and find how much we could save
      zlib.deflate(entry.response.body, function(err, buf) {

        // check if we got a error
        if(err) {

          // log the error
          payload.error('gzip', 'Problem deflating the input', err);

          // finish, not too worried about the error
          return cb(null);

        }

        // check for the length
        var originalLen     = Buffer.byteLength(entry.response.body, 'utf8');
        var resultingLen    = Buffer.byteLength(buf, 'binary');

        // get the percentage between the two
        var percentage      = (originalLen - resultingLen) / originalLen;

        // if it's bigger than 20% report on it
        if(percentage >= 0.1) {

          // check if local
          var isLocal = entryUri.hostname.indexOf(uri.hostname) != -1;

          // add the rule depending on internal or external
          if(isLocal === true) {

            // add the rule
            payload.addRule({

                message:        'Enable GZIP to decrease the size of assets that the user has to download from local domain',
                key:            'gzip.internal',
                type:           'error'

              }, {

                  message:      'Enabling GZIP on $ could represent a $ saving, reducing the file size from $kb to $kb',
                  identifiers:  [ url.format(entryUri), originalLen, resultingLen, Math.round(percentage * 100) + '%' ],
                  url:          url.format(entryUri),
                  type:         'url'

                });

          } else {

            // add the rule
            payload.addRule({

                message:        'Enabling GZIP on $ could represent a $ saving, reducing the file size from $kb to $kb',
                key:            'gzip.external',
                type:           'notice'

              }, {

                  message:      '$ has compression enabled',
                  identifiers:  [ url.format(entryUri), originalLen, resultingLen, Math.round(percentage * 100) + '%' ],
                  url:          url.format(entryUri),
                  type:         'url'

                });

          }

        }

        // finish strong
        cb(null);

      });

    }, function() {

      // done
      fn(null);

    });

  });

};
