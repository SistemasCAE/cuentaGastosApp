var file = {
	exito: function(r){
		window.location.href="#inicio";
		window.plugins.toast.show("Guardado correctamente", 'long', 'center');
		//window.localStorage.setItem("nombreUsuario", $("#nombreRegistro").val());
		//window.location.href="#home";
	},

	error: function(error){
		alert(error.code);
		alert(error.source);
		alert(error.target);
		alert("Error al enviar foto al servidor.");
	},

	transferir: function(fileURL,folio){
		var options = new FileUploadOptions();
		options.fileKey = "foto";
		options.fileName = folio;
		options.mimeType = "image/jpeg";
		options.chunkedMode = false;
		options.headers = {
			Connection: "close"
		};
		var ft = new FileTransfer();
		ft.upload(fileURL, encodeURI("http://200.92.207.198:50081/ControlEntregas/Recibe/guardaCG.php"), file.exito, file.error, options);
	}
}