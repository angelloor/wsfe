-- FUNCTION: business.validation_institution_overview(numeric, business."TYPE_VOUCHER")
-- DROP FUNCTION IF EXISTS business.validation_institution_overview(numeric, business."TYPE_VOUCHER");

CREATE OR REPLACE FUNCTION business.validation_institution_overview(
	_id_institution numeric,
	_type_voucher business."TYPE_VOUCHER")
    RETURNS boolean
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
			 DECLARE
				_EXISTENCE_INSTITUTION NUMERIC;
				_STATUS_INSTITUTION BOOLEAN;
				_STATUS_TAXPAYER BOOLEAN;
				_ID_TAXPAYER NUMERIC;
				_STATUS_COMPANY BOOLEAN;
				_TYPE_ENVIRONMENT BUSINESS."TYPE_ENVIRONMENT";
				_EXISTENCE_SEQUENCE NUMERIC;
				_STATUS_SEQUENCE BOOLEAN;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_EXISTENCE_INSTITUTION = (select count(*) from business.view_institution bvi where bvi.id_institution = _id_institution);

				IF (_EXISTENCE_INSTITUTION > 0) THEN
					_STATUS_INSTITUTION = (select bvi.status_institution from business.view_institution bvi where bvi.id_institution = _id_institution);
					
					IF (_STATUS_INSTITUTION) THEN
						_STATUS_TAXPAYER = (select bvt.status_taxpayer from business.view_institution bvi
							inner join business.view_taxpayer bvt on bvi.id_taxpayer = bvt.id_taxpayer
							where bvi.id_institution = _id_institution);
							
						_ID_TAXPAYER = (select bvt.id_taxpayer from business.view_institution bvi
							inner join business.view_taxpayer bvt on bvi.id_taxpayer = bvt.id_taxpayer
							where bvi.id_institution = _id_institution);	
							
						IF (_STATUS_TAXPAYER) THEN
							_STATUS_COMPANY = (select cvc.status_company from core.view_company cvc
								inner join core.view_user cvu on cvc.id_company = cvu.id_company
								inner join business.view_taxpayer bvt on bvt.id_user = cvu.id_user
								where bvt.id_taxpayer = _ID_TAXPAYER);
								
							IF (_STATUS_COMPANY) THEN
								_TYPE_ENVIRONMENT = (select bvi.type_environment from business.view_institution bvi where bvi.id_institution = _id_institution);
	
								_EXISTENCE_SEQUENCE = (select count(*) from business.view_sequence bvs
										inner join business.view_institution bvi on bvs.id_institution = bvi.id_institution
										where bvi.id_institution = _id_institution and bvs.type_environment = _TYPE_ENVIRONMENT and bvs.type_voucher = _type_voucher);

								IF (_EXISTENCE_SEQUENCE > 0) THEN
									_STATUS_SEQUENCE = (select bvs.status_sequence from business.view_sequence bvs
										inner join business.view_institution bvi on bvs.id_institution = bvi.id_institution
										where bvi.id_institution = _id_institution and bvs.type_environment = _TYPE_ENVIRONMENT and bvs.type_voucher = _type_voucher);

									IF (_STATUS_SEQUENCE) THEN
										RETURN TRUE;
									 ELSE 
										_EXCEPTION = 'La secuencia de la institución '||_id_institution||' se encuentra desactivada';
										RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
									 END IF;
								 ELSE 
									_EXCEPTION = 'No se encontró un secuencial para la institución '||_id_institution||' con ambiente '||_TYPE_ENVIRONMENT||' y tipo de comprobante '||_type_voucher||'';
									RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
								 END IF;
							ELSE
								_EXCEPTION = 'La empresa a la cual pertenece la institución '||_id_institution||' se encuentra desactivada';
								RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
							END IF;
						 ELSE 
							_EXCEPTION = 'El contribuyente al cual pertenece la institución '||_id_institution||' se encuentra desactivado';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						 END IF;
					 ELSE 
					 	_EXCEPTION = 'La institución '||_id_institution||' se encuentra desactivada';
					 	RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					 END IF;
				ELSE 
					 _EXCEPTION = 'La institución '||_id_institution||' no se encuentra registrada';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
			 	END IF;
			 	exception when others then 
				 -- RAISE NOTICE '%', SQLERRM;
				 IF (_EXCEPTION = 'Internal Error') THEN
					 RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
				 ELSE
					 RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				 END IF;
			 END;
			 
$BODY$;

ALTER FUNCTION business.validation_institution_overview(numeric, business."TYPE_VOUCHER")
    OWNER TO postgres;

-- FUNCTION: business.auth_sign_in_with_buyer_identifier_voucher(character varying)
-- DROP FUNCTION IF EXISTS business.auth_sign_in_with_buyer_identifier_voucher(character varying);

CREATE OR REPLACE FUNCTION business.auth_sign_in_with_buyer_identifier_voucher(
	_buyer_identifier_voucher character varying)
    RETURNS TABLE(id_sequence numeric, id_institution numeric, id_establishment numeric, id_emission_point numeric, bvs_type_environment business."TYPE_ENVIRONMENT", bvs_type_voucher business."TYPE_VOUCHER", number_code_sequence character varying, deleted_sequence boolean, value_establishment character varying, description_establishment character varying, value_emission_point character varying, description_emission_point character varying, id_taxpayer numeric, bvi_type_environment business."TYPE_ENVIRONMENT", name_institution character varying, description_institution character varying, address_institution character varying, status_institution boolean, bvv_type_voucher business."TYPE_VOUCHER", access_key_voucher character varying, buyer_identifier_voucher character varying, body_voucher json, id_company numeric, id_user numeric, id_setting_taxpayer numeric, type_emission business."TYPE_EMISSION", business_name_taxpayer character varying, tradename_taxpayer character varying, ruc_taxpayer character varying, dir_matriz_taxpayer character varying, signature_password_taxpayer character varying, signature_path_taxpayer character varying, status_taxpayer boolean, accounting_obliged business."TYPE_ACCOUNTING_OBLIGED", id_mail_server numeric, mailing_setting_taxpayer boolean, from_setting_taxpayer character varying, subject_setting_taxpayer character varying, html_setting_taxpayer text, download_note_setting_taxpayer character varying, logo_path_setting_taxpayer character varying, save_alfresco boolean, wait_autorization numeric, expiration_token numeric, inactivity_time numeric, navigation json) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
DECLARE
	_NAME_TYPE_USER_DEFAULT CHARACTER VARYING DEFAULT 'Consulta';
	_COUNT_VOUCHER NUMERIC;
	_ID_TYPE_USER NUMERIC;
	_COUNT_NAVIGATION NUMERIC;
	_NAVIGATION TEXT DEFAULT '';
	_NAV JSON;
	_X RECORD;
	_EXCEPTION TEXT DEFAULT '';
BEGIN
	_COUNT_VOUCHER = (select count(*) from business.view_voucher bvv where bvv.buyer_identifier_voucher = _buyer_identifier_voucher);

	IF (_COUNT_VOUCHER >= 1) THEN
		_ID_TYPE_USER = (select cvtu.id_type_user from core.view_type_user cvtu where cvtu.name_type_user = _NAME_TYPE_USER_DEFAULT and cvtu.status_type_user = true);
				
		IF (_ID_TYPE_USER >= 1) THEN
			_COUNT_NAVIGATION = (select count(*) from core.view_navigation vn
				inner join core.view_profile_navigation vpn on vn.id_navigation = vpn.id_navigation
				inner join core.view_profile vp on vp.id_profile = vpn.id_profile
				inner join core.view_type_user vtu on vtu.id_profile = vp.id_profile
				where vtu.id_type_user = _ID_TYPE_USER LIMIT 1);
				
			IF (_COUNT_NAVIGATION >= 1) THEN
				-- OBTENER LA NAVEGACION DEL USUARIO LOGEADO DE ACUERDO A SU PERFIL DE USUARIO
				FOR _X IN select cvn.* from core.view_type_user cvtu 
					inner join core.view_profile cvp on cvtu.id_profile = cvp.id_profile
					inner join core.view_profile_navigation cvpn on cvp.id_profile = cvpn.id_profile
					inner join core.view_navigation cvn on cvn.id_navigation = cvpn.id_navigation
					where cvtu.name_type_user = _NAME_TYPE_USER_DEFAULT and cvn.status_navigation = true LOOP
					
					_NAVIGATION = _NAVIGATION || '"'||_X.type_navigation||'": '||_X.content_navigation||',';
				END LOOP;
				-- ELIMINAR ULTIMA ,
				-- RAISE NOTICE '%', _NAVIGATION;
				_NAVIGATION = (select substring(_NAVIGATION from 1 for (char_length(_NAVIGATION)-1)));
				-- TRANSFORMAR STRING TO JSON[]
				_NAV = '{'||_NAVIGATION||'}';
				-- RAISE NOTICE '%', _NAV; 
				-- RAISE NOTICE '%', _NAV->0; 
				-- RAISE NOTICE '%', _NAV->1; 

				RETURN QUERY select bvs.id_sequence, bvs.id_institution, bvs.id_establishment, bvs.id_emission_point, bvs.type_environment as bvs_type_environment, bvs.type_voucher, bvs.number_code_sequence, bvs.deleted_sequence, bve.value_establishment, bve.description_establishment, bvep.value_emission_point, bvep.description_emission_point, bvi.id_taxpayer, bvi.type_environment as bvi_type_environment, bvi.name_institution, bvi.description_institution, bvi.address_institution, bvi.status_institution, bvv.type_voucher, bvv.access_key_voucher, bvv.buyer_identifier_voucher, bvv.body_voucher, bvt.id_company, bvt.id_user, bvt.id_setting_taxpayer, bvt.type_emission, bvt.business_name_taxpayer, bvt.tradename_taxpayer, bvt.ruc_taxpayer, bvt.dir_matriz_taxpayer, bvt.signature_password_taxpayer, bvt.signature_path_taxpayer, bvt.status_taxpayer, bvt.accounting_obliged, bvst.id_mail_server, bvst.mailing_setting_taxpayer, bvst.from_setting_taxpayer, bvst.subject_setting_taxpayer, bvst.html_setting_taxpayer, bvst.download_note_setting_taxpayer, bvst.logo_path_setting_taxpayer, cvs.save_alfresco, cvs.wait_autorization, cvs.expiration_token, cvs.inactivity_time, _NAV from business.view_sequence bvs
					inner join business.view_establishment bve on bvs.id_establishment = bve.id_establishment
					inner join business.view_emission_point bvep on bvs.id_emission_point = bvep.id_emission_point
					inner join business.view_institution bvi on bvs.id_institution = bvi.id_institution
					inner join business.view_voucher bvv on bvi.id_institution = bvv.id_institution
					inner join business.view_taxpayer bvt on bvi.id_taxpayer = bvt.id_taxpayer
					inner join business.view_setting_taxpayer bvst on bvst.id_setting_taxpayer = bvt.id_setting_taxpayer
					inner join core.view_user cvu on bvt.id_user = cvu.id_user
					inner join core.view_company cvc on cvu.id_company = cvc.id_company
					inner join core.view_setting cvs on cvc.id_setting = cvs.id_setting
					where bvv.buyer_identifier_voucher = _buyer_identifier_voucher limit 1;
			ELSE
				_EXCEPTION = 'El tipo de usuario de consulta no tiene navegaciones activas en su perfil';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database_auth';
			END IF;
		ELSE
			_EXCEPTION = 'No se encontro o esta desactivado el type_user para el perfil de consultas';
			RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database_auth';
		END IF;
	ELSE
		_EXCEPTION = 'No se encontró comprobantes registrados con el identificador de comprador '||_buyer_identifier_voucher||'';
		RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database_auth';
	END IF;
END;
	-- select * from  business.auth_sign_in_with_buyer_identifier_voucher('1600744443');
$BODY$;

ALTER FUNCTION business.auth_sign_in_with_buyer_identifier_voucher(character varying)
    OWNER TO postgres;

-- FUNCTION: business.dml_taxpayer_create(numeric, numeric, numeric, numeric, business."TYPE_EMISSION", character varying, character varying, character varying, character varying, character varying, character varying, boolean, business."TYPE_ACCOUNTING_OBLIGED", boolean, boolean)
-- DROP FUNCTION IF EXISTS business.dml_taxpayer_create(numeric, numeric, numeric, numeric, business."TYPE_EMISSION", character varying, character varying, character varying, character varying, character varying, character varying, boolean, business."TYPE_ACCOUNTING_OBLIGED", boolean, boolean);

CREATE OR REPLACE FUNCTION business.dml_taxpayer_create(
	id_user_ numeric,
	_id_company numeric,
	_id_user numeric,
	_id_setting_taxpayer numeric,
	_type_emission business."TYPE_EMISSION",
	_business_name_taxpayer character varying,
	_tradename_taxpayer character varying,
	_ruc_taxpayer character varying,
	_dir_matriz_taxpayer character varying,
	_signature_password_taxpayer character varying,
	_signature_path_taxpayer character varying,
	_status_taxpayer boolean,
	_accounting_obliged business."TYPE_ACCOUNTING_OBLIGED",
	_status_by_batch_taxpayer boolean,
	_deleted_taxpayer boolean)
    RETURNS numeric
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
			DECLARE
				_RESPONSE BOOLEAN DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_ATT NUMERIC;
				_COUNT_ATT_BUSINESS_NAME NUMERIC;
				_COUNT_EXTERNALS_IDS NUMERIC;
				_RETURNING NUMERIC;
				_CURRENT_ID NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			BEGIN 
			-- company
			_COUNT_EXTERNALS_IDS = (select count(*) from core.view_company v where v.id_company = _id_company);
				
			IF (_COUNT_EXTERNALS_IDS = 0) THEN
				_EXCEPTION = 'El id '||_id_company||' de la tabla company no se encuentra registrado';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
			END IF;
			 
			-- user
			_COUNT_EXTERNALS_IDS = (select count(*) from core.view_user v where v.id_user = _id_user);
				
			IF (_COUNT_EXTERNALS_IDS = 0) THEN
				_EXCEPTION = 'El id '||_id_user||' de la tabla user no se encuentra registrado';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
			END IF;
			 
			-- setting_taxpayer
			_COUNT_EXTERNALS_IDS = (select count(*) from business.view_setting_taxpayer v where v.id_setting_taxpayer = _id_setting_taxpayer);
				
			IF (_COUNT_EXTERNALS_IDS = 0) THEN
				_EXCEPTION = 'El id '||_id_setting_taxpayer||' de la tabla setting_taxpayer no se encuentra registrado';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
			END IF;
			
				_CURRENT_ID = (select nextval('business.serial_taxpayer')-1);
				_COUNT = (select count(*) from business.view_taxpayer t where t.id_taxpayer = _CURRENT_ID);

				IF (_COUNT = 0) THEN
				
					_COUNT_ATT = (select count(*) from business.view_taxpayer t where t.ruc_taxpayer = _ruc_taxpayer);
				
					IF (_COUNT_ATT = 0) THEN 
					
						_COUNT_ATT_BUSINESS_NAME = (select count(*) from business.view_taxpayer t where t.business_name_taxpayer = _business_name_taxpayer);
					
						IF (_COUNT_ATT = 0) THEN 
							FOR _X IN INSERT INTO business.taxpayer(id_taxpayer, id_company, id_user, id_setting_taxpayer, type_emission, business_name_taxpayer, tradename_taxpayer, ruc_taxpayer, dir_matriz_taxpayer, signature_password_taxpayer, signature_path_taxpayer, status_taxpayer, accounting_obliged, status_by_batch_taxpayer, deleted_taxpayer) VALUES (_CURRENT_ID, $2 , $3 , $4 , $5 , $6 , $7 , $8 , $9 , $10 , $11 , $12 , $13 , $14 , $15 ) RETURNING id_taxpayer LOOP
								_RETURNING = _X.id_taxpayer;
							END LOOP;

							IF (_RETURNING >= 1) THEN
								_SAVE_LOG = (select * from core.global_save_log());
								IF (_SAVE_LOG) THEN
									_RESPONSE = (core.dml_system_event_create($1,'taxpayer',_CURRENT_ID,'CREATE', now()::timestamp, false));
									IF (_RESPONSE != true) THEN
										_EXCEPTION = 'Ocurrió un error al registrar el evento del sistema';
										RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
									ELSE
										RETURN _CURRENT_ID;
									END IF;
								ELSE 
									RETURN _CURRENT_ID;
								END IF;
							ELSE
								_EXCEPTION = 'Ocurrió un error al insertar el registro';
								RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
							END IF;
						ELSE
							_EXCEPTION = 'Ya existe un registro con el business_name_taxpayer '||_ruc_taxpayer||'';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						END IF;
					ELSE
						_EXCEPTION = 'Ya existe un registro con el ruc_taxpayer '||_ruc_taxpayer||'';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
				ELSE
					_EXCEPTION = 'El registro con id '||_CURRENT_ID||' ya se encuentra registrado';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_CURRENT_ID >= 1) THEN
						EXECUTE 'select setval(''business.serial_taxpayer'', '||_CURRENT_ID||')';
					END IF;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			END;
			
$BODY$;

ALTER FUNCTION business.dml_taxpayer_create(numeric, numeric, numeric, numeric, business."TYPE_EMISSION", character varying, character varying, character varying, character varying, character varying, character varying, boolean, business."TYPE_ACCOUNTING_OBLIGED", boolean, boolean)
    OWNER TO postgres;

-- FUNCTION: business.dml_taxpayer_create_modified(numeric)
-- DROP FUNCTION IF EXISTS business.dml_taxpayer_create_modified(numeric);

