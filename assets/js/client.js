$(document).ready(function() {
	// Set up jquery.form on our form
	var uploadFormOptions =
		{
			dataType: 'html',
			success: showFileSaved
		},
		descriptionFormOptions =
		{
			dataType: 'html',
			success: showDescriptionSaved
		};
	$("#file_form").ajaxForm(uploadFormOptions);
	$("#description_form").ajaxForm(descriptionFormOptions);

	// Set up socket for receiving progress events
	var socket = io.connect('http://ec2-23-23-18-45.compute-1.amazonaws.com');

	// Add the socket's session id onto the form so we can parse it out
	// server side
	socket.on("connect", function() {
		$("#file_form").attr("action", "/upload?sid=" + socket.socket.sessionid);
	});

	// Update the status when receiving progress updates
	socket.on('message', function(data) {
		$("#status").show();
		$("#percentage").text(data + "%");
	});

	// Submit form when images is selected, as long as the user selected a file
	$("input:file").change(function() {
		if ($(this).val() != "") {
			$("#file_form").submit();
			$("#file_link").text("");
		} else {
			$("#status").hide();
			$("#file_link").hide();
		}
	});

	// Show link to completed file upload after file is finished uploading
	function showFileSaved(responseText, statusText, xhr, $form) {
		$("#file_link").attr("href", '/uploads/' + responseText).text("View file here").show();
	}

	// Show the user that their description was posted successfully
	function showDescriptionSaved(responseText, statusText, xhr, $form) {
		$("#description_form .success").show();
	}
});