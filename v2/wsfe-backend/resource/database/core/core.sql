------------------------------ UTILS ------------------------------

-- FUNCTION: core.utils_get_date_maximum_hour()
-- DROP FUNCTION IF EXISTS core.utils_get_date_maximum_hour();

CREATE OR REPLACE FUNCTION core.utils_get_date_maximum_hour(
	)
    RETURNS timestamp without time zone
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
			 DECLARE
			 	_DAY DOUBLE PRECISION;
				_DAY_FINAL CHARACTER VARYING;
			 	_MONTH DOUBLE PRECISION;
				_MONTH_FINAL CHARACTER VARYING;
			 	_YEAR DOUBLE PRECISION;
			 	_YEAR_FINAL CHARACTER VARYING;
				_DATE CHARACTER VARYING;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
				_DAY = (select extract(day from now()::timestamp));
				_MONTH = (select extract(month from now()::timestamp));
				_YEAR = (select extract(year from now()::timestamp));
				
				IF (_DAY <= 9) THEN
					_DAY_FINAL = '0'||_DAY||'';
				ELSE
					_DAY_FINAL = ''||_DAY||'';
				END IF;
				
				IF (_MONTH <= 9) THEN
					_MONTH_FINAL = '0'||_MONTH||'';
				ELSE
					_MONTH_FINAL = ''||_MONTH||'';
				END IF;
				
				_YEAR_FINAL = ''||_YEAR||'';
				
				_DATE = ''||_YEAR_FINAL||'-'||_MONTH_FINAL||'-'||_DAY_FINAL||' 23:59:59';
				
				return _DATE::timestamp without time zone;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			 END;
			 
$BODY$;

ALTER FUNCTION core.utils_get_date_maximum_hour()
    OWNER TO postgres;

-- FUNCTION: core.auth_sign_in(character varying, character varying, character varying, json)
-- DROP FUNCTION IF EXISTS core.auth_sign_in(character varying, character varying, character varying, json);

CREATE OR REPLACE FUNCTION core.auth_sign_in(
	_name_user character varying,
	_password_user character varying,
	_host_session character varying,
	_agent_session json)
    RETURNS TABLE(status_sign_in boolean, id_session numeric, id_user numeric, id_company numeric, id_person numeric, id_type_user numeric, name_user character varying, avatar_user character varying, status_user boolean, id_setting numeric, name_company character varying, status_company boolean, expiration_token numeric, inactivity_time numeric, dni_person character varying, name_person character varying, last_name_person character varying, address_person character varying, phone_person character varying, id_profile numeric, name_type_user character varying, description_type_user character varying, status_type_user boolean, type_profile core."TYPE_PROFILE", name_profile character varying, description_profile character varying, status_profile boolean, navigation json) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
DECLARE
	_SESSION_LIMIT NUMERIC;
	_SESSION_COUNT NUMERIC;
	_COUNT_NAME_USER NUMERIC;
	_COUNT_PASSWORD_USER NUMERIC;
	_STATUS_USER BOOLEAN;
	_STATUS_COMPANY BOOLEAN;
	_STATUS_TYPE_USER BOOLEAN;
	_STATUS_PROFILE BOOLEAN;
	_NAME_TYPE_USER CHARACTER VARYING;
	_COUNT_NAVIGATION NUMERIC;
	_ID_USER NUMERIC;
	_ID_SESSION NUMERIC;
	_X RECORD;
	_NAVIGATION TEXT DEFAULT '';
	_NAV JSON;
	_EXCEPTION TEXT DEFAULT '';
