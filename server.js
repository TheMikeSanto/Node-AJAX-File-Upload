var http        = require('http'),
    formidable  = require('formidable'),
    fs          = require('fs'),
    io          = require('socket.io'),
    mime        = require('mime'),
    forms       = {};

var server = http.createServer(function (req, res) {
	// Serve up the main page containing the form
	if (req.url === "/") {
		serveFile(res, "./index.html", 'text/html');
	}

	// Handle file upload POSTs
	if (req.url.split("?")[0] === "/upload") {
		if (req.method.toLowerCase() === 'post') {
			// Get the socket id out of the posted url
			// and create a new form object for it
			socket_id = req.url.split("sid=")[1];
			forms[socket_id] = new formidable.IncomingForm();
			form = forms[socket_id];

			// When form progress event fires, send the current progress
			// over the socket
			form.addListener('progress', (function (socket_id) {
			return function (bytesReceived, bytesExpected) {
				progress = (bytesReceived / bytesExpected * 100).toFixed(0);
				socket.sockets.socket(socket_id).send(progress);
			};
			})(socket_id));

			// Parse form and return file name in response
			form.parse(req, function (err, fields, files) {
				file_name = escape(files.upload.name);

				fs.rename(files.upload.path, virtualToPhysical("/uploads/" + file_name), function (err) {
					if (err) {
						throw err;
					} else {
						res.writeHead(200, {'Content-Type': 'text/html'});
						res.end(file_name);
					}
				});
			});
		} else {
			res.writeHead(405, "Method Not Allowed");
			res.end();
		}
	}

	// Handle description POSTs
	if (req.url === "/description") {
		if (req.method.toLowerCase() === 'post') {
			res.writeHead(200, {"Content-Type": "text/html"});
			res.end("success");
		} else {
			res.writeHead(405, "Method Not Allowed");
		}
	}

	// Serve up the requested file to the user after upload
	if (req.url.split("/")[1] === "uploads") {
		console.log("requesting file " + virtualToPhysical(req.url));
		serveFile(res, virtualToPhysical(req.url), mime.lookup(req.url));
	}

	// Handlers for loading static content
	if (req.url === "/client.js") {
		serveFile(res, "./assets/js/client.js", "text/javascript");
	}
	if (req.url === "/check.png") {
		serveFile(res, "./assets/img/check.png", "image/png");
	}
	if (req.url === "/jquery.form.js") {
		serveFile(res, "./assets/js/jquery.form.js", "text/javascript");
	}
	if (req.url === "/style.css") {
		serveFile(res, "./assets/css/style.css", "text/css");
	}
});

var socket = io.listen(server);
server.listen(80);

function virtualToPhysical(path) {
	return __dirname + path;
}

function serveFile(res, path, contentType) {
	fs.readFile(path, function (err, data) {
		if (err) {
			throw err;
		} else {
			console.log("serving file " + path);
			res.writeHead(200, {'Content-Type': contentType});
			res.end(data);
		}
	});
}