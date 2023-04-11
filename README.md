# WSFE

### WSFE Api es un servicio que hace de middleware con la facturación electrónica del SRI

### Características 📋

v 1.0

```
• Modo de emisión: al instante (instante, posterior)
• envió de correo al cliente adjuntando XML y PDF
• Registro de comprobantes en Alfresco (XML)
• Portal de consulta para los comprobantes generados
• Consultar estado de un comprobante en el SRI
• autorización individual de comprobantes
• Consulta la información de una factura en el API
• envió por Lote.
```

v 2.0

```
• Administración del número de comprobante según el ambiente de cada institución
• Soporte para valores extras en el RIDE
• Corrección bugs v 1.0
```

v 3.0

```
• Soporte para resolver problemas en la actualización en lote
• Soporte para completar los procesos (accionpdf, accioncorreo, accionalfresco)
• Corrección bugs v 2.0
```

Próximos Pasos

```
• Soporte en la información adicional en el detalle, trabajar con ingeniería inversa para descubrir cual es el inconveniente con la información adicional.
• Implementar protocolo OCSP para (X509IssuerName independiente)
• Implementar algoritmo de firmado sha256
```
