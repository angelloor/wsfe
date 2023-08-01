# WSFE

### WSFE

### Features 📋

```
•
•
•
```

select \* from business.view_voucher bvv where bvv.id_institution = 2 and bvv.emission_date_voucher > '2023-07-31 00:00:00'
and bvv.emission_date_voucher < '2023-07-31 23:59:59';

update business.voucher set action_pdf_voucher = false where access_key_voucher = '3107202301166000025000120010010000134501234567818';

<!-- Si hay problemas con las fechas en el metodo getFullDate settear 0 de incremento y se soluciona
const \_fullYear: FullDate = getFullDate(
voucher.emission_date_voucher!,
0
); -->
