// load modules
const _           = require('underscore');
const url         = require('url');
const request     = require('request');

// handle checking for the cache
module.exports = exports = function(payload, fn) {

  // get the data
  var data = payload.getData();

  // go get the robots file
  var uri = url.parse(data.url);

  // update path
  uri.pathname = '/favicon.ico';
  uri.search = '';

  // get the robots file
  var faviconPath = url.format(uri);

  // request 
  payload.doRequest({

    url:      faviconPath,
    options:  {

      encoding: null

    }

  }, function(err, response, body) {

    // sanity checks
    if(err)       return setImmediate(fn, null);
    if(!response) return setImmediate(fn, null);

    // get the status code
    var statusCode = response.statusCode || 500;

    // was this a success ?
    if(statusCode == 200) {

      // only if we found it
      if(response.headers['content-length']) {

        // parse the item
        var parsedLength = parseInt('' + response.headers['content-length'], 10);

        // check it
        if(parsedLength !== NaN && 
            parsedLength !== null && 
              parsedLength !== undefined) {

          // check if we can use it
          if(parsedLength > 1024 * 10) {

            // add in the favicon item
            payload.addRule({

              message:  'Favicon should be small and cacheable',
              key:      'favicon.size',
              type:     'warning'

            }, {

              message:      'The favicon at $ was $',
              identifiers:  [

                faviconPath,
                (Math.round((parsedLength / 1024) * 100) / 100) + 'kb'

              ]

            })

          }

        }

      }

    } else if(statusCode >= 300 && statusCode < 400) {

      // add in the favicon item
      payload.addRule({

        message:      'Favicon request redirected',
        key:          'favicon.redirect',
        type:         'warning'

      }, {

          message: faviconPath,
          display: 'url',
          url: faviconPath

        });

    } else {

      // add in the favicon item
      payload.addRule({

        message:    'No Favicon found',
        key:        'favicon.exists',
        type:       'warning'

      }, {

          message: faviconPath,
          display: 'url',
          url: faviconPath

        });

    }

    // send back all the rules
    setImmediate(fn, null)

  });

};
