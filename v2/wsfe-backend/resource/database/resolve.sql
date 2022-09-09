select bvv.id_voucher, bvv.access_key_voucher, bvv.id_institution, bvv.number_voucher, bvv.body_voucher->'importeTotal' as x from business.view_voucher bvv where (bvv.emission_date_voucher > '2022/05/03 00:00:00' and bvv.emission_date_voucher <= '2022/05/06 23:59:59') order by bvv.number_voucher asc



-- SQLServer
SELECT f.id_factura as numerodocumento,  f.detalle as detalle,
                        (1*f.subtotal + f.iva) as total, 'municipio' as institution FROM dbo.FACTURACION f
                        WHERE f.fecha_emision > cast('2022-05-03 00:00:00 +00:00' as datetimeoffset)
                        and f.fecha_emision < cast('2022-05-06 23:59:59 +00:00' as datetimeoffset)
                        UNION SELECT f.id_factura as numerodocumento,f.detalle as detalle,
                        (f.cantidad*f.valor_unitario) as total,  'patronato' as institution FROM dbo.FACTURACION_PATRONATO f
                        WHERE f.fecha_emision > cast('2022-05-03 00:00:00 +00:00' as datetimeoffset)
                        and f.fecha_emision < cast('2022-05-06 23:59:59 +00:00' as datetimeoffset) order by f.id_factura asc