BEGIN
	-- Verificar que el usuario no exceda las sesiones segun la configuración de la empresa
	_SESSION_LIMIT = (select vs.session_limit from core.view_user vu inner join core.view_company vc on vu.id_company = vc.id_company inner join core.view_setting vs on vc.id_setting = vs.id_setting where vu.name_user = _name_user);
	_SESSION_COUNT = (select count(*) from core.view_session vs inner join core.view_user vu on vs.id_user = vu.id_user where vu.name_user = 'miguelangelloor96@gmail.com' and vs.status_session = true);
	
	IF (_SESSION_COUNT >= _SESSION_LIMIT) THEN
		_EXCEPTION = 'Ha excedido el máximo de sesiones activas por usuario';
		RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database_auth';
	END IF;
	-- Verificar que el usuario este registrado
	_COUNT_NAME_USER = (select count(*) from core.view_user vu where vu.name_user = _name_user);
	IF (_COUNT_NAME_USER >= 1) THEN
		-- Verificar la contraseña del usuario
		_COUNT_PASSWORD_USER = (select count(*) from core.view_user vu where vu.name_user = _name_user and vu.password_user = _password_user);
		IF (_COUNT_PASSWORD_USER >= 1) THEN
			-- Verificar el estado del usuario 
			_STATUS_USER = (select vu.status_user from core.view_user vu where vu.name_user = _name_user);
			IF (_STATUS_USER) THEN
				-- Verificar el estado de la empresa del usuario				
				_STATUS_COMPANY = (select vc.status_company from core.view_company vc inner join core.view_user vu on vc.id_company = vu.id_company where vu.name_user = _name_user); 
				IF (_STATUS_COMPANY) THEN
					-- Verificar el estado del tipo de usuario				
					_STATUS_TYPE_USER = (select cvtu.status_type_user from core.view_type_user cvtu inner join core.view_user cvu on cvu.id_type_user = cvtu.id_type_user where cvu.name_user = _name_user);
					IF (_STATUS_TYPE_USER) THEN
						-- Verificar el estado del perfil				
						_STATUS_PROFILE = (select vp.status_profile from core.view_profile vp inner join core.view_type_user cvtu on vp.id_profile = cvtu.id_profile inner join core.view_user cu on cvtu.id_type_user = cu.id_type_user where cu.name_user = _name_user); 
						IF (_STATUS_PROFILE) THEN
							_COUNT_NAVIGATION = (select count(*) from core.view_navigation vn
								inner join core.view_profile_navigation vpn on vn.id_navigation = vpn.id_navigation
								inner join core.view_profile vp on vp.id_profile = vpn.id_profile
								inner join core.view_type_user vtu on vtu.id_profile = vp.id_profile
								inner join core.view_user vu on vu.id_type_user = vtu.id_type_user
								where vu.name_user = _name_user and vn.status_navigation = true);

							IF (_COUNT_NAVIGATION >= 1) THEN
								-- OBTENER LA NAVEGACION DEL USUARIO LOGEADO DE ACUERDO A SU PERFIL DE USUARIO
								FOR _X IN select vn.* from core.view_navigation vn inner join core.view_profile_navigation vpn on vn.id_navigation = vpn.id_navigation inner join core.view_profile vp on vp.id_profile = vpn.id_profile inner join core.view_type_user vtu on vtu.id_profile = vp.id_profile inner join core.view_user vu on vu.id_type_user = vtu.id_type_user where vu.name_user = _name_user and vn.status_navigation = true LOOP
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

								_ID_USER = (select vu.id_user from core.view_user vu where vu.name_user = _name_user);
								_ID_SESSION = (select * from core.dml_session_create(_ID_USER, _ID_USER, _host_session, _agent_session, now()::timestamp, now()::timestamp, true));

								RETURN QUERY select true as status_sign_in, _ID_SESSION as id_sesion, vu.id_user, vu.id_company, vu.id_person, vu.id_type_user, vu.name_user, vu.avatar_user, vu.status_user, vc.id_setting, vc.name_company, vc.status_company, vs.expiration_token, vs.inactivity_time, vp.dni_person, vp.name_person, vp.last_name_person, vp.address_person, vp.phone_person, vtu.id_profile, vtu.name_type_user, vtu.description_type_user, vtu.status_type_user, vpr.type_profile, vpr.name_profile, vpr.description_profile, vpr.status_profile, _NAV from core.view_user vu
									inner join core.view_company vc on vu.id_company = vc.id_company
									inner join core.view_setting vs on vc.id_setting = vs.id_setting
									inner join core.view_person vp on vu.id_person = vp.id_person
									inner join core.view_type_user vtu on vtu.id_type_user = vu.id_type_user
									inner join core.view_profile vpr on vpr.id_profile = vtu.id_profile
									where vu.name_user = _name_user;
							ELSE
								_EXCEPTION = 'El usuario '||_name_user||' no tiene navegaciones activas en su perfil';
								RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database_auth';
							END IF;
						ELSE
							_EXCEPTION = 'El perfil del usuario '||_name_user||' se encuentra desactivado';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database_auth';
						END IF;
					ELSE 
						_NAME_TYPE_USER = (select cvtu.name_type_user from core.view_type_user cvtu inner join core.view_user cvu on cvu.id_type_user = cvtu.id_type_user where cvu.name_user = _name_user);
						_EXCEPTION = 'El tipo de usuario '||_NAME_TYPE_USER||' se encuentra desactivado';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database_auth';
					END IF;
				ELSE
					_EXCEPTION = 'La empresa del usuario '||_name_user||' se encuentra desactivada';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database_auth';
				END IF;
			ELSE
				_EXCEPTION = 'El usuario '||_name_user||' se encuentra desactivado';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database_auth';
			END IF;
		ELSE
			_EXCEPTION = 'La contraseña ingresada es incorrecta';
			RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database_auth';
		END IF;
	ELSE
		_EXCEPTION = 'El usuario '||_name_user||' no se encuentra registrado';
		RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database_auth';
	END IF;
END;
	-- select * from  core.auth_sign_in('miguelangelloor96@gmail.com', 'IvD7dt+mfsPPpD23ZSFPXA==')
	-- select * from core.security_cap_aes_decrypt('IvD7dt+mfsPPpD23ZSFPXA==')
$BODY$;

ALTER FUNCTION core.auth_sign_in(character varying, character varying, character varying, json)
    OWNER TO postgres;

-- FUNCTION: core.auth_check_user(character varying)
-- DROP FUNCTION IF EXISTS core.auth_check_user(character varying);

CREATE OR REPLACE FUNCTION core.auth_check_user(
	_name_user character varying)
    RETURNS TABLE(status_check_user boolean, _expiration_verification_code numeric) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
DECLARE
	_COUNT_NAME_USER NUMERIC;
	_COUNT_PASSWORD_USER NUMERIC;
	_STATUS_USER BOOLEAN;
	_STATUS_COMPANY BOOLEAN;
	_STATUS_PROFILE BOOLEAN;
	_STATUS_TYPE_USER BOOLEAN;
	_NAME_TYPE_USER CHARACTER VARYING;
	_ID_COMPANY NUMERIC;
	_EXPIRATION_VERIFICATION_CODE NUMERIC;
	_EXCEPTION TEXT DEFAULT 'Internal Error';
BEGIN
	-- Verificar que el usuario este registrado
	_COUNT_NAME_USER = (select count(*) from core.view_user vu where vu.name_user = _name_user);
	IF (_COUNT_NAME_USER >= 0) THEN
		-- Verificar el estado del usuario 
		_STATUS_USER = (select vu.status_user from core.view_user vu where vu.name_user = _name_user);
		IF (_STATUS_USER) THEN
			-- Verificar el estado de la empresa del usuario				
			_STATUS_COMPANY = (select vc.status_company from core.view_company vc inner join core.view_user vu on vc.id_company = vu.id_company where vu.name_user = _name_user); 
			IF (_STATUS_COMPANY) THEN
				-- Verificar el estado del tipo de usuario				
				_STATUS_TYPE_USER = (select cvtu.status_type_user from core.view_type_user cvtu inner join core.view_user cvu on cvu.id_type_user = cvtu.id_type_user where cvu.name_user = _name_user);

				IF (_STATUS_TYPE_USER) THEN
					-- Verificar el estado del perfil				
					_STATUS_PROFILE = (select vp.status_profile from core.view_profile vp inner join core.view_type_user cvtu on vp.id_profile = cvtu.id_profile inner join core.view_user cu on cvtu.id_type_user = cu.id_type_user where cu.name_user = _name_user); 
					IF (_STATUS_PROFILE) THEN
						-- Obtener el id de la empresa
						_ID_COMPANY = (select vc.id_company from core.view_company vc inner join core.view_user vu on vc.id_company = vu.id_company where vu.name_user = _name_user);
						-- Obtener la configuración
						_EXPIRATION_VERIFICATION_CODE = (select vs.expiration_verification_code from core.view_setting vs inner join core.view_company vc on vc.id_setting = vs.id_setting where vc.id_company = _ID_COMPANY);
						-- Return query
						RETURN QUERY select true as status_check_user, _EXPIRATION_VERIFICATION_CODE as _expiration_verification_code;
					ELSE
						_EXCEPTION = 'El perfil del usuario '||_name_user||' se encuentra desactivado';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database_auth';
					END IF;
				ELSE
					_NAME_TYPE_USER = (select cvtu.name_type_user from core.view_type_user cvtu inner join core.view_user cvu on cvu.id_type_user = cvtu.id_type_user where cvu.name_user = _name_user);
					_EXCEPTION = 'El tipo de usuario '||_NAME_TYPE_USER||' se encuentra desactivado';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database_auth';
				END IF;
			ELSE
				_EXCEPTION = 'La empresa del usuario '||_name_user||' se encuentra desactivada';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database_auth';
			END IF;
		ELSE
			_EXCEPTION = 'El usuario '||_name_user||' se encuentra desactivado';
			RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database_auth';
		END IF;
	ELSE
		_EXCEPTION = 'El usuario '||_name_user||' no se encuentra registrado';
		RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database_auth';
	END IF;
