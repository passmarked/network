// load modules
const _             = require('underscore');
const url           = require('url');
const zlib          = require('zlib');
const async         = require('async');
const request       = require('request');
const S             = require('string');

/**
* List of allowed types (images)
**/
var imgTypes = [

  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/png'

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
    for(var i = 0; i < entries.length; i++) {

      // create a local entry
      var entry = entries[i];

      // check the status
      if(!entry.response) continue;
      if(!entry.request) continue;

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
      if(!headers['content-type']) continue;

      // check if it's a image
      if(imgTypes.indexOf(headers['content-type']) === -1) continue;

      // right so if the content encoding is set
      if(!headers['content-encoding']) continue;

      // right so is this gzipped ?
      if(knownEncodings.indexOf(headers['content-encoding']) === -1) continue;

      // parse the domain
      var entryUri = url.parse(entry.response.url || entry.request.url);
      
      // the current domain must be in the list
      if(entryUri.hostname.indexOf(uri.hostname) === -1) continue;

      // add the rule
      payload.addRule({

          message: 'Disable compression on images',
          key: 'compress.images',
          type: 'warning'

        }, {

            message: '$ has compression enabled',
            identifiers: [ entry.response.url || entry.request.url ],
            url: entry.response.url  || entry.request.url,
            type: 'url'

          });

    }

    // done
    fn(null);

  });

};
