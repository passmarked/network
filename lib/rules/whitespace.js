// load modules
const _             = require('underscore');
const url           = require('url');
const zlib          = require('zlib');
const async         = require('async');
const UglifyJS      = require('uglify-js');
const CleanCSS      = require('clean-css');
const S             = require('string')

// handle checking for the cache
module.exports = exports = function(payload, fn) {

  // get the data
  var data = payload.getData()

  // get the page content
  payload.getResponse(function(err, response) {

    // did we get a error ?
    if(err) {

      // debug
      payload.error('Got a error trying to get the page content', err);

      // done
      return fn(null);

    }

    // check if returned
    if(!response) {

      // debug
      payload.warning('No response was returned');

      // done
      return fn(null);

    }

    // get the content
    var content = null;

    // set it
    if(response.body) {

      // set to the body
      content = response.body;

    } else if(response.content && 
                response.content.text) {

      // set the content
      content = response.content.text;

    }

    // added safety checks for performance
    if(S(content || '').isEmpty() === true) {

      // debug
      payload.error('Page content was blank', err);

      // done
      return fn(null);

    }

    // get the item
    var minifiedContent   = (content || '').replace(/<\/.+>\s+<.+>/g, '><');

    // check the size
    var rawLength         = (content || '').length;
    var minifiedLength    = (minifiedContent || content).length;

    // percentage to save
    var percentage        = (rawLength - minifiedLength) / rawLength;

    // only if bigger than 20%
    if(percentage >= 0.3) {

      // can save quite a bit
      payload.addRule({

        message:  'Minify / Remove whitespace from HTML',
        key:      'whitespace',
        type:     'error'

      }, {

        message:  'Minification on your HTML would decrease the size by $',
        identifiers: [

          Math.round( percentage * 100 ).toString() + '%'

        ],
        url:      data.redirected || data.url || '',
        type:     'url'

      });

    }

    // done
    fn(null);

  });

};