CREATE OR REPLACE FUNCTION business.dml_taxpayer_create_modified(
	id_user_ numeric)
    RETURNS TABLE(id_taxpayer numeric, id_company numeric, id_user numeric, id_setting_taxpayer numeric, type_emission business."TYPE_EMISSION", business_name_taxpayer character varying, tradename_taxpayer character varying, ruc_taxpayer character varying, dir_matriz_taxpayer character varying, signature_password_taxpayer character varying, signature_path_taxpayer character varying, status_taxpayer boolean, accounting_obliged business."TYPE_ACCOUNTING_OBLIGED", status_by_batch_taxpayer boolean, deleted_taxpayer boolean, id_setting numeric, name_company character varying, acronym_company character varying, address_company character varying, status_company boolean, id_person numeric, id_type_user numeric, name_user character varying, password_user character varying, avatar_user character varying, status_user boolean, id_academic numeric, id_job numeric, dni_person character varying, name_person character varying, last_name_person character varying, address_person character varying, phone_person character varying, title_academic character varying, abbreviation_academic character varying, nivel_academic character varying, name_job character varying, address_job character varying, phone_job character varying, position_job character varying, id_profile numeric, name_type_user character varying, description_type_user character varying, status_type_user boolean, id_mail_server numeric, mailing_setting_taxpayer boolean, from_setting_taxpayer character varying, subject_setting_taxpayer character varying, html_setting_taxpayer text, download_note_setting_taxpayer character varying, logo_path_setting_taxpayer character varying) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
			DECLARE
				_ID_COMPANY NUMERIC;
				_ID_ACADEMIC NUMERIC;
				_ID_JOB NUMERIC;
				_ID_PERSON NUMERIC;
				_ID_PROFILE NUMERIC;
				_ID_TYPE_USER NUMERIC;
				_ID_USER NUMERIC;
				_ID_TAXPAYER NUMERIC;
				_ID_MAIL_SERVER NUMERIC;
				_ID_SETTING_TAXPAYER NUMERIC;
				_HTML CHARACTER VARYING;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			BEGIN
				_ID_COMPANY = (select vu.id_company from core.view_user vu where vu.id_user = id_user_);
				
				_ID_ACADEMIC = (select * from core.dml_academic_create(id_user_, '', '', '', false));
				
				IF (_ID_ACADEMIC >= 1) THEN
					_ID_JOB = (select * from core.dml_job_create(id_user_, '', '', '', '', false));
					
					IF (_ID_JOB >= 1) THEN
						_ID_PERSON = (select * from core.dml_person_create(id_user_, _ID_ACADEMIC, _ID_JOB, 'DNI (Por defecto)', '', '', '', '', false));
						
						IF (_ID_PERSON >= 1) THEN
							_ID_PROFILE = (select vp.id_profile from core.view_profile vp order by vp.id_profile asc limit 1);
							
							IF (_ID_PROFILE >= 1) THEN
								_ID_TYPE_USER = (select vtu.id_type_user from core.view_type_user vtu order by vtu.id_type_user asc limit 1);

								IF (_ID_TYPE_USER >= 1) THEN
									_ID_USER = (select * from core.dml_user_create(id_user_, _ID_COMPANY, _ID_PERSON, _ID_TYPE_USER, 'new_user@wsfe.com', '', 'default.svg', false, false));
								
									IF (_ID_USER >= 1) THEN
										_HTML = '<div>
    <strong>SALUDOS CORDIALES.</strong> Este comprobante ha sido generado automáticamente por un sistema de facturación
    electrónica, por lo tanto no es necesario que responda este mensaje.
    <br>
    <br>
    <strong>Estimado(a),</strong><br>
    ${razonSocialComprador}<br><br>
    Información del comprobante electrónico<br>
    <strong>Comprobante:</strong> ${codDoc}<br>
    <strong>Número Documento:</strong> ${estab}-${ptoEmi}-${secuencial}<br>
    <strong>Fecha de emisión:</strong> ${fechaEmision}<br>
    <strong>Monto total:</strong> ${importeTotal}<br>
    <br>
    <br>
    Adjuntamos el comprobante en formato: <strong>XML y PDF</strong>
</div>';
												
										_ID_SETTING_TAXPAYER = (select * from business.dml_setting_taxpayer_create(id_user_, null, false, 'WSFE <new_user@wsfe.com>', 'WSFE - Envío de comprobantes', _HTML, 'Nota RIDE', 'default.png'));
										
										IF (_ID_SETTING_TAXPAYER >= 1) THEN
											_ID_TAXPAYER = (select * from business.dml_taxpayer_create(id_user_, _ID_COMPANY, _ID_USER, _ID_SETTING_TAXPAYER, '1', 'Razon social (Por defecto)', 'Nombre comercial (Por defecto)', '(Por defecto)', '', '', '', false, 'NO', false, false));

											IF (_ID_TAXPAYER >= 1) THEN
												_ID_MAIL_SERVER = (select * from business.dml_mail_server_create(id_user_, _ID_TAXPAYER, 'office365', 'smtp.office365.com', 587, false, '', '', false));
												
												IF (_ID_MAIL_SERVER >= 1) THEN
													RETURN QUERY select bvt.id_taxpayer, bvt.id_company, bvt.id_user, bvt.id_setting_taxpayer, bvt.type_emission, bvt.business_name_taxpayer, bvt.tradename_taxpayer, bvt.ruc_taxpayer, bvt.dir_matriz_taxpayer, bvt.signature_password_taxpayer, bvt.signature_path_taxpayer, bvt.status_taxpayer, bvt.accounting_obliged, bvt.status_by_batch_taxpayer, bvt.deleted_taxpayer, cvc.id_setting, cvc.name_company, cvc.acronym_company, cvc.address_company, cvc.status_company, cvu.id_person, cvu.id_type_user, cvu.name_user, cvu.password_user, cvu.avatar_user, cvu.status_user, cvp.id_academic, cvp.id_job, cvp.dni_person, cvp.name_person, cvp.last_name_person, cvp.address_person, cvp.phone_person, cva.title_academic, cva.abbreviation_academic, cva.nivel_academic, cvj.name_job, cvj.address_job, cvj.phone_job, cvj.position_job, cvtu.id_profile, cvtu.name_type_user, cvtu.description_type_user, cvtu.status_type_user, bvst.id_mail_server, bvst.mailing_setting_taxpayer, bvst.from_setting_taxpayer, bvst.subject_setting_taxpayer, bvst.html_setting_taxpayer, bvst.download_note_setting_taxpayer, bvst.logo_path_setting_taxpayer from business.view_taxpayer bvt
														inner join core.view_company cvc on bvt.id_company = cvc.id_company
														inner join core.view_user cvu on bvt.id_user = cvu.id_user
														inner join core.view_person cvp on cvu.id_person = cvp.id_person
														inner join core.view_academic cva on cvp.id_academic = cva.id_academic
														inner join core.view_job cvj on cvp.id_job = cvj.id_job
														inner join core.view_type_user cvtu on cvu.id_type_user = cvtu.id_type_user
														inner join business.view_setting_taxpayer bvst on bvt.id_setting_taxpayer = bvst.id_setting_taxpayer
														where bvt.id_taxpayer = _id_taxpayer;
												ELSE
													_EXCEPTION = 'Ocurrió un error al ingresar el servidor de correo';
													RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
												END IF;
											ELSE
												_EXCEPTION = 'Ocurrió un error al ingresar el contribuyente';
												RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
											END IF;
										ELSE
											_EXCEPTION = 'Ocurrió un error al ingresar la configuración del contribuyente';
											RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
										END IF;
									ELSE
										_EXCEPTION = 'Ocurrió un error al ingresar el usuario';
										RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
									END IF;
								ELSE
									_EXCEPTION = 'No se encontró tipos de usuarios registrados';
									RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
								END IF;
							ELSE
								_EXCEPTION = 'No se encontró un el perfil';
								RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
							END IF;
						ELSE
							_EXCEPTION = 'Ocurrió un error al ingresar a la persona';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						END IF;
					ELSE
						_EXCEPTION = 'Ocurrió un error al ingresar la información laboral';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
				ELSE
					_EXCEPTION = 'Ocurrió un error al ingresar la información académica';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			END;
			
$BODY$;

ALTER FUNCTION business.dml_taxpayer_create_modified(numeric)
    OWNER TO postgres;

-- FUNCTION: business.dml_taxpayer_update_modified(numeric, numeric, numeric, numeric, numeric, business."TYPE_EMISSION", character varying, character varying, character varying, character varying, character varying, character varying, boolean, business."TYPE_ACCOUNTING_OBLIGED", boolean, boolean, numeric, numeric, character varying, character varying, character varying, boolean, numeric, numeric, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying)
-- DROP FUNCTION IF EXISTS business.dml_taxpayer_update_modified(numeric, numeric, numeric, numeric, numeric, business."TYPE_EMISSION", character varying, character varying, character varying, character varying, character varying, character varying, boolean, business."TYPE_ACCOUNTING_OBLIGED", boolean, boolean, numeric, numeric, character varying, character varying, character varying, boolean, numeric, numeric, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying);

CREATE OR REPLACE FUNCTION business.dml_taxpayer_update_modified(
	id_user_ numeric,
	_id_taxpayer numeric,
	_id_company numeric,
	_id_user numeric,
	_id_setting_taxpayer numeric,
	_type_emission business."TYPE_EMISSION",
	_business_name_taxpayer character varying,
	_tradename_taxpayer character varying,
	_ruc_taxpayer character varying,
	_dir_matriz_taxpayer character varying,
	_signature_password_taxpayer character varying,
	_signature_path_taxpayer character varying,
	_status_taxpayer boolean,
	_accounting_obliged business."TYPE_ACCOUNTING_OBLIGED",
	_status_by_batch_taxpayer boolean,
	_deleted_taxpayer boolean,
	_id_person numeric,
	_id_type_user numeric,
	_name_user character varying,
	_password_user character varying,
	_avatar_user character varying,
	_status_user boolean,
	_id_academic numeric,
	_id_job numeric,
	_dni_person character varying,
	_name_person character varying,
	_last_name_person character varying,
	_address_person character varying,
	_phone_person character varying,
	_title_academic character varying,
	_abbreviation_academic character varying,
	_nivel_academic character varying,
	_name_job character varying,
	_address_job character varying,
	_phone_job character varying,
	_position_job character varying)
    RETURNS TABLE(id_taxpayer numeric, id_company numeric, id_user numeric, id_setting_taxpayer numeric, type_emission business."TYPE_EMISSION", business_name_taxpayer character varying, tradename_taxpayer character varying, ruc_taxpayer character varying, dir_matriz_taxpayer character varying, signature_password_taxpayer character varying, signature_path_taxpayer character varying, status_taxpayer boolean, accounting_obliged business."TYPE_ACCOUNTING_OBLIGED", status_by_batch_taxpayer boolean, deleted_taxpayer boolean, id_setting numeric, name_company character varying, acronym_company character varying, address_company character varying, status_company boolean, id_person numeric, id_type_user numeric, name_user character varying, password_user character varying, avatar_user character varying, status_user boolean, id_academic numeric, id_job numeric, dni_person character varying, name_person character varying, last_name_person character varying, address_person character varying, phone_person character varying, title_academic character varying, abbreviation_academic character varying, nivel_academic character varying, name_job character varying, address_job character varying, phone_job character varying, position_job character varying, id_profile numeric, name_type_user character varying, description_type_user character varying, status_type_user boolean, id_mail_server numeric, mailing_setting_taxpayer boolean, from_setting_taxpayer character varying, subject_setting_taxpayer character varying, html_setting_taxpayer text, download_note_setting_taxpayer character varying, logo_path_setting_taxpayer character varying) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
			 DECLARE
				_UPDATE_ACADEMIC BOOLEAN;
				_UPDATE_JOB BOOLEAN;
				_UPDATE_PERSON BOOLEAN;
			 	_UPDATE_USER BOOLEAN;
				_UPDATE_TAXPAYER BOOLEAN;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_UPDATE_ACADEMIC = (select * from core.dml_academic_update(id_user_, _id_academic, _title_academic, _abbreviation_academic, _nivel_academic, false));
				
				IF (_UPDATE_ACADEMIC) THEN
					_UPDATE_JOB = (select * from core.dml_job_update(id_user_, _id_job, _name_job, _address_job, _phone_job, _position_job, false));
					
					IF (_UPDATE_JOB) THEN
						_UPDATE_PERSON = (select * from core.dml_person_update(id_user_, _id_person, _id_academic, _id_job, _dni_person, _name_person, _last_name_person, _address_person, _phone_person, false));
						
						IF (_UPDATE_PERSON) THEN
							_UPDATE_USER = (select * from core.dml_user_update(id_user_, _id_user, _id_company, _id_person, _id_type_user, _name_user, _password_user, _avatar_user, _status_user, false));
								
							IF (_UPDATE_USER) THEN
								_UPDATE_TAXPAYER = (select * from business.dml_taxpayer_update(id_user_, _id_taxpayer, _id_company, _id_user, _id_setting_taxpayer, _type_emission, _business_name_taxpayer, _tradename_taxpayer, _ruc_taxpayer, _dir_matriz_taxpayer, _signature_password_taxpayer, _signature_path_taxpayer, _status_taxpayer, _accounting_obliged, _status_by_batch_taxpayer, _deleted_taxpayer));
								
								IF (_UPDATE_TAXPAYER) THEN
									RETURN QUERY select bvt.id_taxpayer, bvt.id_company, bvt.id_user, bvt.id_setting_taxpayer, bvt.type_emission, bvt.business_name_taxpayer, bvt.tradename_taxpayer, bvt.ruc_taxpayer, bvt.dir_matriz_taxpayer, bvt.signature_password_taxpayer, bvt.signature_path_taxpayer, bvt.status_taxpayer, bvt.accounting_obliged, bvt.status_by_batch_taxpayer, bvt.deleted_taxpayer, cvc.id_setting, cvc.name_company, cvc.acronym_company, cvc.address_company, cvc.status_company, cvu.id_person, cvu.id_type_user, cvu.name_user, cvu.password_user, cvu.avatar_user, cvu.status_user, cvp.id_academic, cvp.id_job, cvp.dni_person, cvp.name_person, cvp.last_name_person, cvp.address_person, cvp.phone_person, cva.title_academic, cva.abbreviation_academic, cva.nivel_academic, cvj.name_job, cvj.address_job, cvj.phone_job, cvj.position_job, cvtu.id_profile, cvtu.name_type_user, cvtu.description_type_user, cvtu.status_type_user, bvst.id_mail_server, bvst.mailing_setting_taxpayer, bvst.from_setting_taxpayer, bvst.subject_setting_taxpayer, bvst.html_setting_taxpayer, bvst.download_note_setting_taxpayer, bvst.logo_path_setting_taxpayer from business.view_taxpayer bvt
										inner join core.view_company cvc on bvt.id_company = cvc.id_company
										inner join core.view_user cvu on bvt.id_user = cvu.id_user
										inner join core.view_person cvp on cvu.id_person = cvp.id_person
										inner join core.view_academic cva on cvp.id_academic = cva.id_academic
										inner join core.view_job cvj on cvp.id_job = cvj.id_job
										inner join core.view_type_user cvtu on cvu.id_type_user = cvtu.id_type_user
										inner join business.view_setting_taxpayer bvst on bvt.id_setting_taxpayer = bvst.id_setting_taxpayer
										where bvt.id_taxpayer = _id_taxpayer;
								ELSE
									_EXCEPTION = 'Ocurrió un error al actualizar el contribuyente';
									RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
								END IF;
							ELSE
								_EXCEPTION = 'Ocurrió un error al actualizar el usuario';
								RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
							END IF;
						ELSE
							_EXCEPTION = 'Ocurrió un error al actualizar la información de la persona';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						END IF;
					ELSE
						_EXCEPTION = 'Ocurrió un error al actualizar la información laboral';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
				ELSE
					_EXCEPTION = 'Ocurrió un error al actualizar la información académica';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			 END;
			 
$BODY$;

ALTER FUNCTION business.dml_taxpayer_update_modified(numeric, numeric, numeric, numeric, numeric, business."TYPE_EMISSION", character varying, character varying, character varying, character varying, character varying, character varying, boolean, business."TYPE_ACCOUNTING_OBLIGED", boolean, boolean, numeric, numeric, character varying, character varying, character varying, boolean, numeric, numeric, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying)
    OWNER TO postgres;

-- FUNCTION: business.dml_taxpayer_delete_modified(numeric, numeric)
-- DROP FUNCTION IF EXISTS business.dml_taxpayer_delete_modified(numeric, numeric);

CREATE OR REPLACE FUNCTION business.dml_taxpayer_delete_modified(
	id_user_ numeric,
	_id_taxpayer numeric)
    RETURNS TABLE(avatar_user character varying, signature_path_taxpayer character varying, logo_path_setting_taxpayer character varying) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
			 DECLARE
			 	_ID_MAIL_SERVER NUMERIC;
				_ID_SETTING_TAXPAYER NUMERIC;
			 	_ID_USER NUMERIC;
				_ID_PERSON NUMERIC;
				_ID_JOB NUMERIC;
				_ID_ACADEMIC NUMERIC;
				_DELETE_ACADEMIC BOOLEAN;
				_DELETE_JOB BOOLEAN;
				_DELETE_PERSON BOOLEAN;
			 	_DELETE_USER BOOLEAN;
				_DELETE_MAIL_SERVER BOOLEAN;
				_DELETE_SETTING_TAXPAYER BOOLEAN;
				_DELETE_TAXPAYER BOOLEAN;
				_AVATAR_USER CHARACTER VARYING;
				_SIGNATURE_PATH_TAXPAYER CHARACTER VARYING;
				_LOGO_PATH_SETTING_TAXPAYER CHARACTER VARYING;
				_X RECORD;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	-- GET THE INFORMATION OF FILES
			 	FOR _X IN select cvu.avatar_user, bvt.signature_path_taxpayer, bvst.logo_path_setting_taxpayer from business.view_taxpayer bvt inner join core.view_user cvu on bvt.id_user = cvu.id_user inner join business.view_setting_taxpayer bvst on bvst.id_taxpayer = bvt.id_taxpayer where bvt.id_taxpayer = _id_taxpayer LOOP
					_AVATAR_USER = _X.avatar_user;
					_SIGNATURE_PATH_TAXPAYER = _X.signature_path_taxpayer;
					_LOGO_PATH_SETTING_TAXPAYER = _X.logo_path_setting_taxpayer;
				END LOOP;
			 
				_ID_SETTING_TAXPAYER = (select bvst.id_setting_taxpayer from business.view_setting_taxpayer bvst where bvst.id_taxpayer = _id_taxpayer);
			 	_ID_USER = (select vtp.id_user from business.view_taxpayer vtp where vtp.id_taxpayer = _id_taxpayer);
			 	_ID_PERSON = (select vu.id_person from core.view_user vu where vu.id_user = _ID_USER);
				_ID_JOB = (select vp.id_job from core.view_person vp where vp.id_person = _ID_PERSON);
				_ID_ACADEMIC = (select va.id_academic from core.view_academic va where va.id_academic = _ID_PERSON);
			 
				_DELETE_SETTING_TAXPAYER = (select * from business.dml_setting_taxpayer_delete(id_user_, _id_setting_taxpayer));
				
				IF (_DELETE_SETTING_TAXPAYER) THEN
					FOR _X IN select bvms.id_mail_server from business.view_mail_server bvms where bvms.id_taxpayer = _id_taxpayer LOOP
						_DELETE_MAIL_SERVER = (select * from business.dml_mail_server_delete(id_user_, _X.id_mail_server));
					END LOOP;
				
					IF (_DELETE_MAIL_SERVER) THEN
			 			_DELETE_TAXPAYER = (select * from business.dml_taxpayer_delete(id_user_, _id_taxpayer));

						IF (_DELETE_TAXPAYER) THEN
							_DELETE_USER = (select * from core.dml_user_delete(id_user_, _id_user));
				
							IF (_DELETE_USER) THEN
								_DELETE_PERSON = (select * from core.dml_person_delete(id_user_, _ID_PERSON));

								IF (_DELETE_PERSON) THEN
									_DELETE_JOB = (select * from core.dml_job_delete(id_user_, _ID_JOB));

									IF (_DELETE_JOB) THEN
										_DELETE_ACADEMIC = (select * from core.dml_academic_delete(id_user_, _ID_ACADEMIC));

										IF (_DELETE_ACADEMIC) THEN
											RETURN QUERY select _AVATAR_USER as avatar_user, _SIGNATURE_PATH_TAXPAYER as signature_path_taxpayer, _LOGO_PATH_SETTING_TAXPAYER as logo_path_setting_taxpayer;
										ELSE
											_EXCEPTION = 'Ocurrió un error al eliminar la información académica';
											RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
										END IF;
									ELSE
										_EXCEPTION = 'Ocurrió un error al eliminar la información laboral';
										RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
									END IF;
								ELSE
									_EXCEPTION = 'Ocurrió un error al eliminar la persona';
									RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
								END IF;
							ELSE
								_EXCEPTION = 'Ocurrió un error al eliminar el usuario';
								RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
							END IF;
						ELSE
							_EXCEPTION = 'Ocurrió un error al eliminar el contribuyente';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						END IF;
					ELSE
						_EXCEPTION = 'Ocurrió un error al eliminar el servidor de correo';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
				ELSE
					_EXCEPTION = 'Ocurrió un error al eliminar la configuración del contribuyente';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			 END;
			 
