var fs = require('fs');
var path = require('path');
var http2 = require('http2');

// We cache one file to be able to do simple performance tests without waiting for the disk
var cachedFile = fs.readFileSync(path.join(__dirname, './server.js'));
var cachedUrl = '/server.js';

// The callback to handle requests
function onRequest(request, response) {
  var filename = path.join(__dirname, request.url);

  var jsPush = response.push('/app.js');
  jsPush.writeHead(200);
  fs.createReadStream(path.join(__dirname, '/app.js')).pipe(jsPush);

  var cssPush = response.push('/app.css');
  cssPush.writeHead(200);
  fs.createReadStream(path.join(__dirname, '/app.css')).pipe(cssPush);

  response.writeHead(200);
  var fileStream = fs.createReadStream(path.join(__dirname, '/index.html'));
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
    key: fs.readFileSync(path.join(__dirname, '/localhost.key')),
    cert: fs.readFileSync(path.join(__dirname, '/localhost.crt'))
  }, onRequest);
}
server.listen(process.env.HTTP2_PORT || 8080);
