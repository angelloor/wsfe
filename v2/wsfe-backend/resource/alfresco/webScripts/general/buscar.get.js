function buscaDocumentos(query) {
	documentos = search.luceneSearch(query);

	if (documentos != undefined) return documentos;
	else return undefined;
}

function main() {
	try {
		if (args.query != undefined) {
			var documentosMapa = [];
			//metodo busqueda por query
			model.query = search.ISO9075Encode(args.query);
			var documentos = buscaDocumentos(args.query);
			var idHistoria = args.idHistoria;

			// Si viene el id de Historia, busca en el historial el documento
			if (idHistoria !== null && idHistoria !== undefined && idHistoria !== "") {
				if (documentos.length > 0) {
					nodoDocumento = documentos[0];
					nodoDocumento.ensureVersioningEnabled(true, true);
					if (nodoDocumento.isVersioned) {
						lDocumentoVersionHistory = nodoDocumento.getVersionHistory();
						for each(scriptVersion in lDocumentoVersionHistory)
						{
								var documento = scriptVersion.node;
								if(documento.referencia === idHistoria){
								var documentoMapa = eval('(' + '{}' + ')'); //crear un mapa en blanco
								// Crear atributos principales del documento
								documentoMapa.nombre = documento.properties.name;
								documentoMapa.accesoDescarga = documento.downloadUrl;
								documentoMapa.tipo = documento.typeShort;
								documentoMapa.referencia = documento.nodeRef;
								documentoMapa.xPathLocationPadre = documento.parent.qnamePath;
								documentoMapa.xPathLocation = documento.qnamePath;
								// Recuperar todos los metadatos del documento
								json = eval('(' + appUtils.toJSON(documento, true) + ')');
								documentoMapa.propiedades = jsonUtils.toJSONString(json.properties);
								documentosMapa.push(documentoMapa);
								break;
							}
						}
				}
			}
		}
		// De lo contrario es una busqueda normal
		else {
			for each(documento in documentos)
				{
					var documentoMapa = eval('(' + '{}' + ')'); //crear un mapa en blanco
					//Crear atributos principales del documento
					documentoMapa.nombre = documento.properties.name;
					documentoMapa.accesoDescarga = documento.downloadUrl;
					documentoMapa.tipo = documento.typeShort;
					documentoMapa.referencia = documento.nodeRef;
					documentoMapa.xPathLocationPadre = documento.parent.qnamePath;
					documentoMapa.xPathLocation = documento.qnamePath;
					//Recuperar todos los metadatos del documento
					json = eval('(' + appUtils.toJSON(documento, true) + ')');
					documentoMapa.propiedades = jsonUtils.toJSONString(json.properties);
					documentosMapa.push(documentoMapa);
				}
			}
		model.documentos = documentosMapa;
		model.resultados = model.documentos.length;
	}else {
		status.code = 400;
		status.message = "Error al realizar la busqueda, envie un query";
		status.redirect = true;
	}
}catch (Err) {
	status.code = 400;
	status.message = "Ocurrio un error al realizar la busqueda - " + Err.message;
	status.redirect = true;
}
}
main();