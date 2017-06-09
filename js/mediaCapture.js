var mc = {
	exito: function(mediaFiles){
		var path = mediaFiles[0].fullPath;
		//alert(path.replace("file://", ""));
		$("#fotoTomadaRegistro").html('<img src="'+path+'" >');
	},

	error: function(){
		alert("Error al tomar foto");
	},

	abrirCamara: function(){
		navigator.device.capture.captureImage(mc.exito, mc.error, {limit:1});
	}
};