END;
-- select * from core.auth_check_user('miguelangelloor96@gmail.com')
$BODY$;

ALTER FUNCTION core.auth_check_user(character varying)
    OWNER TO postgres;

-- FUNCTION: core.auth_reset_password(character varying, character varying)
-- DROP FUNCTION IF EXISTS core.auth_reset_password(character varying, character varying);

CREATE OR REPLACE FUNCTION core.auth_reset_password(
	_name_user character varying,
	_new_password character varying)
    RETURNS boolean
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
	_COUNT_NAME_USER NUMERIC;
	_COUNT_PASSWORD_USER NUMERIC;
	_STATUS_USER BOOLEAN;
	_STATUS_COMPANY BOOLEAN;
	_STATUS_PROFILE BOOLEAN;
	_STATUS_RESET_PASSWORD BOOLEAN;
	_X RECORD;
	_EXCEPTION TEXT DEFAULT 'Internal Error';
BEGIN
	-- Verificar que el usuario este registrado
	_COUNT_NAME_USER = (select count(*) from core.view_user vu where vu.name_user = _name_user);
	IF (_COUNT_NAME_USER >= 0) THEN
		-- Verificar el estado del usuario 
		_STATUS_USER = (select vu.status_user from core.view_user vu where vu.name_user = _name_user);
		IF (_STATUS_USER) THEN
			-- Verificar el estado de la empresa del usuario				
			_STATUS_COMPANY = (select vc.status_company from core.view_company vc inner join core.view_user vu on vc.id_company = vu.id_company where vu.name_user = _name_user); 
			IF (_STATUS_COMPANY) THEN
				-- Verificar el estado del perfil				
				_STATUS_PROFILE = (select vp.status_profile from core.view_profile vp inner join core.view_type_user vtu on vtu.id_profile = vp.id_profile inner join core.view_user vu on vtu.id_type_user = vu.id_type_user where vu.name_user = _name_user); 
				IF (_STATUS_PROFILE) THEN
					FOR _X IN UPDATE core.user u SET password_user = _new_password WHERE u.name_user = _name_user returning true as status_reset_password LOOP
						_STATUS_RESET_PASSWORD = _X.status_reset_password;
					END LOOP;
					IF (_STATUS_RESET_PASSWORD) THEN
						RETURN _STATUS_RESET_PASSWORD;
					ELSE
						_EXCEPTION = 'Ocurrió un error al restablecer la contraseña del usuario '||_name_user||'';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database_auth';
					END IF;
				ELSE
					_EXCEPTION = 'El perfil del usuario '||_name_user||' se encuentra desactivado';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database_auth';
				END IF;
			ELSE
				_EXCEPTION = 'La empresa del usuario '||_name_user||' se encuentra desactivada';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database_auth';
			END IF;
		ELSE
			_EXCEPTION = 'El usuario '||_name_user||' se encuentra desactivado';
			RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database_auth';
		END IF;
	ELSE
		_EXCEPTION = 'El usuario '||_name_user||' no se encuentra registrado';
		RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database_auth';
	END IF;
END;
-- select * from core.auth_reset_password('miguelangelloor96@gmail.com', 'nuevacontraseña')
$BODY$;

ALTER FUNCTION core.auth_reset_password(character varying, character varying)
    OWNER TO postgres;

-- FUNCTION: core.auth_sign_out(character varying, numeric)
-- DROP FUNCTION IF EXISTS core.auth_sign_out(character varying, numeric);

CREATE OR REPLACE FUNCTION core.auth_sign_out(
	_name_user character varying,
	_id_session numeric)
    RETURNS boolean
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
	_ID_USER NUMERIC;
	_RELEASE_SESSION boolean;
	_RESPONSE BOOLEAN;
	_SAVE_LOG BOOLEAN DEFAULT false;
	_EXCEPTION TEXT DEFAULT 'Internal Error';
BEGIN
	_ID_USER = (select vu.id_user from core.view_user vu where vu.name_user = _name_user);
	_RELEASE_SESSION = (select * from core.dml_session_release(_id_session));
	
	IF (_RELEASE_SESSION) THEN
		_SAVE_LOG = (select * from core.global_save_log());
		IF (_SAVE_LOG) THEN
			_RESPONSE = (core.dml_system_event_create(_ID_USER,'session',_id_session,'singOut', now()::timestamp, false));
			IF (_RESPONSE != true) THEN
				_EXCEPTION = 'Ocurrió un error al registrar el evento del sistema';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database_auth';
			END IF;
		END IF;
		RETURN true;
	ELSE
		_EXCEPTION = 'Ocurrió un error al cerrar la sessión';
		RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database_auth';
	END IF;
END;
$BODY$;

ALTER FUNCTION core.auth_sign_out(character varying, numeric)
    OWNER TO postgres;

