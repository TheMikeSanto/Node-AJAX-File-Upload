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
				console.log("post");
				var form = new formidable.IncomingForm();

				socket.of('/upload').on('connection', function (client) {
					console.log("socket connected");
					form.on('progress', function (bytesReceived, bytesExpected) {
       			progress = (bytesReceived / bytesExpected * 100).toFixed(0);

						socket.of('/upload').socket(client.id).emit('progress', progress);
					});
				});

				form.parse(req, function(err, fields, files) {
					fs.writeFile(files.upload.name, files.upload, 'utf8', function (err) {
						if (err) throw err;
						console.log(files.upload.name + " has been saved");
					})
					console.log("form parsed");
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

socket.sockets.on("disconnect", function(socket) {
	console.log(socket.id + " disconnected.");
});