$BODY$;

ALTER FUNCTION business.dml_taxpayer_delete_modified(numeric, numeric)
    OWNER TO postgres;

-- FUNCTION: business.dml_taxpayer_upload_signature(numeric, numeric, character varying)
-- DROP FUNCTION IF EXISTS business.dml_taxpayer_upload_signature(numeric, numeric, character varying);

CREATE OR REPLACE FUNCTION business.dml_taxpayer_upload_signature(
	_id_user numeric,
	_id_taxpayer numeric,
	_new_path character varying)
    RETURNS TABLE(status_upload_signature boolean, old_path character varying, new_path character varying) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
DECLARE
	_SIGNATURE_PATH_TAXPAYER CHARACTER VARYING;
	_X RECORD;
	_ID_TAXPAYER_UPDATE NUMERIC;
	_EXCEPTION TEXT DEFAULT 'Internal Error';
BEGIN
	_SIGNATURE_PATH_TAXPAYER = (select vtp.signature_path_taxpayer from business.view_taxpayer vtp where vtp.id_taxpayer = _id_taxpayer);
	-- Update Path
	FOR _X IN UPDATE business.taxpayer btp SET signature_path_taxpayer = _new_path WHERE btp.id_taxpayer = _id_taxpayer returning id_taxpayer LOOP 
		_ID_TAXPAYER_UPDATE = _X.id_taxpayer;
	END LOOP;
	
	IF (_ID_TAXPAYER_UPDATE >= 1) THEN
		RETURN QUERY select true as status_upload_signature, _SIGNATURE_PATH_TAXPAYER as old_path, _new_path as new_path;
	ELSE
		_EXCEPTION = 'Ocurrió un error al actualizar la firma electrónica del contribuyente';
		RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database_auth';
	END IF;
	exception when others then 
		-- RAISE NOTICE '%', SQLERRM;
		IF (_EXCEPTION = 'Internal Error') THEN
			RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database_auth';
		ELSE
			RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database_auth';
		END IF;
END;
			
$BODY$;

ALTER FUNCTION business.dml_taxpayer_upload_signature(numeric, numeric, character varying)
    OWNER TO postgres;

-- FUNCTION: business.dml_taxpayer_remove_signature(numeric, numeric)
-- DROP FUNCTION IF EXISTS business.dml_taxpayer_remove_signature(numeric, numeric);

CREATE OR REPLACE FUNCTION business.dml_taxpayer_remove_signature(
	_id_user numeric,
	_id_taxpayer numeric)
    RETURNS TABLE(status_remove_signature boolean, current_path character varying) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
DECLARE
	_SIGNATURE_PATH_TAXPAYER CHARACTER VARYING;
	_X RECORD;
	_ID_TAXPAYER_UPDATE NUMERIC;
	_EXCEPTION TEXT DEFAULT 'Internal Error';
BEGIN
	_SIGNATURE_PATH_TAXPAYER = (select vtp.signature_path_taxpayer from business.view_taxpayer vtp where vtp.id_taxpayer = _id_taxpayer);
	-- Update Path
	FOR _X IN UPDATE business.taxpayer btp SET signature_path_taxpayer = '' WHERE btp.id_taxpayer = _id_taxpayer returning id_taxpayer LOOP 
		_ID_TAXPAYER_UPDATE = _X.id_taxpayer;
	END LOOP;
	
	IF (_ID_TAXPAYER_UPDATE >= 1) THEN
		RETURN QUERY select true as status_remove_signature, _SIGNATURE_PATH_TAXPAYER as current_path;
	ELSE
		_EXCEPTION = 'Ocurrió un error al eliminar la firma electrónica del contribuyente';
		RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
	END IF;
	exception when others then 
		-- RAISE NOTICE '%', SQLERRM;
		IF (_EXCEPTION = 'Internal Error') THEN
			RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
		ELSE
			RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
		END IF;
END;
$BODY$;

ALTER FUNCTION business.dml_taxpayer_remove_signature(numeric, numeric)
    OWNER TO postgres;

-- FUNCTION: business.dml_taxpayer_change_status_by_batch(numeric, numeric, boolean)
-- DROP FUNCTION IF EXISTS business.dml_taxpayer_change_status_by_batch(numeric, numeric, boolean);

CREATE OR REPLACE FUNCTION business.dml_taxpayer_change_status_by_batch(
	id_user_ numeric,
	_id_taxpayer numeric,
	_status_by_batch_taxpayer boolean)
    RETURNS boolean
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
			 DECLARE
			 	_COUNT_TAXPAYER NUMERIC;
				_RETURNING NUMERIC;
				_X RECORD;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_COUNT_TAXPAYER = (select count(*) from business.view_taxpayer bvt where bvt.id_taxpayer = _id_taxpayer);
				
				IF (_COUNT_TAXPAYER > 0) THEN
					FOR _X IN UPDATE business.taxpayer SET status_by_batch_taxpayer = _status_by_batch_taxpayer WHERE id_taxpayer = _id_taxpayer RETURNING id_taxpayer LOOP
						_RETURNING = _X.id_taxpayer;
					END LOOP;
					IF (_RETURNING >= 1) THEN
						RETURN true;
					ELSE
						_EXCEPTION = 'Ocurrió un error al actualizar status_by_batch_taxpayer';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
				ELSE
					_EXCEPTION = 'El contribuyente '||_id_taxpayer||' no se encuentra registrado';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			 END;
			 
$BODY$;

ALTER FUNCTION business.dml_taxpayer_change_status_by_batch(numeric, numeric, boolean)
    OWNER TO postgres;

-- FUNCTION: business.dml_mail_server_create_modified(numeric, numeric)
-- DROP FUNCTION IF EXISTS business.dml_mail_server_create_modified(numeric, numeric);

CREATE OR REPLACE FUNCTION business.dml_mail_server_create_modified(
	id_user_ numeric,
	_id_taxpayer numeric)
    RETURNS TABLE(id_mail_server numeric, id_taxpayer numeric, type_mail_server business."TYPE_MAIL_SERVER", host_mail_server character varying, port_mail_server numeric, secure_mail_server boolean, user_mail_server character varying, password_mail_server character varying, status_mail_server boolean, id_company numeric, id_user numeric, type_emission business."TYPE_EMISSION", business_name_taxpayer character varying, tradename_taxpayer character varying, ruc_taxpayer character varying, dir_matriz_taxpayer character varying, signature_password_taxpayer character varying, signature_path_taxpayer character varying, status_taxpayer boolean, accounting_obliged business."TYPE_ACCOUNTING_OBLIGED") 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
			DECLARE
				_ID_MAIL_SERVER NUMERIC;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			BEGIN
				_ID_MAIL_SERVER = (select * from business.dml_mail_server_create(id_user_, _id_taxpayer, 'gmail', '', 0, false, '', '', false));

				IF (_ID_MAIL_SERVER >= 1) THEN
					RETURN QUERY select bvms.id_mail_server, bvms.id_taxpayer, bvms.type_mail_server, bvms.host_mail_server, bvms.port_mail_server, bvms.secure_mail_server, bvms.user_mail_server, bvms.password_mail_server, bvms.status_mail_server, bvt.id_company, bvt.id_user, bvt.type_emission, bvt.business_name_taxpayer, bvt.tradename_taxpayer, bvt.ruc_taxpayer, bvt.dir_matriz_taxpayer, bvt.signature_password_taxpayer, bvt.signature_path_taxpayer, bvt.status_taxpayer, bvt.accounting_obliged from business.view_mail_server bvms
						inner join business.view_taxpayer bvt on bvms.id_taxpayer = bvt.id_taxpayer
						where bvms.id_mail_server = _ID_MAIL_SERVER;
				ELSE
					_EXCEPTION = 'Ocurrió un error al ingresar mail_server';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			END;
			
$BODY$;

ALTER FUNCTION business.dml_mail_server_create_modified(numeric, numeric)
    OWNER TO postgres;

-- FUNCTION: business.dml_mail_server_update_modified(numeric, numeric, numeric, business."TYPE_MAIL_SERVER", character varying, numeric, boolean, character varying, character varying, boolean)
-- DROP FUNCTION IF EXISTS business.dml_mail_server_update_modified(numeric, numeric, numeric, business."TYPE_MAIL_SERVER", character varying, numeric, boolean, character varying, character varying, boolean);

CREATE OR REPLACE FUNCTION business.dml_mail_server_update_modified(
	id_user_ numeric,
	_id_mail_server numeric,
	_id_taxpayer numeric,
	_type_mail_server business."TYPE_MAIL_SERVER",
	_host_mail_server character varying,
	_port_mail_server numeric,
	_secure_mail_server boolean,
	_user_mail_server character varying,
	_password_mail_server character varying,
	_status_mail_server boolean)
    RETURNS TABLE(id_mail_server numeric, id_taxpayer numeric, type_mail_server business."TYPE_MAIL_SERVER", host_mail_server character varying, port_mail_server numeric, secure_mail_server boolean, user_mail_server character varying, password_mail_server character varying, status_mail_server boolean, id_company numeric, id_user numeric, type_emission business."TYPE_EMISSION", business_name_taxpayer character varying, tradename_taxpayer character varying, ruc_taxpayer character varying, dir_matriz_taxpayer character varying, signature_password_taxpayer character varying, signature_path_taxpayer character varying, status_taxpayer boolean, accounting_obliged business."TYPE_ACCOUNTING_OBLIGED") 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
			 DECLARE
			 	_UPDATE_MAIL_SERVER BOOLEAN;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_UPDATE_MAIL_SERVER = (select * from business.dml_mail_server_update(id_user_, _id_mail_server, _id_taxpayer, _type_mail_server, _host_mail_server, _port_mail_server, _secure_mail_server, _user_mail_server, _password_mail_server, _status_mail_server));

			 	IF (_UPDATE_MAIL_SERVER) THEN
					RETURN QUERY select bvms.id_mail_server, bvms.id_taxpayer, bvms.type_mail_server, bvms.host_mail_server, bvms.port_mail_server, bvms.secure_mail_server, bvms.user_mail_server, bvms.password_mail_server, bvms.status_mail_server, bvt.id_company, bvt.id_user, bvt.type_emission, bvt.business_name_taxpayer, bvt.tradename_taxpayer, bvt.ruc_taxpayer, bvt.dir_matriz_taxpayer, bvt.signature_password_taxpayer, bvt.signature_path_taxpayer, bvt.status_taxpayer, bvt.accounting_obliged from business.view_mail_server bvms
						inner join business.view_taxpayer bvt on bvms.id_taxpayer = bvt.id_taxpayer
						where bvms.id_mail_server = _id_mail_server;
				ELSE
					_EXCEPTION = 'Ocurrió un error al actualizar mail_server';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			 END;
			 
$BODY$;

ALTER FUNCTION business.dml_mail_server_update_modified(numeric, numeric, numeric, business."TYPE_MAIL_SERVER", character varying, numeric, boolean, character varying, character varying, boolean)
    OWNER TO postgres;

-- FUNCTION: business.dml_setting_taxpayer_create(numeric, numeric, boolean, character varying, character varying, text, character varying, character varying)
-- DROP FUNCTION IF EXISTS business.dml_setting_taxpayer_create(numeric, numeric, boolean, character varying, character varying, text, character varying, character varying);

CREATE OR REPLACE FUNCTION business.dml_setting_taxpayer_create(
	id_user_ numeric,
	_id_mail_server numeric,
	_mailing_setting_taxpayer boolean,
	_from_setting_taxpayer character varying,
	_subject_setting_taxpayer character varying,
	_html_setting_taxpayer text,
	_download_note_setting_taxpayer character varying,
	_logo_path_setting_taxpayer character varying)
    RETURNS numeric
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
			DECLARE
				_RESPONSE BOOLEAN DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_EXTERNALS_IDS NUMERIC;
				_RETURNING NUMERIC;
				_CURRENT_ID NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			BEGIN 
				_CURRENT_ID = (select nextval('business.serial_setting_taxpayer')-1);
				_COUNT = (select count(*) from business.view_setting_taxpayer t where t.id_setting_taxpayer = _CURRENT_ID);

				IF (_COUNT = 0) THEN
					FOR _X IN INSERT INTO business.setting_taxpayer(id_setting_taxpayer, id_mail_server, mailing_setting_taxpayer, from_setting_taxpayer, subject_setting_taxpayer, html_setting_taxpayer, download_note_setting_taxpayer, logo_path_setting_taxpayer) VALUES (_CURRENT_ID, $2 , $3 , $4 , $5 , $6 , $7 , $8 ) RETURNING id_setting_taxpayer LOOP
						_RETURNING = _X.id_setting_taxpayer;
					END LOOP;
					
					IF (_RETURNING >= 1) THEN
						_SAVE_LOG = (select * from core.global_save_log());
						IF (_SAVE_LOG) THEN
							_RESPONSE = (core.dml_system_event_create($1,'setting_taxpayer',_CURRENT_ID,'CREATE', now()::timestamp, false));
							IF (_RESPONSE != true) THEN
								_EXCEPTION = 'Ocurrió un error al registrar el evento del sistema';
								RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
							ELSE
								RETURN _CURRENT_ID;
							END IF;
						ELSE 
							RETURN _CURRENT_ID;
						END IF;
					ELSE
						_EXCEPTION = 'Ocurrió un error al insertar el registro';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
				ELSE
					_EXCEPTION = 'El registro con id '||_CURRENT_ID||' ya se encuentra registrado';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_CURRENT_ID >= 1) THEN
						EXECUTE 'select setval(''business.serial_setting_taxpayer'', '||_CURRENT_ID||')';
					END IF;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			END;
			
$BODY$;

ALTER FUNCTION business.dml_setting_taxpayer_create(numeric, numeric, boolean, character varying, character varying, text, character varying, character varying)
    OWNER TO postgres;

-- FUNCTION: business.dml_setting_taxpayer_update(numeric, numeric, numeric, boolean, character varying, character varying, text, character varying, character varying)
-- DROP FUNCTION IF EXISTS business.dml_setting_taxpayer_update(numeric, numeric, numeric, boolean, character varying, character varying, text, character varying, character varying);

CREATE OR REPLACE FUNCTION business.dml_setting_taxpayer_update(
	id_user_ numeric,
	_id_setting_taxpayer numeric,
	_id_mail_server numeric,
	_mailing_setting_taxpayer boolean,
	_from_setting_taxpayer character varying,
	_subject_setting_taxpayer character varying,
	_html_setting_taxpayer text,
	_download_note_setting_taxpayer character varying,
	_logo_path_setting_taxpayer character varying)
    RETURNS boolean
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_EXTERNALS_IDS NUMERIC;
				_RETURNING NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN 
			 	_COUNT = (select count(*) from business.view_setting_taxpayer t where t.id_setting_taxpayer = $2);
			
				IF (_COUNT = 1) THEN
					FOR _X IN UPDATE business.setting_taxpayer SET id_mail_server=$3, mailing_setting_taxpayer=$4, from_setting_taxpayer=$5, subject_setting_taxpayer=$6, html_setting_taxpayer=$7, download_note_setting_taxpayer=$8, logo_path_setting_taxpayer=$9 WHERE id_setting_taxpayer=$2 RETURNING id_setting_taxpayer LOOP
						_RETURNING = _X.id_setting_taxpayer;
					END LOOP;
						
					IF (_RETURNING >= 1) THEN
						_SAVE_LOG = (select * from core.global_save_log());
						IF (_SAVE_LOG) THEN
							_RESPONSE = (core.dml_system_event_create($1,'setting_taxpayer',$2,'UPDATE', now()::timestamp, false));
							IF (_RESPONSE != true) THEN
								_EXCEPTION = 'Ocurrió un error al registrar el evento del sistema';
								RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
							ELSE
								RETURN _RESPONSE;
							END IF;
						ELSE
							RETURN true;
						END IF;
					ELSE
						_EXCEPTION = 'Ocurrió un error al actualizar el registro';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
				ELSE
					_EXCEPTION = 'El registro con id '||$2||' no se encuentra registrado';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			 END;
			 
$BODY$;

ALTER FUNCTION business.dml_setting_taxpayer_update(numeric, numeric, numeric, boolean, character varying, character varying, text, character varying, character varying)
    OWNER TO postgres;

-- FUNCTION: business.dml_setting_taxpayer_update_modified(numeric, numeric, numeric, boolean, character varying, character varying, text, character varying, character varying)
-- DROP FUNCTION IF EXISTS business.dml_setting_taxpayer_update_modified(numeric, numeric, numeric, boolean, character varying, character varying, text, character varying, character varying);