-- FUNCTION: core.auth_check_session(numeric, json)
-- DROP FUNCTION IF EXISTS core.auth_check_session(numeric, json);

CREATE OR REPLACE FUNCTION core.auth_check_session(
	_id_session numeric,
	_agent_session json)
    RETURNS boolean
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
	_STATUS_SESSION BOOLEAN;
	_HOST CHARACTER VARYING;
	_BROWSER CHARACTER VARYING;
	_VERSION CHARACTER VARYING;
	_OS CHARACTER VARYING;
	_PLATFORM CHARACTER VARYING;
	_EXCEPTION TEXT DEFAULT 'Internal Error';
BEGIN
	_STATUS_SESSION = (select vs.status_session from core.view_session vs where vs.id_session = _id_session);
	
	_HOST = (select vs.host_session from core.view_session vs where vs.id_session = _id_session);
	_BROWSER = (select (select vs.agent_session from core.view_session vs where vs.id_session = _id_session)->>'browser');
	_VERSION = (select (select vs.agent_session from core.view_session vs where vs.id_session = _id_session)->>'version');
	_OS = (select (select vs.agent_session from core.view_session vs where vs.id_session = _id_session)->>'os');
	_PLATFORM = (select (select vs.agent_session from core.view_session vs where vs.id_session = _id_session)->>'platform');
	
	IF (_STATUS_SESSION) THEN
		IF (_HOST = _agent_session->>'host') THEN
			IF (_BROWSER = _agent_session->'agent'->>'browser') THEN
				IF (_VERSION = _agent_session->'agent'->>'version') THEN
					IF (_OS = _agent_session->'agent'->>'os') THEN
						IF (_PLATFORM = _agent_session->'agent'->>'platform') THEN
							RETURN true;
						ELSE
							_EXCEPTION = 'EL platform del agent es incorrecto';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database_auth';
						END IF;
					ELSE
						_EXCEPTION = 'El SO del agent es incorrecto';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database_auth';
					END IF;
				ELSE
					_EXCEPTION = 'La version del agent es incorrecto';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database_auth';
				END IF;
			ELSE
				_EXCEPTION = 'El browser del agent es incorrecto';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database_auth';
			END IF;
		ELSE
			_EXCEPTION = 'El host de la sesión es incorrecto';
			RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database_auth';
		END IF;
	ELSE
		_EXCEPTION = 'La sesión se encuentra cerrada';
		RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database_auth';
	END IF;
END;
-- select * from core.auth_check_session(11, '{"host":"172.18.2.3:3000","agent":{"browser":"Chrome","version":"98.0.4758.102","os":"Windows 10.0","platform":"Microsoft Windows","source":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36"}}')
$BODY$;

ALTER FUNCTION core.auth_check_session(numeric, json)
    OWNER TO postgres;

-- FUNCTION: core.dml_user_upload_avatar(numeric, character varying)
-- DROP FUNCTION IF EXISTS core.dml_user_upload_avatar(numeric, character varying);

CREATE OR REPLACE FUNCTION core.dml_user_upload_avatar(
	_id_user numeric,
	_new_avatar character varying)
    RETURNS TABLE(status_upload_avatar boolean, old_path character varying, new_path character varying) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
DECLARE
	_X RECORD;
	_AVATAR_USER CHARACTER VARYING;
	_ID_USER_UPDATE NUMERIC;
	_EXCEPTION TEXT DEFAULT 'Internal Error';
BEGIN
	_AVATAR_USER = (select vu.avatar_user from core.view_user vu where vu.id_user = _id_user);
	-- Update Path	
	FOR _X IN UPDATE core.user u SET avatar_user = _new_avatar WHERE u.id_user = _ID_USER returning id_user LOOP 
		_ID_USER_UPDATE = _X.id_user;
	END LOOP;
	
	IF (_ID_USER_UPDATE >= 1) THEN
		RETURN QUERY select true as status_upload_avatar, _AVATAR_USER as old_path, _new_avatar as new_path;
	ELSE
		_EXCEPTION = 'Ocurrió un error al actualizar el avatar del usuario';
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

ALTER FUNCTION core.dml_user_upload_avatar(numeric, character varying)
    OWNER TO postgres;

-- FUNCTION: core.dml_user_remove_avatar(numeric)
-- DROP FUNCTION IF EXISTS core.dml_user_remove_avatar(numeric);

CREATE OR REPLACE FUNCTION core.dml_user_remove_avatar(
	_id_user numeric)
    RETURNS TABLE(status_remove_avatar boolean, current_path character varying) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
DECLARE
	_X RECORD;
	_AVATAR_USER CHARACTER VARYING;
	_ID_USER_DELETE NUMERIC;
	_EXCEPTION TEXT DEFAULT 'Internal Error';
BEGIN
	_AVATAR_USER = (select vu.avatar_user from core.view_user vu where vu.id_user = _id_user);
	-- Update Path	
	FOR _X IN UPDATE core.user u SET avatar_user = 'default.svg' WHERE u.id_user = _ID_USER returning id_user LOOP 
		_ID_USER_DELETE = _X.id_user;
	END LOOP;
	IF (_ID_USER_DELETE >= 1) THEN
		RETURN QUERY select true as status_remove_avatar, _AVATAR_USER as current_path;
	ELSE
		_EXCEPTION = 'Ocurrió un error al eliminar el avatar del user';
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

ALTER FUNCTION core.dml_user_remove_avatar(numeric)
    OWNER TO postgres;

------------------------------ INITIAL DATA ------------------------------
-- FUNCTION: dev.dml_create_navigation()
-- DROP FUNCTION IF EXISTS dev.dml_create_navigation();

CREATE OR REPLACE FUNCTION dev.dml_create_navigation(
	)
    RETURNS boolean
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
	_ID_INITIAL NUMERIC;
	_CURRENT_ID_NAVIGATION NUMERIC;
	_RESPONSE1 NUMERIC DEFAULT 0;
	_RESPONSE2 NUMERIC DEFAULT 0;
	_RESPONSE3 NUMERIC DEFAULT 0;
	_RESPONSE4 NUMERIC DEFAULT 0;
	_RESPONSE5 NUMERIC DEFAULT 0;
	_RESPONSE6 NUMERIC DEFAULT 0;
	_X RECORD;
