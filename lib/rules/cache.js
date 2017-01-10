// load modules
const _           = require('underscore');
const url         = require('url');
const S           = require('string');

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
* Returns the expire header for us to use
**/
var getExpireHeader = function(headers) {

  // get the cache control header first
  for(var i = 0; i < (headers || []).length; i++) {

    // check it
    if(!headers[i].name) continue;

    // get the headers
    if((headers[i].name || '').toLowerCase() == 'cache-control') {

      // return the header
      return headers[i];

    }

  }

  // loop to find the expires header
  for(var i = 0; i < (headers || []).length; i++) {

    // check it
    if(!headers[i].name) continue;

    // get the headers
    if((headers[i].name || '').toLowerCase() == 'expires') {

      // return the header
      return headers[i];

    }

  }

  // done with default
  return null;

};

/**
* Returns the max-age as provided by the caching header
**/
var getMaxAge = function(headers) {

  // gets the header
  var header = getExpireHeader(headers);

  // check if we found the header
  if(header === null || header === undefined)
    return null;

  // handle the item
  var value       = (header.value || '').toLowerCase();
  var values      = value.replace(/\s+/gi, '').split(',');

  // loop and find the max-age
  for(var i = 0; i < values.length; i++) {

    // check if we have value 
    if(values[i].indexOf('max-age=') == 0) {

      // get the numbers
      var numb = values[i].split('=')[1];

      // set the item
      if( S('' + numb).isEmpty() === false ) {

        try {

          // check the max age
          var numb = parseInt(numb, 10);

          // check if a number
          if(numb && 
              !isNaN(parseFloat(numb)) && 
                isFinite(numb))
                  return numb;

        } catch(err) {}

      }

    }

  }

  // loop and try to parse the time
  for(var i = 0; i < values.length; i++) {

    try {

      // check if valid date
      var expires = new Date( header.value || 'invalid' );

      // check if it's a valid date
      if(expires.toString() != 'Invalid Date') {

        // return it
        return expires.getTime() - new Date().getTime();

      }

    } catch(err) {}

  }

  // done
  return null;

};

