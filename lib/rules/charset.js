// load modules
const _             = require('underscore');
const url           = require('url');
const zlib          = require('zlib');
const async         = require('async');
const request       = require('request');

// the allowed content types
var allowedContentTypes = [

  'text/html',
  'text/plain'

];

// handle checking for the cache
module.exports = exports = function(payload, fn) {

  // get the data
  var data = payload.getData();

  // parse the page url
  var uri = url.parse( data.url );

  // get the page content
  payload.getHAR(function(err, har) {

    // did we get a error ?
    if(err) {

      // debug
      payload.error('Got a error trying to get the HAR', err);

      // done
      return fn(null);

    }

    // sanity checck
    if(!har) return fn(null);
    if(!har.log) return fn(null);

    // get the entries
    var entries = har.log.entries || [];

    // parse the url
    var uri = url.parse(data.url);

    // loop all the har entries and check for query strings in the proxy
    for(var i = 0; i < entries.length; i++) {

      // local reference
      var entry = entries[i];

      // get the content type
      var contentTypeHeader = _.find(entry.response.headers || [], function(item) {

        // returns the item
        return (item.name || '').toLowerCase() == 'content-type';

      });

      // check the status
      if(((entry || {}).response || {}).status != 200) continue;

      // check content type
      if(!contentTypeHeader) continue;

      // pull out values
      var value = (contentTypeHeader.value || '').toLowerCase().split(',');

      // right check if this one of our allowed types
      if(allowedContentTypes.indexOf(value[0] || '') === -1)
        continue;

      // ok so now we check if the url that was contained a query string
      var entryUri = url.parse( entry.response.url || entry.request.url );

      // must be from the same domain
      if((uri.hostname || '').toLowerCase().indexOf((entryUri.hostname || '').toLowerCase()) === -1) continue;

      // right see how big this is
      if(value.join(',').indexOf('charset=utf-8') != -1) continue;

      // if this is smaller than 3kb we show a rule
      payload.addRule({

        message:      'Specify a character set early',
        key:          'charset',
        type:         'notice'

      }, {

        message:      '$ did not specify the charset',
        identifiers:  [ entry.request.url ],
        url:          entry.request.url,
        type:         'url',
        filename:     entry.request.url

      });

    }

    // send back all the rules
    fn(null)

  });

};
