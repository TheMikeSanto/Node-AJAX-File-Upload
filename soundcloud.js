var http 				= require('http'),
		formidable 	= require('formidable'),
		fs 					= require('fs'), 
		sys 				= require('sys');

var server = http.createServer(function (req, res) {
	switch(req.url) {
		case '/':
	       // show the user a simple form
	    console.log("[200] " + req.method + " to " + req.url);
	    res.writeHead(200, "OK", {'Content-Type': 'text/html'});
	    res.write('<html><head><title>Hello Noder!</title></head><body>');
	    res.write('<h1>Welcome Noder, who are you?</h1>');
	    res.write('<form enctype="multipart/form-data" action="/upload" method="post">');
	    res.write('Name: <input type="text" name="username" value="John Doe" /><br />');
	    res.write('Age: <input type="text" name="userage" value="99" /><br />');
	    res.write('File :<input type="file" name="upload" multiple="multiple"><br>');
	    res.write('<input type="submit" />');
	    res.write('</form></body></html');
	    res.end();
      break;
    case '/upload':
    	console.log(req.method.toLowerCase());
			if (req.method.toLowerCase() === 'post') {
				var form = new formidable.IncomingForm();
				form.addListener('progress', function(bytesReceived, bytesExpected) {
					console.log(bytesRecevied + " out of " + bytesExpected);
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

server.listen(8000);