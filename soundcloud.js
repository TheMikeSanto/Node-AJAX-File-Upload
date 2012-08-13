var http 				= require('http'),
		formidable 	= require('formidable'),
		fs 					= require('fs'), 
		io 					= require('socket.io'),
		mime				= require('mime'),
		forms 			= {},
		current_client = "";

var server = http.createServer(function (req, res) {
	if (req.url == "/") {
    console.log("[200] " + req.method + " to " + req.url);
    res.writeHead(200, "OK", {'Content-Type': 'text/html'});
    fs.readFile('./index.html', function(err, html) {
    	if (err) {
    		throw err;
    	} else { 
    		res.end(html);
  		}
    });
  }

	if (req.url.split("/")[1] == "uploads") {
		console.log("requesting file " + virtualToPhysical(req.url));
		var file = fs.readFile(virtualToPhysical(req.url), function (err, data) {
			if (err) {
				throw err;
			} else {
				res.writeHead(200, { 'Content-Type': mime.lookup(req.url) });
				res.end(data, 'binary');
			}
		});
	}

	if (req.url.split("?")[0] == "/upload") {
		console.log("hit upload");
		if (req.method.toLowerCase() === 'post') {
			socket_id = req.url.split("sid=")[1];
			forms[socket_id] = new formidable.IncomingForm();
			form = forms[socket_id];

			form.addListener('progress', (function(socket_id) {
				return function (bytesReceived, bytesExpected) {
   				progress = (bytesReceived / bytesExpected * 100).toFixed(0);
					socket.sockets.socket(socket_id).send(progress);
				};
			})(socket_id));

			form.parse(req, function (err, fields, files) {
				file_name = escape(files.upload.name);

				fs.writeFile(virtualToPhysical("/uploads/" + file_name), files.upload, 'utf8', function (err) {
					if (err) {
						throw err;
					} else
						res.writeHead(200, {'Content-Type': 'text/html'});
						res.end(file_name);
				})
			});
		}
	}

	if (req.url == "/client.js") {
		fs.readFile('./client.js', function (err, data) {
			if (err) {
				throw err;
			} else {
				res.writeHead(200, {'Content-Type': 'text/javascript'});
				res.end(data);
			}
		});
	}
});

var socket = io.listen(server);
server.listen(8000);

function virtualToPhysical(path) {
	return __dirname + path;
}