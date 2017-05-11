var almacena = {
	db: null,
	usuario: null,
	informacion: null,
	estado: null,
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
	guardaPedimento: function(usu, inf, est){
		almacena.db              = almacena.conectarDB();
		almacena.usuario  		 = usu;
		almacena.informacion     = inf;
		almacena.estado 		 = est;
		almacena.db.transaction(almacena.tablaPendientes, almacena.error, almacena.exito);
	},
	tablaPendientes: function(tx){
		// CREAR TABLA DE HISTORIAL
		tx.executeSql('CREATE TABLE IF NOT EXISTS Pendientes (id INTEGER, usuario, informacion, estado, primary key(informacion))');

		// INSERTAR LOS DATOS
		tx.executeSql('INSERT INTO Pendientes (usuario, informacion, estado) VALUES ("'+almacena.usuario+'", "'+almacena.informacion+'", "'+almacena.estado+'")');
	},

	cargarDatosPendientes: function(){
		almacena.db = almacena.conectarDB();
		almacena.db.transaction(almacena.leerPendientes, almacena.error);
	},

	leerPendientes: function(tx){
		// CREAR TABLA DE HISTORIAL SI NO EXISTE
		tx.executeSql('CREATE TABLE IF NOT EXISTS Pendientes (id INTEGER, usuario, informacion, estado, primary key(informacion))');

		// LEER DEL HISTORIAL
		tx.executeSql('SELECT * FROM Pendientes WHERE usuario="'+window.localStorage.getItem("nombreUsuario")+'"', [], almacena.mostrarResultadosPendientes, null);
	},

	mostrarResultadosPendientes: function(tx, res){
		var cantidad = res.rows.length;
		var resultado = '<tr><td colspan="4">No hay pedimentos pendientes</td></tr>';

		if(cantidad > 0){
			// SI HAY RESERVAS EN EL HISTORIAL
			resultado = '';

			for( var i = 0; i < cantidad; i++){
				var usu = res.rows.item(i).usuario;
				var inf = res.rows.item(i).informacion;
				var est = res.rows.item(i).estado;
				if(est == ""){
					est = "&nbsp;"
				}
				var vectorInfo = inf.trim().split("\n");
				if(vectorInfo.length == 12){
					var patente 	= vectorInfo[0].trim();
					var pedimento 	= vectorInfo[1].trim();
					if(patente.length != 4){
						est = "Datos invalidos";
					}
					if(pedimento.length != 7){
						est = "Datos invalidos";
					}
					inf = patente+"-"+pedimento;
				}else{
					inf = "No encontrado";
					est = "Datos invalidos";
				}
				resultado += '<tr><td>'+(i+1).toString()+'</td><td>'+usu+'</td><td>'+inf+'</td><td>'+est+'</td></tr>';
			}
		}
		//$("#informacion").removeClass("ui-table");
		//$("#informacion").removeClass("ui-table-reflow");
		$("#listaPendientes").html(resultado);
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
		tx.executeSql('CREATE TABLE IF NOT EXISTS Pendientes (id INTEGER, usuario, informacion, estado, primary key(informacion))');

		// LEER DEL HISTORIAL
		tx.executeSql('SELECT * FROM Pendientes WHERE usuario="'+window.localStorage.getItem("nombreUsuario")+'"', [], almacena.enviarPendientes, null);
	},

	enviarPendientes: function(tx, res){
		var cantidad = res.rows.length;
		var resultado = '<tr><td colspan="4">No hay pedimentos pendientes</td></tr>';
		//alert("Primer paso: " + cantidad.toString());
		if(cantidad > 0){
			// SI HAY RESERVAS EN EL HISTORIAL
			resultado = '';
			for( var i = 0; i < cantidad; i++){
				almacena.resultado = "";
				almacena.informacion2 = "";	
				var inf = res.rows.item(i).informacion;
				var est = res.rows.item(i).estado;
				if(est == ""){
					est = "&nbsp;"
				}
				var vectorInfo = inf.trim().split("\n");
				if(vectorInfo.length == 12){
					var patente 	= vectorInfo[0].trim();
					var pedimento 	= vectorInfo[1].trim();
					if(patente.length != 4){
						est = "Datos invalidos";
					}
					if(pedimento.length != 7){
						est = "Datos invalidos";
					}
				}else{
					est = "Datos invalidos";
				}
				if(est != "Datos invalidos"){
					almacena.enviaAjax(inf);
					
				}
				//alert("Termina envio primero");
			}
			alert("Envío Finalizado");
		}
		//$("#informacion").removeClass("ui-table");
		//$("#informacion").removeClass("ui-table-reflow");
		
	},
	
	enviaAjax: function(informacion){
		$.ajax({
				method: "POST",
				url: "http://intranet.cae3076.com:50000/CursoAndroid/obtieneDatos.php",
				data: { 
					datos: informacion,
					usu: window.localStorage.getItem("nombreUsuario")
				}
			}).done(function(mensaje){
		//alert("asigna mensaje "+mensaje);
		almacena.resultado = mensaje;
		almacena.db.transaction(function(tx){
							almacena.hacerUpdate(tx, informacion, mensaje);
						}, almacena.error);
					});
	},
	
	hacerUpdate: function(tx, informacion, mensaje){
		tx.executeSql('CREATE TABLE IF NOT EXISTS Pendientes (id INTEGER, usuario, informacion, estado, primary key(informacion))');
		tx.executeSql('UPDATE Pendientes SET estado = "'+mensaje+'" WHERE informacion= "'+informacion+'" AND usuario="'+window.localStorage.getItem("nombreUsuario")+'"');
		almacena.cargarDatosPendientes();
	},
	
	limpiar: function(){
		almacena.db = almacena.conectarDB();
		almacena.db.transaction(almacena.limipiarTabla, almacena.error);
	},
	
	limipiarTabla: function(tx){
		tx.executeSql('CREATE TABLE IF NOT EXISTS Pendientes (id INTEGER, usuario, informacion, estado, primary key(informacion))');
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