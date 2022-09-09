select * from core.view_user
select * from dev.utils_get_columns_type('core', 'setting')
select * from dev.ddl_create_crud_modified('business', 'voucher')

select setval('business.serial_sequence_2', 827 )   