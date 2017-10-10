// load modules
const _             = require('underscore');
const url           = require('url');
const zlib          = require('zlib');
const async         = require('async');
const request       = require('request');
const S             = require('string');

// types to check for cache
var allowedContentTypes = [ 

  'application/javascript', 
  'text/javascript', 
  'text/css', 
  'image/png', 
  'image/jpeg', 
  'image/jpg', 
  'image/gif' 

];

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
      return fn(null);

    }

    // sanity checck
    if(!har_obj) return fn(null);
    if(!har_obj.log) return fn(null);

    // parse the url
    var uri = url.parse(data.url);

    // get the entries
    var entries = har_obj.log.entries || [];

    // keep track of the paths we found, along with their domain.
    var paths   = {};

    // loop all the har entries and check for query strings in the proxy
    for(var i = 0; i < entries.length; i++) {

      // create a local entry
      var entry = entries[i];

      // check the status
      if(!entry.response) continue;
      if(!entry.request) continue;

      // parse the url
      var entryUrl = url.parse(entry.response.url || entry.request.url);

      // get the content type
      var contentTypeHeader = _.find(entry.response.headers || [], function(item) {

        // returns the item
        return item.name.toLowerCase() == 'content-type';

      });

      // only from local domain
      if(entryUrl.hostname.indexOf(uri.hostname) === -1) continue;

      // check if we found a header ?
      if(!contentTypeHeader) continue;

      // get the value
      var value = (contentTypeHeader.value || '').split(',')[0].toLowerCase();

      // check the type
      if( allowedContentTypes.indexOf(value.split(',')[0]) === -1 ) continue;

      // if not already defined, define
      if(!paths[ S(entryUrl.pathname) ])
        paths[ S(entryUrl.pathname) ] = [];

      // get the path
      paths[ S(entryUrl.pathname) ].push(entryUrl);

    }

    // great then loop all the groups, 
    // and if one has more than one entry
    // that is a asset not being consistent
    // in url naming

    // get the keys
    var keys = _.keys(paths);

    // loop the keys and check if any have more than one ... ?
    for(var i = 0; i < keys.length; i++) {

      // local reference
      var pathItems = paths[keys[i]];

      // sanity check
      if(!entry) continue;

      // does this have more than ?
      if(pathItems.length <= 1) continue;

      // get the list of domains used
      var domains = [];
      var urls    = [];

      // add the rule !
      for(var a = 0; a < pathItems.length; a++) {

        // must be unique
        if(domains.indexOf(pathItems[a].hostname) == -1) {

          // add the domain
          domains.push(pathItems[a].hostname);

        }
          
        // add the url
        urls.push(pathItems[a]);

      }

      // must have more than one domain
      if(domains.length <= 1) continue;

      // add the rule !
      for(var a = 0; a < urls.length; a++) {

        // get the entry
        var uri = urls[a];

        // add to the list of issues
        payload.addRule({

            type:     'warning',
            message:  'Serve resources from a consistent URL',
            key:      'consistent'

          }, _.extend({

            message:      '$ was served from multiple domains',
            url:          url.format(uri),
            display:      'url',
            identifiers:  [ url.format(uri) ]

          }));

      }

    }

    // done
    fn(null);

  });

};