CREATE OR REPLACE FUNCTION business.dml_setting_taxpayer_update_modified(
	id_user_ numeric,
	_id_setting_taxpayer numeric,
	_id_mail_server numeric,
	_mailing_setting_taxpayer boolean,
	_from_setting_taxpayer character varying,
	_subject_setting_taxpayer character varying,
	_html_setting_taxpayer text,
	_download_note_setting_taxpayer character varying,
	_logo_path_setting_taxpayer character varying)
    RETURNS TABLE(id_setting_taxpayer numeric, id_mail_server numeric, mailing_setting_taxpayer boolean, from_setting_taxpayer character varying, subject_setting_taxpayer character varying, html_setting_taxpayer text, download_note_setting_taxpayer character varying, logo_path_setting_taxpayer character varying) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
			 DECLARE
			 	_UPDATE_SETTING_TAXPAYER BOOLEAN;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_UPDATE_SETTING_TAXPAYER = (select * from business.dml_setting_taxpayer_update(id_user_, _id_setting_taxpayer, _id_mail_server, _mailing_setting_taxpayer, _from_setting_taxpayer, _subject_setting_taxpayer, _html_setting_taxpayer, _download_note_setting_taxpayer, _logo_path_setting_taxpayer));

			 	IF (_UPDATE_SETTING_TAXPAYER) THEN
					RETURN QUERY select bvst.id_setting_taxpayer, bvst.id_mail_server, bvst.mailing_setting_taxpayer, bvst.from_setting_taxpayer, bvst.subject_setting_taxpayer, bvst.html_setting_taxpayer, bvst.download_note_setting_taxpayer, bvst.logo_path_setting_taxpayer from business.view_setting_taxpayer bvst
						where bvst.id_setting_taxpayer = _id_setting_taxpayer;
				ELSE
					_EXCEPTION = 'Ocurrió un error al actualizar setting_taxpayer';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			 END;
			 
$BODY$;

ALTER FUNCTION business.dml_setting_taxpayer_update_modified(numeric, numeric, numeric, boolean, character varying, character varying, text, character varying, character varying)
    OWNER TO postgres;

-- FUNCTION: business.dml_setting_taxpayer_upload_logo(numeric, numeric, character varying)
-- DROP FUNCTION IF EXISTS business.dml_setting_taxpayer_upload_logo(numeric, numeric, character varying);

CREATE OR REPLACE FUNCTION business.dml_setting_taxpayer_upload_logo(
	_id_user numeric,
	_id_setting_taxpayer numeric,
	_new_path character varying)
    RETURNS TABLE(status_upload_logo boolean, old_path character varying, new_path character varying) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
DECLARE
	_LOGO_PATH_SETTING_TAXPAYER CHARACTER VARYING;
	_X RECORD;
	_ID_SETTING_TAXPAYER_UPDATE NUMERIC;
	_EXCEPTION TEXT DEFAULT 'Internal Error';
BEGIN
	_LOGO_PATH_SETTING_TAXPAYER = (select bvst.logo_path_setting_taxpayer from business.view_setting_taxpayer bvst where bvst.id_setting_taxpayer = _id_setting_taxpayer);
	-- Update Path
	FOR _X IN UPDATE business.view_setting_taxpayer bvst SET logo_path_setting_taxpayer = _new_path WHERE bvst.id_setting_taxpayer = _id_setting_taxpayer returning id_setting_taxpayer LOOP 
		_ID_SETTING_TAXPAYER_UPDATE = _X.id_setting_taxpayer;
	END LOOP;
	
	IF (_ID_SETTING_TAXPAYER_UPDATE >= 1) THEN
		RETURN QUERY select true as status_upload_logo, _LOGO_PATH_SETTING_TAXPAYER as old_path, _new_path as new_path;
	ELSE
		_EXCEPTION = 'Ocurrió un error al actualizar el logo del RIDE';
		RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database_auth';
	END IF;
	exception when others then 
		-- RAISE NOTICE '%', SQLERRM;
		IF (_EXCEPTION = 'Internal Error') THEN
			RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database_auth';
		ELSE
			RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database_auth';
		END IF;
END;
			
$BODY$;

ALTER FUNCTION business.dml_setting_taxpayer_upload_logo(numeric, numeric, character varying)
    OWNER TO postgres;

-- FUNCTION: business.dml_setting_taxpayer_remove_logo(numeric, numeric)
-- DROP FUNCTION IF EXISTS business.dml_setting_taxpayer_remove_logo(numeric, numeric);

CREATE OR REPLACE FUNCTION business.dml_setting_taxpayer_remove_logo(
	_id_user numeric,
	_id_setting_taxpayer numeric)
    RETURNS TABLE(status_remove_logo boolean, current_path character varying) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
DECLARE
	_LOGO_PATH_SETTING_TAXPAYER CHARACTER VARYING;
	_X RECORD;
	_ID_SETTING_TAXPAYER_UPDATE NUMERIC;
	_EXCEPTION TEXT DEFAULT 'Internal Error';
BEGIN
	_LOGO_PATH_SETTING_TAXPAYER = (select bvst.logo_path_setting_taxpayer from business.view_setting_taxpayer bvst where bvst.id_setting_taxpayer = _id_setting_taxpayer);
	-- Update Path
	FOR _X IN UPDATE business.view_setting_taxpayer bvst SET logo_path_setting_taxpayer = 'default.png' WHERE bvst.id_setting_taxpayer = _id_setting_taxpayer returning id_setting_taxpayer LOOP 
		_ID_SETTING_TAXPAYER_UPDATE = _X.id_setting_taxpayer;
	END LOOP;
	
	IF (_ID_SETTING_TAXPAYER_UPDATE >= 1) THEN
		RETURN QUERY select true as status_remove_logo, _LOGO_PATH_SETTING_TAXPAYER as current_path;
	ELSE
		_EXCEPTION = 'Ocurrió un error al eliminar el logo del RIDE';
		RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
	END IF;
	exception when others then 
		-- RAISE NOTICE '%', SQLERRM;
		IF (_EXCEPTION = 'Internal Error') THEN
			RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
		ELSE
			RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
		END IF;
END;
$BODY$;

ALTER FUNCTION business.dml_setting_taxpayer_remove_logo(numeric, numeric)
    OWNER TO postgres;

-- FUNCTION: business.dml_institution_create_modified(numeric, numeric)

-- DROP FUNCTION IF EXISTS business.dml_institution_create_modified(numeric, numeric);

CREATE OR REPLACE FUNCTION business.dml_institution_create_modified(
	id_user_ numeric,
	_id_taxpayer numeric)
    RETURNS TABLE(value_sequence numeric, id_institution numeric, id_taxpayer numeric, type_environment business."TYPE_ENVIRONMENT", name_institution character varying, description_institution character varying, address_institution character varying, status_institution boolean, status_by_batch_institution boolean, deleted_institution boolean, id_company numeric, id_user numeric, type_emission business."TYPE_EMISSION", business_name_taxpayer character varying, tradename_taxpayer character varying, ruc_taxpayer character varying, dir_matriz_taxpayer character varying, signature_password_taxpayer character varying, signature_path_taxpayer character varying, status_taxpayer boolean, accounting_obliged business."TYPE_ACCOUNTING_OBLIGED") 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
			DECLARE
				_ID_INSTITUTION NUMERIC;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			BEGIN
				_ID_INSTITUTION = (select * from business.dml_institution_create(id_user_, _id_taxpayer, '1', 'Nueva institución', '', '', false, false, false));
				
				IF (_ID_INSTITUTION >= 1) THEN
					EXECUTE 'CREATE SEQUENCE IF NOT EXISTS business.serial_institution_'||_ID_INSTITUTION||' INCREMENT 1 MINVALUE  1 MAXVALUE 9999999999 START 2 CACHE 1';
				
					RETURN QUERY select setval('business.serial_institution_'||bvi.id_institution||'', (select nextval('business.serial_institution_'||bvi.id_institution||'')-1))::numeric as value_sequence, bvi.id_institution, bvi.id_taxpayer, bvi.type_environment, bvi.name_institution, bvi.description_institution, bvi.address_institution, bvi.status_institution, bvi.status_by_batch_institution, bvi.deleted_institution, bvt.id_company, bvt.id_user, bvt.type_emission, bvt.business_name_taxpayer, bvt.tradename_taxpayer, bvt.ruc_taxpayer, bvt.dir_matriz_taxpayer, bvt.signature_password_taxpayer, bvt.signature_path_taxpayer, bvt.status_taxpayer, bvt.accounting_obliged from business.view_institution bvi
						inner join business.view_taxpayer bvt on bvi.id_taxpayer = bvt.id_taxpayer
						where bvi.id_institution = _ID_INSTITUTION;
				ELSE
					_EXCEPTION = 'Ocurrió un error al ingresar la institución';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			END;
			
$BODY$;

ALTER FUNCTION business.dml_institution_create_modified(numeric, numeric)
    OWNER TO postgres;

-- FUNCTION: business.dml_institution_update_modified(numeric, numeric, numeric, business."TYPE_ENVIRONMENT", character varying, character varying, character varying, boolean, boolean)
-- DROP FUNCTION IF EXISTS business.dml_institution_update_modified(numeric, numeric, numeric, business."TYPE_ENVIRONMENT", character varying, character varying, character varying, boolean, boolean);

CREATE OR REPLACE FUNCTION business.dml_institution_update_modified(
	id_user_ numeric,
	_id_institution numeric,
	_id_taxpayer numeric,
	_type_environment business."TYPE_ENVIRONMENT",
	_name_institution character varying,
	_description_institution character varying,
	_address_institution character varying,
	_status_institution boolean,
	_status_by_batch_institution boolean,
	_deleted_institution boolean)
    RETURNS TABLE(value_sequence numeric, id_institution numeric, id_taxpayer numeric, type_environment business."TYPE_ENVIRONMENT", name_institution character varying, description_institution character varying, address_institution character varying, status_institution boolean, status_by_batch_institution boolean, deleted_institution boolean, id_company numeric, id_user numeric, type_emission business."TYPE_EMISSION", business_name_taxpayer character varying, tradename_taxpayer character varying, ruc_taxpayer character varying, dir_matriz_taxpayer character varying, signature_password_taxpayer character varying, signature_path_taxpayer character varying, status_taxpayer boolean, accounting_obliged business."TYPE_ACCOUNTING_OBLIGED") 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
			 DECLARE
				_UPDATE_INSTITUTION BOOLEAN;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_UPDATE_INSTITUTION = (select * from business.dml_institution_update(id_user_, _id_institution, _id_taxpayer, _type_environment, _name_institution, _description_institution, _address_institution, _status_institution, _status_by_batch_institution, _deleted_institution));
				
				IF (_UPDATE_INSTITUTION) THEN
					RETURN QUERY select setval('business.serial_institution_'||bvi.id_institution||'', (select nextval('business.serial_institution_'||bvi.id_institution||'')-1))::numeric as value_sequence, bvi.id_institution, bvi.id_taxpayer, bvi.type_environment, bvi.name_institution, bvi.description_institution, bvi.address_institution, bvi.status_institution, bvi.status_by_batch_institution, bvi.deleted_institution, bvt.id_company, bvt.id_user, bvt.type_emission, bvt.business_name_taxpayer, bvt.tradename_taxpayer, bvt.ruc_taxpayer, bvt.dir_matriz_taxpayer, bvt.signature_password_taxpayer, bvt.signature_path_taxpayer, bvt.status_taxpayer, bvt.accounting_obliged from business.view_institution bvi
						inner join business.view_taxpayer bvt on bvi.id_taxpayer = bvt.id_taxpayer
						where bvi.id_institution = _id_institution;
				ELSE
					_EXCEPTION = 'Ocurrió un error al actualizar la institución';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			 END;
			 
$BODY$;

ALTER FUNCTION business.dml_institution_update_modified(numeric, numeric, numeric, business."TYPE_ENVIRONMENT", character varying, character varying, character varying, boolean, boolean, boolean)
    OWNER TO postgres;

-- FUNCTION: business.dml_institution_delete_modified(numeric, numeric)
-- DROP FUNCTION IF EXISTS business.dml_institution_delete_modified(numeric, numeric);

CREATE OR REPLACE FUNCTION business.dml_institution_delete_modified(
	id_user_ numeric,
	_id_institution numeric)
    RETURNS boolean
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
			 DECLARE
			 	_X RECORD;
				_DELETE_INSTITUTION BOOLEAN;
				_DELETE_SEQUENCE BOOLEAN DEFAULT TRUE;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	FOR _X IN select bvs.id_sequence from business.view_sequence bvs where bvs.id_institution = _id_institution LOOP
					RAISE NOTICE '%', _X.id_sequence; 
					_DELETE_SEQUENCE = (select * from business.dml_sequence_delete(id_user_, _X.id_sequence));
					EXECUTE 'DROP SEQUENCE IF EXISTS business.serial_sequence_'||_X.id_sequence||'';
				END LOOP;
				
				IF (_DELETE_SEQUENCE) THEN 
					_DELETE_INSTITUTION = (select * from business.dml_institution_delete(id_user_, _id_institution));
					
					IF (_DELETE_INSTITUTION) THEN
						EXECUTE 'DROP SEQUENCE IF EXISTS business.serial_institution_'||_id_institution||'';

						RETURN true;
					ELSE
						_EXCEPTION = 'Ocurrió un error al eliminar la institución';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
				ELSE
					_EXCEPTION = 'Ocurrió un error al eliminar las secuencias';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			 END;
			 
$BODY$;

ALTER FUNCTION business.dml_institution_delete_modified(numeric, numeric)
    OWNER TO postgres;

-- FUNCTION: business.dml_institution_change_status_by_batch(numeric, numeric, boolean)
-- DROP FUNCTION IF EXISTS business.dml_institution_change_status_by_batch(numeric, numeric, boolean);

CREATE OR REPLACE FUNCTION business.dml_institution_change_status_by_batch(
	id_user_ numeric,
	_id_institution numeric,
	_status_by_batch_institution boolean)
    RETURNS boolean
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
			 DECLARE
			 	_COUNT_INSTITUTION NUMERIC;
				_RETURNING NUMERIC;
				_X RECORD;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_COUNT_INSTITUTION = (select count(*) from business.view_institution bvi where bvi.id_institution = _id_institution);
			 	
				IF (_COUNT_INSTITUTION > 0) THEN
					FOR _X IN UPDATE business.institution SET status_by_batch_institution = _status_by_batch_institution WHERE id_institution = _id_institution RETURNING id_institution LOOP
						_RETURNING = _X.id_institution;
					END LOOP;
					IF (_RETURNING >= 1) THEN
						RETURN true;
					ELSE
						_EXCEPTION = 'Ocurrió un error al actualizar status_by_batch_institution';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
				ELSE
					_EXCEPTION = 'La institución '||_id_institution||' no se encuentra registrada';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			 END;
			 
$BODY$;

ALTER FUNCTION business.dml_institution_change_status_by_batch(numeric, numeric, boolean)
    OWNER TO postgres;

-- FUNCTION: business.dml_establishment_create_modified(numeric, numeric)
-- DROP FUNCTION IF EXISTS business.dml_establishment_create_modified(numeric, numeric);

CREATE OR REPLACE FUNCTION business.dml_establishment_create_modified(
	id_user_ numeric,
	_id_taxpayer numeric)
    RETURNS TABLE(id_establishment numeric, id_taxpayer numeric, value_establishment character varying, description_establishment character varying, deleted_establishment boolean, id_company numeric, id_user numeric, type_emission business."TYPE_EMISSION", business_name_taxpayer character varying, tradename_taxpayer character varying, ruc_taxpayer character varying, dir_matriz_taxpayer character varying, signature_password_taxpayer character varying, signature_path_taxpayer character varying, status_taxpayer boolean, accounting_obliged business."TYPE_ACCOUNTING_OBLIGED") 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
			DECLARE
				_ID_ESTABLISHMENT NUMERIC;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			BEGIN
				_ID_ESTABLISHMENT = (select * from business.dml_establishment_create(id_user_, _id_taxpayer, '000', '', false));

				IF (_ID_ESTABLISHMENT >= 1) THEN
					RETURN QUERY select bve.id_establishment, bve.id_taxpayer, bve.value_establishment, bve.description_establishment, bve.deleted_establishment, bvt.id_company, bvt.id_user, bvt.type_emission, bvt.business_name_taxpayer, bvt.tradename_taxpayer, bvt.ruc_taxpayer, bvt.dir_matriz_taxpayer, bvt.signature_password_taxpayer, bvt.signature_path_taxpayer, bvt.status_taxpayer, bvt.accounting_obliged from business.view_establishment bve
						inner join business.view_taxpayer bvt on bve.id_taxpayer = bvt.id_taxpayer
						where bve.id_establishment = _ID_ESTABLISHMENT;
				ELSE
					_EXCEPTION = 'Ocurrió un error al ingresar un establecimiento';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			END;
			
$BODY$;

ALTER FUNCTION business.dml_establishment_create_modified(numeric, numeric)
    OWNER TO postgres;

-- FUNCTION: business.dml_establishment_update_modified(numeric, numeric, numeric, character varying, character varying, boolean)
-- DROP FUNCTION IF EXISTS business.dml_establishment_update_modified(numeric, numeric, numeric, character varying, character varying, boolean);

CREATE OR REPLACE FUNCTION business.dml_establishment_update_modified(
	id_user_ numeric,
	_id_establishment numeric,
	_id_taxpayer numeric,
	_value_establishment character varying,
	_description_establishment character varying,
	_deleted_establishment boolean)
    RETURNS TABLE(id_establishment numeric, id_taxpayer numeric, value_establishment character varying, description_establishment character varying, deleted_establishment boolean, id_company numeric, id_user numeric, type_emission business."TYPE_EMISSION", business_name_taxpayer character varying, tradename_taxpayer character varying, ruc_taxpayer character varying, dir_matriz_taxpayer character varying, signature_password_taxpayer character varying, signature_path_taxpayer character varying, status_taxpayer boolean, accounting_obliged business."TYPE_ACCOUNTING_OBLIGED") 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
			 DECLARE
			 	_UPDATE_ESTABLISHMENT BOOLEAN;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_UPDATE_ESTABLISHMENT = (select * from business.dml_establishment_update(id_user_, _id_establishment, _id_taxpayer, _value_establishment, _description_establishment, _deleted_establishment));

			 	IF (_UPDATE_ESTABLISHMENT) THEN
					RETURN QUERY select bve.id_establishment, bve.id_taxpayer, bve.value_establishment, bve.description_establishment, bve.deleted_establishment, bvt.id_company, bvt.id_user, bvt.type_emission, bvt.business_name_taxpayer, bvt.tradename_taxpayer, bvt.ruc_taxpayer, bvt.dir_matriz_taxpayer, bvt.signature_password_taxpayer, bvt.signature_path_taxpayer, bvt.status_taxpayer, bvt.accounting_obliged from business.view_establishment bve
						inner join business.view_taxpayer bvt on bve.id_taxpayer = bvt.id_taxpayer
						where bve.id_establishment = _id_establishment;
				ELSE
					_EXCEPTION = 'Ocurrió un error al actualizar el establecimiento';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			 END;
			 
