$(document).ready(function() {
	var formOptions =
		{
			type: 'post',
			dataType: 'html',
			clearForm: true,
			success: showResponse
		};

	$("form").ajaxForm(formOptions);

	// Set up socket for receiving progress events
	var socket = io.connect('http://localhost:8000');

	// Add the socket's session id onto the form so we can parse it out
	// server side
	socket.on("connect", function() {
		$("form").attr("action", "/upload?sid=" + socket.socket.sessionid);
	});

	// Update the status when receiving progress updates
	socket.on('message', function(data) {
		$("#status").show();
		$("#percentage").text(data + "%");
	});

	// Submit form when images is selected, as long as the user selected a file
	$("input:file").change(function() {
		if ($(this).val() != "") {
			$("form").submit();
			$("#file_link").text("");
		}
	});

	function showResponse(responseText, statusText, xhr, $form) {
		$("#file_link").attr("href", '/uploads/' + responseText).text("View file here");
	}
});