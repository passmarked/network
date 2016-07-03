// curl -k https://localhost:8000/
const https = require('https');
const fs = require('fs');
const path  = require('path');

const options = {

  key: fs.readFileSync(path.join(__dirname, '/../www/localhost.key')),
  cert: fs.readFileSync(path.join(__dirname, '/../www/localhost.crt'))

};

module.exports = exports = function() {

  return https.createServer(options, (req, res) => {
  
    if(req.url === '/app.js') {

      res.writeHead(200);
      var fileStream = fs.createReadStream(path.join(__dirname, '/../www/app.js'));
      fileStream.pipe(res);
      fileStream.on('finish',res.end);

    } else if(req.url === '/app.css') {

      res.writeHead(200);
      var fileStream = fs.createReadStream(path.join(__dirname, '/../www/app.css'));
      fileStream.pipe(res);
      fileStream.on('finish',res.end);

    } else {

      res.writeHead(200);
      var fileStream = fs.createReadStream(path.join(__dirname, '/../www/index.html'));
      fileStream.pipe(res);
      fileStream.on('finish',res.end);

    }

  });

};
