var http = require('http')
,formidable = require('formidable')
,fs = require('fs')
 , sys = require('sys');

http.createServer(function (req, res) {
  // set up some routes
  switch(req.url) {
    case '/':
         // show the user a simple form
          console.log("[200] " + req.method + " to " + req.url);
          res.writeHead(200, "OK", {'Content-Type': 'text/html'});
          res.write('<html><head><title>Hello Noder!</title></head><body>');
          res.write('<h1>Welcome Noder, who are you?</h1>');
          res.write('<form enctype="multipart/form-data" action="/formhandler" method="post">');
          res.write('Name: <input type="text" name="username" value="John Doe" /><br />');
          res.write('Age: <input type="text" name="userage" value="99" /><br />');
          res.write('File :<input type="file" name="upload" multiple="multiple"><br>');
          res.write('<input type="submit" />');
          res.write('</form></body></html');
          res.end();
      break;
    case '/formhandler':
        if (req.method == 'POST') {
            console.log("[200] " + req.method + " to " + req.url);

            req.on('data', function(chunk) {
              console.log("Received body data:");
              // console.log(chunk.toString());
            });
            var form = new formidable.IncomingForm();
            form.parse(req, function(err,fields, files) {
                console.log('in if condition'+sys.inspect({fields: fields, files: files}));
               fs.writeFile(files.upload.name, files.upload,'utf8', function (err) {
                      if (err) throw err;
                      console.log('It\'s saved!');
                });

              res.writeHead(200, {'content-type': 'text/plain'});
              res.write('received upload:\n\n');
              res.end();
            });
            req.on('end', function() {
              // empty 200 OK response for now
              res.writeHead(200, "OK", {'Content-Type': 'text/html'});
              res.end();
            });

          } else {
            console.log("[405] " + req.method + " to " + req.url);
            res.writeHead(405, "Method not supported", {'Content-Type': 'text/html'});
            res.end('<html><head><title>405 - Method not supported</title></head><body><h1>Method not supported.</h1></body></html>');
          }
      break;
    default:
      res.writeHead(404, "Not found", {'Content-Type': 'text/html'});
      res.end('<html><head><title>404 - Not found</title></head><body><h1>Not found.</h1></body></html>');
      console.log("[404] " + req.method + " to " + req.url);
  };
}).listen(8000)