$BODY$;

ALTER FUNCTION business.dml_establishment_update_modified(numeric, numeric, numeric, character varying, character varying, boolean)
    OWNER TO postgres;

-- FUNCTION: business.dml_emission_point_create_modified(numeric, numeric)
-- DROP FUNCTION IF EXISTS business.dml_emission_point_create_modified(numeric, numeric);

CREATE OR REPLACE FUNCTION business.dml_emission_point_create_modified(
	id_user_ numeric,
	_id_taxpayer numeric)
    RETURNS TABLE(id_emission_point numeric, id_taxpayer numeric, value_emission_point character varying, description_emission_point character varying, deleted_emission_point boolean, id_company numeric, id_user numeric, type_emission business."TYPE_EMISSION", business_name_taxpayer character varying, tradename_taxpayer character varying, ruc_taxpayer character varying, dir_matriz_taxpayer character varying, signature_password_taxpayer character varying, signature_path_taxpayer character varying, status_taxpayer boolean, accounting_obliged business."TYPE_ACCOUNTING_OBLIGED") 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
			DECLARE
				_ID_EMISSION_POINT NUMERIC;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			BEGIN
				_ID_EMISSION_POINT = (select * from business.dml_emission_point_create(id_user_, _id_taxpayer, '000', '', false));

				IF (_ID_EMISSION_POINT >= 1) THEN
					RETURN QUERY select bvep.id_emission_point, bvep.id_taxpayer, bvep.value_emission_point, bvep.description_emission_point, bvep.deleted_emission_point, bvt.id_company, bvt.id_user, bvt.type_emission, bvt.business_name_taxpayer, bvt.tradename_taxpayer, bvt.ruc_taxpayer, bvt.dir_matriz_taxpayer, bvt.signature_password_taxpayer, bvt.signature_path_taxpayer, bvt.status_taxpayer, bvt.accounting_obliged from business.view_emission_point bvep
						inner join business.view_taxpayer bvt on bvep.id_taxpayer = bvt.id_taxpayer
						where bvep.id_emission_point = _ID_EMISSION_POINT;
				ELSE
					_EXCEPTION = 'Ocurrió un error al ingresar un punto de emisión';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			END;
			
$BODY$;

ALTER FUNCTION business.dml_emission_point_create_modified(numeric, numeric)
    OWNER TO postgres;

-- FUNCTION: business.dml_emission_point_update_modified(numeric, numeric, numeric, character varying, character varying, boolean)
-- DROP FUNCTION IF EXISTS business.dml_emission_point_update_modified(numeric, numeric, numeric, character varying, character varying, boolean);

CREATE OR REPLACE FUNCTION business.dml_emission_point_update_modified(
	id_user_ numeric,
	_id_emission_point numeric,
	_id_taxpayer numeric,
	_value_emission_point character varying,
	_description_emission_point character varying,
	_deleted_emission_point boolean)
    RETURNS TABLE(id_emission_point numeric, id_taxpayer numeric, value_emission_point character varying, description_emission_point character varying, deleted_emission_point boolean, id_company numeric, id_user numeric, type_emission business."TYPE_EMISSION", business_name_taxpayer character varying, tradename_taxpayer character varying, ruc_taxpayer character varying, dir_matriz_taxpayer character varying, signature_password_taxpayer character varying, signature_path_taxpayer character varying, status_taxpayer boolean, accounting_obliged business."TYPE_ACCOUNTING_OBLIGED") 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
			 DECLARE
			 	_UPDATE_EMISSION_POINT BOOLEAN;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_UPDATE_EMISSION_POINT = (select * from business.dml_emission_point_update(id_user_, _id_emission_point, _id_taxpayer, _value_emission_point, _description_emission_point, _deleted_emission_point));

			 	IF (_UPDATE_EMISSION_POINT) THEN
					RETURN QUERY select bvep.id_emission_point, bvep.id_taxpayer, bvep.value_emission_point, bvep.description_emission_point, bvep.deleted_emission_point, bvt.id_company, bvt.id_user, bvt.type_emission, bvt.business_name_taxpayer, bvt.tradename_taxpayer, bvt.ruc_taxpayer, bvt.dir_matriz_taxpayer, bvt.signature_password_taxpayer, bvt.signature_path_taxpayer, bvt.status_taxpayer, bvt.accounting_obliged from business.view_emission_point bvep
						inner join business.view_taxpayer bvt on bvep.id_taxpayer = bvt.id_taxpayer
						where bvep.id_emission_point = _id_emission_point;
				ELSE
					_EXCEPTION = 'Ocurrió un error al actualizar el punto de emisión';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			 END;
			 
$BODY$;

ALTER FUNCTION business.dml_emission_point_update_modified(numeric, numeric, numeric, character varying, character varying, boolean)
    OWNER TO postgres;

-- FUNCTION: business.dml_sequence_create_modified(numeric, numeric)
-- DROP FUNCTION IF EXISTS business.dml_sequence_create_modified(numeric, numeric);

CREATE OR REPLACE FUNCTION business.dml_sequence_create_modified(
	id_user_ numeric,
	_id_institution numeric)
    RETURNS TABLE(value_sequence numeric, id_sequence numeric, id_institution numeric, id_establishment numeric, id_emission_point numeric, bvs_type_environment business."TYPE_ENVIRONMENT", bvs_type_voucher business."TYPE_VOUCHER", number_code_sequence character varying, status_sequence boolean, deleted_sequence boolean, id_taxpayer numeric, bvi_type_environment business."TYPE_ENVIRONMENT", name_institution character varying, description_institution character varying, address_institution character varying, status_institution boolean, value_establishment character varying, description_establishment character varying, value_emission_point character varying, description_emission_point character varying) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
			DECLARE
				_ID_SEQUENCE NUMERIC;
				_ID_ESTABLISHMENT NUMERIC;
				_ID_EMISSION_POINT NUMERIC;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			BEGIN
				_ID_ESTABLISHMENT = (select bve.id_establishment from business.view_establishment bve order by id_establishment asc limit 1);
				
				IF (_ID_ESTABLISHMENT >= 1) THEN
					_ID_EMISSION_POINT = (select bvep.id_emission_point from business.view_emission_point bvep order by id_emission_point asc limit 1);
					
					IF (_ID_EMISSION_POINT >= 1) THEN
						_ID_SEQUENCE = (select * from business.dml_sequence_create(id_user_, _id_institution, _ID_ESTABLISHMENT, _ID_EMISSION_POINT, '1', '01', '12345678',false, false));

						IF (_ID_SEQUENCE >= 1) THEN
							EXECUTE 'CREATE SEQUENCE IF NOT EXISTS business.serial_sequence_'||_ID_SEQUENCE||' INCREMENT 1 MINVALUE  1 MAXVALUE 9999999999 START 2 CACHE 1';
						
							RETURN QUERY select setval('business.serial_sequence_'||bvs.id_sequence||'', (select nextval('business.serial_sequence_'||bvs.id_sequence||'')-1))::numeric as value_sequence, bvs.id_sequence, bvs.id_institution, bvs.id_establishment, bvs.id_emission_point, bvs.type_environment as bvs_type_environment, bvs.type_voucher as bvs_type_voucher, bvs.number_code_sequence, bvs.status_sequence, bvs.deleted_sequence, bvi.id_taxpayer, bvi.type_environment as bvi_type_environment, bvi.name_institution, bvi.description_institution, bvi.address_institution, bvi.status_institution, bve.value_establishment, bve.description_establishment, bvep.value_emission_point, bvep.description_emission_point from business.view_sequence bvs
								inner join business.view_institution bvi on bvs.id_institution = bvi.id_institution
								inner join business.view_establishment bve on bvs.id_establishment = bve.id_establishment
								inner join business.view_emission_point bvep on bvs.id_emission_point = bvep.id_emission_point
								where bvs.id_sequence = _ID_SEQUENCE;
						ELSE
							_EXCEPTION = 'Ocurrió un error al ingresar una secuencia';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						END IF;
					ELSE
						_EXCEPTION = 'No se encontraron puntos de emisión registrados';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
				ELSE
					_EXCEPTION = 'No se encontraron establecimientos registrados';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			END;
			
$BODY$;

ALTER FUNCTION business.dml_sequence_create_modified(numeric, numeric)
    OWNER TO postgres;

-- FUNCTION: business.dml_sequence_update_modified(numeric, numeric, numeric, numeric, numeric, business."TYPE_ENVIRONMENT", business."TYPE_VOUCHER", character varying, boolean, boolean)
-- DROP FUNCTION IF EXISTS business.dml_sequence_update_modified(numeric, numeric, numeric, numeric, numeric, business."TYPE_ENVIRONMENT", business."TYPE_VOUCHER", character varying, boolean, boolean);

CREATE OR REPLACE FUNCTION business.dml_sequence_update_modified(
	id_user_ numeric,
	_id_sequence numeric,
	_id_institution numeric,
	_id_establishment numeric,
	_id_emission_point numeric,
	_type_environment business."TYPE_ENVIRONMENT",
	_type_voucher business."TYPE_VOUCHER",
	_number_code_sequence character varying,
	_status_sequence boolean,
	_deleted_sequence boolean)
    RETURNS TABLE(value_sequence numeric, id_sequence numeric, id_institution numeric, id_establishment numeric, id_emission_point numeric, bvs_type_environment business."TYPE_ENVIRONMENT", bvs_type_voucher business."TYPE_VOUCHER", number_code_sequence character varying, status_sequence boolean, deleted_sequence boolean, id_taxpayer numeric, bvi_type_environment business."TYPE_ENVIRONMENT", name_institution character varying, description_institution character varying, address_institution character varying, status_institution boolean, value_establishment character varying, description_establishment character varying, value_emission_point character varying, description_emission_point character varying) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
			DECLARE
				_UUPDATE_SEQUENCE BOOLEAN;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			BEGIN
				_UUPDATE_SEQUENCE = (select * from business.dml_sequence_update(id_user_, _id_sequence, _id_institution, _id_establishment, _id_emission_point, _type_environment, _type_voucher, _number_code_sequence, _status_sequence, _deleted_sequence));
				
				IF (_UUPDATE_SEQUENCE) THEN
					RETURN QUERY select (setval('business.serial_sequence_'||bvs.id_sequence||'', (select nextval('business.serial_sequence_'||bvs.id_sequence||'')-1)))::numeric as value_sequence, bvs.id_sequence, bvs.id_institution, bvs.id_establishment, bvs.id_emission_point, bvs.type_environment as bvs_type_environment, bvs.type_voucher as bvs_type_voucher, bvs.number_code_sequence, bvs.status_sequence, bvs.deleted_sequence, bvi.id_taxpayer, bvi.type_environment as bvi_type_environment, bvi.name_institution, bvi.description_institution, bvi.address_institution, bvi.status_institution, bve.value_establishment, bve.description_establishment, bvep.value_emission_point, bvep.description_emission_point from business.view_sequence bvs
						inner join business.view_institution bvi on bvs.id_institution = bvi.id_institution
						inner join business.view_establishment bve on bvs.id_establishment = bve.id_establishment
						inner join business.view_emission_point bvep on bvs.id_emission_point = bvep.id_emission_point
						where bvs.id_sequence = _id_sequence;
				ELSE
					_EXCEPTION = 'Ocurrió un error al actualizar la secuencia';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			END;
			
$BODY$;

ALTER FUNCTION business.dml_sequence_update_modified(numeric, numeric, numeric, numeric, numeric, business."TYPE_ENVIRONMENT", business."TYPE_VOUCHER", character varying, boolean, boolean)
    OWNER TO postgres;

-- FUNCTION: business.dml_sequence_delete_modified(numeric, numeric)
-- DROP FUNCTION IF EXISTS business.dml_sequence_delete_modified(numeric, numeric);

CREATE OR REPLACE FUNCTION business.dml_sequence_delete_modified(
	id_user_ numeric,
	_id_sequence numeric)
    RETURNS boolean
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
			 DECLARE
			 	_DELETE_SEQUENCE BOOLEAN;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_DELETE_SEQUENCE = (select * from business.dml_sequence_delete(id_user_, _id_sequence));
					
				IF (_DELETE_SEQUENCE) THEN
					EXECUTE 'DROP SEQUENCE IF EXISTS business.serial_sequence_'||_id_sequence||'';
					RETURN true;
				ELSE
					_EXCEPTION = 'Ocurrió un error al eliminar la secuencia';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			 END;
			 
$BODY$;

ALTER FUNCTION business.dml_sequence_delete_modified(numeric, numeric)
    OWNER TO postgres;

-- FUNCTION: business.dml_voucher_reception(numeric, numeric, business."TYPE_VOUCHER", character varying, boolean)
-- DROP FUNCTION IF EXISTS business.dml_voucher_reception(numeric, numeric, business."TYPE_VOUCHER", character varying, boolean);

