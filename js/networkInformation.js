var networkInfo = {
	estaConectado: function(){
		if(navigator.connection.type != Connection.NONE){
			return true;
		}
		return false;
	}
};