var http 				= require('http'),
		formidable 	= require('formidable'),
		fs 					= require('fs'), 
		sys 				= require('sys'),
		io 					= require('socket.io');

var server = http.createServer(function (req, res) {
	switch(req.url) {
		case '/':
	    console.log("[200] " + req.method + " to " + req.url);
	    res.writeHead(200, "OK", {'Content-Type': 'text/html'});
	    fs.readFile('./index.html', function(err, html) {
	    	res.end(html);
	    });
      break;
    case '/upload':
			if (req.method.toLowerCase() === 'post') {
				var form = new formidable.IncomingForm();
				form.on('progress', function(bytesReceived, bytesExpected) {
					var progress = {
						type: 'progress',
						bytesRecevied: bytesReceived,
						bytesExpected: bytesExpected
					};

					io.sockets.on('connection', function(socket) {
						socket.emit('progress', JSON.stringify(progress));
					});
				});

				form.parse(req, function(err, fields, files) {
      		res.writeHead(200, {'content-type': 'text/plain'});
      		res.end();
    		});
			} else {
				res.writeHead(405, "Method not supported", {'Content-type': 'text/html'});
				res.end();
			}
			break;
		default:
		res.writeHead(404, 'Not found', {'Content-type': 'text/html'});
		res.end();
	}
});

var io = io.listen(server);
server.listen(8000);