CREATE OR REPLACE FUNCTION business.dml_voucher_reception(
	id_user_ numeric,
	_id_institution numeric,
	_type_voucher business."TYPE_VOUCHER",
	_access_key_voucher character varying,
	_istosolve boolean)
    RETURNS TABLE(id_voucher numeric, number_voucher numeric, emission_date_voucher character varying, sequence numeric, id_sequence numeric, id_institution numeric, id_establishment numeric, id_emission_point numeric, bvs_type_environment business."TYPE_ENVIRONMENT", bvs_type_voucher business."TYPE_VOUCHER", number_code_sequence character varying, deleted_sequence boolean, value_establishment character varying, description_establishment character varying, value_emission_point character varying, description_emission_point character varying, id_taxpayer numeric, bvi_type_environment business."TYPE_ENVIRONMENT", name_institution character varying, description_institution character varying, address_institution character varying, status_institution boolean, id_company numeric, id_user numeric, id_setting_taxpayer numeric, type_emission business."TYPE_EMISSION", business_name_taxpayer character varying, tradename_taxpayer character varying, ruc_taxpayer character varying, dir_matriz_taxpayer character varying, signature_password_taxpayer character varying, signature_path_taxpayer character varying, status_taxpayer boolean, accounting_obliged business."TYPE_ACCOUNTING_OBLIGED", id_mail_server numeric, mailing_setting_taxpayer boolean, from_setting_taxpayer character varying, subject_setting_taxpayer character varying, html_setting_taxpayer text, download_note_setting_taxpayer character varying, logo_path_setting_taxpayer character varying, save_alfresco boolean, wait_autorization numeric) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
			DECLARE	
				_VALIDATION_STATUS BOOLEAN;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
				_ID_SEQUENCE NUMERIC;
				_SEQUENCE NUMERIC;
				_ID_VOUCHER NUMERIC DEFAULT 0;
				_NUMBER_VOUCHER NUMERIC DEFAULT 0;
				_EMISSION_DATE_VOUCHER CHARACTER VARYING DEFAULT '';
			BEGIN
				-- General validation 
				_VALIDATION_STATUS = (select * from business.validation_institution_overview(_id_institution, _type_voucher));
				-- General validation 
				
				IF (_VALIDATION_STATUS) THEN
					_ID_SEQUENCE = (select bvs.id_sequence from business.view_sequence bvs 
						inner join business.view_establishment bve on bvs.id_establishment = bve.id_establishment
						inner join business.view_emission_point bvep on bvs.id_emission_point = bvep.id_emission_point
						inner join business.view_institution bvi on bvs.id_institution = bvi.id_institution
						where bvs.type_environment = bvi.type_environment and bvi.id_institution = _id_institution and bvs.type_voucher = _type_voucher);
					
					IF (_isToSolve) THEN
						_SEQUENCE = 0;
						_ID_VOUCHER = (select bvv.id_voucher from business.view_voucher bvv where bvv.access_key_voucher = _access_key_voucher);
						_NUMBER_VOUCHER = (select bvv.number_voucher from business.view_voucher bvv where bvv.access_key_voucher = _access_key_voucher);
						_EMISSION_DATE_VOUCHER = (select bvv.emission_date_voucher from business.view_voucher bvv where bvv.access_key_voucher = _access_key_voucher);
					ELSE
						_SEQUENCE = (select nextval('business.serial_sequence_'||_ID_SEQUENCE||''));
					END IF;
					
					RETURN QUERY select _ID_VOUCHER, _NUMBER_VOUCHER, _EMISSION_DATE_VOUCHER, _SEQUENCE, bvs.id_sequence, bvs.id_institution, bvs.id_establishment, bvs.id_emission_point, bvs.type_environment as bvs_type_environment, bvs.type_voucher, bvs.number_code_sequence, bvs.deleted_sequence, bve.value_establishment, bve.description_establishment, bvep.value_emission_point, bvep.description_emission_point, bvi.id_taxpayer, bvi.type_environment as bvi_type_environment, bvi.name_institution, bvi.description_institution, bvi.address_institution, bvi.status_institution,  bvt.id_company, bvt.id_user, bvt.id_setting_taxpayer, bvt.type_emission, bvt.business_name_taxpayer, bvt.tradename_taxpayer, bvt.ruc_taxpayer, bvt.dir_matriz_taxpayer, (select * from core.security_cap_aes_decrypt(bvt.signature_password_taxpayer))::character varying as signature_password_taxpayer, bvt.signature_path_taxpayer, bvt.status_taxpayer, bvt.accounting_obliged, bvst.id_mail_server, bvst.mailing_setting_taxpayer, bvst.from_setting_taxpayer, bvst.subject_setting_taxpayer, bvst.html_setting_taxpayer, bvst.download_note_setting_taxpayer, bvst.logo_path_setting_taxpayer, cvs.save_alfresco, cvs.wait_autorization from business.view_sequence bvs
						inner join business.view_establishment bve on bvs.id_establishment = bve.id_establishment
						inner join business.view_emission_point bvep on bvs.id_emission_point = bvep.id_emission_point
						inner join business.view_institution bvi on bvs.id_institution = bvi.id_institution
						inner join business.view_taxpayer bvt on bvi.id_taxpayer = bvt.id_taxpayer
						inner join business.view_setting_taxpayer bvst on bvst.id_setting_taxpayer = bvt.id_setting_taxpayer
						inner join core.view_user cvu on bvt.id_user = cvu.id_user
						inner join core.view_company cvc on cvu.id_company = cvc.id_company
						inner join core.view_setting cvs on cvc.id_setting = cvs.id_setting
						where bvs.type_environment = bvi.type_environment and bvi.id_institution = _id_institution and bvs.type_voucher = _type_voucher;
				END IF;	
				exception when others then
					-- RAISE NOTICE '%', SQLERRM;
					IF (_SEQUENCE >= 1) THEN
						EXECUTE 'select setval(''business.serial_sequence_'||_ID_SEQUENCE||''', '||_SEQUENCE||')';
					END IF;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			END;
			
$BODY$;

ALTER FUNCTION business.dml_voucher_reception(numeric, numeric, business."TYPE_VOUCHER", character varying, boolean)
    OWNER TO postgres;

-- FUNCTION: business.dml_voucher_create(numeric, numeric, business."TYPE_ENVIRONMENT", business."TYPE_EMISSION", business."TYPE_VOUCHER", character varying, character varying, timestamp without time zone, timestamp without time zone, character varying, json, business."TYPE_VOUCHER_STATUS", business."TYPE_VOUCHER_STATUS", boolean, boolean, boolean, json, boolean)
-- DROP FUNCTION IF EXISTS business.dml_voucher_create(numeric, numeric, business."TYPE_ENVIRONMENT", business."TYPE_EMISSION", business."TYPE_VOUCHER", character varying, character varying, timestamp without time zone, timestamp without time zone, character varying, json, business."TYPE_VOUCHER_STATUS", business."TYPE_VOUCHER_STATUS", boolean, boolean, boolean, json, boolean);

CREATE OR REPLACE FUNCTION business.dml_voucher_create(
	id_user_ numeric,
	_id_institution numeric,
	_type_environment business."TYPE_ENVIRONMENT",
	_type_emission business."TYPE_EMISSION",
	_type_voucher business."TYPE_VOUCHER",
	_number_voucher character varying,
	_access_key_voucher character varying,
	_emission_date_voucher timestamp without time zone,
	_authorization_date_voucher timestamp without time zone,
	_buyer_identifier_voucher character varying,
	_body_voucher json,
	_internal_status_voucher business."TYPE_VOUCHER_STATUS",
	_global_status_voucher business."TYPE_VOUCHER_STATUS",
	_action_pdf_voucher boolean,
	_action_email_voucher boolean,
	_action_alfresco_voucher boolean,
	_messages_voucher json,
	_deleted_voucher boolean)
    RETURNS numeric
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
			DECLARE
				_RESPONSE BOOLEAN DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_ATT NUMERIC;
				_COUNT_ATT_NUMBER_VOUCHER NUMERIC;
				_COUNT_EXTERNALS_IDS NUMERIC;
				_RETURNING NUMERIC;
				_CURRENT_ID NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			BEGIN 
			-- institution
			_COUNT_EXTERNALS_IDS = (select count(*) from business.view_institution v where v.id_institution = _id_institution);
				
			IF (_COUNT_EXTERNALS_IDS = 0) THEN
				_EXCEPTION = 'El id '||_id_institution||' de la tabla institution no se encuentra registrado';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
			END IF;
			
				_CURRENT_ID = (select nextval('business.serial_voucher')-1);
				_COUNT = (select count(*) from business.view_voucher t where t.id_voucher = _CURRENT_ID);

				IF (_COUNT = 0) THEN
				
					_COUNT_ATT = (select count(*) from business.view_voucher t where t.access_key_voucher = _access_key_voucher);
				
					IF (_COUNT_ATT = 0) THEN 
						
						_COUNT_ATT_NUMBER_VOUCHER = (select count(*) from business.view_voucher t where t.number_voucher = _number_voucher and t.id_institution = _id_institution);
						
						IF (_COUNT_ATT_NUMBER_VOUCHER = 0) THEN
							FOR _X IN INSERT INTO business.voucher(id_voucher, id_institution, type_environment, type_emission, type_voucher, number_voucher, access_key_voucher, emission_date_voucher, authorization_date_voucher, buyer_identifier_voucher, body_voucher, internal_status_voucher, global_status_voucher, action_pdf_voucher, action_email_voucher, action_alfresco_voucher, messages_voucher, deleted_voucher) VALUES (_CURRENT_ID, $2 , $3 , $4 , $5 , $6 , $7 , $8 , $9 , $10 , $11 , $12 , $13 , $14 , $15 , $16 , $17 , $18 ) RETURNING id_voucher LOOP
								_RETURNING = _X.id_voucher;
							END LOOP;

							IF (_RETURNING >= 1) THEN
								_SAVE_LOG = (select * from core.global_save_log());
								IF (_SAVE_LOG) THEN
									_RESPONSE = (core.dml_system_event_create($1,'voucher',_CURRENT_ID,'CREATE', now()::timestamp, false));
									IF (_RESPONSE != true) THEN
										_EXCEPTION = 'Ocurrió un error al registrar el evento del sistema';
										RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
									ELSE
										RETURN _CURRENT_ID;
									END IF;
								ELSE 
									RETURN _CURRENT_ID;
								END IF;
							ELSE
								_EXCEPTION = 'Ocurrió un error al insertar el registro';
								RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
							END IF;
						ELSE
							_EXCEPTION = 'Ya existe un comprobante con el numero '||_number_voucher||'';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						END IF;
					ELSE
						_EXCEPTION = 'Ya existe un comprobante con la clave de acceso '||_access_key_voucher||'';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
				ELSE
					_EXCEPTION = 'El registro con id '||_CURRENT_ID||' ya se encuentra registrado';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_CURRENT_ID >= 1) THEN
						EXECUTE 'select setval(''business.serial_voucher'', '||_CURRENT_ID||')';
					END IF;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			END;
			
$BODY$;

ALTER FUNCTION business.dml_voucher_create(numeric, numeric, business."TYPE_ENVIRONMENT", business."TYPE_EMISSION", business."TYPE_VOUCHER", character varying, character varying, timestamp without time zone, timestamp without time zone, character varying, json, business."TYPE_VOUCHER_STATUS", business."TYPE_VOUCHER_STATUS", boolean, boolean, boolean, json, boolean)
    OWNER TO postgres;

-- FUNCTION: business.dml_voucher_create_modified(numeric, numeric, business."TYPE_VOUCHER", character varying, character varying, character varying, json, business."TYPE_VOUCHER_STATUS", business."TYPE_VOUCHER_STATUS")
-- DROP FUNCTION IF EXISTS business.dml_voucher_create_modified(numeric, numeric, business."TYPE_VOUCHER", character varying, character varying, character varying, json, business."TYPE_VOUCHER_STATUS", business."TYPE_VOUCHER_STATUS");

CREATE OR REPLACE FUNCTION business.dml_voucher_create_modified(
	id_user_ numeric,
	_id_institution numeric,
	_type_voucher business."TYPE_VOUCHER",
	_number_voucher character varying,
	_access_key_voucher character varying,
	_buyer_identifier_voucher character varying,
	_body_voucher json,
	_internal_status_voucher business."TYPE_VOUCHER_STATUS",
	_global_status_voucher business."TYPE_VOUCHER_STATUS")
    RETURNS TABLE(id_voucher numeric, id_institution numeric, bvv_type_environment business."TYPE_ENVIRONMENT", bvv_type_emission business."TYPE_EMISSION", type_voucher business."TYPE_VOUCHER", number_voucher character varying, access_key_voucher character varying, emission_date_voucher timestamp without time zone, authorization_date_voucher timestamp without time zone, buyer_identifier_voucher character varying, body_voucher json, internal_status_voucher business."TYPE_VOUCHER_STATUS", global_status_voucher business."TYPE_VOUCHER_STATUS", action_pdf_voucher boolean, action_email_voucher boolean, action_alfresco_voucher boolean, messages_voucher json, deleted_voucher boolean, id_taxpayer numeric, bvi_type_environment business."TYPE_ENVIRONMENT", name_institution character varying, description_institution character varying, address_institution character varying, status_institution boolean) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
			DECLARE	
				_X RECORD;
				_TYPE_ENVIRONMENT BUSINESS."TYPE_ENVIRONMENT";
				_TYPE_EMISSION BUSINESS."TYPE_EMISSION";
				_SERIAL_INSTITUTION NUMERIC DEFAULT 0;
				NUMBER_VOUCHER_ CHARACTER VARYING;
				_ID_VOUCHER NUMERIC;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			BEGIN
				FOR _X IN select bvt.type_emission, bvi.type_environment from business.view_taxpayer bvt inner join business.view_institution bvi on bvt.id_taxpayer = bvi.id_taxpayer LOOP
					_TYPE_EMISSION = _X.type_emission;
					_TYPE_ENVIRONMENT = _X.type_environment;
				END LOOP;

				IF 	(_number_voucher IS NULL) THEN
					_SERIAL_INSTITUTION = (select nextval('business.serial_institution_'||_id_institution||'')-1);
					NUMBER_VOUCHER_ = _SERIAL_INSTITUTION::CHARACTER VARYING;
				ELSE
					NUMBER_VOUCHER_ = _number_voucher;
				END IF;

				_ID_VOUCHER = (select * from business.dml_voucher_create(id_user_, _id_institution, _TYPE_ENVIRONMENT, _TYPE_EMISSION, _type_voucher, NUMBER_VOUCHER_, _access_key_voucher, now()::timestamp, null, _buyer_identifier_voucher, _body_voucher,  _internal_status_voucher, _global_status_voucher, false, false, false, '[]', false));

				IF (_ID_VOUCHER >= 1) THEN
					RETURN QUERY select bvv.id_voucher, bvv.id_institution, bvv.type_environment as bvv_type_environment, bvv.type_emission as bvv_type_emission, bvv.type_voucher, bvv.number_voucher, bvv.access_key_voucher, bvv.emission_date_voucher, bvv.authorization_date_voucher, bvv.buyer_identifier_voucher, bvv.body_voucher, bvv.internal_status_voucher, bvv.global_status_voucher, bvv.action_pdf_voucher, bvv.action_email_voucher, bvv.action_alfresco_voucher, bvv.messages_voucher, bvv.deleted_voucher, bvi.id_taxpayer, bvi.type_environment as bvi_type_environment, bvi.name_institution, bvi.description_institution, bvi.address_institution, bvi.status_institution from business.view_voucher bvv
						inner join business.view_institution bvi on bvv.id_institution = bvi.id_institution
						inner join business.view_taxpayer bvt on bvi.id_taxpayer = bvt.id_taxpayer
						inner join business.view_setting_taxpayer bvst on bvt.id_setting_taxpayer = bvst.id_setting_taxpayer
						where bvv.id_voucher =_ID_VOUCHER;
				ELSE
					_EXCEPTION = 'Ocurrió un error al ingresar voucher';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_SERIAL_INSTITUTION >= 1) THEN
						EXECUTE 'select setval(''business.serial_institution_'||_id_institution||''', '||_SERIAL_INSTITUTION||')';
					END IF;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			END;
			
$BODY$;

ALTER FUNCTION business.dml_voucher_create_modified(numeric, numeric, business."TYPE_VOUCHER", character varying, character varying, character varying, json, business."TYPE_VOUCHER_STATUS", business."TYPE_VOUCHER_STATUS")
    OWNER TO postgres;

-- FUNCTION: business.dml_voucher_update_modified(numeric, numeric, numeric, business."TYPE_ENVIRONMENT", business."TYPE_EMISSION", business."TYPE_VOUCHER", character varying, character varying, timestamp without time zone, timestamp without time zone, character varying, json, business."TYPE_VOUCHER_STATUS", business."TYPE_VOUCHER_STATUS", boolean, boolean, boolean, json, boolean)
-- DROP FUNCTION IF EXISTS business.dml_voucher_update_modified(numeric, numeric, numeric, business."TYPE_ENVIRONMENT", business."TYPE_EMISSION", business."TYPE_VOUCHER", character varying, character varying, timestamp without time zone, timestamp without time zone, character varying, json, business."TYPE_VOUCHER_STATUS", business."TYPE_VOUCHER_STATUS", boolean, boolean, boolean, json, boolean);

CREATE OR REPLACE FUNCTION business.dml_voucher_update_modified(
	id_user_ numeric,
	_id_voucher numeric,
	_id_institution numeric,
	_type_environment business."TYPE_ENVIRONMENT",
	_type_emission business."TYPE_EMISSION",
	_type_voucher business."TYPE_VOUCHER",
	_number_voucher character varying,
	_access_key_voucher character varying,
	_emission_date_voucher timestamp without time zone,
	_authorization_date_voucher timestamp without time zone,
	_buyer_identifier_voucher character varying,
	_body_voucher json,
	_internal_status_voucher business."TYPE_VOUCHER_STATUS",
	_global_status_voucher business."TYPE_VOUCHER_STATUS",
	_action_pdf_voucher boolean,
	_action_email_voucher boolean,
	_action_alfresco_voucher boolean,
	_messages_voucher json,
	_deleted_voucher boolean)
    RETURNS TABLE(id_voucher numeric, id_institution numeric, bvv_type_environment business."TYPE_ENVIRONMENT", bvv_type_emission business."TYPE_EMISSION", type_voucher business."TYPE_VOUCHER", number_voucher character varying, access_key_voucher character varying, emission_date_voucher timestamp without time zone, authorization_date_voucher timestamp without time zone, buyer_identifier_voucher character varying, body_voucher json, internal_status_voucher business."TYPE_VOUCHER_STATUS", global_status_voucher business."TYPE_VOUCHER_STATUS", action_pdf_voucher boolean, action_email_voucher boolean, action_alfresco_voucher boolean, messages_voucher json, deleted_voucher boolean, id_taxpayer numeric, bvi_type_environment business."TYPE_ENVIRONMENT", name_institution character varying, description_institution character varying, address_institution character varying, status_institution boolean) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
			 DECLARE
			 	_UPDATE_VOUCHER BOOLEAN;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_UPDATE_VOUCHER = (select * from business.dml_voucher_update(id_user_, _id_voucher, _id_institution, _type_environment, _type_emission, _type_voucher, _number_voucher, _access_key_voucher, _emission_date_voucher, _authorization_date_voucher, _buyer_identifier_voucher, _body_voucher, _internal_status_voucher, _global_status_voucher, _action_pdf_voucher, _action_email_voucher, _action_alfresco_voucher, _messages_voucher, _deleted_voucher));

			 	IF (_UPDATE_VOUCHER) THEN
					RETURN QUERY select bvv.id_voucher, bvv.id_institution, bvv.type_environment as bvv_type_environment, bvv.type_emission as bvv_type_emission, bvv.type_voucher, bvv.number_voucher, bvv.access_key_voucher, bvv.emission_date_voucher, bvv.authorization_date_voucher, bvv.buyer_identifier_voucher, bvv.body_voucher, bvv.internal_status_voucher, bvv.global_status_voucher, bvv.action_pdf_voucher, bvv.action_email_voucher, bvv.action_alfresco_voucher, bvv.messages_voucher, bvv.deleted_voucher, bvi.id_taxpayer, bvi.type_environment as bvi_type_environment, bvi.name_institution, bvi.description_institution, bvi.address_institution, bvi.status_institution from business.view_voucher bvv
						inner join business.view_institution bvi on bvv.id_institution = bvi.id_institution
						inner join business.view_taxpayer bvt on bvi.id_taxpayer = bvt.id_taxpayer
						inner join business.view_setting_taxpayer bvst on bvt.id_setting_taxpayer = bvst.id_setting_taxpayer
						where bvv.id_voucher =_id_voucher;
				ELSE
					_EXCEPTION = 'Ocurrió un error al actualizar voucher';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			 END;
			 
$BODY$;

ALTER FUNCTION business.dml_voucher_update_modified(numeric, numeric, numeric, business."TYPE_ENVIRONMENT", business."TYPE_EMISSION", business."TYPE_VOUCHER", character varying, character varying, timestamp without time zone, timestamp without time zone, character varying, json, business."TYPE_VOUCHER_STATUS", business."TYPE_VOUCHER_STATUS", boolean, boolean, boolean, json, boolean)
    OWNER TO postgres;

-- FUNCTION: business.dml_voucher_validation(numeric, numeric, character varying, business."TYPE_VOUCHER")
-- DROP FUNCTION IF EXISTS business.dml_voucher_validation(numeric, numeric, character varying, business."TYPE_VOUCHER");

CREATE OR REPLACE FUNCTION business.dml_voucher_validation(
	id_user_ numeric,
	_id_institution numeric,
	_access_key_voucher character varying,
	_type_voucher business."TYPE_VOUCHER")
    RETURNS TABLE(id_voucher numeric, id_institution numeric, bvv_type_environment business."TYPE_ENVIRONMENT", bvv_type_emission business."TYPE_EMISSION", type_voucher business."TYPE_VOUCHER", number_voucher character varying, access_key_voucher character varying, emission_date_voucher timestamp without time zone, authorization_date_voucher timestamp without time zone, buyer_identifier_voucher character varying, body_voucher json, internal_status_voucher business."TYPE_VOUCHER_STATUS", global_status_voucher business."TYPE_VOUCHER_STATUS", action_pdf_voucher boolean, action_email_voucher boolean, action_alfresco_voucher boolean, messages_voucher json, deleted_voucher boolean, id_taxpayer numeric, bvi_type_environment business."TYPE_ENVIRONMENT", name_institution character varying, description_institution character varying, address_institution character varying, status_institution boolean) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
			DECLARE	
				_COUNT_VOUCHER NUMERIC;
				_VALIDATION_STATUS BOOLEAN;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			BEGIN
				_COUNT_VOUCHER = (select count(*) from business.view_voucher bvv where bvv.id_institution = _id_institution and bvv.access_key_voucher = _access_key_voucher);
				
				IF (_COUNT_VOUCHER > 0) THEN
					RETURN QUERY select bvv.id_voucher, bvv.id_institution, bvv.type_environment as bvv_type_environment, bvv.type_emission, bvv.type_voucher as bvv_type_emission, bvv.number_voucher, bvv.access_key_voucher, bvv.emission_date_voucher, bvv.authorization_date_voucher, bvv.buyer_identifier_voucher, bvv.body_voucher, bvv.internal_status_voucher, bvv.global_status_voucher, bvv.action_pdf_voucher, bvv.action_email_voucher, bvv.action_alfresco_voucher, bvv.messages_voucher, bvv.deleted_voucher, bvi.id_taxpayer, bvi.type_environment as bvi_type_environment, bvi.name_institution, bvi.description_institution, bvi.address_institution, bvi.status_institution from business.view_voucher bvv
						inner join business.view_institution bvi on bvv.id_institution = bvi.id_institution
						inner join business.view_taxpayer bvt on bvi.id_taxpayer = bvt.id_taxpayer
						inner join business.view_setting_taxpayer bvst on bvt.id_setting_taxpayer = bvst.id_setting_taxpayer
						where bvv.access_key_voucher = _access_key_voucher;
				ELSE
					_EXCEPTION = 'No se encontró registrado el comprobante '||_access_key_voucher||' en la institución';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			END;
			
