var file = {
	exito: function(r){
		alert(r.response);
		window.localStorage.setItem("nombreUsuario", $("#nombreRegistro").val());
		window.location.href="#home";
	},

	error: function(error){
		alert(error.code);
		alert(error.source);
		alert(error.target);
		alert("Error al enviar foto al servidor.");
	},

	transferir: function(fileURL){
		var options = new FileUploadOptions();
		options.fileKey = "foto";
		options.fileName = "miFoto";
		options.mimeType = "image/jpeg";
		options.chunkedMode = false;
		options.headers = {
			Connection: "close"
		};
		var ft = new FileTransfer();
		ft.upload(fileURL, encodeURI("http://intranet.cae3076.com:50000/CursoAndroid/guardaCG.php"), file.exito, file.error, options);
	}
}