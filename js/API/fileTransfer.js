var file = {
	exito: function(){
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
		ft.upload(fileURL, encodeURI("http://www.colors.edu.mx/archivoTest.php"), file.exito, file.error, options);
	}
}