$BODY$;

ALTER FUNCTION business.dml_voucher_validation(numeric, numeric, character varying, business."TYPE_VOUCHER")
    OWNER TO postgres;

-- FUNCTION: business.dml_voucher_cancel(numeric, numeric, character varying)
-- DROP FUNCTION IF EXISTS business.dml_voucher_cancel(numeric, numeric, character varying);

CREATE OR REPLACE FUNCTION business.dml_voucher_cancel(
	id_user_ numeric,
	_id_institution numeric,
	_access_key_voucher character varying)
    RETURNS TABLE(id_voucher numeric, id_institution numeric, bvv_type_environment business."TYPE_ENVIRONMENT", type_emission business."TYPE_EMISSION", type_voucher business."TYPE_VOUCHER", number_voucher character varying, access_key_voucher character varying, emission_date_voucher timestamp without time zone, authorization_date_voucher timestamp without time zone, buyer_identifier_voucher character varying, body_voucher json, internal_status_voucher business."TYPE_VOUCHER_STATUS", global_status_voucher business."TYPE_VOUCHER_STATUS", action_pdf_voucher boolean, action_email_voucher boolean, action_alfresco_voucher boolean, messages_voucher json, deleted_voucher boolean, id_taxpayer numeric, bvi_type_environment business."TYPE_ENVIRONMENT", name_institution character varying, description_institution character varying, address_institution character varying, status_institution boolean) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
			 DECLARE
			 	_COUNT_VOUCHER NUMERIC;
				_INTERNAL_STATUS_VOUCHER business."TYPE_VOUCHER_STATUS";
			 	_X RECORD; 
			 	_UPDATE_VOUCHER BOOLEAN;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
				_COUNT_VOUCHER = (select count(*) from business.view_voucher bvv where bvv.id_institution = _id_institution and bvv.access_key_voucher = _access_key_voucher);
		
				IF (_COUNT_VOUCHER >= 1) THEN
					_INTERNAL_STATUS_VOUCHER = (select bvv.internal_status_voucher from business.view_voucher bvv where bvv.access_key_voucher = _access_key_voucher);
					
					IF (_INTERNAL_STATUS_VOUCHER = 'pending' OR _INTERNAL_STATUS_VOUCHER = 'authorized') THEN
						FOR _X IN select * from business.view_voucher bvv where bvv.access_key_voucher = _access_key_voucher LOOP
							RAISE NOTICE '%', _X.id_voucher;
							_UPDATE_VOUCHER = (select * from business.dml_voucher_update(id_user_, _X.id_voucher, _X.id_institution, _X.type_environment, _X.type_emission, _X.type_voucher, _X.number_voucher, _X.access_key_voucher, _X.emission_date_voucher, _X.authorization_date_voucher, _X.buyer_identifier_voucher, _X.body_voucher, 'canceled', _X.global_status_voucher, _X.action_pdf_voucher, _X.action_email_voucher, _X.action_alfresco_voucher, _X.messages_voucher, _X.deleted_voucher));
						END LOOP;
						
						IF (_UPDATE_VOUCHER) THEN
							RETURN QUERY select bvv.id_voucher, bvv.id_institution, bvv.type_environment as bvv_type_environment, bvv.type_emission, bvv.type_voucher, bvv.number_voucher, bvv.access_key_voucher, bvv.emission_date_voucher, bvv.authorization_date_voucher, bvv.buyer_identifier_voucher, bvv.body_voucher, bvv.internal_status_voucher, bvv.global_status_voucher, bvv.action_pdf_voucher, bvv.action_email_voucher, bvv.action_alfresco_voucher, bvv.messages_voucher, bvv.deleted_voucher, bvi.id_taxpayer, bvi.type_environment as bvi_type_environment, bvi.name_institution, bvi.description_institution, bvi.address_institution, bvi.status_institution from business.view_voucher bvv
								inner join business.view_institution bvi on bvv.id_institution = bvi.id_institution
								inner join business.view_taxpayer bvt on bvi.id_taxpayer = bvt.id_taxpayer
								inner join business.view_setting_taxpayer bvst on bvt.id_setting_taxpayer = bvst.id_setting_taxpayer
								where bvv.access_key_voucher = _access_key_voucher;
						ELSE
							_EXCEPTION = 'Ocurrió un error al actualizar voucher';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						END IF;
					ELSE 
						_EXCEPTION = 'El comprobante se encuentra anulado o eliminado';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
				ELSE
					_EXCEPTION = 'No se encontró registrado el comprobante '||_access_key_voucher||' en la institución';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			 END;
			 
$BODY$;

ALTER FUNCTION business.dml_voucher_cancel(numeric, numeric, character varying)
    OWNER TO postgres;

-- FUNCTION: business.dml_voucher_reverse_cancel(numeric, numeric, character varying)
-- DROP FUNCTION IF EXISTS business.dml_voucher_reverse_cancel(numeric, numeric, character varying);

CREATE OR REPLACE FUNCTION business.dml_voucher_reverse_cancel(
	id_user_ numeric,
	_id_institution numeric,
	_access_key_voucher character varying)
    RETURNS TABLE(id_voucher numeric, id_institution numeric, bvv_type_environment business."TYPE_ENVIRONMENT", type_emission business."TYPE_EMISSION", type_voucher business."TYPE_VOUCHER", number_voucher character varying, access_key_voucher character varying, emission_date_voucher timestamp without time zone, authorization_date_voucher timestamp without time zone, buyer_identifier_voucher character varying, body_voucher json, internal_status_voucher business."TYPE_VOUCHER_STATUS", global_status_voucher business."TYPE_VOUCHER_STATUS", action_pdf_voucher boolean, action_email_voucher boolean, action_alfresco_voucher boolean, messages_voucher json, deleted_voucher boolean, id_taxpayer numeric, bvi_type_environment business."TYPE_ENVIRONMENT", name_institution character varying, description_institution character varying, address_institution character varying, status_institution boolean) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
			 DECLARE
			 	_COUNT_VOUCHER NUMERIC;
				_INTERNAL_STATUS_VOUCHER business."TYPE_VOUCHER_STATUS";
			 	_X RECORD; 
			 	_UPDATE_VOUCHER BOOLEAN;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
				_COUNT_VOUCHER = (select count(*) from business.view_voucher bvv where bvv.id_institution = _id_institution and bvv.access_key_voucher = _access_key_voucher);
		
				IF (_COUNT_VOUCHER >= 1) THEN
					_INTERNAL_STATUS_VOUCHER = (select bvv.internal_status_voucher from business.view_voucher bvv where bvv.access_key_voucher = _access_key_voucher);
					
					IF (_INTERNAL_STATUS_VOUCHER = 'canceled') THEN
						FOR _X IN select * from business.view_voucher bvv where bvv.access_key_voucher = _access_key_voucher LOOP
							_UPDATE_VOUCHER = (select * from business.dml_voucher_update(id_user_, _X.id_voucher, _X.id_institution, _X.type_environment, _X.type_emission, _X.type_voucher, _X.number_voucher, _X.access_key_voucher, _X.emission_date_voucher, _X.authorization_date_voucher, _X.buyer_identifier_voucher, _X.body_voucher, _X.global_status_voucher, _X.global_status_voucher, _X.action_pdf_voucher, _X.action_email_voucher, _X.action_alfresco_voucher, _X.messages_voucher, _X.deleted_voucher));
						END LOOP;
						
						IF (_UPDATE_VOUCHER) THEN
							RETURN QUERY select bvv.id_voucher, bvv.id_institution, bvv.type_environment as bvv_type_environment, bvv.type_emission, bvv.type_voucher, bvv.number_voucher, bvv.access_key_voucher, bvv.emission_date_voucher, bvv.authorization_date_voucher, bvv.buyer_identifier_voucher, bvv.body_voucher, bvv.internal_status_voucher, bvv.global_status_voucher, bvv.action_pdf_voucher, bvv.action_email_voucher, bvv.action_alfresco_voucher, bvv.messages_voucher, bvv.deleted_voucher, bvi.id_taxpayer, bvi.type_environment as bvi_type_environment, bvi.name_institution, bvi.description_institution, bvi.address_institution, bvi.status_institution from business.view_voucher bvv
								inner join business.view_institution bvi on bvv.id_institution = bvi.id_institution
								inner join business.view_taxpayer bvt on bvi.id_taxpayer = bvt.id_taxpayer
								inner join business.view_setting_taxpayer bvst on bvt.id_setting_taxpayer = bvst.id_setting_taxpayer
								where bvv.access_key_voucher = _access_key_voucher;
						ELSE
							_EXCEPTION = 'Ocurrió un error al hacer la reversa de la anulación del comprobante';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						END IF;
					ELSE 
						_EXCEPTION = 'El comprobante no se encuentra anulado';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
				ELSE
					_EXCEPTION = 'No se encontró registrado el comprobante '||_access_key_voucher||' en la institución';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			 END;
			 
$BODY$;

ALTER FUNCTION business.dml_voucher_reverse_cancel(numeric, numeric, character varying)
    OWNER TO postgres;

-- FUNCTION: business.dml_voucher_reception_instantly(numeric, numeric, character varying, business."TYPE_VOUCHER")
-- DROP FUNCTION IF EXISTS business.dml_voucher_reception_instantly(numeric, numeric, character varying, business."TYPE_VOUCHER");

CREATE OR REPLACE FUNCTION business.dml_voucher_reception_instantly(
	id_user_ numeric,
	_id_institution numeric,
	_access_key_voucher character varying,
	_type_voucher business."TYPE_VOUCHER")
    RETURNS TABLE(id_sequence numeric, id_institution numeric, id_establishment numeric, id_emission_point numeric, bvs_type_environment business."TYPE_ENVIRONMENT", bvs_type_voucher business."TYPE_VOUCHER", number_code_sequence character varying, deleted_sequence boolean, value_establishment character varying, description_establishment character varying, value_emission_point character varying, description_emission_point character varying, id_taxpayer numeric, bvi_type_environment business."TYPE_ENVIRONMENT", name_institution character varying, description_institution character varying, address_institution character varying, status_institution boolean, bvv_type_voucher business."TYPE_VOUCHER", access_key_voucher character varying, body_voucher json, id_company numeric, id_user numeric, id_setting_taxpayer numeric, type_emission business."TYPE_EMISSION", business_name_taxpayer character varying, tradename_taxpayer character varying, ruc_taxpayer character varying, dir_matriz_taxpayer character varying, signature_password_taxpayer character varying, signature_path_taxpayer character varying, status_taxpayer boolean, accounting_obliged business."TYPE_ACCOUNTING_OBLIGED", id_mail_server numeric, mailing_setting_taxpayer boolean, from_setting_taxpayer character varying, subject_setting_taxpayer character varying, html_setting_taxpayer text, download_note_setting_taxpayer character varying, logo_path_setting_taxpayer character varying, save_alfresco boolean, wait_autorization numeric) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
			DECLARE	
				_COUNT_VOUCHER NUMERIC;
				_COUNT_STATUS NUMERIC;
				_VALIDATION_STATUS BOOLEAN;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			BEGIN
				_COUNT_VOUCHER = (select count(*) from business.view_voucher bvv where bvv.id_institution = _id_institution and bvv.access_key_voucher = _access_key_voucher);
				
				IF (_COUNT_VOUCHER > 0) THEN
					_COUNT_STATUS = (select count(*) from business.view_voucher bvv where bvv.id_institution = _id_institution and bvv.access_key_voucher = _access_key_voucher and bvv.global_status_voucher = 'pending');
					
					IF (_COUNT_STATUS > 0) THEN
						-- General validation 
						_VALIDATION_STATUS = (select * from business.validation_institution_overview(_id_institution, _type_voucher));
						-- General validation 

						IF (_VALIDATION_STATUS) THEN
							RETURN QUERY select bvs.id_sequence, bvs.id_institution, bvs.id_establishment, bvs.id_emission_point, bvs.type_environment as bvs_type_environment, bvs.type_voucher, bvs.number_code_sequence, bvs.deleted_sequence, bve.value_establishment, bve.description_establishment, bvep.value_emission_point, bvep.description_emission_point, bvi.id_taxpayer, bvi.type_environment as bvi_type_environment, bvi.name_institution, bvi.description_institution, bvi.address_institution, bvi.status_institution, bvv.type_voucher, bvv.access_key_voucher, bvv.body_voucher, bvt.id_company, bvt.id_user, bvt.id_setting_taxpayer, bvt.type_emission, bvt.business_name_taxpayer, bvt.tradename_taxpayer, bvt.ruc_taxpayer, bvt.dir_matriz_taxpayer, bvt.signature_password_taxpayer, bvt.signature_path_taxpayer, bvt.status_taxpayer, bvt.accounting_obliged, bvst.id_mail_server, bvst.mailing_setting_taxpayer, bvst.from_setting_taxpayer, bvst.subject_setting_taxpayer, bvst.html_setting_taxpayer, bvst.download_note_setting_taxpayer, bvst.logo_path_setting_taxpayer, cvs.save_alfresco, cvs.wait_autorization from business.view_sequence bvs
								inner join business.view_establishment bve on bvs.id_establishment = bve.id_establishment
								inner join business.view_emission_point bvep on bvs.id_emission_point = bvep.id_emission_point
								inner join business.view_institution bvi on bvs.id_institution = bvi.id_institution
								inner join business.view_voucher bvv on bvi.id_institution = bvv.id_institution
								inner join business.view_taxpayer bvt on bvi.id_taxpayer = bvt.id_taxpayer
								inner join business.view_setting_taxpayer bvst on bvst.id_setting_taxpayer = bvt.id_setting_taxpayer
								inner join core.view_user cvu on bvt.id_user = cvu.id_user
								inner join core.view_company cvc on cvu.id_company = cvc.id_company
								inner join core.view_setting cvs on cvc.id_setting = cvs.id_setting
								where bvv.access_key_voucher = _access_key_voucher;
						END IF;
					ELSE
						_EXCEPTION = 'El comprobante '||_access_key_voucher||' tiene un estado != pending';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
				ELSE
					_EXCEPTION = 'No se encontró registrado el comprobante '||_access_key_voucher||' en la institución';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
				-- RAISE NOTICE '%', SQLERRM;
				IF (_EXCEPTION = 'Internal Error') THEN
					RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
				ELSE
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
			END;
			
$BODY$;

ALTER FUNCTION business.dml_voucher_reception_instantly(numeric, numeric, character varying, business."TYPE_VOUCHER")
    OWNER TO postgres;

-- FUNCTION: business.dml_voucher_by_batch_by_institution(numeric, numeric, business."TYPE_VOUCHER", character varying)
-- DROP FUNCTION IF EXISTS business.dml_voucher_by_batch_by_institution(numeric, numeric, business."TYPE_VOUCHER", character varying);

CREATE OR REPLACE FUNCTION business.dml_voucher_by_batch_by_institution(
	id_user_ numeric,
	_id_institution numeric,
	_type_voucher business."TYPE_VOUCHER",
	_emission_date_voucher character varying)
    RETURNS TABLE(id_sequence numeric, id_institution numeric, id_establishment numeric, id_emission_point numeric, bvs_type_environment business."TYPE_ENVIRONMENT", bvs_type_voucher business."TYPE_VOUCHER", number_code_sequence character varying, deleted_sequence boolean, value_establishment character varying, description_establishment character varying, value_emission_point character varying, description_emission_point character varying, id_taxpayer numeric, bvi_type_environment business."TYPE_ENVIRONMENT", name_institution character varying, description_institution character varying, address_institution character varying, status_institution boolean, bvv_type_voucher business."TYPE_VOUCHER", access_key_voucher character varying, body_voucher json, id_company numeric, id_user numeric, id_setting_taxpayer numeric, type_emission business."TYPE_EMISSION", business_name_taxpayer character varying, tradename_taxpayer character varying, ruc_taxpayer character varying, dir_matriz_taxpayer character varying, signature_password_taxpayer character varying, signature_path_taxpayer character varying, status_taxpayer boolean, accounting_obliged business."TYPE_ACCOUNTING_OBLIGED", id_mail_server numeric, mailing_setting_taxpayer boolean, from_setting_taxpayer character varying, subject_setting_taxpayer character varying, html_setting_taxpayer text, download_note_setting_taxpayer character varying, logo_path_setting_taxpayer character varying, save_alfresco boolean, wait_autorization numeric, batch_shipping boolean, max_generation_pdf numeric, wait_generation_pdf numeric) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
			DECLARE	
				_STATUS_BY_BATCH_INSTITUTION BOOLEAN;
				_START_DATE TIMESTAMP WITHOUT TIME ZONE;
				_END_DATE TIMESTAMP WITHOUT TIME ZONE;
				_VALIDATION_STATUS BOOLEAN;
				_COUNT_VOUCHER NUMERIC;
				_CHANGE_STATUS_BY_BATCH BOOLEAN;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			BEGIN
				_STATUS_BY_BATCH_INSTITUTION = (select bvi.status_by_batch_institution from business.view_institution bvi 
					where bvi.id_institution = _id_institution); 
					
				IF (_STATUS_BY_BATCH_INSTITUTION) THEN
					_EXCEPTION = 'La institución '||_id_institution||' se encuentra realizando el proceso sendVoucherByBatchByInstitution';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				ELSE
					_START_DATE = ''||_emission_date_voucher||' 00:00:00';
					_END_DATE = ''||_emission_date_voucher||' 23:59:59';

					-- General validation 
					_VALIDATION_STATUS = (select * from business.validation_institution_overview(_id_institution, _type_voucher));
					-- General validation 
				
					IF (_VALIDATION_STATUS) THEN
						_COUNT_VOUCHER =  (select count(*) from business.view_voucher bvv
								where bvv.id_institution = _id_institution and bvv.global_status_voucher = 'pending' and bvv.type_voucher = _type_voucher and (bvv.emission_date_voucher > _START_DATE and bvv.emission_date_voucher < _END_DATE));
						IF (_COUNT_VOUCHER > 0) THEN
							_CHANGE_STATUS_BY_BATCH = (select * from business.dml_institution_change_status_by_batch(id_user_, _id_institution, true));

							RETURN QUERY select bvs.id_sequence, bvs.id_institution, bvs.id_establishment, bvs.id_emission_point, bvs.type_environment as bvs_type_environment, bvs.type_voucher, bvs.number_code_sequence, bvs.deleted_sequence, bve.value_establishment, bve.description_establishment, bvep.value_emission_point, bvep.description_emission_point, bvi.id_taxpayer, bvi.type_environment as bvi_type_environment, bvi.name_institution, bvi.description_institution, bvi.address_institution, bvi.status_institution, bvv.type_voucher, bvv.access_key_voucher, bvv.body_voucher, bvt.id_company, bvt.id_user, bvt.id_setting_taxpayer, bvt.type_emission, bvt.business_name_taxpayer, bvt.tradename_taxpayer, bvt.ruc_taxpayer, bvt.dir_matriz_taxpayer, bvt.signature_password_taxpayer, bvt.signature_path_taxpayer, bvt.status_taxpayer, bvt.accounting_obliged, bvst.id_mail_server, bvst.mailing_setting_taxpayer, bvst.from_setting_taxpayer, bvst.subject_setting_taxpayer, bvst.html_setting_taxpayer, bvst.download_note_setting_taxpayer, bvst.logo_path_setting_taxpayer, cvs.save_alfresco, cvs.wait_autorization, cvs.batch_shipping, cvs.max_generation_pdf, cvs.wait_generation_pdf from business.view_sequence bvs
								inner join business.view_establishment bve on bvs.id_establishment = bve.id_establishment
								inner join business.view_emission_point bvep on bvs.id_emission_point = bvep.id_emission_point
								inner join business.view_institution bvi on bvs.id_institution = bvi.id_institution
								inner join business.view_voucher bvv on bvi.id_institution = bvv.id_institution
								inner join business.view_taxpayer bvt on bvi.id_taxpayer = bvt.id_taxpayer
								inner join business.view_setting_taxpayer bvst on bvst.id_setting_taxpayer = bvt.id_setting_taxpayer
								inner join core.view_user cvu on bvt.id_user = cvu.id_user
								inner join core.view_company cvc on cvu.id_company = cvc.id_company
								inner join core.view_setting cvs on cvc.id_setting = cvs.id_setting
								where bvv.id_institution = _id_institution and bvv.global_status_voucher = 'pending' and bvv.type_voucher = _type_voucher and (bvv.emission_date_voucher > _START_DATE and bvv.emission_date_voucher < _END_DATE);
						ELSE
							_EXCEPTION = 'No se encontraron comprobantes registrados con los parámetros ingresados';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						END IF;
					END IF;
				END IF;
				exception when others then 
				-- RAISE NOTICE '%', SQLERRM;
				IF (_EXCEPTION = 'Internal Error') THEN
					RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
				ELSE
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
			END;
			