// handle checking for the cache
module.exports = exports = function(payload, fn) {

  // get the data
  var data = payload.getData()

  // get the page content
  payload.getPageContent(function(err, content) {

    // did we get a error ?
    if(err) {

      // debug
      payload.error('Got a error trying to get the Page Content', err);

      // done
      return fn(null);

    }

    // added safety checks for performance
    if(S(content || '').isEmpty() === true)
      return fn(null);

    // parse our url from data
    var uri = url.parse(data.redirected || data.url);

    // parse out lines
    var lines               = content.split('\n');
    var last_current_line   = -1;

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
      if(!har.log.entries) return fn(null);

      // parse the url
      var uri = url.parse(data.url)

      // loop the entries
      for(var i = 0; i < (har.log.entries || []).length; i++) {

        // local reference
        var entry = har.log.entries[i];

        // sanity check
        if(!entry) continue;
        if(!entry.request) continue;
        if(!entry.response) continue;

        // get the entry url
        var entryUrl          = entry.response.url || entry.request.url || '';
        var entryUri          = url.parse( entryUrl );
        var sameOrigin        = uri.hostname ==  entryUri.hostname;

        // get the content type
        var contentTypeHeader = _.find(entry.response.headers || [], function(item) {

          // returns the item
          return item.name.toLowerCase() == 'content-type';

        });

        // check if we found a header ?
        if(!contentTypeHeader) continue;

        // get the value
        var value = (contentTypeHeader.value || '').toLowerCase();

        // check the type
        if( allowedContentTypes.indexOf(value.split(',')[0]) === -1 ) continue;

        // get the max age
        var maxage = getMaxAge(entry.response.headers || []);

        // build out the occurrence we will be adding
        var occurrence = {

          url: entryUrl,
          header: data.url,
          display: 'url'

        };

        // set if we should continue
        var shouldContinue = true;

        // if set on demand don't worry about
        for(var a = 0; a < (entry.response.headers || []).length; a++) {

          // get the cache-control header
          if((entry.response.headers[a].name || '').toLowerCase() !== 'cache-control')
            continue;

          // get the value
          var value     = (entry.response.headers[a].value || '').toLowerCase();
          var values    = value.replace(/\s+/gi, '').split(',');

          // check if matches
          if(values.indexOf('no-cache') != -1)
            shouldContinue = false;

          // check if matches
          if(values.indexOf('no-store') != -1)
            shouldContinue = false;

          // check if matches
          if(values.indexOf('must-revalidate') != -1)
            shouldContinue = false;

          // check if matches
          if(values.indexOf('proxy-revalidate') != -1)
            shouldContinue = false;

          // stop right here
          break;

        }

        // does this match ?
        if(shouldContinue === false) continue;

        // must actually have found a max age
        if(maxage !== null) {

          // get where it is in the content
          var codeBuild = payload.getSnippetManager().build(lines, -1, entryUri.pathname);

          // add build
          if(codeBuild) {

            // set the code
            occurrence.code = codeBuild;
            occurrence.display = 'code';

          }

          // keep track of the time
          var expireTimestamp               = 0;
          var ruleMessage                   = '';
          var occurrenceMessage             = '';
          var key                           = '';
          var level                         = '';

          // get the units
          var units = null;
          var number = 0;

          // get the units
          if(maxage / 60 / 60 > 24) {

            units   = 'day';
            number  = Math.round( maxage / 60 / 60 / 24  );

          } else if(maxage / 60 / 60 > 1) {

            units   = 'hour';
            number  = Math.round( maxage / 60 / 60  );

          } else if(maxage / 60 > 1) {

            units   = 'minute';
            number  = Math.round( maxage / 60  );

          } else {

            units   = 'second';
            number  = Math.round( maxage );

          }

          /* console.log('max age: ' + maxage);
          console.log('unit: ' +    units);
          console.log('number: ' +  number); */

          // add to the unit
          if(number > 1) units = units + 's';

          // check the timestamp item
          if(sameOrigin === true) {

            // set to local expire, we expect 2 days at a minimum
            expireTimestamp   = (60 * 60) * 24 * 2;
            ruleMessage       = 'Caching age on local asset too small';
            occurrenceMessage = 'Cache header on $ is only $ ' + units + ', expected at least 2 days';
            key               = 'expire.internal';
            level             = 'error';

          } else {

            // set to third party expire, 6 hours
            expireTimestamp   = (60 * 60) * 6;
            ruleMessage       = 'Caching age on external asset too small';
            occurrenceMessage = 'Cache header on $ is only $ ' + units + ', expected at least 6 hours';
            key               = 'expire.external';
            level             = 'notice';

          }

          // check if it matches the rule
          if(maxage <= 0 || maxage > expireTimestamp) continue;

          // add the rule
          payload.addRule({

              type:     level,
              message:  ruleMessage,
              key:      key

            }, _.extend(occurrence, {

              message:      occurrenceMessage,
              identifiers:  [ entryUrl, Math.round( number  ) ]

            }));

        } else if(sameOrigin === true) {

          // add a missing item
          payload.addRule({

              type:         'warning',
              message:      'Missing cache headers on local asset',
              key:          'cache.internal'

            }, _.extend(occurrence, {

              message:      'Cache header missing on $',
              identifiers:  [ entryUrl ]

            }));

        } else {

          // add a missing item
          payload.addRule({

              type:     'notice',
              message:  'Missing cache headers on third party asset',
              key:      'cache.external'

            }, _.extend(occurrence, {

              message: 'Cache header missing on $',
              identifiers: [ entryUrl ]

            }));

        }

      }

      // done
      fn(null);

    });

  });

};