BEGIN
		-- Administrador (Por defecto)
		_CURRENT_ID_NAVIGATION = (select nextval('core.serial_navigation')-1);	
		_ID_INITIAL = _CURRENT_ID_NAVIGATION;
		FOR _X IN INSERT INTO core.navigation(
			id_navigation, id_company, name_navigation, description_navigation, type_navigation, status_navigation, content_navigation, deleted_navigation)
			VALUES (_CURRENT_ID_NAVIGATION, 1, 'Administrador (Por defecto)', 'Navegación por defecto para el administrador', 'defaultNavigation', true, '[
	{
		"id": "core",
		"title": "Core",
		"subtitle": "Administración core del sistema",
		"type": "group",
		"icon": "heroicons_outline:chip",
		"children": [
			{
				"id": "core.validation",
				"title": "Validaciones",
				"type": "basic",
				"icon": "mat_outline:security",
				"link": "/core/validation"
			},
			{
				"id": "core.access",
				"title": "Acceso",
				"type": "collapsable",
				"icon": "mat_outline:account_tree",
				"children": [
					{
						"id": "core.navigation",
						"title": "Navegación",
						"type": "basic",
						"icon": "heroicons_outline:template",
						"link": "/core/navigation"
					},
					{
						"id": "core.profile",
						"title": "Perfil",
						"type": "basic",
						"icon": "heroicons_outline:user-group",
						"link": "/core/profile"
					},
					{
						"id": "core.type-user",
						"title": "Tipo de usuario",
						"type": "basic",
						"icon": "mat_outline:category",
						"link": "/core/type-user"
					},
					{
						"id": "core.user",
						"title": "Usuario",
						"type": "basic",
						"icon": "heroicons_outline:user",
						"link": "/core/user"
					}
				]
			},
			{
				"id": "core.session",
				"title": "Sesiones",
				"type": "basic",
				"icon": "heroicons_outline:login",
				"link": "/core/session"
			},
			{
				"id": "core.system-event",
				"title": "Eventos del sistema",
				"type": "basic",
				"icon": "mat_outline:event",
				"link": "/core/system-event"
			}
		]
	},
	{
		"id": "business",
		"title": "Business",
		"subtitle": "Administración business del sistema",
		"type": "group",
		"icon": "heroicons_outline:cube-transparent",
		"children": [
			{
				"id": "business.taxpayer",
				"title": "Contribuyente",
				"type": "basic",
				"icon": "heroicons_outline:user",
				"link": "/business/taxpayer"
			},
			{
				"id": "business.voucher",
				"title": "Comprobantes",
				"type": "basic",
				"icon": "heroicons_outline:user",
				"link": "/business/voucher"
			},
			{
				"id": "business.voucher-sql-server",
				"title": "Comprobantes SQLServer",
				"type": "basic",
				"icon": "heroicons_outline:user",
				"link": "/business/voucher-sql-server"
			}
		]
	},
	{
		"id": "report",
		"title": "Reportes",
		"subtitle": "Reportes del sistema",
		"type": "basic",
		"link": "/report"
	}
]', false) returning id_navigation LOOP
			_RESPONSE1 = _X.id_navigation;
		END LOOP;
		
		
		-- Administrador (Compacta)
		_CURRENT_ID_NAVIGATION = (select nextval('core.serial_navigation')-1);	
		FOR _X IN INSERT INTO core.navigation(
			id_navigation, id_company, name_navigation, description_navigation, type_navigation, status_navigation, content_navigation, deleted_navigation)
			VALUES (_CURRENT_ID_NAVIGATION, 1, 'Administrador (Compacta)', 'Navegación compacta para el administrador', 'compactNavigation',  true, '[
  {
    "id": "core",
    "title": "Core",
    "type": "aside",
    "icon": "heroicons_outline:chip",
    "children": []
  },
  {
    "id": "business",
    "title": "Business",
    "type": "aside",
    "icon": "mat_outline:business",
    "children": []
  }
]', false) returning id_navigation LOOP
			_RESPONSE2 = _X.id_navigation;
		END LOOP;
				
		-- Administrador (Futurista)
		_CURRENT_ID_NAVIGATION = (select nextval('core.serial_navigation')-1);	
		FOR _X IN INSERT INTO core.navigation(
			id_navigation, id_company, name_navigation, description_navigation, type_navigation, status_navigation, content_navigation, deleted_navigation)
			VALUES (_CURRENT_ID_NAVIGATION, 1, 'Administrador (Futurista)', 'Navegación futurista para el administrador', 'futuristicNavigation',  true, '[
	{
		"id": "core",
		"title": "Core",
		"subtitle": "Administración core del sistema",
		"type": "group",
		"icon": "heroicons_outline:chip",
		"children": [
			{
				"id": "core.validation",
				"title": "Validaciones",
				"type": "basic",
				"icon": "mat_outline:security",
				"link": "/core/validation"
			},
			{
				"id": "core.access",
				"title": "Acceso",
				"type": "collapsable",
				"icon": "mat_outline:account_tree",
				"children": [
					{
						"id": "core.navigation",
						"title": "Navegación",
						"type": "basic",
						"icon": "heroicons_outline:template",
						"link": "/core/navigation"
					},
					{
						"id": "core.profile",
						"title": "Perfil",
						"type": "basic",
						"icon": "heroicons_outline:user-group",
						"link": "/core/profile"
					},
					{
						"id": "core.type-user",
						"title": "Tipo de usuario",
						"type": "basic",
						"icon": "mat_outline:category",
						"link": "/core/type-user"
					},
					{
						"id": "core.user",
						"title": "Usuario",
						"type": "basic",
						"icon": "heroicons_outline:user",
						"link": "/core/user"
					}
				]
			},
			{
				"id": "core.session",
				"title": "Sesiones",
				"type": "basic",
				"icon": "heroicons_outline:login",
				"link": "/core/session"
			},
			{
				"id": "core.system-event",
				"title": "Eventos del sistema",
				"type": "basic",
				"icon": "mat_outline:event",
				"link": "/core/system-event"
			}
		]
	},
	{
		"id": "business",
		"title": "Business",
		"subtitle": "Administración business del sistema",
		"type": "group",
		"icon": "heroicons_outline:cube-transparent",
		"children": [
			{
				"id": "business.taxpayer",
				"title": "Contribuyente",
				"type": "basic",
				"icon": "heroicons_outline:user",
				"link": "/business/taxpayer"
			},
			{
				"id": "business.voucher",
				"title": "Comprobantes",
				"type": "basic",
				"icon": "heroicons_outline:user",
				"link": "/business/voucher"
			},
			{
				"id": "business.voucher-sql-server",
				"title": "Comprobantes SQLServer",
				"type": "basic",
				"icon": "heroicons_outline:user",
				"link": "/business/voucher-sql-server"
			}
		]
	},
	{
		"id": "report",
		"title": "Reportes",
		"subtitle": "Reportes del sistema",
		"type": "basic",
		"link": "/report"
	}
]', false) returning id_navigation LOOP
			_RESPONSE3 = _X.id_navigation;
		END LOOP;
		
		
		-- Administrador (Horizontal)
		_CURRENT_ID_NAVIGATION = (select nextval('core.serial_navigation')-1);	
		FOR _X IN INSERT INTO core.navigation(
			id_navigation, id_company, name_navigation, description_navigation, type_navigation, status_navigation, content_navigation, deleted_navigation)
			VALUES (_CURRENT_ID_NAVIGATION, 1, 'Administrador (Horizontal)', 'Navegación horizontal para el administrador', 'horizontalNavigation', true, '[
  {
    "id": "core",
    "title": "Core",
    "type": "aside",
    "icon": "heroicons_outline:chip",
    "children": []
  },
  {
    "id": "business",
    "title": "Business",
    "type": "aside",
    "icon": "mat_outline:business",
    "children": []
  }
]', false) returning id_navigation LOOP
			_RESPONSE4 = _X.id_navigation;
		END LOOP;

		-- Consulta (Por defecto)
		_CURRENT_ID_NAVIGATION = (select nextval('core.serial_navigation')-1);	
		FOR _X IN INSERT INTO core.navigation(
			id_navigation, id_company, name_navigation, description_navigation, type_navigation, status_navigation, content_navigation, deleted_navigation)
			VALUES (_CURRENT_ID_NAVIGATION, 1, 'Consulta (Por defecto)', 'Navegación por defecto para las consultas', 'defaultNavigation', true, '[
	{
		"id": "public",
		"title": "Public",
		"subtitle": "Acceso público",
		"type": "group",
		"icon": "heroicons_outline:cube-transparent",
		"children": [
			{
				"id": "my-vouchers",
				"title": "Mis comprobantes",
				"type": "basic",
				"icon": "heroicons_outline:user",
				"link": "/business/my-vouchers"
			}
		]
	}
]', false) returning id_navigation LOOP
			_RESPONSE5 = _X.id_navigation;
		END LOOP;

		-- Consulta (Compacta)
		_CURRENT_ID_NAVIGATION = (select nextval('core.serial_navigation')-1);	
		FOR _X IN INSERT INTO core.navigation(
			id_navigation, id_company, name_navigation, description_navigation, type_navigation, status_navigation, content_navigation, deleted_navigation)
			VALUES (_CURRENT_ID_NAVIGATION, 1, 'Consulta (Compacta)', 'Navegación compacta para las consultas', 'compactNavigation', true, '[
  {
    "id": "public",
    "title": "Public",
    "type": "aside",
    "icon": "heroicons_outline:chip",
    "children": []
  }
]', false) returning id_navigation LOOP
			_RESPONSE6 = _X.id_navigation;
		END LOOP;
		
		IF (_RESPONSE1 >= 1 AND _RESPONSE2 >= 1 AND _RESPONSE3 >=1 AND _RESPONSE4 >= 1 AND _RESPONSE5 >=1 AND _RESPONSE6 >= 1) THEN
			RETURN true;
		ELSE
			RETURN false;
		END IF;
		exception when others then 
				-- RAISE NOTICE '%', SQLERRM;
				IF (_ID_INITIAL >= 1) THEN
					EXECUTE 'select setval(''core.serial_navigation'', '||_ID_INITIAL||')';
				END IF;
				RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