$BODY$;

ALTER FUNCTION business.dml_voucher_by_batch_by_institution(numeric, numeric, business."TYPE_VOUCHER", character varying)
    OWNER TO postgres;

-- FUNCTION: business.dml_voucher_by_batch_by_taxpayer(numeric, numeric, business."TYPE_VOUCHER", character varying)
-- DROP FUNCTION IF EXISTS business.dml_voucher_by_batch_by_taxpayer(numeric, numeric, business."TYPE_VOUCHER", character varying);

CREATE OR REPLACE FUNCTION business.dml_voucher_by_batch_by_taxpayer(
	id_user_ numeric,
	_id_taxpayer numeric,
	_type_voucher business."TYPE_VOUCHER",
	_emission_date_voucher character varying)
    RETURNS TABLE(id_sequence numeric, id_institution numeric, id_establishment numeric, id_emission_point numeric, bvs_type_environment business."TYPE_ENVIRONMENT", bvs_type_voucher business."TYPE_VOUCHER", number_code_sequence character varying, deleted_sequence boolean, value_establishment character varying, description_establishment character varying, value_emission_point character varying, description_emission_point character varying, id_taxpayer numeric, bvi_type_environment business."TYPE_ENVIRONMENT", name_institution character varying, description_institution character varying, address_institution character varying, status_institution boolean, bvv_type_voucher business."TYPE_VOUCHER", access_key_voucher character varying, body_voucher json, id_company numeric, id_user numeric, id_setting_taxpayer numeric, type_emission business."TYPE_EMISSION", business_name_taxpayer character varying, tradename_taxpayer character varying, ruc_taxpayer character varying, dir_matriz_taxpayer character varying, signature_password_taxpayer character varying, signature_path_taxpayer character varying, status_taxpayer boolean, accounting_obliged business."TYPE_ACCOUNTING_OBLIGED", id_mail_server numeric, mailing_setting_taxpayer boolean, from_setting_taxpayer character varying, subject_setting_taxpayer character varying, html_setting_taxpayer text, download_note_setting_taxpayer character varying, logo_path_setting_taxpayer character varying, save_alfresco boolean, wait_autorization numeric, batch_shipping boolean, max_generation_pdf numeric, wait_generation_pdf numeric) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
			DECLARE	
				_VALIDATION_STATUS BOOLEAN;
				_STATUS_BY_BATCH_TAXPAYER BOOLEAN;
				_START_DATE TIMESTAMP WITHOUT TIME ZONE;
				_END_DATE TIMESTAMP WITHOUT TIME ZONE;
				_X RECORD;
				_COUNT_VOUCHER NUMERIC;
				_CHANGE_STATUS_BY_BATCH BOOLEAN;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			BEGIN
				_STATUS_BY_BATCH_TAXPAYER = (select bvt.status_by_batch_taxpayer from business.view_taxpayer bvt 
					where bvt.id_taxpayer = _id_taxpayer); 
				
				IF (_STATUS_BY_BATCH_TAXPAYER) THEN
					_EXCEPTION = 'La contribuyente '||_id_taxpayer||' se encuentra realizando el proceso sendVoucherByBatchByTaxpayer';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				ELSE
					_START_DATE = ''||_emission_date_voucher||' 00:00:00';
					_END_DATE = ''||_emission_date_voucher||' 23:59:59';

					-- General validation 
					FOR _X IN select bvi.id_institution from business.view_institution bvi where bvi.id_taxpayer = _id_taxpayer LOOP
						_VALIDATION_STATUS = (select * from business.validation_institution_overview(_X.id_institution, _type_voucher));
					END LOOP;
					-- General validation 
				
					IF (_VALIDATION_STATUS) THEN
						_COUNT_VOUCHER =  (select count(*) from business.view_voucher bvv
							inner join business.view_institution bvi on bvv.id_institution = bvi.id_institution
							inner join business.view_taxpayer bvt on bvi.id_taxpayer = bvt.id_taxpayer
							where bvt.id_taxpayer = _id_taxpayer and bvv.global_status_voucher = 'pending' and bvv.type_voucher = _type_voucher and (bvv.emission_date_voucher > _START_DATE and bvv.emission_date_voucher < _END_DATE));
						
						IF (_COUNT_VOUCHER > 0) THEN
							_CHANGE_STATUS_BY_BATCH = (select * from business.dml_taxpayer_change_status_by_batch(id_user_, _id_taxpayer, true));

							RETURN QUERY select bvs.id_sequence, bvs.id_institution, bvs.id_establishment, bvs.id_emission_point, bvs.type_environment as bvs_type_environment, bvs.type_voucher, bvs.number_code_sequence, bvs.deleted_sequence, bve.value_establishment, bve.description_establishment, bvep.value_emission_point, bvep.description_emission_point, bvi.id_taxpayer, bvi.type_environment as bvi_type_environment, bvi.name_institution, bvi.description_institution, bvi.address_institution, bvi.status_institution, bvv.type_voucher, bvv.access_key_voucher, bvv.body_voucher, bvt.id_company, bvt.id_user, bvt.id_setting_taxpayer, bvt.type_emission, bvt.business_name_taxpayer, bvt.tradename_taxpayer, bvt.ruc_taxpayer, bvt.dir_matriz_taxpayer, bvt.signature_password_taxpayer, bvt.signature_path_taxpayer, bvt.status_taxpayer, bvt.accounting_obliged, bvst.id_mail_server, bvst.mailing_setting_taxpayer, bvst.from_setting_taxpayer, bvst.subject_setting_taxpayer, bvst.html_setting_taxpayer, bvst.download_note_setting_taxpayer, bvst.logo_path_setting_taxpayer, cvs.save_alfresco, cvs.wait_autorization, cvs.batch_shipping, cvs.max_generation_pdf, cvs.wait_generation_pdf from business.view_sequence bvs
								inner join business.view_establishment bve on bvs.id_establishment = bve.id_establishment
								inner join business.view_emission_point bvep on bvs.id_emission_point = bvep.id_emission_point
								inner join business.view_institution bvi on bvs.id_institution = bvi.id_institution
								inner join business.view_voucher bvv on bvi.id_institution = bvv.id_institution
								inner join business.view_taxpayer bvt on bvi.id_taxpayer = bvt.id_taxpayer
								inner join business.view_setting_taxpayer bvst on bvst.id_setting_taxpayer = bvt.id_setting_taxpayer
								inner join core.view_user cvu on bvt.id_user = cvu.id_user
								inner join core.view_company cvc on cvu.id_company = cvc.id_company
								inner join core.view_setting cvs on cvc.id_setting = cvs.id_setting
								where bvt.id_taxpayer = _id_taxpayer and bvv.global_status_voucher = 'pending' and bvv.type_voucher = _type_voucher and (bvv.emission_date_voucher > _START_DATE and bvv.emission_date_voucher < _END_DATE);
						ELSE
							_EXCEPTION = 'No se encontraron comprobantes registrados con los parámetros ingresados';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						END IF;
					END IF;
				END IF;
				exception when others then 
				-- RAISE NOTICE '%', SQLERRM;
				IF (_EXCEPTION = 'Internal Error') THEN
					RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
				ELSE
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
			END;
			
$BODY$;

ALTER FUNCTION business.dml_voucher_by_batch_by_taxpayer(numeric, numeric, business."TYPE_VOUCHER", character varying)
    OWNER TO postgres;

-- FUNCTION: business.dml_voucher_complete_process(numeric, numeric, character varying, business."TYPE_VOUCHER")
-- DROP FUNCTION IF EXISTS business.dml_voucher_complete_process(numeric, numeric, character varying, business."TYPE_VOUCHER");

CREATE OR REPLACE FUNCTION business.dml_voucher_complete_process(
	id_user_ numeric,
	_id_institution numeric,
	_access_key_voucher character varying,
	_type_voucher business."TYPE_VOUCHER")
    RETURNS TABLE(id_sequence numeric, id_institution numeric, id_establishment numeric, id_emission_point numeric, bvs_type_environment business."TYPE_ENVIRONMENT", bvs_type_voucher business."TYPE_VOUCHER", number_code_sequence character varying, deleted_sequence boolean, value_establishment character varying, description_establishment character varying, value_emission_point character varying, description_emission_point character varying, id_taxpayer numeric, bvi_type_environment business."TYPE_ENVIRONMENT", name_institution character varying, description_institution character varying, address_institution character varying, status_institution boolean, bvv_type_voucher business."TYPE_VOUCHER", access_key_voucher character varying, body_voucher json, id_company numeric, id_user numeric, id_setting_taxpayer numeric, type_emission business."TYPE_EMISSION", business_name_taxpayer character varying, tradename_taxpayer character varying, ruc_taxpayer character varying, dir_matriz_taxpayer character varying, signature_password_taxpayer character varying, signature_path_taxpayer character varying, status_taxpayer boolean, accounting_obliged business."TYPE_ACCOUNTING_OBLIGED", id_mail_server numeric, mailing_setting_taxpayer boolean, from_setting_taxpayer character varying, subject_setting_taxpayer character varying, html_setting_taxpayer text, download_note_setting_taxpayer character varying, logo_path_setting_taxpayer character varying, save_alfresco boolean, wait_autorization numeric) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
			DECLARE	
				_X RECORD;
				_COUNT_VOUCHER NUMERIC;
				_ACTION_PDF_VOUCHER BOOLEAN;
				_ACTION_EMAIL_VOUCHER BOOLEAN;
				_ACTION_ALFRESCO_VOUCHER BOOLEAN;
				_VALIDATION_STATUS BOOLEAN;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			BEGIN
				_COUNT_VOUCHER = (select count(*) from business.view_voucher bvv where bvv.id_institution = _id_institution and bvv.access_key_voucher = _access_key_voucher);

				IF (_COUNT_VOUCHER >= 1) THEN
					FOR _X IN select bvv.action_pdf_voucher, bvv.action_email_voucher, bvv.action_alfresco_voucher from business.view_voucher bvv where bvv.access_key_voucher = _access_key_voucher LOOP
						_ACTION_PDF_VOUCHER = _X.action_pdf_voucher;
						_ACTION_EMAIL_VOUCHER = _X.action_email_voucher;
						_ACTION_ALFRESCO_VOUCHER = _X.action_alfresco_voucher;
					END LOOP;

					IF (NOT(_ACTION_PDF_VOUCHER and _ACTION_EMAIL_VOUCHER and _ACTION_ALFRESCO_VOUCHER)) THEN
						-- General validation 
						_VALIDATION_STATUS = (select * from business.validation_institution_overview(_id_institution, _type_voucher));
						-- General validation 
				
						IF (_VALIDATION_STATUS) THEN
							RETURN QUERY select bvs.id_sequence, bvs.id_institution, bvs.id_establishment, bvs.id_emission_point, bvs.type_environment as bvs_type_environment, bvs.type_voucher, bvs.number_code_sequence, bvs.deleted_sequence, bve.value_establishment, bve.description_establishment, bvep.value_emission_point, bvep.description_emission_point, bvi.id_taxpayer, bvi.type_environment as bvi_type_environment, bvi.name_institution, bvi.description_institution, bvi.address_institution, bvi.status_institution, bvv.type_voucher, bvv.access_key_voucher, bvv.body_voucher, bvt.id_company, bvt.id_user, bvt.id_setting_taxpayer, bvt.type_emission, bvt.business_name_taxpayer, bvt.tradename_taxpayer, bvt.ruc_taxpayer, bvt.dir_matriz_taxpayer, bvt.signature_password_taxpayer, bvt.signature_path_taxpayer, bvt.status_taxpayer, bvt.accounting_obliged, bvst.id_mail_server, bvst.mailing_setting_taxpayer, bvst.from_setting_taxpayer, bvst.subject_setting_taxpayer, bvst.html_setting_taxpayer, bvst.download_note_setting_taxpayer, bvst.logo_path_setting_taxpayer, cvs.save_alfresco, cvs.wait_autorization from business.view_sequence bvs
								inner join business.view_establishment bve on bvs.id_establishment = bve.id_establishment
								inner join business.view_emission_point bvep on bvs.id_emission_point = bvep.id_emission_point
								inner join business.view_institution bvi on bvs.id_institution = bvi.id_institution
								inner join business.view_voucher bvv on bvi.id_institution = bvv.id_institution
								inner join business.view_taxpayer bvt on bvi.id_taxpayer = bvt.id_taxpayer
								inner join business.view_setting_taxpayer bvst on bvst.id_setting_taxpayer = bvt.id_setting_taxpayer
								inner join core.view_user cvu on bvt.id_user = cvu.id_user
								inner join core.view_company cvc on cvu.id_company = cvc.id_company
								inner join core.view_setting cvs on cvc.id_setting = cvs.id_setting
								where bvv.access_key_voucher = _access_key_voucher;
						END IF;				
					ELSE
						_EXCEPTION = 'El comprobante '||_access_key_voucher||' no tiene procesos pendientes';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
				ELSE
					_EXCEPTION = 'No se encontró registrado el comprobante '||_access_key_voucher||' en la institución';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			END;
			
$BODY$;

ALTER FUNCTION business.dml_voucher_complete_process(numeric, numeric, character varying, business."TYPE_VOUCHER")
    OWNER TO postgres;

-- FUNCTION: business.dml_voucher_download(numeric, character varying)
-- DROP FUNCTION IF EXISTS business.dml_voucher_download(numeric, character varying);

CREATE OR REPLACE FUNCTION business.dml_voucher_download(
	_id_institution numeric,
	_access_key_voucher character varying)
    RETURNS TABLE(id_voucher numeric, id_institution numeric, bvv_type_environment business."TYPE_ENVIRONMENT", bvv_type_emission business."TYPE_EMISSION", type_voucher business."TYPE_VOUCHER", number_voucher character varying, access_key_voucher character varying, emission_date_voucher timestamp without time zone, authorization_date_voucher timestamp without time zone, buyer_identifier_voucher character varying, body_voucher json, internal_status_voucher business."TYPE_VOUCHER_STATUS", global_status_voucher business."TYPE_VOUCHER_STATUS", action_pdf_voucher boolean, action_email_voucher boolean, action_alfresco_voucher boolean, messages_voucher json, deleted_voucher boolean, id_taxpayer numeric, bvi_type_environment business."TYPE_ENVIRONMENT", name_institution character varying, description_institution character varying, address_institution character varying, status_institution boolean) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
			 DECLARE
			 	_COUNT_VOUCHER NUMERIC;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	-- Validation
				_COUNT_VOUCHER = (select count(*) from business.view_voucher bvv where bvv.id_institution = _id_institution and bvv.access_key_voucher = _access_key_voucher);
		
				IF (_COUNT_VOUCHER >= 1) THEN
					RETURN QUERY select bvv.id_voucher, bvv.id_institution, bvv.type_environment as bvv_type_environment, bvv.type_emission as bvv_type_emission, bvv.type_voucher, bvv.number_voucher, bvv.access_key_voucher, bvv.emission_date_voucher, bvv.authorization_date_voucher, bvv.buyer_identifier_voucher, bvv.body_voucher, bvv.internal_status_voucher, bvv.global_status_voucher, bvv.action_pdf_voucher, bvv.action_email_voucher, bvv.action_alfresco_voucher, bvv.messages_voucher, bvv.deleted_voucher, bvi.id_taxpayer, bvi.type_environment as bvi_type_environment, bvi.name_institution, bvi.description_institution, bvi.address_institution, bvi.status_institution from business.view_voucher bvv
						inner join business.view_institution bvi on bvv.id_institution = bvi.id_institution
						inner join business.view_taxpayer bvt on bvi.id_taxpayer = bvt.id_taxpayer
						inner join business.view_setting_taxpayer bvst on bvt.id_setting_taxpayer = bvst.id_setting_taxpayer
						where bvv.access_key_voucher = _access_key_voucher;
				ELSE
					_EXCEPTION = 'No se encontró registrado el comprobante '||_access_key_voucher||' en la institución';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			 END;
			 
$BODY$;

ALTER FUNCTION business.dml_voucher_download(numeric, character varying)
    OWNER TO postgres;