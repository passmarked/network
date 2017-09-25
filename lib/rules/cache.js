// load modules
const _           = require('underscore');
const url         = require('url');
const async       = require('async');
const S           = require('string');

/**
* Amount of hours we require from the cache
**/
const MINIMUM_CACHE_NUMB    = 4;
const MINIMUM_CACHE_UNITS   = 'hours';
const MINIMUM_CACHE_TIME    = 60 * 60 * MINIMUM_CACHE_NUMB; // 4 hours

/**
* types to check for cache
**/
const ALLOWED_CONTENT_TYPES = [ 

  'application/javascript', 
  'text/javascript', 
  'text/css', 
  'image/png', 
  'image/jpeg', 
  'image/jpg', 
  'image/gif' 

];

/**
* Returns the units and formatted amount in:
* days / hours / minutes / seconds
**/
var getFormattedNumbers = function(timestamp) {

  // get the units
  var units = null;
  var number = 0;

  // get the units
  if(timestamp / 60 / 60 > 24) {

    units   = 'day';
    number  = Math.round( timestamp / 60 / 60 / 24  );

  } else if(timestamp / 60 / 60 > 1) {

    units   = 'hour';
    number  = Math.round( timestamp / 60 / 60  );

  } else if(timestamp / 60 > 1) {

    units   = 'minute';
    number  = Math.round( timestamp / 60  );

  } else {

    units   = 'second';
    number  = Math.round( timestamp || 0 );

  }

  // check for plurals
  if(number > 1) units = units + 's';

  // done
  return {

    unit:     units,
    number:   number

  }

}

