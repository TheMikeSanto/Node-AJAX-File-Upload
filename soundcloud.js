var http 				= require('http'),
		formidable 	= require('formidable'),
		fs 					= require('fs'), 
		sys 				= require('sys'),
		io 					= require('socket.io');

var server = http.createServer(function (req, res) {
	switch(req.url) {
		case '/':
	       // show the user a simple form
	    console.log("[200] " + req.method + " to " + req.url);
	    res.writeHead(200, "OK", {'Content-Type': 'text/html'});
	    fs.readFile('./index.html', function(err, html) {
	    	res.write(html);
	    }
	    res.end();
      break;
    case '/upload':
			if (req.method.toLowerCase() === 'post') {
				var form = new formidable.IncomingForm();
				var socket = io.connect('http://localhost:8000');
				form.on('progress', function(bytesReceived, bytesExpected) {
					var progress = {
						type: 'progress',
						bytesRecevied: bytesReceived,
						bytesExpected: bytesExpected
					};

					socket.broadcast(JSON.stringify(progress));
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

io.sockets.on('connection', function(socket) {
	socket.emit('news', {hello: 'world'});
});