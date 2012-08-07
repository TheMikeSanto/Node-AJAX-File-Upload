var http 				= require('http'),
		formidable 	= require('formidable'),
		fs 					= require('fs'), 
		sys 				= require('sys'),
		io 					= require('socket.io'),
		clients 		= {};

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
       		progress = (bytesReceived / bytesExpected * 100).toFixed(2);
       		mb = (bytesExpected / 1024 / 1024).toFixed(1);

					socket.emit('progress', progress);
				});

				form.parse(req, function(err, fields, files) {
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

var socket = io.listen(server);
server.listen(8000);

socket.sockets.on("connection", function(socket) {
	clients[socket.id] = socket;
	socket.emit("connect", {message: "you've been connected"});
})