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
  var data                = payload.getData();

  // get the documents
  var documents           =  data.documents || [];

  // get the types
  var clientDocuments     = _.filter(documents, function(item) {

    return item.type == 'client';

  }) || [];

  // get the types
  var serverDocuments     = _.filter(documents, function(item) {

    return item.type == 'server';

  }) || [];

  // check how many redirects there are, Google recommends only
  // 2 redirects. So more than 1 (the original) + 2 = 3 triggers the warning
  if(serverDocuments.length > 3) {

    // show the error
    payload.addRule({

      message:      'Keep redirects to a minimum',
      key:          'redirect.count',
      type:         'warning'

    }, {

      display:      'urls',
      urls:         _.pluck(serverDocuments, 'url'),
      message:      '$ redirected $ times, the recommended maximum is 3',
      identifiers:  [ data.url, serverDocuments.length ]

    })

  }

  // check if there are any client side redirects, 
  // that are also in the list of server items
  var serverUrls        = _.pluck(serverDocuments, 'url');

  // loop all the client side redirects
  for(var i = 0; i < clientDocuments.length; i++) {

    // check if this is in the list
    if(serverUrls.indexOf(clientDocuments[i].url) == -1) 
      continue;

    // well lookie here >:|, this was a client side redirect
    // a totally new document.
    payload.addRule({

      message:      'Avoid client-side redirects',
      key:          'redirect.clientside',
      type:         'error'

    }, {

      message:      '$ was redirected by client-side $',
      identifiers:  [ clientDocuments[i].url, 'Javascript' ]

    })

  }

  // done 
  setImmediate(fn, null);

};