END;
$BODY$;

ALTER FUNCTION dev.dml_create_navigation()
    OWNER TO postgres;

-- FUNCTION: dev.dml_create_initial_data()
-- DROP FUNCTION IF EXISTS dev.dml_create_initial_data();

CREATE OR REPLACE FUNCTION dev.dml_create_initial_data(
	)
    RETURNS boolean
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
	_ID_INITIAL NUMERIC;
	_ID_INITIAL_PROFILE NUMERIC;
	_CURRENT_ID_SETTING NUMERIC;
	_ID_SETTING NUMERIC;
	_CURRENT_ID_COMPANY NUMERIC;
	_ID_COMPANY NUMERIC;
	_CURRENT_ID_ACADEMIC NUMERIC;
	_ID_ACADEMIC NUMERIC;
	_CURRENT_ID_JOB NUMERIC;
	_ID_JOB NUMERIC;
    _CURRENT_ID_PERSON NUMERIC;
    _ID_PERSON NUMERIC;
	_CREATE_NAVIGATION BOOLEAN;
    _CURRENT_ID_PROFILE NUMERIC;
    _ID_PROFILE NUMERIC;
    _CURRENT_ID_TYPE_USER NUMERIC;
	_CURRENT_ID_PROFILE_CONSULTA NUMERIC;
	_ID_PROFILE_CONSULTA NUMERIC;
	_CURRENT_ID_TYPE_USER_CONSULTA NUMERIC;
	_ID_TYPE_USER_CONSULTA NUMERIC;
	_ID_TYPE_USER NUMERIC;
	_CURRENT_ID_PROFILE_NAVIGATION NUMERIC;
	_ID_PROFILE_NAVIGATION NUMERIC;
    _CURRENT_ID_USER NUMERIC;
    _ID_USER NUMERIC;
	_EXCEPTION TEXT DEFAULT 'Internal Error';
	_X RECORD;
