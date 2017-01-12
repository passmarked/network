// load modules
const _             = require('underscore');
const url           = require('url');
const zlib          = require('zlib');
const async         = require('async');
const S             = require('string')
const minify        = require('html-minifier').minify;

// handle checking for the cache
module.exports = exports = function(payload, fn) {

  // get the data
  var data = payload.getData()

  // get the page content
  payload.getResponse(function(err, response) {

    // did we get a error ?
    if(err) {

      // debug
      payload.error('whitespace', 'Got a error trying to get the page content', err);

      // done
      return fn(null);

    }

    // check if returned
    if(!response) {

      // debug
      payload.warning('whitespace', 'No response was returned');

      // done
      return fn(null);

    }

    // get the content
    var originalContent = null;

    // set it
    if(response.body) {

      // set to the body
      originalContent = response.body;

    } else if(response.content && 
                response.content.text) {

      // set the content
      originalContent = response.content.text;

    }

    // added safety checks for performance
    if(S(originalContent || '').isEmpty() === true) {

      // debug
      payload.error('whitespace', 'Page content was blank', err);

      // done
      return fn(null);

    }

    var minifiedContent = minify(originalContent, {
      
      removeAttributeQuotes:  true,
      removeComments:         true

    });

    // check if the content is blank
    if(S(minifiedContent || '').isEmpty() === true) {

      // done
      return fn(null);

    }

    // check for the length
    var originalLen       = Buffer.byteLength(originalContent, 'utf8');
    var resultingLen      = Buffer.byteLength(minifiedContent, 'utf8');

    // check if the content was given
    if(originalLen <= 0) {

      // debug
      payload.debug('whitespace', 'Skipping a original length was ' + originalLen + ' bytes');

      // done
      return fn(null);

    }

    // check if the content was given
    if(resultingLen <= 0) {

      // debug
      payload.debug('whitespace', 'Skipping a resulting length was ' + resultingLen + ' bytes');

      // done
      return fn(null);

    }

    // if the raw length is more than the minified length
    if(resultingLen > originalLen) {

      // debug
      payload.debug('whitespace', Math.round(resultingLen / 1024) + 'kb is bigger than the original ' + Math.round(originalLen / 1024) + 'kb so skipping ...');

      // done
      return fn(null); // right ...

    }

    // percentage to save
    var delta        = originalLen - resultingLen;

    // on local output the newly minified page
    if(process.env.NODE_ENV == 'development') {

      // output
      // console.log(minifiedContent);

    }

    // debug
    payload.debug('whitespace', 'Before minification: ' + Math.round(originalLen / 2014) + 'kb')
    payload.debug('whitespace', 'After minification: ' + Math.round(resultingLen / 2014) + 'kb')

    // load the delya
    payload.debug('whitespace', 'Delta was: ' + (delta / originalLen) + '%')


    // only if bigger than 5%, this then triggers on sites were the HTML
    // is really bad and needs some help. After HTTP2 whitespaces are not
    // that big of a issue anymore
    if(delta >= 1024 && (delta / originalLen) > 0.05) {

      // get the units
      var units = Math.round( delta / 1024 ) + 'kb';

      // can save quite a bit
      payload.addRule({

        message:  'Minify / Remove whitespace from HTML',
        key:      'whitespace',
        type:     'error'

      }, {

        message:  'Minification on your HTML would decrease the size by $',
        identifiers: [

          Math.round( delta / 1024 ) + 'kb'

        ],
        url:      data.redirected || data.url || '',
        type:     'url'

      });

    }

    // done
    fn(null);

  });

};
