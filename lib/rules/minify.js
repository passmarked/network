// load modules
const _             = require('underscore');
const url           = require('url');
const zlib          = require('zlib');
const async         = require('async');
const UglifyJS      = require("uglify-js")
const CleanCSS      = require('clean-css');
const request       = require('request');
const S             = require('string');

// handle checking for the cache
module.exports = exports = function(payload, fn) {

  // last indexed line
  var last_current_line = -1;

  // get the data
  var data = payload.getData();

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

    // get the page content
    payload.getPageContent(function(err, content) {

      // did we get a error ?
      if(err) {

        // debug
        payload.error('Got a error trying to get the HAR', err);

        // done
        return fn(null);

      }

      // check page content
      if(S(content).isEmpty() === true) return fn(null);

      // handle the entry
      async.each(har.log.entries || [], function(entry, cb) {

        // check if minification works
        if(!entry.response) return cb(null);
        if(!entry.response.content) return cb(null);

        // check the mime
        var mime = (entry.response.content.mimeType || '').toLowerCase().split(',')[0];

        // check the type
        if(mime.indexOf('text/css') === -1 && 
            mime.indexOf('javascript') === -1)
              return cb(null);

        // check the length of the contents
        var contents = entry.response.content.body || '';

        // sanity check
        if(S(contents).isEmpty() === true) return cb(null);

        // get the length
        var len = contents.length;

        // must be bigger than 0
        if(len <= 0) return cb(null);

        // get the minified striplen
        var striplen  = contents.replace(/\n| {2}|\t|\r/g, '').length;
        var result    = '';

        // depending on type
        if(mime.indexOf('text/css') != -1) {

          try {
            
            // uglify
            result = new CleanCSS().minify(contents || '').styles;

            // set the length
            striplen = (result || '').length;

          } catch(err) {}

        }

        // percentage to save
        var saving_percentage = (len - striplen) / len;

        // only if bigger than 20%
        if(saving_percentage > 0 && saving_percentage >= 0.2) {

          // if this is 100%, we'll you need to remove that file ...
          if(Math.round( saving_percentage * 100 ) == 100) {

            // add the rule
            payload.addRule({

                message: 'Empty file after Minification',
                key: 'minify.empty',
                type: 'error'

              }, {

                  message: 'Minification on $ returns empty, indicating a redundant request',
                  identifiers: [ entry.request.url ],
                  url: entry.request.url,
                  type: 'url'

                });

          } else {

            // can save quite a bit
            payload.addRule({

              message: 'Minify JavaScript and CSS',
              key: 'minify',
              type: 'warning'

            }, {

              message: 'Minification on $ would decrease the size by $',
              identifiers: [

                entry.request.url,
                Math.round( saving_percentage * 100 ).toString() + '%'

              ],
              url: entry.request.url,
              type: 'url'

            })
            
          }

        }

        // done
        cb(null);

      }, function() {

        // done
        fn(null);

      });

    });

  });

};
