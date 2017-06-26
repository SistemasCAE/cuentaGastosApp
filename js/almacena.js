var almacena = {
	db: null,
	usuario: null,
	informacion: null,
	estado: null,
	foto_ruta: null,
	observaciones: null,
	conectarDB: function(){
		return window.openDatabase("Modulacion", "1.0", "Modulacion", 200000);
	},
	error: function(error){
		//alert("Error: "+error.message);
	},
	exito: function(){
		//alert("Exito");
	},
	//guardarReservasHistorial: function(th, np, nh, nd){
	guardaPedimento: function(usu, inf, est, foto, obs){
		almacena.db              = almacena.conectarDB();
		almacena.usuario  		 = usu;
		almacena.informacion     = inf;
		almacena.estado 		 = est;
		almacena.foto_ruta 		 = foto;
		almacena.observaciones 	 = obs;
		almacena.db.transaction(almacena.tablaPendientes, almacena.error, almacena.exito);
	},
	tablaPendientes: function(tx){
		// CREAR TABLA DE HISTORIAL
		tx.executeSql('CREATE TABLE IF NOT EXISTS Pendientes (id INTEGER, usuario, informacion, estado, foto, observaciones, primary key(informacion))');

		// INSERTAR LOS DATOS
		tx.executeSql('INSERT INTO Pendientes (usuario, informacion, estado, foto, observaciones) VALUES ("'+almacena.usuario+'", "'+almacena.informacion+'", "'+almacena.estado+'","'+almacena.foto_ruta+'","'+almacena.observaciones+'")');
	},

	cargarDatosPendientes: function(){
		almacena.db = almacena.conectarDB();
		almacena.db.transaction(almacena.leerPendientes, almacena.error);
	},

	leerPendientes: function(tx){
		// CREAR TABLA DE HISTORIAL SI NO EXISTE
		tx.executeSql('CREATE TABLE IF NOT EXISTS Pendientes (id INTEGER, usuario, informacion, estado, foto, observaciones, primary key(informacion))');

		// LEER DEL HISTORIAL
		tx.executeSql('SELECT * FROM Pendientes WHERE usuario="'+window.localStorage.getItem("nombreUsuario")+'"', [], almacena.mostrarResultadosPendientes, null);
	},

	mostrarResultadosPendientes: function(tx, res){
		var cantidad = res.rows.length;
		var resultado = '<tr><td colspan="4">No hay entregas pendientes</td></tr>';

		if(cantidad > 0){
			// SI HAY RESERVAS EN EL HISTORIAL
			resultado = '';

			for( var i = 0; i < cantidad; i++){
				var usu = res.rows.item(i).usuario;
				var inf = res.rows.item(i).informacion;
				var est = res.rows.item(i).estado;
				var img = res.rows.item(i).foto;
				var obs = res.rows.item(i).observaciones;
				if(est == ""){
					est = "&nbsp;"
				}
				est='No Enviado';
				resultado += "<tr><td>"+(i+1).toString()+"</td><td>"+usu+"</td><td><a href='#' class='folio' urlImagen='"+img+"|"+obs+"'>"+inf+"</a></td><td>"+est+"</td></tr>";
			}
		}
		//$("#informacion").removeClass("ui-table");
		//$("#informacion").removeClass("ui-table-reflow");
		$("#listaPendientes").html(resultado);
		$("#folio1").tap(almacena.mostrarPopUp);
		$(".folio").tap(almacena.mostrarPopUp);
		
	},
	mostrarPopUp : function()
	{
		var cadena = $(this).attr("urlImagen");
		var vector=cadena.split('|');
		$("#popup").popup("open");
		$("#popupfoto img").attr("src" , vector[0]);
		$("#observaciones_mostrar").html(vector[1]);
		//window.plugins.toast.show(vector[1], 'long', 'center');
	},
	consultaDatosPendientes: function(){
		if(networkInfo.estaConectado() == false){
			window.plugins.toast.show("No existe conexión a internet.", 'long', 'center');
		}else{
			almacena.db = almacena.conectarDB();
			almacena.db.transaction(almacena.seleccionarPendientes, almacena.error);
		}
		
	},

	seleccionarPendientes: function(tx){
		// CREAR TABLA DE HISTORIAL SI NO EXISTE
		tx.executeSql('CREATE TABLE IF NOT EXISTS Pendientes (id INTEGER, usuario, informacion, estado, foto, observaciones, primary key(informacion))');

		// LEER DEL HISTORIAL
		tx.executeSql('SELECT * FROM Pendientes WHERE usuario="'+window.localStorage.getItem("nombreUsuario")+'"', [], almacena.enviarPendientes, null);
	},

	enviarPendientes: function(tx, res){
		var cantidad = res.rows.length;
		var resultado = '<tr><td colspan="4">No hay entregas pendientes</td></tr>';
		//alert("Primer paso: " + cantidad.toString());
		if(cantidad > 0){
			// SI HAY RESERVAS EN EL HISTORIAL
			resultado = '';
			for( var i = 0; i < cantidad; i++){
				almacena.resultado = "";
				almacena.informacion2 = "";	
				var usu = res.rows.item(i).usuario;
				var inf = res.rows.item(i).informacion;
				var est = res.rows.item(i).estado;
				var img = res.rows.item(i).foto;
				var obs = res.rows.item(i).observaciones;
				
				almacena.enviaAjax(inf,img,obs);
					
				
				
				
				alert("enviando registros");
			}
			//alert("Envío Finalizado");
		}
		//$("#informacion").removeClass("ui-table");
		//$("#informacion").removeClass("ui-table-reflow");
		
	},
	
	enviaAjax: function(informacion,imagen, observaciones){
	alert("llegue al envio");
		$.ajax({
				method: "POST",
				url: "http://intranet.cae3076.com:50000/ControlEntregas/Recibe/GuardaCG.php",
				data: { 
					datos: informacion,
					observaciones: observaciones,
					usu: window.localStorage.getItem("nombreUsuario")
				}
			}).done(function(mensaje){
			alert("en mensaje "+mensje);
			if(mensaje != "0"){
					file.transferir(imagen,informacion);
				}else{
					window.plugins.toast.show("Usuario/Contraseña invalido(s)", 'long', 'center');
				}
			
		//alert("asigna mensaje "+mensaje);
		almacena.resultado = mensaje;
		almacena.db.transaction(function(tx){
							almacena.hacerUpdate(tx, informacion, mensaje);
						}, almacena.error);
					});
	},
	
	hacerUpdate: function(tx, informacion, mensaje){
		tx.executeSql('CREATE TABLE IF NOT EXISTS Pendientes (id INTEGER, usuario, informacion, estado, foto, observaciones, primary key(informacion))');
		tx.executeSql('UPDATE Pendientes SET estado = "'+mensaje+'" WHERE informacion= "'+informacion+'" AND usuario="'+window.localStorage.getItem("nombreUsuario")+'"');
		almacena.cargarDatosPendientes();
	},
	
	limpiar: function(){
		almacena.db = almacena.conectarDB();
		almacena.db.transaction(almacena.limipiarTabla, almacena.error);
	},
	
	limipiarTabla: function(tx){
		tx.executeSql('CREATE TABLE IF NOT EXISTS Pendientes (id INTEGER, usuario, informacion, estado, foto, observaciones, primary key(informacion))');
		tx.executeSql('DELETE FROM Pendientes WHERE  usuario="'+window.localStorage.getItem("nombreUsuario")+'"');
		almacena.cargarDatosPendientes();
	},
	
	sleep: function(milisegundos){
		var start = new Date().getTime();
		for (var i = 0; i < 1e7; i++) {
			if ((new Date().getTime() - start) > milisegundos){
				break;
			}
		}
	}
	

}; 