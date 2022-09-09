function infoError(numeroExcepcion, parametro) {
	status.code = 400;
	status.message = messageError(numeroExcepcion, parametro);
	status.redirect = true;
}

var messageError = function (numeroExcepcion, parametro) {
	var message = null;
	switch (numeroExcepcion) {
		case 1: message = "Error al leer las propiedades del documento." + parametro
			break;
		case 2: message = "Documento no encontrado."
			break;
		case 3: message = "Ya existe un documento con el mismo nombre: " + parametro;
			break;
		case 4: message = "Ocurrio un error en el mantenimiento de documentos"
			break;
		case 5: message = "La carpeta inicial '" + parametro + "' debe estar creada"
			break;
	}
	return message;
}

var obtenerNodoRuta = function (ruta) {
	var rutaArr = ruta.split("/cm:");

	var ultimoNombre = codificarISO9075(rutaArr[3]);
	var rutaBase = rutaArr[0] + "/cm:" + rutaArr[1] + "/cm:" + rutaArr[2] + "/cm:" + ultimoNombre;

	var nodoBase = search.xpathSearch(rutaBase);
	if (nodoBase == null || nodoBase.length <= 0) {
		infoError(5, ultimoNombre);
		return null;
	}
	nodoBase = nodoBase[0];
	for (var i = 4; i < rutaArr.length; i++) {
		var nombreNodo = codificarISO9075(rutaArr[i]);
		rutaBase += "/cm:" + nombreNodo;
		var nodoRuta = search.xpathSearch(rutaBase);
		if (nodoRuta != null && nodoRuta.length > 0) {
			nodoBase = nodoRuta[0];
		} else {
			nodoBase = nodoBase.createFolder(rutaArr[i]);
		}
	}
	return nodoBase;
};


var codificarISO9075 = function (xPathUpdateDocument) {
	if (xPathUpdateDocument == null || xPathUpdateDocument == "") {
		return xPathUpdateDocument;
	}
	if (xPathUpdateDocument.indexOf('cm:') < 0) {
		if (!(xPathUpdateDocument.indexOf("_x") == 0)) {
			return search.ISO9075Encode(xPathUpdateDocument);
		}
		return xPathUpdateDocument;
	}

	var arrPrincipal = xPathUpdateDocument.split("/app:company_home/st:sites/");
	var principal = "";
	var path = "";
	var pathfinal = "";

	if (arrPrincipal.length > 1) {
		principal = "/app:company_home/st:sites/";
		path = arrPrincipal[1];
	} else {
		path = arrPrincipal[0];
	}

	var arrPath = path.split("cm:");
	for (var key in arrPath) {
		var item = arrPath[key];
		if (item == "") {
			continue;
		}
		var encoded = item.replace("/", "");
		if (!(item.indexOf("_x") == 0)) {
			encoded = search.ISO9075Encode(encoded);
		}
		pathfinal += "cm:" + encoded + "/";
	}
	pathfinal = principal + pathfinal.substring(0, pathfinal.length - 1);

	return pathfinal;
};




function main() {
	//Parametros
	var ubicacion = args.ubicacion;
	var modificadoPor = args.modificadoPor;
	var tipoArchivo = args.tipo;
	if (tipoArchivo == null) {
		tipoArchivo = "cm:content";
	}
	var propiedades = null;
	var propiedadesToSet = [];
	var aspectos = eval('(' + unescape(args.aspectos) + ')');
	try {
		propiedades = eval('(' + unescape(args.propiedades) + ')');
		for (var key in propiedades) {
			var item = propiedades[key];
			if (item["type"] == "date") {
				propiedadesToSet[key] = utils.fromISO8601(item["value"]);
			} else if (item["type"] == "number") {
				propiedadesToSet[key] = parseInt(item["value"]);
			} else {
				propiedadesToSet[key] = String(item["value"]);
			}
		}
	} catch (Err) {
		infoError(1, jsonUtils.toJSONString(propiedades));
		return;
	}
	//Datos Archivo
	var file = null;
	var filename = null;
	var xPathUpdateDocument = null

	for each(field in formdata.fields) {
		if(field.name == "archivo" && field.isFile) {
			file = field;
		}else if (field.name == "filename") {
			filename = unescape(field.value);
		} else if (field.name == "xPathUpdateDocument") {
			xPathUpdateDocument = field.value;
		}
}

var nodoDocumento = null;
if (propiedadesToSet['cm:name']) {
	filename = propiedadesToSet['cm:name'];
}
try {
	if (xPathUpdateDocument != null) {
		nodoDocumento = search.xpathSearch(codificarISO9075(xPathUpdateDocument));
		//nodoDocumento = search.xpathSearch(nodoRuta.qnamePath);
		if (nodoDocumento.length > 0) {
			nodoDocumento = nodoDocumento[0];
			if (!nodoDocumento.hasAspect("cm:versionable")) {
				nodoDocumento.addAspect("cm:versionable");
			}
			for (var key in propiedadesToSet) {
				var item = propiedadesToSet[key];
				nodoDocumento.properties[key] = item;
			}
			nodoDocumento.save();

			nodoDocumento.ensureVersioningEnabled(true, true);
			nodoDocumentoCopia = nodoDocumento.checkout();
			nodoDocumentoCopia.properties.content.write(file.content);
			nodoDocumentoCopia.properties.content.guessEncoding();
			nodoDocumentoCopia.properties.content.guessMimetype(filename);
			// nodoDocumentoCopia.properties.name = String(filename);
			nodoDocumentoCopia = nodoDocumentoCopia.checkin();


		} else {
			nodoDocumento = null;
		}
	} else {
		var nodoRuta = obtenerNodoRuta(ubicacion);
		if (nodoRuta == null) {
			return;
		}
		if (search.xpathSearch(nodoRuta.qnamePath + "/cm:" + search.ISO9075Encode(filename)).length > 0) {
			infoError(3, filename);
			return;
		}
		// propiedadesToSet["cm:creator"] = modificadoPor;
		// propiedadesToSet["cm:modifier"] = modificadoPor;
		nodoDocumento = nodoRuta.createNode(filename, tipoArchivo, propiedadesToSet);
		nodoDocumento.properties.content.write(file.content);
		nodoDocumento.properties.content.guessEncoding();
		nodoDocumento.properties.content.guessMimetype(filename);
		if (!nodoDocumento.hasAspect("cm:versionable")) {
			nodoDocumento.addAspect("cm:versionable");
		}

		nodoDocumento.save();
		//Agregar aspectos
	}

} catch (Err) {
	status.code = 400;
	status.message = Err;
	status.redirect = true;
	return;
}

var documentoMapa = eval('(' + '{}' + ')'); //crear un mapa en blanco
//Crear atributos principales del documento
documentoMapa.nombre = nodoDocumento.properties.name;
documentoMapa.accesoDescarga = nodoDocumento.downloadUrl;
documentoMapa.tipo = nodoDocumento.typeShort;
documentoMapa.referencia = nodoDocumento.nodeRef;
documentoMapa.xPathLocationPadre = nodoDocumento.parent.qnamePath;
documentoMapa.xPathLocation = nodoDocumento.qnamePath;
//Recuperar todos los metadatos del documento
json = eval('(' + appUtils.toJSON(nodoDocumento, true) + ')');
documentoMapa.propiedades = jsonUtils.toJSONString(json.properties);
model.documentoMapa = documentoMapa;
}
main();