select dev.ddl_config('business');

update dev.ddl_config dc set haved_handler_attribute = 'ruc_taxpayer' where dc.table_name = 'taxpayer';
update dev.ddl_config dc set haved_handler_attribute = 'access_key_voucher' where dc.table_name = 'voucher';
update dev.ddl_config dc set haved_handler_attribute = 'value_emission_point' where dc.table_name = 'emission_point';
update dev.ddl_config dc set haved_handler_attribute = 'value_establishment' where dc.table_name = 'establishment';

select dev.ddl_create_sequences('business');
select dev.ddl_create_view('business');
select dev.ddl_createall_crud('business');

select dev.dml_reset_sequences('business');
select dev.dml_truncateall('business');