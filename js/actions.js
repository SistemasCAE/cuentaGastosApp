var fn = {
	deviceready: function(){
		//alert();
		document.addEventListener("deviceready", fn.init/*this.init*/, false);
	},
	init: function(){
		/*
		 * En esta sección vamos a asociar
		 * todos los eventos del "Click" al HTML
		 */
		//bcs.abrirCamara();
		fn.compruebaSesion();
		$("#botonEscanea").tap(bcs.abrirCamara);
		$("#botonTomarFoto").tap(mc.abrirCamara);
		$("#botonIniciarSesion").tap(fn.iniciarSesion);
		$("#botonCerrarSesion").tap(fn.cerrarSesion);
		$("#botonPendientes").tap(almacena.cargarDatosPendientes);
		$("#botonEnviar").tap(almacena.consultaDatosPendientes);
		$("#botonLimpiar").tap(almacena.limpiar);
		$("#botonEnviaDatos").tap(fn.comprobarDatos);
		$("#folio").tap(almacena.mostrarPopUp);
		
		fn.quitarClases();
		document.addEventListener("backbutton", fn.onBackKeyDown, false);
		//window.localStorage.setItem("nombreUsuario", "adominguez");
	},
	comprobarDatos: function(){
		
		var datoEscaneado = bcs.escaneo;
		var observaciones = $("#observaciones").val();
		var completo= $("#inicio select.completo").val();
		var imagen = $("#fotoTomadaRegistro img").attr("src");
		try{
			if(datoEscaneado === undefined){
				throw new Error("Favor de escanear el código");
			}
			if(observaciones == ""){
				throw new Error("No ha indicado ninguna observación");
			}
			if(imagen == "img/sin-imagen.jpg"){
				throw new Error("No ha tomado ninguna foto");
			}
			fn.enviarDatos(datoEscaneado, observaciones, imagen, completo);
		}catch(error){
			window.plugins.toast.show(error, 'short', 'center');
		}
	},
	enviarDatos: function(datoEscaneado, observaciones, imagen, completo){
		fn.quitarClases();
		window.location.href="#cargando";
		if(networkInfo.estaConectado() == false){
			var escaneado = bcs.escaneo;
			var foto_tomada = mc.tomada;
			
			window.plugins.toast.show("No existe conexión a internet, Datos almacenados localmente", 'long', 'center');
			almacena.guardaPedimento(window.localStorage.getItem("nombreUsuario"),escaneado, completo, foto_tomada, observaciones);
			window.location.href="#inicio";
			$("#observaciones").val('');
			$("#fotoTomadaRegistro").html('<img src="img/sin_imagen.jpg">');
		}else{
			$.ajax({
				method: "POST",
				url: "http://intranet.cae3076.com:50000/ControlEntregas/Recibe/guardaCG.php",
				data: { 
					informacion: datoEscaneado,
					estado: completo,
					observaciones: observaciones
				}
			}).done(function(mensaje){
				//alert("Datos enviados");
				if(mensaje != "0"){
					file.transferir(imagen,datoEscaneado);
				}else{
					window.plugins.toast.show("Usuario/Contraseña invalido(s)", 'long', 'center');
				}


				
			}).fail(function(error){
				alert(error.status);
				alert(error.message);
				alert(error.responseText);
			});
		}
		
	},
	onBackKeyDown: function(){
		// Handle the back button
		
		navigator.app.exitApp();
		return false;
	},
	cerrarSesion: function(){
		window.localStorage.removeItem("nombreUsuario");
		$("#usuarioSesion").val("");
		$("#passwordSesion").val(""); 
		window.location.href = "#inicioSesion";
	},
	iniciarSesion: function(){
		var usuario = $("#usuarioSesion").val();
		var password = $("#passwordSesion").val();
		try{
			if(usuario == ""){
				throw new Error("Especifique su usuario");
			}
			if(password == ""){
				throw new Error("Especifique su contraseña");
			}
			fn.enviarSesion(usuario, password);
		}catch(error){
			window.plugins.toast.show(error, 'short', 'center');
		}
	},
	compruebaSesion: function(){
		if(window.localStorage.getItem("nombreUsuario") != null){
			$("#usuario").html(window.localStorage.getItem("nombreUsuario"));
			
			window.location.href="#inicio";
		}
		fn.quitarClases();
	},
	enviarSesion: function(usuario, password){
		fn.quitarClases();
		//alert("Enviando datos");
		//alert("Nombre: "+nombreR+" Email: "+emailR+" Telefono: "+telefonoR+" Password: "+passwordR+" Foto: "+fotoR);
		if(networkInfo.estaConectado() == false){
			window.plugins.toast.show("No existe conexión a internet, revisela e intente de nuevo", 'long', 'center');
			//alert("No existe conexión a internet, revisela e intente de nuevo");
		}else{
			$.ajax({
				method: "POST",
				url: "http://intranet.cae3076.com:50000/ControlEntregas/Recibe/compruebaSesion.php",
				data: { 
					usu: usuario,
					pass: password
				}
			}).done(function(mensaje){
				//alert("Datos enviados");
				if(mensaje != "0"){
					window.localStorage.setItem("nombreUsuario", usuario);
					$("#usuario").html(usuario);
					window.location.href="#inicio";
				}else{
					window.plugins.toast.show("Usuario/Contraseña invalido(s)", 'long', 'center');
				}


				//alert(mensaje);
				//fn.sleep(3000);
				//bcs.abrirCamara().delay( 3000 );
			}).fail(function(error){
				alert(error.status);
				alert(error.message);
				alert(error.responseText);
			});
		}
		
	},
	enviarRegistro: function(datosLeidos){
		//alert("Enviando datos");
		//alert("Nombre: "+nombreR+" Email: "+emailR+" Telefono: "+telefonoR+" Password: "+passwordR+" Foto: "+fotoR);
		$.ajax({
			method: "POST",
			url: "http://intranet.cae3076.com:50000/ControlEntregas/Recibe/obtieneDatos.php",
			data: { 
				datos: datosLeidos,
				usu: window.localStorage.getItem("nombreUsuario")
			}
		}).done(function(mensaje){
			//alert( "Datos enviados");
			window.plugins.toast.show(mensaje, 'long', 'center');
			//alert(mensaje);
			fn.sleep(3000);
			//bcs.abrirCamara().delay( 3000 );
		}).fail(function(error){
			alert(error.status);
			alert(error.message);
			alert(error.responseText);
		});
	},
	sleep: function(milisegundos){
		var start = new Date().getTime();
		for (var i = 0; i < 1e7; i++) {
			if ((new Date().getTime() - start) > milisegundos){
				break;
			}
		}
		bcs.abrirCamara();
	},
	quitarClases: function(){
		$("#fotoTomadaRegistro").removeClass("ui-li-static");
		$("#fotoTomadaRegistro").removeClass("ui-body-inherit");
		$("#fotoTomadaRegistro").removeClass("ui-li-has-thumb");
		$("#fotoTomadaRegistro").removeClass("ui-last-child");
	}
};
/*
 *Llamar al metodo Init en el navegador
 */
//fn.init();

/*
 *Llamar deviceready para compilar
 */
//
fn.deviceready();
