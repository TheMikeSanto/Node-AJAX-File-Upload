var socket = io.connect('http://localhost:8000');
socket.on('progress', function(data) {
	console.log(data);
});