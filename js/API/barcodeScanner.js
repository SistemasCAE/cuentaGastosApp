var bcs = {
	abrirCamara: function(){
		cordova.plugins.barcodeScanner.scan(
			function (result) {
				if(result.text != ""){
					navigator.vibrate(500);
					$("#botonEscanea").removeClass("ui-btn-active");
					//alert("Datos Obtenidos\n" +
					//		"Result: " + result.text);
					if(networkInfo.estaConectado() == false){
						window.plugins.toast.show("No existe conexión a internet, Datos almacenados localmente", 'long', 'center');
						bcs.escaneo = result.text;
						//almacena.guardaPedimento(window.localStorage.getItem("nombreUsuario"),result.text,"");
					}else{
						bcs.escaneo = result.text;
					}
				  }
			  },
			function (error) {
				//alert("Scanning failed: " + error);
				window.plugins.toast.show("Scanning failed: " + error, 'long', 'center');
			},
			{
				"preferFrontCamera" : false, // iOS and Android 
				"showFlipCameraButton" : true, // iOS and Android 
				"prompt" : "Coloque el código en el área especificada", // supported on Android only 
				"formats" : "QR_CODE,RSS_EXPANDED,PDF_417",//"QR_CODE,DATA_MATRIX,UPC_E,UPC_A,EAN_8,EAN_13,CODE_128,CODE_39,CODE_93,CODABAR,ITF,RSS14,RSS_EXPANDED,PDF_417", // default: all but PDF_417 and RSS_EXPANDED 
				//"orientation" : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device 
				"showTorchButton" : true, // iOS and Android 
				"torchOn": false // Android, launch with the torch switched on (if available) 
			}
		);
	}
};