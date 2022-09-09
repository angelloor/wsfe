{
    "query":"${query}",
    "resultados":<#if documentos??>"${resultados}",
    "documentos":
    [
	<#list documentos as documento>
	{
	    "nombre":"${documento.nombre}",
	    "accesoDescarga":"${documento.accesoDescarga}",
	    "tipo":"${documento.tipo}",
	    "referencia":"${documento.referencia.nodeRef}",
	    "xPathLocationPadre":"${documento.xPathLocationPadre}",
	    "xPathLocation":"${documento.xPathLocation}",
	    "propiedades":${documento.propiedades}
	}<#if documento_has_next>,</#if>
	</#list>
    ]
    <#else>"0"</#if>
}