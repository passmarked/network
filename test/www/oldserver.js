// curl -k https://localhost:8000/
const https = require('https');
const fs = require('fs');
const path  = require('path');

const options = {
  key: fs.readFileSync('./www/localhost.key'),
  cert: fs.readFileSync('./www/localhost.crt')
};

https.createServer(options, (req, res) => {
  
  if(req.url === '/app.js') {

    res.writeHead(200);
    var fileStream = fs.createReadStream(path.join(__dirname, '/app.js'));
    fileStream.pipe(res);
    fileStream.on('finish',res.end);

  } else if(req.url === '/app.css') {

    res.writeHead(200);
    var fileStream = fs.createReadStream(path.join(__dirname, '/app.css'));
    fileStream.pipe(res);
    fileStream.on('finish',res.end);

  } else {

    res.writeHead(200);
    var fileStream = fs.createReadStream(path.join(__dirname, '/index.html'));
    fileStream.pipe(res);
    fileStream.on('finish',res.end);

  }

}).listen(8000);