/**
* Returns the expire header for us to use
**/
var getExpireHeader = function(headers) {

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
* Returns the expire header for us to use
**/
var getCacheControlHeader = function(headers) {

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

  // done with default
  return null;

};

/**
* Returns the max-age as provided by the caching header
**/
var processCacheHeaders = function(payload, entry, fn) {

  // gets the header
  var cacheControlHeader  = getCacheControlHeader((entry.response || {}).headers || []);
  var expireHeader        = getCacheControlHeader((entry.response || {}).headers || []);

  // get the payload data
  var data        = payload.getData();

  // parse the urls
  var uri         = url.parse(data.url);

  // get the url 
  var entryUrl    = entry.response.url || entry.request.url || '';
  var entryUri    = url.parse(entryUrl);

  // check the origin
  var sameOrigin  = uri.hostname ==  entryUri.hostname;

  // the base occurrence
  var occurrence  = {

    url:        entryUrl,
    header:     data.url,
    display:    'url',
    file:       entryUrl

  };

  // is the cache control header present
  if(cacheControlHeader) {

    /**
    * The resulting sections we can output,
    * pulled from:
    * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
    **/
    var result = {

      'type':         'cache-control',
      'directives':   {

        'must-revalidate':          false,
        'no-cache':                 false,
        'no-store':                 false,
        'no-transform':             false,
        'public':                   false,
        'private':                  false,
        'proxy-revalidate':         false,
        'max-age':                  null,
        's-maxage':                 null,
        'immutable':                false,
        'stale-while-revalidate':   null,
        'stale-if-error':           null

      }

    };

    // handle the item
    var value       = (cacheControlHeader.value || '').toLowerCase();
    var values      = value.replace(/\s+/gi, '').split(',');

    // loop and find the max-age
    for(var i = 0; i < values.length; i++) {

      // split, in case this is a equals directive
      var sections = S(values[i] || '').trim().s.toLowerCase().split('=');

      // check if this is a defined header ... ?
      if(result['directives'][sections[0]] === undefined) {

        // depending on the origin
        if(sameOrigin === true) {

          // add the rule
          // add a missing item
          payload.addRule({

              type:         'error',
              message:      'Unknown options configured for caching',
              key:          'cache.unknown'

            }, _.extend(occurrence, {

              message:      '$ was not recognized',
              identifiers:  [ sections[0] ]

            }));

        }

        // stop here
        continue;

      }

      // is there more than one section ?
      if(sections.length > 1) {

        // try to parse the number
        var parsedNumber = parseInt(sections[1]);

        // were we able to parse ?
        if(parsedNumber !== null && 
            parsedNumber !== NaN && 
              parsedNumber !== undefined) {

          // set it
          result['directives'][sections[0]] = parsedNumber;

        }

      } else {

        // set the cache directive
        result['directives'][sections[0]] = true;

      }

    }

    // do our checks
    var directives = result['directives'];

    // if defined as public, it makes no sense to define public
    // and vice versa. Do a quick check to stop this
    if(directives.private === true && 
        directives.public === true && 
          sameOrigin === true) {

      // nope ... show the rule
      payload.addRule({

        type:         'error',
        message:      'Cache responded as both private and public',
        key:          'cache.scope'

      }, _.extend(occurrence, {

        message:      '$ responded as being cachable by both $ and $',
        identifiers:  [ entryUrl, 'private', 'public' ]

      }));

    }

    // only if we are not instructed to ignore cache
    if(directives['no-store'] == true || 
        directives['must-revalidate'] == true || 
          directives['max-age'] === 0 || 
            directives['max-age'] <= 0) {

      // stop here
      return fn(null);

    }

    // debug
    payload.debug('max-age', 'max-age found was ' + directives['max-age'])

    // if configured 
    if(directives['max-age'] !== null) {

      // is it smaller than 4 hours ?
      if(directives['max-age'] === 0 || 
          directives['max-age'] >= MINIMUM_CACHE_TIME) {

        // debug
        payload.debug('max-age', 'Skipping as ' + directives['max-age'] + ' > ' + MINIMUM_CACHE_TIME);

        // umm yes ...
        return fn(null);

      }

      // get the formatted number
      var formattedNumber = getFormattedNumbers(directives['max-age']);

      // if we found it
      if(formattedNumber) {

        // check if internal or external
        if(sameOrigin === true) {

          // add the rule
          payload.addRule({

              type:         'error',
              message:      'Caching age on local asset too small',
              key:          'expire.internal'

            }, _.extend(occurrence, {

              message:      '$ header on $ is only $ ' + formattedNumber.unit + ', expected at the bare minimum $ ' + MINIMUM_CACHE_UNITS,
              identifiers:  [ 'Cache-Control', entryUrl, Math.round( formattedNumber.number ), MINIMUM_CACHE_NUMB ]

            }));

        } else {

          // add the rule
          payload.addRule({

              type:         'notice',
              message:      'Caching age on third-party asset too small',
              key:          'expire.external'

            }, _.extend(occurrence, {

              message:      '$ header on $ is only $ ' + formattedNumber.unit + ', expected at the bare minimum $ ' + MINIMUM_CACHE_UNITS,
              identifiers:  [ 'Cache-Control', entryUrl, Math.round( formattedNumber.number ), MINIMUM_CACHE_NUMB ]

            }));

        }

      }

      // finish
      return fn(null);

    }

  }

  // check if the xpire header is defined
  if(expireHeader) {

    // try to parse it
    var expireDate = null;

    // try to parse the header
    try {

      // parse it
      expireDate = new Date(expireHeader.value || 'invalid');

    }  catch(err) { /** no luck :(*/ }

    // were we able to parse the date ?
    if(expireDate === null) {

      if(sameOrigin === true) {

        // nope, show a error
        payload.addRule({

            type:         'error',
            message:      'Expire header contains invalid date',
            key:          'expire.date'

          }, _.extend(occurrence, {

            message:      '$ responded with an invalid date of $',
            identifiers:  [ entryUrl, expireHeader.value ]

          }));

      }

      // and finish
      return fn(null);

    }

    // check the time
    var delta = (new Date().getTime() - expireDate.getTime());

    // must be bigger than 0, just a sanity check
    if(delta <= 0) return fn(null);

    // is this more than 4 hours
    if(delta < MINIMUM_CACHE_TIME) {

      // get the formatted number
      var formattedNumber = getFormattedNumbers(delta);

      // if we found it
      if(formattedNumber) {

        // check if internal or external
        if(sameOrigin === true) {

          // add the rule
          payload.addRule({

              type:         'error',
              message:      'Caching age on local asset too small',
              key:          'expire.internal'

            }, _.extend(occurrence, {

              message:      '$ header on $ is only $ ' + formattedNumber.unit + ', expected at the bare minimum $ ' + MINIMUM_CACHE_UNITS,
              identifiers:  [ 'Expire', entryUrl, Math.round( formattedNumber.number ), MINIMUM_CACHE_NUMB ]

            }));

        } else {

          // add the rule
          payload.addRule({

              type:         'notice',
              message:      'Caching age on third-party asset too small',
              key:          'expire.external'

            }, _.extend(occurrence, {

              message:      '$ header on $ is only $ ' + formattedNumber.unit + ', expected at the bare minimum $ ' + MINIMUM_CACHE_UNITS,
              identifiers:  [ 'Expire', entryUrl, Math.round( formattedNumber.number ), MINIMUM_CACHE_NUMB ]

            }));

        }

      }

    }

    // done
    return fn(null);

  } else {

    if(sameOrigin === true) {

      // add a missing item
      payload.addRule({

          type:         'warning',
          message:      'Missing cache headers on local asset',
          key:          'cache.internal'

        }, _.extend(occurrence, {

          message:      '$ nor $ were found on $',
          identifiers:  [ 'Cache-control', 'Expires', entryUrl ]

        }));

    } else {

      // add a missing item
      payload.addRule({

          type:         'notice',
          message:      'Missing cache headers on third party asset',
          key:          'cache.external'

        }, _.extend(occurrence, {

          message:      '$ nor $ were found on $',
          identifiers:  [ 'Cache-control', 'Expires', entryUrl ]

        }));

    }

  }

  // done
  fn(null);

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

      // walk the entries
      async.eachLimit(har.log.entries || [], 10, function(entry, cb) {

        // sanity checks
        if(!entry) return setImmediate(cb, null);
        if(!entry.request) return setImmediate(cb, null);
        if(!entry.response) return setImmediate(cb, null);

        // get the entry url
        var statusCode        = entry.response.status || entry.response.statusCode || null;

        // must be a 200 
        if(statusCode != 200) return setImmediate(cb, null);

        // get the content type
        var contentTypeHeader = _.find(entry.response.headers || [], function(item) {

          // returns the item
          return item.name.toLowerCase() == 'content-type';

        });

        // check if we found a header ?
        if(!contentTypeHeader) return setImmediate(cb, null);

        // get the value
        var value = (contentTypeHeader.value || '').toLowerCase();

        // check the type
        if( ALLOWED_CONTENT_TYPES.indexOf(value.split(',')[0]) === -1 ) return setImmediate(cb, null);

        // check if not data:image
        if(S(entry.request.url || '').trimLeft().s.slice(0, 24).toLowerCase().indexOf('data:') == 0) {

          // skip 
          return setImmediate(cb, null);

        }

        // run the process
        processCacheHeaders(payload, entry, function() {

          // done
          setImmediate(cb, null);

        });

      }, function() {

        // done
        fn(null);

      });

    });

  });

};
