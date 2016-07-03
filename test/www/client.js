var fs = require('fs');
var path = require('path');
var http2 = require('http2');
var urlParse = require('url').parse;

// Setting the global logger (optional)
var agent = new http2.Agent({
  rejectUnauthorized: false
});

// Sending the request
var url = process.argv.pop();
var options = urlParse(url);
options.agent = agent;
// options.port = 8080;

var request = http2.get(options);

// Receiving the response
request.on('response', function(response) {
  console.dir(response.statusCode);
  console.dir(response.headers);
  console.dir(response.httpVersion);
  response.on('data', function(data){ /* console.log(data.toString()); */ });
  // response.pipe(process.stdout);
  response.on('end', finish);
});

request.on('error', function(err) {

  console.dir(err);

});

// Receiving push streams
request.on('push', function(pushRequest) {
  push_count += 1;
  console.error('Received push request: ' + pushRequest.url);
  pushRequest.on('response', function(pushResponse) {
    finish();
    //pushResponse.pipe(fs.createWriteStream(filename)).on('finish', finish);
  });
});

// Quitting after both the response and the associated pushed resources have arrived
var push_count = 0;
var finished = 0;
function finish() {
  finished += 1;
  if (finished === (1 + push_count)) {
    // process.exit();
  }
}
