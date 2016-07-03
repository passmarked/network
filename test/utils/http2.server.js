var fs = require('fs');
var path = require('path');
var http2 = require('http2');

// We cache one file to be able to do simple performance tests without waiting for the disk
var cachedFile = fs.readFileSync(path.join(__dirname, '/../www/server.js'));
var cachedUrl = '/server.js';

module.exports = exports = function() {

  // The callback to handle requests
  function onRequest(request, response) {
    var filename = path.join(__dirname, request.url);

    var jsPush = response.push('/app.js');
    jsPush.writeHead(200);
    fs.createReadStream(path.join(__dirname, '/../www/app.js')).pipe(jsPush);

    var cssPush = response.push('/app.css');
    cssPush.writeHead(200);
    fs.createReadStream(path.join(__dirname, '/../www/app.css')).pipe(cssPush);

    response.writeHead(200);
    var fileStream = fs.createReadStream(path.join(__dirname, '/../www/index.html'));
    fileStream.pipe(response);
    fileStream.on('finish',response.end);

  }

  // Creating the server in plain or TLS mode (TLS mode is the default)
  var server;
  if (process.env.HTTP2_PLAIN) {
    server = http2.raw.createServer({
    }, onRequest);
  } else {
    server = http2.createServer({
      key: fs.readFileSync(path.join(__dirname, '/../www/localhost.key')),
      cert: fs.readFileSync(path.join(__dirname, '/../www/localhost.crt'))
    }, onRequest);
  }
  return server;

};
