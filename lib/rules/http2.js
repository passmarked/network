// load modules
const _             = require('underscore');
const url           = require('url');
const async         = require('async');
const S             = require('string');
const cheerio       = require('cheerio');
const http2         = require('http2');

/**
* handle checking for the cache
**/
module.exports = exports = function(payload, fn) {

  // get a callback
  var callback = _.once(fn);

  // get the data
  var data = payload.getData();

  // parse the uri
  var uri = url.parse(data.redirected || data.url);

  // force the protocl to https
  uri.protocol = 'https:';

  // get the page content
  payload.getPageContent(function(err, content) {

    // sanity check
    if(err) {

      // output to stderr
      console.error('Something went wrong while trying to get the HAR' ,err);

      // return a with a error
      return callback(err);

    }

    // sanity check
    if(S(content).isEmpty() === true) return callback(null);

    /**
    * Update the global agent to not case about
    * unauthed certificates, our security section
    * handles that problem
    **/  
    var localAgent = new http2.Agent({

      rejectUnauthorized: false

    });

    // create our request
    var request = http2.get(_.extend({}, uri, {

      agent: localAgent

    }));

    /**
    * Counts to keep track of all the push notifcations
    **/
    var receivedResponse    = false;
    var serverPushList      = [];
    var sluggedPushList     = [];
    var finishedPushCount   = 0;
    var httpResponseVersion = null;

    /**
    * Callback that we can use to show we are finished
    **/
    var testCallback = _.once(function(){

      // did we actually get a response from http2 ?
      if((httpResponseVersion || '').toLowerCase().indexOf('2.') == 0) {

        // check if H2 gave us any content ?
        if(receivedResponse === false) {

          // no... ?
          payload.addRule({

            key:      'h2.blank',
            message:  'Response over HTTP/2 was blank',
            type:     'error'

          });

          // done with no error
          return callback(null);

        }

        // list of assets we found
        var blockingResources = [];
        var sluggedResources   = [];

        // load a cheerio context
        var $ = cheerio.load(content);

        // get all the head links
        $('head > link, head > script').each(function() {

          // get the url
          var resourceUrl = $(this).attr('href') || $(this).attr('src') || '';
          var cleanedUrl  = resourceUrl.toLowerCase();

          // only add if point to a local resource
          if(cleanedUrl.indexOf('//') == 0 || 
              cleanedUrl.indexOf('https://') == 0 || 
                cleanedUrl.indexOf('http://') == 0) {

            // parse see if this is a local resource
            var resourceUri = url.parse(resourceUrl);

            // check if the hostname matches
            if(!resourceUri.hostname) return;
            if(resourceUri.hostname !== uri.hostname) return;

          }

          // sanity check that the element is not empty
          if(S(resourceUrl || '').isEmpty() === true) return;

          // find the slug
          var slug        = S(resourceUrl).slugify().s;

          // add to the list if not already present
          if(sluggedResources.indexOf( slug ) !== -1) return;

          // add to the list
          sluggedResources.push(slug);

          // add the actual url to our list
          blockingResources.push(resourceUrl);

        });

        // right so loop and check that the list of
        // blocking resources were server pushed if
        // on the same domain to make the initial render
        // a bit faster.
        for(var i = 0; i < blockingResources.length; i++) {

          // local reference
          var resource  = blockingResources[i];

          // slug the resource
          var slug      = S(resource).slugify().s;

          // is this in the slugged list ?
          if(sluggedPushList.indexOf(slug) === -1) {

            // right so check if this was server pushed
            payload.addRule({

              key:      'h2.push',
              message:  'Enable HTTP/2 Server Push on blocking resources',
              type:     'warning'

            }, {

              message:      'The blocking resource $ could be delivered over the initial request',
              identifiers:  [ url.format({

                host:       uri.host,
                protocol:   uri.protocol

              }) + resource ]

            });

          }

        }

        // done
        callback(null);

      } else if(S(httpResponseVersion || '').isEmpty() === true) {

        // nope this was not httpv2 ...
        payload.addRule({

          key:      'h2',
          message:  'HTTP/2 not supported',
          type:     'error'

        }, {

          message:      'The server responded with HTTP Version $ to a HTTP/2 enabled client',
          identifiers:  [ httpResponseVersion ]

        });

        // report done
        callback(null);

      } else {

        // nope this was not httpv2 ...
        payload.addRule({

          key:      'h2',
          message:  'HTTP/2 not supported',
          type:     'error'

        }, {

          message:      'Unable to connect using HTTP/2 enabled client',
          identifiers:  []

        });

        // report done
        callback(null);

      }

    });

    /**
    * Handles counting up with the push
    * notifications so we can wait till
    * all the resources are finished downloading
    **/
    var handleFinish = function() {

      // check if we have handled all of the requests
      if (finishedPushCount === (1 + serverPushList.length))
        testCallback();

    };

    /**
    * Handle the error
    **/
    request.on('error', function(err){

      // handle the error
      payload.error('Something went wong while trying to connect to http2', err);

      // nope this was not httpv2 ...
      testCallback();

    });

    /**
    * Handle the actual response we received
    **/
    request.on('response', function(response) {

      // set to the version
      httpResponseVersion = (response || {}).httpVersion || 'unknown';
      
      // handle the data to clear the buffer
      response.on('data', function(data){

        // check if not empty
        if(S(data.toString()).isEmpty() === false) {

          // set that we found resources
          receivedResponse = true;

        }

      });

      // when done call our finish counter
      response.on('end', function() {

        // increment the finished count by one
        finishedPushCount += 1;

        // call finish
        handleFinish();

      });

    });

    // Receiving push streams
    request.on('push', function(pushRequest) {

      // parse the url
      var pushUri   = url.parse(pushRequest.url);

      // get the path
      var path      = S(pushUri.path || '').toLowerCase();

      // sanity check
      if(S(path).isEmpty() === false) {

        // create a slug
        var slug = S(path).slugify().s;

        // check if not already in list
        if(sluggedPushList.indexOf(slug) === -1) {

          // add to slug list
          sluggedPushList.push(slug);

          // add to the list
          serverPushList.push(path);

        }

      }

      // register to just drain the buffer, don't
      // actually save the files just yet
      pushRequest.on('data', function(pushResponse) {});

      // When done
      pushRequest.on('end', function() {

        // increment the finished count by one
        finishedPushCount += 1;

        // call finish
        handleFinish();

      });

    });

    /**
    * Sets a timeout
    **/
    setTimeout(function(){

      try {

        // close the request
        request.close();

      } catch(err) {}

      // nope this was not httpv2 ...
      payload.addRule({

        key:      'h2',
        message:  'HTTP/2 not supported',
        type:     'error'

      }, {

        message:      'The server responded with HTTP Version $ to a HTTP/2 enabled client',
        identifiers:  [ httpResponseVersion ]

      });

      // finish
      callback(null);

    }, 1000 * 10);

  });

};