BEGIN	
		_CURRENT_ID_SETTING = (select nextval('core.serial_setting')-1);	
		FOR _X IN INSERT INTO core.setting(id_setting, expiration_token, expiration_verification_code, inactivity_time, session_limit, save_alfresco, wait_autorization, batch_shipping, max_generation_pdf, wait_generation_pdf, deleted_setting) VALUES (_CURRENT_ID_SETTING, 30000, 30000, 30000, 5, false, 3, false, 10, 20, false) RETURNING id_setting LOOP
			_ID_SETTING = _X.id_setting;
		END LOOP;
		
		IF (_ID_SETTING >= 1) THEN
			_CURRENT_ID_COMPANY = (select nextval('core.serial_company')-1);	
			FOR _X IN INSERT INTO core.company(id_company, id_setting, name_company, acronym_company, address_company, status_company, deleted_company) VALUES (_CURRENT_ID_COMPANY, _ID_SETTING, 'ANGEL LOOR', 'ANGEL', 'PUYO', true, false) RETURNING id_company LOOP
				_ID_COMPANY = _X.id_company;
			END LOOP;
			
			IF (_ID_COMPANY >= 1) THEN 
				_CURRENT_ID_ACADEMIC = (select nextval('core.serial_academic')-1);	
				FOR _X IN INSERT INTO core.academic(id_academic, title_academic, abbreviation_academic, nivel_academic, deleted_academic) VALUES (_CURRENT_ID_ACADEMIC, 'Titulo Administrador', 'Abreviación titulo', 'Nivel titulo', false) RETURNING id_academic LOOP
					_ID_ACADEMIC = _X.id_academic;
				END LOOP;
				
				IF (_ID_ACADEMIC >= 1) THEN
					_CURRENT_ID_JOB = (select nextval('core.serial_job')-1);	
					
					FOR _X IN INSERT INTO core.job(id_job, name_job, address_job, phone_job, position_job, deleted_job) VALUES (_CURRENT_ID_JOB, 'Empresa', 'Dirección', '+593', 'Cargo', false) RETURNING id_job LOOP
						_ID_JOB = _X.id_job;
					END LOOP;
					
					IF (_ID_JOB >= 1) THEN
						_CURRENT_ID_PERSON = (select nextval('core.serial_person')-1);	
						FOR _X IN INSERT INTO core.person(id_person, id_academic, id_job, dni_person, name_person, last_name_person, address_person, phone_person, deleted_person) VALUES (_CURRENT_ID_PERSON, _ID_ACADEMIC, _ID_JOB, '1600744443', 'ANGEL MIGUEL', 'LOOR MANZANO', 'PUYO', '+593998679628', false) RETURNING id_person LOOP
							_ID_PERSON = _X.id_person;
						END LOOP;
						
						IF (_ID_PERSON >= 1) THEN
							_CREATE_NAVIGATION = (select * from dev.dml_create_navigation());
							
							IF (_CREATE_NAVIGATION) THEN 
								_CURRENT_ID_PROFILE = (select nextval('core.serial_profile')-1);
								_ID_INITIAL_PROFILE = _CURRENT_ID_PROFILE;

								FOR _X IN INSERT INTO core.profile(id_profile, id_company, type_profile, name_profile, description_profile, status_profile, deleted_profile) VALUES (_CURRENT_ID_PROFILE, _ID_COMPANY, 'administator', 'Perfil Administrador', 'Perfil de usuario para el administrador', true, false) RETURNING id_profile LOOP
									_ID_PROFILE = _X.id_profile;
								END LOOP;

								_CURRENT_ID_TYPE_USER = (select nextval('core.serial_type_user')-1);
								FOR _X IN INSERT INTO core.type_user(id_type_user, id_company, id_profile, name_type_user, description_type_user, status_type_user, deleted_type_user) VALUES (_CURRENT_ID_TYPE_USER, _ID_COMPANY, _ID_PROFILE, 'Administrador', 'Tipo de usuario para el administrador', true, false) RETURNING id_type_user LOOP
									_ID_TYPE_USER = _X.id_type_user;
								END LOOP;

								-- CONSULTA
								_CURRENT_ID_PROFILE_CONSULTA = (select nextval('core.serial_profile')-1);

								FOR _X IN INSERT INTO core.profile(id_profile, id_company, type_profile, name_profile, description_profile, status_profile, deleted_profile) VALUES (_CURRENT_ID_PROFILE_CONSULTA, _ID_COMPANY, 'commonProfile', 'Perfil de consulta', 'Perfil de usuario para las consultas', true, false) RETURNING id_profile LOOP
									_ID_PROFILE_CONSULTA = _X.id_profile;
								END LOOP;
								
								_CURRENT_ID_TYPE_USER_CONSULTA = (select nextval('core.serial_type_user')-1);
								FOR _X IN INSERT INTO core.type_user(id_type_user, id_company, id_profile, name_type_user, description_type_user, status_type_user, deleted_type_user) VALUES (_CURRENT_ID_TYPE_USER_CONSULTA, _ID_COMPANY, _ID_PROFILE_CONSULTA, 'Consulta', 'Tipo de usuario para las consultas', true, false) RETURNING id_type_user LOOP
									_ID_TYPE_USER_CONSULTA = _X.id_type_user;
								END LOOP;
								
								IF (_ID_PROFILE >= 1) THEN
									_CURRENT_ID_PROFILE_NAVIGATION = (select nextval('core.serial_profile_navigation')-1);
									_ID_INITIAL = _CURRENT_ID_PROFILE_NAVIGATION;
									
									FOR _X IN INSERT INTO core.profile_navigation(id_profile_navigation, id_profile, id_navigation) VALUES (_CURRENT_ID_PROFILE_NAVIGATION, _ID_PROFILE, 1) RETURNING id_profile_navigation LOOP
										_ID_PROFILE_NAVIGATION = _X.id_profile_navigation;
									END LOOP;
									
									_CURRENT_ID_PROFILE_NAVIGATION = (select nextval('core.serial_profile_navigation')-1);
									FOR _X IN INSERT INTO core.profile_navigation(id_profile_navigation, id_profile, id_navigation) VALUES (_CURRENT_ID_PROFILE_NAVIGATION, _ID_PROFILE, 2) RETURNING id_profile_navigation LOOP
										_ID_PROFILE_NAVIGATION = _X.id_profile_navigation;
									END LOOP;
									
									_CURRENT_ID_PROFILE_NAVIGATION = (select nextval('core.serial_profile_navigation')-1);
									FOR _X IN INSERT INTO core.profile_navigation(id_profile_navigation, id_profile, id_navigation) VALUES (_CURRENT_ID_PROFILE_NAVIGATION, _ID_PROFILE, 3) RETURNING id_profile_navigation LOOP
										_ID_PROFILE_NAVIGATION = _X.id_profile_navigation;
									END LOOP;
									
									_CURRENT_ID_PROFILE_NAVIGATION = (select nextval('core.serial_profile_navigation')-1);
									FOR _X IN INSERT INTO core.profile_navigation(id_profile_navigation, id_profile, id_navigation) VALUES (_CURRENT_ID_PROFILE_NAVIGATION, _ID_PROFILE, 4) RETURNING id_profile_navigation LOOP
										_ID_PROFILE_NAVIGATION = _X.id_profile_navigation;
									END LOOP;

									-- CONSULTA
									_CURRENT_ID_PROFILE_NAVIGATION = (select nextval('core.serial_profile_navigation')-1);
									FOR _X IN INSERT INTO core.profile_navigation(id_profile_navigation, id_profile, id_navigation) VALUES (_CURRENT_ID_PROFILE_NAVIGATION, _ID_PROFILE_CONSULTA, 5) RETURNING id_profile_navigation LOOP
										_ID_PROFILE_NAVIGATION = _X.id_profile_navigation;
									END LOOP;
									
									_CURRENT_ID_PROFILE_NAVIGATION = (select nextval('core.serial_profile_navigation')-1);
									FOR _X IN INSERT INTO core.profile_navigation(id_profile_navigation, id_profile, id_navigation) VALUES (_CURRENT_ID_PROFILE_NAVIGATION, _ID_PROFILE_CONSULTA, 6) RETURNING id_profile_navigation LOOP
										_ID_PROFILE_NAVIGATION = _X.id_profile_navigation;
									END LOOP;

									_CURRENT_ID_USER = (select nextval('core.serial_user')-1);
									FOR _X IN INSERT INTO core.user(id_user, id_company, id_person, id_type_user, name_user, password_user, avatar_user, status_user, deleted_user) VALUES (_CURRENT_ID_USER, _ID_COMPANY, _ID_PERSON, _ID_TYPE_USER , 'miguelangelloor96@gmail.com', 'IvD7dt+mfsPPpD23ZSFPXA==', 'default.svg', true, false) RETURNING id_user LOOP
										_ID_USER = _X.id_user;
									END LOOP;
									
									IF (_ID_USER >= 1) THEN
										RETURN true;
									ELSE
										_EXCEPTION = 'Ocurrió un error al ingresar el usuario';
										RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
									END IF;
								ELSE
									_EXCEPTION = 'Ocurrió un error al ingresar el perfil de usuario';
									RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
								END IF;
							ELSE
								_EXCEPTION = 'Ocurrió un error al ingresar la navegación';
								RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
							END IF;
						ELSE
							_EXCEPTION = 'Ocurrió un error al ingresar la persona';
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
			ELSE
				_EXCEPTION = 'Ocurrió un error al ingresar la empresa';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
			END IF;
		ELSE
			_EXCEPTION = 'Ocurrió un error al ingresar la configuración';
			RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
		END IF;
		
		exception when others then 
				-- RAISE NOTICE '%', SQLERRM;
				IF (_CURRENT_ID_SETTING >= 1) THEN 
					EXECUTE 'select setval(''core.serial_setting'', '||_CURRENT_ID_SETTING||')';
				END IF;
				IF (_CURRENT_ID_COMPANY >= 1) THEN 
					EXECUTE 'select setval(''core.serial_company'', '||_CURRENT_ID_COMPANY||')';
				END IF;
				IF (_CURRENT_ID_ACADEMIC >= 1) THEN 
					EXECUTE 'select setval(''core.serial_academic'', '||_CURRENT_ID_ACADEMIC||')';
				END IF;
				IF (_CURRENT_ID_JOB >= 1) THEN 
					EXECUTE 'select setval(''core.serial_job'', '||_CURRENT_ID_JOB||')';
				END IF;
				IF (_CURRENT_ID_PERSON >= 1) THEN 
					EXECUTE 'select setval(''core.serial_person'', '||_CURRENT_ID_PERSON||')';
				END IF;
				IF (_ID_INITIAL_PROFILE >= 1) THEN 
					EXECUTE 'select setval(''core.serial_profile'', '||_ID_INITIAL_PROFILE||')';
				END IF;
				IF (_CURRENT_ID_TYPE_USER >= 1) THEN 
					EXECUTE 'select setval(''core.serial_type_user'', '||_CURRENT_ID_TYPE_USER||')';
				END IF;
				IF (_ID_INITIAL >= 1) THEN 
					EXECUTE 'select setval(''core.serial_profile_navigation'', '||_ID_INITIAL||')';
				END IF;
				IF (_CURRENT_ID_USER >= 1) THEN 
					EXECUTE 'select setval(''core.serial_user'', '||_CURRENT_ID_USER||')';
				END IF;
				RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
END;
$BODY$;

ALTER FUNCTION dev.dml_create_initial_data()
    OWNER TO postgres;

select dev.ddl_config('core');

update dev.ddl_config dc set haved_handler_attribute = 'name_company' where dc.table_name = 'company';
update dev.ddl_config dc set haved_handler_attribute = 'name_navigation' where dc.table_name = 'navigation';
update dev.ddl_config dc set haved_handler_attribute = 'name_profile' where dc.table_name = 'profile';
update dev.ddl_config dc set haved_handler_attribute = 'dni_person' where dc.table_name = 'person';
update dev.ddl_config dc set haved_handler_attribute = 'name_user' where dc.table_name = 'user';

select dev.ddl_create_sequences('core');
select dev.ddl_create_view('core');
select dev.ddl_createall_crud('core');

select dev.dml_reset_sequences('core');
select dev.dml_truncateall('core');
select dev.dml_create_initial_data();
