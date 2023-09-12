	--
-- PostgreSQL database dump
--

-- Dumped from database version 13.4 (Ubuntu 13.4-1.pgdg20.04+1)
-- Dumped by pg_dump version 13.8

-- Started on 2023-04-10 15:39:30

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 6 (class 2615 OID 25381)
-- Name: business; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA business;


ALTER SCHEMA business OWNER TO postgres;

--
-- TOC entry 4 (class 2615 OID 25357)
-- Name: core; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA core;


ALTER SCHEMA core OWNER TO postgres;

--
-- TOC entry 2 (class 3079 OID 25450)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA core;


--
-- TOC entry 3516 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 876 (class 1247 OID 25386)
-- Name: TYPE_ACCOUNTING_OBLIGED; Type: TYPE; Schema: business; Owner: postgres
--

CREATE TYPE business."TYPE_ACCOUNTING_OBLIGED" AS ENUM (
    'SI',
    'NO'
);


ALTER TYPE business."TYPE_ACCOUNTING_OBLIGED" OWNER TO postgres;

--
-- TOC entry 873 (class 1247 OID 25383)
-- Name: TYPE_EMISSION; Type: TYPE; Schema: business; Owner: postgres
--

CREATE TYPE business."TYPE_EMISSION" AS ENUM (
    '1'
);


ALTER TYPE business."TYPE_EMISSION" OWNER TO postgres;

--
-- TOC entry 879 (class 1247 OID 25392)
-- Name: TYPE_ENVIRONMENT; Type: TYPE; Schema: business; Owner: postgres
--

CREATE TYPE business."TYPE_ENVIRONMENT" AS ENUM (
    '1',
    '2'
);


ALTER TYPE business."TYPE_ENVIRONMENT" OWNER TO postgres;

--
-- TOC entry 888 (class 1247 OID 25422)
-- Name: TYPE_MAIL_SERVER; Type: TYPE; Schema: business; Owner: postgres
--

CREATE TYPE business."TYPE_MAIL_SERVER" AS ENUM (
    'office365',
    'gmail'
);


ALTER TYPE business."TYPE_MAIL_SERVER" OWNER TO postgres;

--
-- TOC entry 882 (class 1247 OID 25398)
-- Name: TYPE_VOUCHER; Type: TYPE; Schema: business; Owner: postgres
--

CREATE TYPE business."TYPE_VOUCHER" AS ENUM (
    '01',
    '03',
    '04',
    '05',
    '06',
    '07'
);


ALTER TYPE business."TYPE_VOUCHER" OWNER TO postgres;

--
-- TOC entry 885 (class 1247 OID 25412)
-- Name: TYPE_VOUCHER_STATUS; Type: TYPE; Schema: business; Owner: postgres
--

CREATE TYPE business."TYPE_VOUCHER_STATUS" AS ENUM (
    'pending',
    'authorized',
    'canceled',
    'removed'
);


ALTER TYPE business."TYPE_VOUCHER_STATUS" OWNER TO postgres;

--
-- TOC entry 864 (class 1247 OID 25359)
-- Name: TYPE_NAVIGATION; Type: TYPE; Schema: core; Owner: postgres
--

CREATE TYPE core."TYPE_NAVIGATION" AS ENUM (
    'defaultNavigation',
    'compactNavigation',
    'futuristicNavigation',
    'horizontalNavigation'
);


ALTER TYPE core."TYPE_NAVIGATION" OWNER TO postgres;

--
-- TOC entry 870 (class 1247 OID 25376)
-- Name: TYPE_PROFILE; Type: TYPE; Schema: core; Owner: postgres
--

CREATE TYPE core."TYPE_PROFILE" AS ENUM (
    'administator',
    'commonProfile'
);


ALTER TYPE core."TYPE_PROFILE" OWNER TO postgres;

--
-- TOC entry 867 (class 1247 OID 25368)
-- Name: TYPE_VALIDATION; Type: TYPE; Schema: core; Owner: postgres
--

CREATE TYPE core."TYPE_VALIDATION" AS ENUM (
    'validationPassword',
    'validationDNI',
    'validationPhoneNumber'
);


ALTER TYPE core."TYPE_VALIDATION" OWNER TO postgres;

--
-- TOC entry 449 (class 1255 OID 26053)
-- Name: auth_sign_in_with_buyer_identifier_voucher(character varying); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.auth_sign_in_with_buyer_identifier_voucher(_buyer_identifier_voucher character varying) RETURNS TABLE(id_sequence numeric, id_institution numeric, id_establishment numeric, id_emission_point numeric, bvs_type_environment business."TYPE_ENVIRONMENT", bvs_type_voucher business."TYPE_VOUCHER", number_code_sequence character varying, deleted_sequence boolean, value_establishment character varying, description_establishment character varying, value_emission_point character varying, description_emission_point character varying, id_taxpayer numeric, bvi_type_environment business."TYPE_ENVIRONMENT", name_institution character varying, description_institution character varying, address_institution character varying, status_institution boolean, bvv_type_voucher business."TYPE_VOUCHER", access_key_voucher character varying, buyer_identifier_voucher character varying, body_voucher json, id_company numeric, id_user numeric, id_setting_taxpayer numeric, type_emission business."TYPE_EMISSION", business_name_taxpayer character varying, tradename_taxpayer character varying, ruc_taxpayer character varying, dir_matriz_taxpayer character varying, signature_password_taxpayer character varying, signature_path_taxpayer character varying, status_taxpayer boolean, accounting_obliged business."TYPE_ACCOUNTING_OBLIGED", id_mail_server numeric, mailing_setting_taxpayer boolean, from_setting_taxpayer character varying, subject_setting_taxpayer character varying, html_setting_taxpayer text, download_note_setting_taxpayer character varying, logo_path_setting_taxpayer character varying, save_alfresco boolean, wait_autorization numeric, expiration_token numeric, inactivity_time numeric, navigation json)
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION business.auth_sign_in_with_buyer_identifier_voucher(_buyer_identifier_voucher character varying) OWNER TO postgres;

--
-- TOC entry 402 (class 1255 OID 26011)
-- Name: dml_emission_point_create(numeric, numeric, character varying, character varying, boolean); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_emission_point_create(id_user_ numeric, _id_taxpayer numeric, _value_emission_point character varying, _description_emission_point character varying, _deleted_emission_point boolean) RETURNS numeric
    LANGUAGE plpgsql
    AS $_$
			DECLARE
				_RESPONSE BOOLEAN DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_ATT NUMERIC;
				_COUNT_EXTERNALS_IDS NUMERIC;
				_RETURNING NUMERIC;
				_CURRENT_ID NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			BEGIN 
			-- taxpayer
			_COUNT_EXTERNALS_IDS = (select count(*) from business.view_taxpayer v where v.id_taxpayer = _id_taxpayer);
				
			IF (_COUNT_EXTERNALS_IDS = 0) THEN
				_EXCEPTION = 'El id '||_id_taxpayer||' de la tabla taxpayer no se encuentra registrado';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
			END IF;
			
				_CURRENT_ID = (select nextval('business.serial_emission_point')-1);
				_COUNT = (select count(*) from business.view_emission_point t where t.id_emission_point = _CURRENT_ID);

				IF (_COUNT = 0) THEN
				
					_COUNT_ATT = (select count(*) from business.view_emission_point t where t.value_emission_point = _value_emission_point);
				
					IF (_COUNT_ATT = 0) THEN 
						FOR _X IN INSERT INTO business.emission_point(id_emission_point, id_taxpayer, value_emission_point, description_emission_point, deleted_emission_point) VALUES (_CURRENT_ID, $2 , $3 , $4 , $5 ) RETURNING id_emission_point LOOP
							_RETURNING = _X.id_emission_point;
						END LOOP;

						IF (_RETURNING >= 1) THEN
							_SAVE_LOG = (select * from core.global_save_log());
							IF (_SAVE_LOG) THEN
								_RESPONSE = (core.dml_system_event_create($1,'emission_point',_CURRENT_ID,'CREATE', now()::timestamp, false));
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
						_EXCEPTION = 'Ya existe un registro con el value_emission_point '||_value_emission_point||'';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
				ELSE
					_EXCEPTION = 'El registro con id '||_CURRENT_ID||' ya se encuentra registrado';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_CURRENT_ID >= 1) THEN
						EXECUTE 'select setval(''business.serial_emission_point'', '||_CURRENT_ID||')';
					END IF;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			END;
			$_$;


ALTER FUNCTION business.dml_emission_point_create(id_user_ numeric, _id_taxpayer numeric, _value_emission_point character varying, _description_emission_point character varying, _deleted_emission_point boolean) OWNER TO postgres;

--
-- TOC entry 435 (class 1255 OID 26074)
-- Name: dml_emission_point_create_modified(numeric, numeric); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_emission_point_create_modified(id_user_ numeric, _id_taxpayer numeric) RETURNS TABLE(id_emission_point numeric, id_taxpayer numeric, value_emission_point character varying, description_emission_point character varying, deleted_emission_point boolean, id_company numeric, id_user numeric, type_emission business."TYPE_EMISSION", business_name_taxpayer character varying, tradename_taxpayer character varying, ruc_taxpayer character varying, dir_matriz_taxpayer character varying, signature_password_taxpayer character varying, signature_path_taxpayer character varying, status_taxpayer boolean, accounting_obliged business."TYPE_ACCOUNTING_OBLIGED")
    LANGUAGE plpgsql
    AS $$
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
			
$$;


ALTER FUNCTION business.dml_emission_point_create_modified(id_user_ numeric, _id_taxpayer numeric) OWNER TO postgres;

--
-- TOC entry 404 (class 1255 OID 26013)
-- Name: dml_emission_point_delete(numeric, numeric); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_emission_point_delete(id_user_ numeric, _id_emission_point numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_DELETED NUMERIC;
				_COUNT_DEPENDENCY NUMERIC;
				_RETURNING NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_COUNT = (select count(*) from business.view_emission_point t where t.id_emission_point = $2);
					
				IF (_COUNT = 1) THEN
					_COUNT_DELETED = (select count(*) from business.view_emission_point t where t.id_emission_point = $2 and deleted_emission_point = true); 
					IF (_COUNT_DELETED = 0) THEN 
						_COUNT_DEPENDENCY = (select * from core.utils_get_table_dependency('business','emission_point', $2));
						
						IF (_COUNT_DEPENDENCY > 0) THEN
							_EXCEPTION = 'No se puede eliminar el registro, mantiene dependencia en otros procesos.';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						ELSE
							FOR _X IN UPDATE business.emission_point SET deleted_emission_point=true WHERE id_emission_point = $2 RETURNING id_emission_point LOOP
								_RETURNING = _X.id_emission_point;
							END LOOP;
							IF (_RETURNING >= 1) THEN
								_SAVE_LOG = (select * from core.global_save_log());
								IF (_SAVE_LOG) THEN
									_RESPONSE = (core.dml_system_event_create($1,'emission_point',$2,'DELETE', now()::timestamp, false));
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
								_EXCEPTION = 'Ocurrió un error al eliminar el registro';
								RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
							END IF;
						END IF;
					ELSE
						_EXCEPTION = 'EL registro ya se encuentra eliminado';
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
			 $_$;


ALTER FUNCTION business.dml_emission_point_delete(id_user_ numeric, _id_emission_point numeric) OWNER TO postgres;

--
-- TOC entry 403 (class 1255 OID 26012)
-- Name: dml_emission_point_update(numeric, numeric, numeric, character varying, character varying, boolean); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_emission_point_update(id_user_ numeric, _id_emission_point numeric, _id_taxpayer numeric, _value_emission_point character varying, _description_emission_point character varying, _deleted_emission_point boolean) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_ATT NUMERIC;
				_COUNT_DELETED NUMERIC;
				_COUNT_EXTERNALS_IDS NUMERIC;
				_RETURNING NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN 
			-- taxpayer
			_COUNT_EXTERNALS_IDS = (select count(*) from business.view_taxpayer v where v.id_taxpayer = _id_taxpayer);
				
			IF (_COUNT_EXTERNALS_IDS = 0) THEN
				_EXCEPTION = 'El id '||_id_taxpayer||' de la tabla taxpayer no se encuentra registrado';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
			END IF;
			
				_COUNT = (select count(*) from business.view_emission_point t where t.id_emission_point = $2);
				
				IF (_COUNT = 1) THEN
					_COUNT_DELETED = (select count(*) from business.view_emission_point t where t.id_emission_point = $2 and deleted_emission_point = true); 
					IF (_COUNT_DELETED = 0) THEN
						
						_COUNT_ATT = (select count(*) from business.view_emission_point t where t.value_emission_point = _value_emission_point and t.id_emission_point != _id_emission_point);
						
						IF (_COUNT_ATT = 0) THEN 
							FOR _X IN UPDATE business.emission_point SET id_taxpayer=$3, value_emission_point=$4, description_emission_point=$5, deleted_emission_point=$6 WHERE id_emission_point=$2 RETURNING id_emission_point LOOP
								_RETURNING = _X.id_emission_point;
							END LOOP;

							IF (_RETURNING >= 1) THEN
								_SAVE_LOG = (select * from core.global_save_log());
								IF (_SAVE_LOG) THEN
									_RESPONSE = (core.dml_system_event_create($1,'emission_point',$2,'UPDATE', now()::timestamp, false));
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
							_EXCEPTION = 'Ya existe un registro con el value_emission_point '||_value_emission_point||'';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						END IF;
					ELSE 
						_EXCEPTION = 'EL registro se encuentra eliminado';
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
			 $_$;


ALTER FUNCTION business.dml_emission_point_update(id_user_ numeric, _id_emission_point numeric, _id_taxpayer numeric, _value_emission_point character varying, _description_emission_point character varying, _deleted_emission_point boolean) OWNER TO postgres;

--
-- TOC entry 436 (class 1255 OID 26075)
-- Name: dml_emission_point_update_modified(numeric, numeric, numeric, character varying, character varying, boolean); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_emission_point_update_modified(id_user_ numeric, _id_emission_point numeric, _id_taxpayer numeric, _value_emission_point character varying, _description_emission_point character varying, _deleted_emission_point boolean) RETURNS TABLE(id_emission_point numeric, id_taxpayer numeric, value_emission_point character varying, description_emission_point character varying, deleted_emission_point boolean, id_company numeric, id_user numeric, type_emission business."TYPE_EMISSION", business_name_taxpayer character varying, tradename_taxpayer character varying, ruc_taxpayer character varying, dir_matriz_taxpayer character varying, signature_password_taxpayer character varying, signature_path_taxpayer character varying, status_taxpayer boolean, accounting_obliged business."TYPE_ACCOUNTING_OBLIGED")
    LANGUAGE plpgsql
    AS $$
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
			 
$$;


ALTER FUNCTION business.dml_emission_point_update_modified(id_user_ numeric, _id_emission_point numeric, _id_taxpayer numeric, _value_emission_point character varying, _description_emission_point character varying, _deleted_emission_point boolean) OWNER TO postgres;

--
-- TOC entry 399 (class 1255 OID 26008)
-- Name: dml_establishment_create(numeric, numeric, character varying, character varying, boolean); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_establishment_create(id_user_ numeric, _id_taxpayer numeric, _value_establishment character varying, _description_establishment character varying, _deleted_establishment boolean) RETURNS numeric
    LANGUAGE plpgsql
    AS $_$
			DECLARE
				_RESPONSE BOOLEAN DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_ATT NUMERIC;
				_COUNT_EXTERNALS_IDS NUMERIC;
				_RETURNING NUMERIC;
				_CURRENT_ID NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			BEGIN 
			-- taxpayer
			_COUNT_EXTERNALS_IDS = (select count(*) from business.view_taxpayer v where v.id_taxpayer = _id_taxpayer);
				
			IF (_COUNT_EXTERNALS_IDS = 0) THEN
				_EXCEPTION = 'El id '||_id_taxpayer||' de la tabla taxpayer no se encuentra registrado';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
			END IF;
			
				_CURRENT_ID = (select nextval('business.serial_establishment')-1);
				_COUNT = (select count(*) from business.view_establishment t where t.id_establishment = _CURRENT_ID);

				IF (_COUNT = 0) THEN
				
					_COUNT_ATT = (select count(*) from business.view_establishment t where t.value_establishment = _value_establishment);
				
					IF (_COUNT_ATT = 0) THEN 
						FOR _X IN INSERT INTO business.establishment(id_establishment, id_taxpayer, value_establishment, description_establishment, deleted_establishment) VALUES (_CURRENT_ID, $2 , $3 , $4 , $5 ) RETURNING id_establishment LOOP
							_RETURNING = _X.id_establishment;
						END LOOP;

						IF (_RETURNING >= 1) THEN
							_SAVE_LOG = (select * from core.global_save_log());
							IF (_SAVE_LOG) THEN
								_RESPONSE = (core.dml_system_event_create($1,'establishment',_CURRENT_ID,'CREATE', now()::timestamp, false));
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
						_EXCEPTION = 'Ya existe un registro con el value_establishment '||_value_establishment||'';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
				ELSE
					_EXCEPTION = 'El registro con id '||_CURRENT_ID||' ya se encuentra registrado';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_CURRENT_ID >= 1) THEN
						EXECUTE 'select setval(''business.serial_establishment'', '||_CURRENT_ID||')';
					END IF;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			END;
			$_$;


ALTER FUNCTION business.dml_establishment_create(id_user_ numeric, _id_taxpayer numeric, _value_establishment character varying, _description_establishment character varying, _deleted_establishment boolean) OWNER TO postgres;

--
-- TOC entry 433 (class 1255 OID 26072)
-- Name: dml_establishment_create_modified(numeric, numeric); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_establishment_create_modified(id_user_ numeric, _id_taxpayer numeric) RETURNS TABLE(id_establishment numeric, id_taxpayer numeric, value_establishment character varying, description_establishment character varying, deleted_establishment boolean, id_company numeric, id_user numeric, type_emission business."TYPE_EMISSION", business_name_taxpayer character varying, tradename_taxpayer character varying, ruc_taxpayer character varying, dir_matriz_taxpayer character varying, signature_password_taxpayer character varying, signature_path_taxpayer character varying, status_taxpayer boolean, accounting_obliged business."TYPE_ACCOUNTING_OBLIGED")
    LANGUAGE plpgsql
    AS $$
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
			
$$;


ALTER FUNCTION business.dml_establishment_create_modified(id_user_ numeric, _id_taxpayer numeric) OWNER TO postgres;

--
-- TOC entry 401 (class 1255 OID 26010)
-- Name: dml_establishment_delete(numeric, numeric); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_establishment_delete(id_user_ numeric, _id_establishment numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_DELETED NUMERIC;
				_COUNT_DEPENDENCY NUMERIC;
				_RETURNING NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_COUNT = (select count(*) from business.view_establishment t where t.id_establishment = $2);
					
				IF (_COUNT = 1) THEN
					_COUNT_DELETED = (select count(*) from business.view_establishment t where t.id_establishment = $2 and deleted_establishment = true); 
					IF (_COUNT_DELETED = 0) THEN 
						_COUNT_DEPENDENCY = (select * from core.utils_get_table_dependency('business','establishment', $2));
						
						IF (_COUNT_DEPENDENCY > 0) THEN
							_EXCEPTION = 'No se puede eliminar el registro, mantiene dependencia en otros procesos.';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						ELSE
							FOR _X IN UPDATE business.establishment SET deleted_establishment=true WHERE id_establishment = $2 RETURNING id_establishment LOOP
								_RETURNING = _X.id_establishment;
							END LOOP;
							IF (_RETURNING >= 1) THEN
								_SAVE_LOG = (select * from core.global_save_log());
								IF (_SAVE_LOG) THEN
									_RESPONSE = (core.dml_system_event_create($1,'establishment',$2,'DELETE', now()::timestamp, false));
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
								_EXCEPTION = 'Ocurrió un error al eliminar el registro';
								RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
							END IF;
						END IF;
					ELSE
						_EXCEPTION = 'EL registro ya se encuentra eliminado';
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
			 $_$;


ALTER FUNCTION business.dml_establishment_delete(id_user_ numeric, _id_establishment numeric) OWNER TO postgres;

--
-- TOC entry 400 (class 1255 OID 26009)
-- Name: dml_establishment_update(numeric, numeric, numeric, character varying, character varying, boolean); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_establishment_update(id_user_ numeric, _id_establishment numeric, _id_taxpayer numeric, _value_establishment character varying, _description_establishment character varying, _deleted_establishment boolean) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_ATT NUMERIC;
				_COUNT_DELETED NUMERIC;
				_COUNT_EXTERNALS_IDS NUMERIC;
				_RETURNING NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN 
			-- taxpayer
			_COUNT_EXTERNALS_IDS = (select count(*) from business.view_taxpayer v where v.id_taxpayer = _id_taxpayer);
				
			IF (_COUNT_EXTERNALS_IDS = 0) THEN
				_EXCEPTION = 'El id '||_id_taxpayer||' de la tabla taxpayer no se encuentra registrado';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
			END IF;
			
				_COUNT = (select count(*) from business.view_establishment t where t.id_establishment = $2);
				
				IF (_COUNT = 1) THEN
					_COUNT_DELETED = (select count(*) from business.view_establishment t where t.id_establishment = $2 and deleted_establishment = true); 
					IF (_COUNT_DELETED = 0) THEN
						
						_COUNT_ATT = (select count(*) from business.view_establishment t where t.value_establishment = _value_establishment and t.id_establishment != _id_establishment);
						
						IF (_COUNT_ATT = 0) THEN 
							FOR _X IN UPDATE business.establishment SET id_taxpayer=$3, value_establishment=$4, description_establishment=$5, deleted_establishment=$6 WHERE id_establishment=$2 RETURNING id_establishment LOOP
								_RETURNING = _X.id_establishment;
							END LOOP;

							IF (_RETURNING >= 1) THEN
								_SAVE_LOG = (select * from core.global_save_log());
								IF (_SAVE_LOG) THEN
									_RESPONSE = (core.dml_system_event_create($1,'establishment',$2,'UPDATE', now()::timestamp, false));
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
							_EXCEPTION = 'Ya existe un registro con el value_establishment '||_value_establishment||'';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						END IF;
					ELSE 
						_EXCEPTION = 'EL registro se encuentra eliminado';
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
			 $_$;


ALTER FUNCTION business.dml_establishment_update(id_user_ numeric, _id_establishment numeric, _id_taxpayer numeric, _value_establishment character varying, _description_establishment character varying, _deleted_establishment boolean) OWNER TO postgres;

--
-- TOC entry 434 (class 1255 OID 26073)
-- Name: dml_establishment_update_modified(numeric, numeric, numeric, character varying, character varying, boolean); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_establishment_update_modified(id_user_ numeric, _id_establishment numeric, _id_taxpayer numeric, _value_establishment character varying, _description_establishment character varying, _deleted_establishment boolean) RETURNS TABLE(id_establishment numeric, id_taxpayer numeric, value_establishment character varying, description_establishment character varying, deleted_establishment boolean, id_company numeric, id_user numeric, type_emission business."TYPE_EMISSION", business_name_taxpayer character varying, tradename_taxpayer character varying, ruc_taxpayer character varying, dir_matriz_taxpayer character varying, signature_password_taxpayer character varying, signature_path_taxpayer character varying, status_taxpayer boolean, accounting_obliged business."TYPE_ACCOUNTING_OBLIGED")
    LANGUAGE plpgsql
    AS $$
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
			 
$$;


ALTER FUNCTION business.dml_establishment_update_modified(id_user_ numeric, _id_establishment numeric, _id_taxpayer numeric, _value_establishment character varying, _description_establishment character varying, _deleted_establishment boolean) OWNER TO postgres;

--
-- TOC entry 432 (class 1255 OID 26071)
-- Name: dml_institution_change_status_by_batch(numeric, numeric, boolean); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_institution_change_status_by_batch(id_user_ numeric, _id_institution numeric, _status_by_batch_institution boolean) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
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
			 
$$;


ALTER FUNCTION business.dml_institution_change_status_by_batch(id_user_ numeric, _id_institution numeric, _status_by_batch_institution boolean) OWNER TO postgres;

--
-- TOC entry 396 (class 1255 OID 26005)
-- Name: dml_institution_create(numeric, numeric, business."TYPE_ENVIRONMENT", character varying, character varying, character varying, boolean, boolean, boolean); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_institution_create(id_user_ numeric, _id_taxpayer numeric, _type_environment business."TYPE_ENVIRONMENT", _name_institution character varying, _description_institution character varying, _address_institution character varying, _status_institution boolean, _status_by_batch_institution boolean, _deleted_institution boolean) RETURNS numeric
    LANGUAGE plpgsql
    AS $_$
			DECLARE
				_RESPONSE BOOLEAN DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_ATT NUMERIC;
				_COUNT_EXTERNALS_IDS NUMERIC;
				_RETURNING NUMERIC;
				_CURRENT_ID NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			BEGIN 
			-- taxpayer
			_COUNT_EXTERNALS_IDS = (select count(*) from business.view_taxpayer v where v.id_taxpayer = _id_taxpayer);
				
			IF (_COUNT_EXTERNALS_IDS = 0) THEN
				_EXCEPTION = 'El id '||_id_taxpayer||' de la tabla taxpayer no se encuentra registrado';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
			END IF;
			
				_CURRENT_ID = (select nextval('business.serial_institution')-1);
				_COUNT = (select count(*) from business.view_institution t where t.id_institution = _CURRENT_ID);

				IF (_COUNT = 0) THEN
				
					_COUNT_ATT = (select count(*) from business.view_institution t where t.id_institution = _CURRENT_ID);
				
					IF (_COUNT_ATT = 0) THEN 
						FOR _X IN INSERT INTO business.institution(id_institution, id_taxpayer, type_environment, name_institution, description_institution, address_institution, status_institution, status_by_batch_institution, deleted_institution) VALUES (_CURRENT_ID, $2 , $3 , $4 , $5 , $6 , $7 , $8 , $9 ) RETURNING id_institution LOOP
							_RETURNING = _X.id_institution;
						END LOOP;

						IF (_RETURNING >= 1) THEN
							_SAVE_LOG = (select * from core.global_save_log());
							IF (_SAVE_LOG) THEN
								_RESPONSE = (core.dml_system_event_create($1,'institution',_CURRENT_ID,'CREATE', now()::timestamp, false));
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
						_EXCEPTION = 'Ya existe un registro con el id_institution '||_id_institution||'';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
				ELSE
					_EXCEPTION = 'El registro con id '||_CURRENT_ID||' ya se encuentra registrado';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_CURRENT_ID >= 1) THEN
						EXECUTE 'select setval(''business.serial_institution'', '||_CURRENT_ID||')';
					END IF;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			END;
			$_$;


ALTER FUNCTION business.dml_institution_create(id_user_ numeric, _id_taxpayer numeric, _type_environment business."TYPE_ENVIRONMENT", _name_institution character varying, _description_institution character varying, _address_institution character varying, _status_institution boolean, _status_by_batch_institution boolean, _deleted_institution boolean) OWNER TO postgres;

--
-- TOC entry 429 (class 1255 OID 26068)
-- Name: dml_institution_create_modified(numeric, numeric); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_institution_create_modified(id_user_ numeric, _id_taxpayer numeric) RETURNS TABLE(value_sequence numeric, id_institution numeric, id_taxpayer numeric, type_environment business."TYPE_ENVIRONMENT", name_institution character varying, description_institution character varying, address_institution character varying, status_institution boolean, status_by_batch_institution boolean, deleted_institution boolean, id_company numeric, id_user numeric, type_emission business."TYPE_EMISSION", business_name_taxpayer character varying, tradename_taxpayer character varying, ruc_taxpayer character varying, dir_matriz_taxpayer character varying, signature_password_taxpayer character varying, signature_path_taxpayer character varying, status_taxpayer boolean, accounting_obliged business."TYPE_ACCOUNTING_OBLIGED")
    LANGUAGE plpgsql
    AS $$
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
			
$$;


ALTER FUNCTION business.dml_institution_create_modified(id_user_ numeric, _id_taxpayer numeric) OWNER TO postgres;

--
-- TOC entry 398 (class 1255 OID 26007)
-- Name: dml_institution_delete(numeric, numeric); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_institution_delete(id_user_ numeric, _id_institution numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_DELETED NUMERIC;
				_COUNT_DEPENDENCY NUMERIC;
				_RETURNING NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_COUNT = (select count(*) from business.view_institution t where t.id_institution = $2);
					
				IF (_COUNT = 1) THEN
					_COUNT_DELETED = (select count(*) from business.view_institution t where t.id_institution = $2 and deleted_institution = true); 
					IF (_COUNT_DELETED = 0) THEN 
						_COUNT_DEPENDENCY = (select * from core.utils_get_table_dependency('business','institution', $2));
						
						IF (_COUNT_DEPENDENCY > 0) THEN
							_EXCEPTION = 'No se puede eliminar el registro, mantiene dependencia en otros procesos.';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						ELSE
							FOR _X IN UPDATE business.institution SET deleted_institution=true WHERE id_institution = $2 RETURNING id_institution LOOP
								_RETURNING = _X.id_institution;
							END LOOP;
							IF (_RETURNING >= 1) THEN
								_SAVE_LOG = (select * from core.global_save_log());
								IF (_SAVE_LOG) THEN
									_RESPONSE = (core.dml_system_event_create($1,'institution',$2,'DELETE', now()::timestamp, false));
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
								_EXCEPTION = 'Ocurrió un error al eliminar el registro';
								RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
							END IF;
						END IF;
					ELSE
						_EXCEPTION = 'EL registro ya se encuentra eliminado';
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
			 $_$;


ALTER FUNCTION business.dml_institution_delete(id_user_ numeric, _id_institution numeric) OWNER TO postgres;

--
-- TOC entry 431 (class 1255 OID 26070)
-- Name: dml_institution_delete_modified(numeric, numeric); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_institution_delete_modified(id_user_ numeric, _id_institution numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
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
			 
$$;


ALTER FUNCTION business.dml_institution_delete_modified(id_user_ numeric, _id_institution numeric) OWNER TO postgres;

--
-- TOC entry 397 (class 1255 OID 26006)
-- Name: dml_institution_update(numeric, numeric, numeric, business."TYPE_ENVIRONMENT", character varying, character varying, character varying, boolean, boolean, boolean); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_institution_update(id_user_ numeric, _id_institution numeric, _id_taxpayer numeric, _type_environment business."TYPE_ENVIRONMENT", _name_institution character varying, _description_institution character varying, _address_institution character varying, _status_institution boolean, _status_by_batch_institution boolean, _deleted_institution boolean) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_ATT NUMERIC;
				_COUNT_DELETED NUMERIC;
				_COUNT_EXTERNALS_IDS NUMERIC;
				_RETURNING NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN 
			-- taxpayer
			_COUNT_EXTERNALS_IDS = (select count(*) from business.view_taxpayer v where v.id_taxpayer = _id_taxpayer);
				
			IF (_COUNT_EXTERNALS_IDS = 0) THEN
				_EXCEPTION = 'El id '||_id_taxpayer||' de la tabla taxpayer no se encuentra registrado';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
			END IF;
			
				_COUNT = (select count(*) from business.view_institution t where t.id_institution = $2);
				
				IF (_COUNT = 1) THEN
					_COUNT_DELETED = (select count(*) from business.view_institution t where t.id_institution = $2 and deleted_institution = true); 
					IF (_COUNT_DELETED = 0) THEN
						
						_COUNT_ATT = (select count(*) from business.view_institution t where t.id_institution = _id_institution and t.id_institution != _id_institution);
						
						IF (_COUNT_ATT = 0) THEN 
							FOR _X IN UPDATE business.institution SET id_taxpayer=$3, type_environment=$4, name_institution=$5, description_institution=$6, address_institution=$7, status_institution=$8, status_by_batch_institution=$9, deleted_institution=$10 WHERE id_institution=$2 RETURNING id_institution LOOP
								_RETURNING = _X.id_institution;
							END LOOP;

							IF (_RETURNING >= 1) THEN
								_SAVE_LOG = (select * from core.global_save_log());
								IF (_SAVE_LOG) THEN
									_RESPONSE = (core.dml_system_event_create($1,'institution',$2,'UPDATE', now()::timestamp, false));
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
							_EXCEPTION = 'Ya existe un registro con el id_institution '||_id_institution||'';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						END IF;
					ELSE 
						_EXCEPTION = 'EL registro se encuentra eliminado';
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
			 $_$;


ALTER FUNCTION business.dml_institution_update(id_user_ numeric, _id_institution numeric, _id_taxpayer numeric, _type_environment business."TYPE_ENVIRONMENT", _name_institution character varying, _description_institution character varying, _address_institution character varying, _status_institution boolean, _status_by_batch_institution boolean, _deleted_institution boolean) OWNER TO postgres;

--
-- TOC entry 430 (class 1255 OID 26069)
-- Name: dml_institution_update_modified(numeric, numeric, numeric, business."TYPE_ENVIRONMENT", character varying, character varying, character varying, boolean, boolean, boolean); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_institution_update_modified(id_user_ numeric, _id_institution numeric, _id_taxpayer numeric, _type_environment business."TYPE_ENVIRONMENT", _name_institution character varying, _description_institution character varying, _address_institution character varying, _status_institution boolean, _status_by_batch_institution boolean, _deleted_institution boolean) RETURNS TABLE(value_sequence numeric, id_institution numeric, id_taxpayer numeric, type_environment business."TYPE_ENVIRONMENT", name_institution character varying, description_institution character varying, address_institution character varying, status_institution boolean, status_by_batch_institution boolean, deleted_institution boolean, id_company numeric, id_user numeric, type_emission business."TYPE_EMISSION", business_name_taxpayer character varying, tradename_taxpayer character varying, ruc_taxpayer character varying, dir_matriz_taxpayer character varying, signature_password_taxpayer character varying, signature_path_taxpayer character varying, status_taxpayer boolean, accounting_obliged business."TYPE_ACCOUNTING_OBLIGED")
    LANGUAGE plpgsql
    AS $$
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
			 
$$;


ALTER FUNCTION business.dml_institution_update_modified(id_user_ numeric, _id_institution numeric, _id_taxpayer numeric, _type_environment business."TYPE_ENVIRONMENT", _name_institution character varying, _description_institution character varying, _address_institution character varying, _status_institution boolean, _status_by_batch_institution boolean, _deleted_institution boolean) OWNER TO postgres;

--
-- TOC entry 405 (class 1255 OID 26014)
-- Name: dml_mail_server_create(numeric, numeric, business."TYPE_MAIL_SERVER", character varying, numeric, boolean, character varying, character varying, boolean); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_mail_server_create(id_user_ numeric, _id_taxpayer numeric, _type_mail_server business."TYPE_MAIL_SERVER", _host_mail_server character varying, _port_mail_server numeric, _secure_mail_server boolean, _user_mail_server character varying, _password_mail_server character varying, _status_mail_server boolean) RETURNS numeric
    LANGUAGE plpgsql
    AS $_$
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
			-- taxpayer
			_COUNT_EXTERNALS_IDS = (select count(*) from business.view_taxpayer v where v.id_taxpayer = _id_taxpayer);
				
			IF (_COUNT_EXTERNALS_IDS = 0) THEN
				_EXCEPTION = 'El id '||_id_taxpayer||' de la tabla taxpayer no se encuentra registrado';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
			END IF;
			
				_CURRENT_ID = (select nextval('business.serial_mail_server')-1);
				_COUNT = (select count(*) from business.view_mail_server t where t.id_mail_server = _CURRENT_ID);

				IF (_COUNT = 0) THEN
					FOR _X IN INSERT INTO business.mail_server(id_mail_server, id_taxpayer, type_mail_server, host_mail_server, port_mail_server, secure_mail_server, user_mail_server, password_mail_server, status_mail_server) VALUES (_CURRENT_ID, $2 , $3 , $4 , $5 , $6 , $7 , $8 , $9 ) RETURNING id_mail_server LOOP
						_RETURNING = _X.id_mail_server;
					END LOOP;
					
					IF (_RETURNING >= 1) THEN
						_SAVE_LOG = (select * from core.global_save_log());
						IF (_SAVE_LOG) THEN
							_RESPONSE = (core.dml_system_event_create($1,'mail_server',_CURRENT_ID,'CREATE', now()::timestamp, false));
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
						EXECUTE 'select setval(''business.serial_mail_server'', '||_CURRENT_ID||')';
					END IF;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			END;
			$_$;


ALTER FUNCTION business.dml_mail_server_create(id_user_ numeric, _id_taxpayer numeric, _type_mail_server business."TYPE_MAIL_SERVER", _host_mail_server character varying, _port_mail_server numeric, _secure_mail_server boolean, _user_mail_server character varying, _password_mail_server character varying, _status_mail_server boolean) OWNER TO postgres;

--
-- TOC entry 422 (class 1255 OID 26063)
-- Name: dml_mail_server_create_modified(numeric, numeric); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_mail_server_create_modified(id_user_ numeric, _id_taxpayer numeric) RETURNS TABLE(id_mail_server numeric, id_taxpayer numeric, type_mail_server business."TYPE_MAIL_SERVER", host_mail_server character varying, port_mail_server numeric, secure_mail_server boolean, user_mail_server character varying, password_mail_server character varying, status_mail_server boolean, id_company numeric, id_user numeric, type_emission business."TYPE_EMISSION", business_name_taxpayer character varying, tradename_taxpayer character varying, ruc_taxpayer character varying, dir_matriz_taxpayer character varying, signature_password_taxpayer character varying, signature_path_taxpayer character varying, status_taxpayer boolean, accounting_obliged business."TYPE_ACCOUNTING_OBLIGED")
    LANGUAGE plpgsql
    AS $$
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
			
$$;


ALTER FUNCTION business.dml_mail_server_create_modified(id_user_ numeric, _id_taxpayer numeric) OWNER TO postgres;

--
-- TOC entry 407 (class 1255 OID 26016)
-- Name: dml_mail_server_delete(numeric, numeric); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_mail_server_delete(id_user_ numeric, _id_mail_server numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_DEPENDENCY NUMERIC;
				_RETURNING NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_COUNT = (select count(*) from business.view_mail_server t where t.id_mail_server = $2);
					
				IF (_COUNT = 1) THEN
					_COUNT_DEPENDENCY = (select * from core.utils_get_table_dependency('business','mail_server', $2));
						
					IF (_COUNT_DEPENDENCY > 0) THEN
						_EXCEPTION = 'No se puede eliminar el registro, mantiene dependencia en otros procesos.';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					ELSE
						FOR _X IN DELETE FROM business.mail_server WHERE id_mail_server = $2 RETURNING id_mail_server LOOP
							_RETURNING = _X.id_mail_server;
						END LOOP;
						IF (_RETURNING >= 1) THEN
							_SAVE_LOG = (select * from core.global_save_log());
							IF (_SAVE_LOG) THEN
								_RESPONSE = (core.dml_system_event_create($1,'mail_server',$2,'DELETE', now()::timestamp, false));
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
							_EXCEPTION = 'Ocurrió un error al eliminar el registro';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						END IF;
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
			 $_$;


ALTER FUNCTION business.dml_mail_server_delete(id_user_ numeric, _id_mail_server numeric) OWNER TO postgres;

--
-- TOC entry 406 (class 1255 OID 26015)
-- Name: dml_mail_server_update(numeric, numeric, numeric, business."TYPE_MAIL_SERVER", character varying, numeric, boolean, character varying, character varying, boolean); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_mail_server_update(id_user_ numeric, _id_mail_server numeric, _id_taxpayer numeric, _type_mail_server business."TYPE_MAIL_SERVER", _host_mail_server character varying, _port_mail_server numeric, _secure_mail_server boolean, _user_mail_server character varying, _password_mail_server character varying, _status_mail_server boolean) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_EXTERNALS_IDS NUMERIC;
				_RETURNING NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN 
			-- taxpayer
			_COUNT_EXTERNALS_IDS = (select count(*) from business.view_taxpayer v where v.id_taxpayer = _id_taxpayer);
				
			IF (_COUNT_EXTERNALS_IDS = 0) THEN
				_EXCEPTION = 'El id '||_id_taxpayer||' de la tabla taxpayer no se encuentra registrado';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
			END IF;
			
			 	_COUNT = (select count(*) from business.view_mail_server t where t.id_mail_server = $2);
			
				IF (_COUNT = 1) THEN
					FOR _X IN UPDATE business.mail_server SET id_taxpayer=$3, type_mail_server=$4, host_mail_server=$5, port_mail_server=$6, secure_mail_server=$7, user_mail_server=$8, password_mail_server=$9, status_mail_server=$10 WHERE id_mail_server=$2 RETURNING id_mail_server LOOP
						_RETURNING = _X.id_mail_server;
					END LOOP;
						
					IF (_RETURNING >= 1) THEN
						_SAVE_LOG = (select * from core.global_save_log());
						IF (_SAVE_LOG) THEN
							_RESPONSE = (core.dml_system_event_create($1,'mail_server',$2,'UPDATE', now()::timestamp, false));
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
			 $_$;


ALTER FUNCTION business.dml_mail_server_update(id_user_ numeric, _id_mail_server numeric, _id_taxpayer numeric, _type_mail_server business."TYPE_MAIL_SERVER", _host_mail_server character varying, _port_mail_server numeric, _secure_mail_server boolean, _user_mail_server character varying, _password_mail_server character varying, _status_mail_server boolean) OWNER TO postgres;

--
-- TOC entry 423 (class 1255 OID 26064)
-- Name: dml_mail_server_update_modified(numeric, numeric, numeric, business."TYPE_MAIL_SERVER", character varying, numeric, boolean, character varying, character varying, boolean); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_mail_server_update_modified(id_user_ numeric, _id_mail_server numeric, _id_taxpayer numeric, _type_mail_server business."TYPE_MAIL_SERVER", _host_mail_server character varying, _port_mail_server numeric, _secure_mail_server boolean, _user_mail_server character varying, _password_mail_server character varying, _status_mail_server boolean) RETURNS TABLE(id_mail_server numeric, id_taxpayer numeric, type_mail_server business."TYPE_MAIL_SERVER", host_mail_server character varying, port_mail_server numeric, secure_mail_server boolean, user_mail_server character varying, password_mail_server character varying, status_mail_server boolean, id_company numeric, id_user numeric, type_emission business."TYPE_EMISSION", business_name_taxpayer character varying, tradename_taxpayer character varying, ruc_taxpayer character varying, dir_matriz_taxpayer character varying, signature_password_taxpayer character varying, signature_path_taxpayer character varying, status_taxpayer boolean, accounting_obliged business."TYPE_ACCOUNTING_OBLIGED")
    LANGUAGE plpgsql
    AS $$
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
			 
$$;


ALTER FUNCTION business.dml_mail_server_update_modified(id_user_ numeric, _id_mail_server numeric, _id_taxpayer numeric, _type_mail_server business."TYPE_MAIL_SERVER", _host_mail_server character varying, _port_mail_server numeric, _secure_mail_server boolean, _user_mail_server character varying, _password_mail_server character varying, _status_mail_server boolean) OWNER TO postgres;

--
-- TOC entry 408 (class 1255 OID 26017)
-- Name: dml_sequence_create(numeric, numeric, numeric, numeric, business."TYPE_ENVIRONMENT", business."TYPE_VOUCHER", character varying, boolean, boolean); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_sequence_create(id_user_ numeric, _id_institution numeric, _id_establishment numeric, _id_emission_point numeric, _type_environment business."TYPE_ENVIRONMENT", _type_voucher business."TYPE_VOUCHER", _number_code_sequence character varying, _status_sequence boolean, _deleted_sequence boolean) RETURNS numeric
    LANGUAGE plpgsql
    AS $_$
			DECLARE
				_RESPONSE BOOLEAN DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_ATT NUMERIC;
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
			 
			-- establishment
			_COUNT_EXTERNALS_IDS = (select count(*) from business.view_establishment v where v.id_establishment = _id_establishment);
				
			IF (_COUNT_EXTERNALS_IDS = 0) THEN
				_EXCEPTION = 'El id '||_id_establishment||' de la tabla establishment no se encuentra registrado';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
			END IF;
			 
			-- emission_point
			_COUNT_EXTERNALS_IDS = (select count(*) from business.view_emission_point v where v.id_emission_point = _id_emission_point);
				
			IF (_COUNT_EXTERNALS_IDS = 0) THEN
				_EXCEPTION = 'El id '||_id_emission_point||' de la tabla emission_point no se encuentra registrado';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
			END IF;
			
				_CURRENT_ID = (select nextval('business.serial_sequence')-1);
				_COUNT = (select count(*) from business.view_sequence t where t.id_sequence = _CURRENT_ID);

				IF (_COUNT = 0) THEN
				
					_COUNT_ATT = (select count(*) from business.view_sequence t where t.id_sequence = _CURRENT_ID);
				
					IF (_COUNT_ATT = 0) THEN 
						FOR _X IN INSERT INTO business.sequence(id_sequence, id_institution, id_establishment, id_emission_point, type_environment, type_voucher, number_code_sequence, status_sequence, deleted_sequence) VALUES (_CURRENT_ID, $2 , $3 , $4 , $5 , $6 , $7 , $8 , $9 ) RETURNING id_sequence LOOP
							_RETURNING = _X.id_sequence;
						END LOOP;

						IF (_RETURNING >= 1) THEN
							_SAVE_LOG = (select * from core.global_save_log());
							IF (_SAVE_LOG) THEN
								_RESPONSE = (core.dml_system_event_create($1,'sequence',_CURRENT_ID,'CREATE', now()::timestamp, false));
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
						_EXCEPTION = 'Ya existe un registro con el id_sequence '||_id_sequence||'';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
				ELSE
					_EXCEPTION = 'El registro con id '||_CURRENT_ID||' ya se encuentra registrado';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_CURRENT_ID >= 1) THEN
						EXECUTE 'select setval(''business.serial_sequence'', '||_CURRENT_ID||')';
					END IF;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			END;
			$_$;


ALTER FUNCTION business.dml_sequence_create(id_user_ numeric, _id_institution numeric, _id_establishment numeric, _id_emission_point numeric, _type_environment business."TYPE_ENVIRONMENT", _type_voucher business."TYPE_VOUCHER", _number_code_sequence character varying, _status_sequence boolean, _deleted_sequence boolean) OWNER TO postgres;

--
-- TOC entry 437 (class 1255 OID 26076)
-- Name: dml_sequence_create_modified(numeric, numeric); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_sequence_create_modified(id_user_ numeric, _id_institution numeric) RETURNS TABLE(value_sequence numeric, id_sequence numeric, id_institution numeric, id_establishment numeric, id_emission_point numeric, bvs_type_environment business."TYPE_ENVIRONMENT", bvs_type_voucher business."TYPE_VOUCHER", number_code_sequence character varying, status_sequence boolean, deleted_sequence boolean, id_taxpayer numeric, bvi_type_environment business."TYPE_ENVIRONMENT", name_institution character varying, description_institution character varying, address_institution character varying, status_institution boolean, value_establishment character varying, description_establishment character varying, value_emission_point character varying, description_emission_point character varying)
    LANGUAGE plpgsql
    AS $$
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
			
$$;


ALTER FUNCTION business.dml_sequence_create_modified(id_user_ numeric, _id_institution numeric) OWNER TO postgres;

--
-- TOC entry 393 (class 1255 OID 26019)
-- Name: dml_sequence_delete(numeric, numeric); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_sequence_delete(id_user_ numeric, _id_sequence numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_DELETED NUMERIC;
				_COUNT_DEPENDENCY NUMERIC;
				_RETURNING NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_COUNT = (select count(*) from business.view_sequence t where t.id_sequence = $2);
					
				IF (_COUNT = 1) THEN
					_COUNT_DELETED = (select count(*) from business.view_sequence t where t.id_sequence = $2 and deleted_sequence = true); 
					IF (_COUNT_DELETED = 0) THEN 
						_COUNT_DEPENDENCY = (select * from core.utils_get_table_dependency('business','sequence', $2));
						
						IF (_COUNT_DEPENDENCY > 0) THEN
							_EXCEPTION = 'No se puede eliminar el registro, mantiene dependencia en otros procesos.';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						ELSE
							FOR _X IN UPDATE business.sequence SET deleted_sequence=true WHERE id_sequence = $2 RETURNING id_sequence LOOP
								_RETURNING = _X.id_sequence;
							END LOOP;
							IF (_RETURNING >= 1) THEN
								_SAVE_LOG = (select * from core.global_save_log());
								IF (_SAVE_LOG) THEN
									_RESPONSE = (core.dml_system_event_create($1,'sequence',$2,'DELETE', now()::timestamp, false));
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
								_EXCEPTION = 'Ocurrió un error al eliminar el registro';
								RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
							END IF;
						END IF;
					ELSE
						_EXCEPTION = 'EL registro ya se encuentra eliminado';
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
			 $_$;


ALTER FUNCTION business.dml_sequence_delete(id_user_ numeric, _id_sequence numeric) OWNER TO postgres;

--
-- TOC entry 416 (class 1255 OID 26078)
-- Name: dml_sequence_delete_modified(numeric, numeric); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_sequence_delete_modified(id_user_ numeric, _id_sequence numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
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
			 
$$;


ALTER FUNCTION business.dml_sequence_delete_modified(id_user_ numeric, _id_sequence numeric) OWNER TO postgres;

--
-- TOC entry 409 (class 1255 OID 26018)
-- Name: dml_sequence_update(numeric, numeric, numeric, numeric, numeric, business."TYPE_ENVIRONMENT", business."TYPE_VOUCHER", character varying, boolean, boolean); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_sequence_update(id_user_ numeric, _id_sequence numeric, _id_institution numeric, _id_establishment numeric, _id_emission_point numeric, _type_environment business."TYPE_ENVIRONMENT", _type_voucher business."TYPE_VOUCHER", _number_code_sequence character varying, _status_sequence boolean, _deleted_sequence boolean) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_ATT NUMERIC;
				_COUNT_DELETED NUMERIC;
				_COUNT_EXTERNALS_IDS NUMERIC;
				_RETURNING NUMERIC;
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
			 
			-- establishment
			_COUNT_EXTERNALS_IDS = (select count(*) from business.view_establishment v where v.id_establishment = _id_establishment);
				
			IF (_COUNT_EXTERNALS_IDS = 0) THEN
				_EXCEPTION = 'El id '||_id_establishment||' de la tabla establishment no se encuentra registrado';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
			END IF;
			 
			-- emission_point
			_COUNT_EXTERNALS_IDS = (select count(*) from business.view_emission_point v where v.id_emission_point = _id_emission_point);
				
			IF (_COUNT_EXTERNALS_IDS = 0) THEN
				_EXCEPTION = 'El id '||_id_emission_point||' de la tabla emission_point no se encuentra registrado';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
			END IF;
			
				_COUNT = (select count(*) from business.view_sequence t where t.id_sequence = $2);
				
				IF (_COUNT = 1) THEN
					_COUNT_DELETED = (select count(*) from business.view_sequence t where t.id_sequence = $2 and deleted_sequence = true); 
					IF (_COUNT_DELETED = 0) THEN
						
						_COUNT_ATT = (select count(*) from business.view_sequence t where t.id_sequence = _id_sequence and t.id_sequence != _id_sequence);
						
						IF (_COUNT_ATT = 0) THEN 
							FOR _X IN UPDATE business.sequence SET id_institution=$3, id_establishment=$4, id_emission_point=$5, type_environment=$6, type_voucher=$7, number_code_sequence=$8, status_sequence=$9, deleted_sequence=$10 WHERE id_sequence=$2 RETURNING id_sequence LOOP
								_RETURNING = _X.id_sequence;
							END LOOP;

							IF (_RETURNING >= 1) THEN
								_SAVE_LOG = (select * from core.global_save_log());
								IF (_SAVE_LOG) THEN
									_RESPONSE = (core.dml_system_event_create($1,'sequence',$2,'UPDATE', now()::timestamp, false));
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
							_EXCEPTION = 'Ya existe un registro con el id_sequence '||_id_sequence||'';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						END IF;
					ELSE 
						_EXCEPTION = 'EL registro se encuentra eliminado';
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
			 $_$;


ALTER FUNCTION business.dml_sequence_update(id_user_ numeric, _id_sequence numeric, _id_institution numeric, _id_establishment numeric, _id_emission_point numeric, _type_environment business."TYPE_ENVIRONMENT", _type_voucher business."TYPE_VOUCHER", _number_code_sequence character varying, _status_sequence boolean, _deleted_sequence boolean) OWNER TO postgres;

--
-- TOC entry 438 (class 1255 OID 26077)
-- Name: dml_sequence_update_modified(numeric, numeric, numeric, numeric, numeric, business."TYPE_ENVIRONMENT", business."TYPE_VOUCHER", character varying, boolean, boolean); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_sequence_update_modified(id_user_ numeric, _id_sequence numeric, _id_institution numeric, _id_establishment numeric, _id_emission_point numeric, _type_environment business."TYPE_ENVIRONMENT", _type_voucher business."TYPE_VOUCHER", _number_code_sequence character varying, _status_sequence boolean, _deleted_sequence boolean) RETURNS TABLE(value_sequence numeric, id_sequence numeric, id_institution numeric, id_establishment numeric, id_emission_point numeric, bvs_type_environment business."TYPE_ENVIRONMENT", bvs_type_voucher business."TYPE_VOUCHER", number_code_sequence character varying, status_sequence boolean, deleted_sequence boolean, id_taxpayer numeric, bvi_type_environment business."TYPE_ENVIRONMENT", name_institution character varying, description_institution character varying, address_institution character varying, status_institution boolean, value_establishment character varying, description_establishment character varying, value_emission_point character varying, description_emission_point character varying)
    LANGUAGE plpgsql
    AS $$
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
			
$$;


ALTER FUNCTION business.dml_sequence_update_modified(id_user_ numeric, _id_sequence numeric, _id_institution numeric, _id_establishment numeric, _id_emission_point numeric, _type_environment business."TYPE_ENVIRONMENT", _type_voucher business."TYPE_VOUCHER", _number_code_sequence character varying, _status_sequence boolean, _deleted_sequence boolean) OWNER TO postgres;

--
-- TOC entry 424 (class 1255 OID 26023)
-- Name: dml_setting_taxpayer_create(numeric, numeric, boolean, character varying, character varying, text, character varying, character varying); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_setting_taxpayer_create(id_user_ numeric, _id_mail_server numeric, _mailing_setting_taxpayer boolean, _from_setting_taxpayer character varying, _subject_setting_taxpayer character varying, _html_setting_taxpayer text, _download_note_setting_taxpayer character varying, _logo_path_setting_taxpayer character varying) RETURNS numeric
    LANGUAGE plpgsql
    AS $_$
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
			
$_$;


ALTER FUNCTION business.dml_setting_taxpayer_create(id_user_ numeric, _id_mail_server numeric, _mailing_setting_taxpayer boolean, _from_setting_taxpayer character varying, _subject_setting_taxpayer character varying, _html_setting_taxpayer text, _download_note_setting_taxpayer character varying, _logo_path_setting_taxpayer character varying) OWNER TO postgres;

--
-- TOC entry 412 (class 1255 OID 26025)
-- Name: dml_setting_taxpayer_delete(numeric, numeric); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_setting_taxpayer_delete(id_user_ numeric, _id_setting_taxpayer numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_DEPENDENCY NUMERIC;
				_RETURNING NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_COUNT = (select count(*) from business.view_setting_taxpayer t where t.id_setting_taxpayer = $2);
					
				IF (_COUNT = 1) THEN
					_COUNT_DEPENDENCY = (select * from core.utils_get_table_dependency('business','setting_taxpayer', $2));
						
					IF (_COUNT_DEPENDENCY > 0) THEN
						_EXCEPTION = 'No se puede eliminar el registro, mantiene dependencia en otros procesos.';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					ELSE
						FOR _X IN DELETE FROM business.setting_taxpayer WHERE id_setting_taxpayer = $2 RETURNING id_setting_taxpayer LOOP
							_RETURNING = _X.id_setting_taxpayer;
						END LOOP;
						IF (_RETURNING >= 1) THEN
							_SAVE_LOG = (select * from core.global_save_log());
							IF (_SAVE_LOG) THEN
								_RESPONSE = (core.dml_system_event_create($1,'setting_taxpayer',$2,'DELETE', now()::timestamp, false));
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
							_EXCEPTION = 'Ocurrió un error al eliminar el registro';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						END IF;
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
			 $_$;


ALTER FUNCTION business.dml_setting_taxpayer_delete(id_user_ numeric, _id_setting_taxpayer numeric) OWNER TO postgres;

--
-- TOC entry 428 (class 1255 OID 26067)
-- Name: dml_setting_taxpayer_remove_logo(numeric, numeric); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_setting_taxpayer_remove_logo(_id_user numeric, _id_setting_taxpayer numeric) RETURNS TABLE(status_remove_logo boolean, current_path character varying)
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION business.dml_setting_taxpayer_remove_logo(_id_user numeric, _id_setting_taxpayer numeric) OWNER TO postgres;

--
-- TOC entry 425 (class 1255 OID 26024)
-- Name: dml_setting_taxpayer_update(numeric, numeric, numeric, boolean, character varying, character varying, text, character varying, character varying); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_setting_taxpayer_update(id_user_ numeric, _id_setting_taxpayer numeric, _id_mail_server numeric, _mailing_setting_taxpayer boolean, _from_setting_taxpayer character varying, _subject_setting_taxpayer character varying, _html_setting_taxpayer text, _download_note_setting_taxpayer character varying, _logo_path_setting_taxpayer character varying) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
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
			 
$_$;


ALTER FUNCTION business.dml_setting_taxpayer_update(id_user_ numeric, _id_setting_taxpayer numeric, _id_mail_server numeric, _mailing_setting_taxpayer boolean, _from_setting_taxpayer character varying, _subject_setting_taxpayer character varying, _html_setting_taxpayer text, _download_note_setting_taxpayer character varying, _logo_path_setting_taxpayer character varying) OWNER TO postgres;

--
-- TOC entry 426 (class 1255 OID 26065)
-- Name: dml_setting_taxpayer_update_modified(numeric, numeric, numeric, boolean, character varying, character varying, text, character varying, character varying); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_setting_taxpayer_update_modified(id_user_ numeric, _id_setting_taxpayer numeric, _id_mail_server numeric, _mailing_setting_taxpayer boolean, _from_setting_taxpayer character varying, _subject_setting_taxpayer character varying, _html_setting_taxpayer text, _download_note_setting_taxpayer character varying, _logo_path_setting_taxpayer character varying) RETURNS TABLE(id_setting_taxpayer numeric, id_mail_server numeric, mailing_setting_taxpayer boolean, from_setting_taxpayer character varying, subject_setting_taxpayer character varying, html_setting_taxpayer text, download_note_setting_taxpayer character varying, logo_path_setting_taxpayer character varying)
    LANGUAGE plpgsql
    AS $$
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
			 
$$;


ALTER FUNCTION business.dml_setting_taxpayer_update_modified(id_user_ numeric, _id_setting_taxpayer numeric, _id_mail_server numeric, _mailing_setting_taxpayer boolean, _from_setting_taxpayer character varying, _subject_setting_taxpayer character varying, _html_setting_taxpayer text, _download_note_setting_taxpayer character varying, _logo_path_setting_taxpayer character varying) OWNER TO postgres;

--
-- TOC entry 427 (class 1255 OID 26066)
-- Name: dml_setting_taxpayer_upload_logo(numeric, numeric, character varying); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_setting_taxpayer_upload_logo(_id_user numeric, _id_setting_taxpayer numeric, _new_path character varying) RETURNS TABLE(status_upload_logo boolean, old_path character varying, new_path character varying)
    LANGUAGE plpgsql
    AS $$
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
			
$$;


ALTER FUNCTION business.dml_setting_taxpayer_upload_logo(_id_user numeric, _id_setting_taxpayer numeric, _new_path character varying) OWNER TO postgres;

--
-- TOC entry 421 (class 1255 OID 26062)
-- Name: dml_taxpayer_change_status_by_batch(numeric, numeric, boolean); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_taxpayer_change_status_by_batch(id_user_ numeric, _id_taxpayer numeric, _status_by_batch_taxpayer boolean) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
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
			 
$$;


ALTER FUNCTION business.dml_taxpayer_change_status_by_batch(id_user_ numeric, _id_taxpayer numeric, _status_by_batch_taxpayer boolean) OWNER TO postgres;

--
-- TOC entry 414 (class 1255 OID 26002)
-- Name: dml_taxpayer_create(numeric, numeric, numeric, numeric, business."TYPE_EMISSION", character varying, character varying, character varying, character varying, character varying, character varying, boolean, business."TYPE_ACCOUNTING_OBLIGED", boolean, boolean); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_taxpayer_create(id_user_ numeric, _id_company numeric, _id_user numeric, _id_setting_taxpayer numeric, _type_emission business."TYPE_EMISSION", _business_name_taxpayer character varying, _tradename_taxpayer character varying, _ruc_taxpayer character varying, _dir_matriz_taxpayer character varying, _signature_password_taxpayer character varying, _signature_path_taxpayer character varying, _status_taxpayer boolean, _accounting_obliged business."TYPE_ACCOUNTING_OBLIGED", _status_by_batch_taxpayer boolean, _deleted_taxpayer boolean) RETURNS numeric
    LANGUAGE plpgsql
    AS $_$
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
			
$_$;


ALTER FUNCTION business.dml_taxpayer_create(id_user_ numeric, _id_company numeric, _id_user numeric, _id_setting_taxpayer numeric, _type_emission business."TYPE_EMISSION", _business_name_taxpayer character varying, _tradename_taxpayer character varying, _ruc_taxpayer character varying, _dir_matriz_taxpayer character varying, _signature_password_taxpayer character varying, _signature_path_taxpayer character varying, _status_taxpayer boolean, _accounting_obliged business."TYPE_ACCOUNTING_OBLIGED", _status_by_batch_taxpayer boolean, _deleted_taxpayer boolean) OWNER TO postgres;

--
-- TOC entry 415 (class 1255 OID 26055)
-- Name: dml_taxpayer_create_modified(numeric); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_taxpayer_create_modified(id_user_ numeric) RETURNS TABLE(id_taxpayer numeric, id_company numeric, id_user numeric, id_setting_taxpayer numeric, type_emission business."TYPE_EMISSION", business_name_taxpayer character varying, tradename_taxpayer character varying, ruc_taxpayer character varying, dir_matriz_taxpayer character varying, signature_password_taxpayer character varying, signature_path_taxpayer character varying, status_taxpayer boolean, accounting_obliged business."TYPE_ACCOUNTING_OBLIGED", status_by_batch_taxpayer boolean, deleted_taxpayer boolean, id_setting numeric, name_company character varying, acronym_company character varying, address_company character varying, status_company boolean, id_person numeric, id_type_user numeric, name_user character varying, password_user character varying, avatar_user character varying, status_user boolean, id_academic numeric, id_job numeric, dni_person character varying, name_person character varying, last_name_person character varying, address_person character varying, phone_person character varying, title_academic character varying, abbreviation_academic character varying, nivel_academic character varying, name_job character varying, address_job character varying, phone_job character varying, position_job character varying, id_profile numeric, name_type_user character varying, description_type_user character varying, status_type_user boolean, id_mail_server numeric, mailing_setting_taxpayer boolean, from_setting_taxpayer character varying, subject_setting_taxpayer character varying, html_setting_taxpayer text, download_note_setting_taxpayer character varying, logo_path_setting_taxpayer character varying)
    LANGUAGE plpgsql
    AS $_$
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
			
$_$;


ALTER FUNCTION business.dml_taxpayer_create_modified(id_user_ numeric) OWNER TO postgres;

--
-- TOC entry 395 (class 1255 OID 26004)
-- Name: dml_taxpayer_delete(numeric, numeric); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_taxpayer_delete(id_user_ numeric, _id_taxpayer numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_DELETED NUMERIC;
				_COUNT_DEPENDENCY NUMERIC;
				_RETURNING NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_COUNT = (select count(*) from business.view_taxpayer t where t.id_taxpayer = $2);
					
				IF (_COUNT = 1) THEN
					_COUNT_DELETED = (select count(*) from business.view_taxpayer t where t.id_taxpayer = $2 and deleted_taxpayer = true); 
					IF (_COUNT_DELETED = 0) THEN 
						_COUNT_DEPENDENCY = (select * from core.utils_get_table_dependency('business','taxpayer', $2));
						
						IF (_COUNT_DEPENDENCY > 0) THEN
							_EXCEPTION = 'No se puede eliminar el registro, mantiene dependencia en otros procesos.';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						ELSE
							FOR _X IN UPDATE business.taxpayer SET deleted_taxpayer=true WHERE id_taxpayer = $2 RETURNING id_taxpayer LOOP
								_RETURNING = _X.id_taxpayer;
							END LOOP;
							IF (_RETURNING >= 1) THEN
								_SAVE_LOG = (select * from core.global_save_log());
								IF (_SAVE_LOG) THEN
									_RESPONSE = (core.dml_system_event_create($1,'taxpayer',$2,'DELETE', now()::timestamp, false));
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
								_EXCEPTION = 'Ocurrió un error al eliminar el registro';
								RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
							END IF;
						END IF;
					ELSE
						_EXCEPTION = 'EL registro ya se encuentra eliminado';
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
			 $_$;


ALTER FUNCTION business.dml_taxpayer_delete(id_user_ numeric, _id_taxpayer numeric) OWNER TO postgres;

--
-- TOC entry 418 (class 1255 OID 26059)
-- Name: dml_taxpayer_delete_modified(numeric, numeric); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_taxpayer_delete_modified(id_user_ numeric, _id_taxpayer numeric) RETURNS TABLE(avatar_user character varying, signature_path_taxpayer character varying, logo_path_setting_taxpayer character varying)
    LANGUAGE plpgsql
    AS $$
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
			 
$$;


ALTER FUNCTION business.dml_taxpayer_delete_modified(id_user_ numeric, _id_taxpayer numeric) OWNER TO postgres;

--
-- TOC entry 420 (class 1255 OID 26061)
-- Name: dml_taxpayer_remove_signature(numeric, numeric); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_taxpayer_remove_signature(_id_user numeric, _id_taxpayer numeric) RETURNS TABLE(status_remove_signature boolean, current_path character varying)
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION business.dml_taxpayer_remove_signature(_id_user numeric, _id_taxpayer numeric) OWNER TO postgres;

--
-- TOC entry 394 (class 1255 OID 26003)
-- Name: dml_taxpayer_update(numeric, numeric, numeric, numeric, numeric, business."TYPE_EMISSION", character varying, character varying, character varying, character varying, character varying, character varying, boolean, business."TYPE_ACCOUNTING_OBLIGED", boolean, boolean); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_taxpayer_update(id_user_ numeric, _id_taxpayer numeric, _id_company numeric, _id_user numeric, _id_setting_taxpayer numeric, _type_emission business."TYPE_EMISSION", _business_name_taxpayer character varying, _tradename_taxpayer character varying, _ruc_taxpayer character varying, _dir_matriz_taxpayer character varying, _signature_password_taxpayer character varying, _signature_path_taxpayer character varying, _status_taxpayer boolean, _accounting_obliged business."TYPE_ACCOUNTING_OBLIGED", _status_by_batch_taxpayer boolean, _deleted_taxpayer boolean) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_ATT NUMERIC;
				_COUNT_DELETED NUMERIC;
				_COUNT_EXTERNALS_IDS NUMERIC;
				_RETURNING NUMERIC;
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
			
				_COUNT = (select count(*) from business.view_taxpayer t where t.id_taxpayer = $2);
				
				IF (_COUNT = 1) THEN
					_COUNT_DELETED = (select count(*) from business.view_taxpayer t where t.id_taxpayer = $2 and deleted_taxpayer = true); 
					IF (_COUNT_DELETED = 0) THEN
						
						_COUNT_ATT = (select count(*) from business.view_taxpayer t where t.ruc_taxpayer = _ruc_taxpayer and t.id_taxpayer != _id_taxpayer);
						
						IF (_COUNT_ATT = 0) THEN 
							FOR _X IN UPDATE business.taxpayer SET id_company=$3, id_user=$4, id_setting_taxpayer=$5, type_emission=$6, business_name_taxpayer=$7, tradename_taxpayer=$8, ruc_taxpayer=$9, dir_matriz_taxpayer=$10, signature_password_taxpayer=$11, signature_path_taxpayer=$12, status_taxpayer=$13, accounting_obliged=$14, status_by_batch_taxpayer=$15, deleted_taxpayer=$16 WHERE id_taxpayer=$2 RETURNING id_taxpayer LOOP
								_RETURNING = _X.id_taxpayer;
							END LOOP;

							IF (_RETURNING >= 1) THEN
								_SAVE_LOG = (select * from core.global_save_log());
								IF (_SAVE_LOG) THEN
									_RESPONSE = (core.dml_system_event_create($1,'taxpayer',$2,'UPDATE', now()::timestamp, false));
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
							_EXCEPTION = 'Ya existe un registro con el ruc_taxpayer '||_ruc_taxpayer||'';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						END IF;
					ELSE 
						_EXCEPTION = 'EL registro se encuentra eliminado';
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
			 $_$;


ALTER FUNCTION business.dml_taxpayer_update(id_user_ numeric, _id_taxpayer numeric, _id_company numeric, _id_user numeric, _id_setting_taxpayer numeric, _type_emission business."TYPE_EMISSION", _business_name_taxpayer character varying, _tradename_taxpayer character varying, _ruc_taxpayer character varying, _dir_matriz_taxpayer character varying, _signature_password_taxpayer character varying, _signature_path_taxpayer character varying, _status_taxpayer boolean, _accounting_obliged business."TYPE_ACCOUNTING_OBLIGED", _status_by_batch_taxpayer boolean, _deleted_taxpayer boolean) OWNER TO postgres;

--
-- TOC entry 417 (class 1255 OID 26057)
-- Name: dml_taxpayer_update_modified(numeric, numeric, numeric, numeric, numeric, business."TYPE_EMISSION", character varying, character varying, character varying, character varying, character varying, character varying, boolean, business."TYPE_ACCOUNTING_OBLIGED", boolean, boolean, numeric, numeric, character varying, character varying, character varying, boolean, numeric, numeric, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_taxpayer_update_modified(id_user_ numeric, _id_taxpayer numeric, _id_company numeric, _id_user numeric, _id_setting_taxpayer numeric, _type_emission business."TYPE_EMISSION", _business_name_taxpayer character varying, _tradename_taxpayer character varying, _ruc_taxpayer character varying, _dir_matriz_taxpayer character varying, _signature_password_taxpayer character varying, _signature_path_taxpayer character varying, _status_taxpayer boolean, _accounting_obliged business."TYPE_ACCOUNTING_OBLIGED", _status_by_batch_taxpayer boolean, _deleted_taxpayer boolean, _id_person numeric, _id_type_user numeric, _name_user character varying, _password_user character varying, _avatar_user character varying, _status_user boolean, _id_academic numeric, _id_job numeric, _dni_person character varying, _name_person character varying, _last_name_person character varying, _address_person character varying, _phone_person character varying, _title_academic character varying, _abbreviation_academic character varying, _nivel_academic character varying, _name_job character varying, _address_job character varying, _phone_job character varying, _position_job character varying) RETURNS TABLE(id_taxpayer numeric, id_company numeric, id_user numeric, id_setting_taxpayer numeric, type_emission business."TYPE_EMISSION", business_name_taxpayer character varying, tradename_taxpayer character varying, ruc_taxpayer character varying, dir_matriz_taxpayer character varying, signature_password_taxpayer character varying, signature_path_taxpayer character varying, status_taxpayer boolean, accounting_obliged business."TYPE_ACCOUNTING_OBLIGED", status_by_batch_taxpayer boolean, deleted_taxpayer boolean, id_setting numeric, name_company character varying, acronym_company character varying, address_company character varying, status_company boolean, id_person numeric, id_type_user numeric, name_user character varying, password_user character varying, avatar_user character varying, status_user boolean, id_academic numeric, id_job numeric, dni_person character varying, name_person character varying, last_name_person character varying, address_person character varying, phone_person character varying, title_academic character varying, abbreviation_academic character varying, nivel_academic character varying, name_job character varying, address_job character varying, phone_job character varying, position_job character varying, id_profile numeric, name_type_user character varying, description_type_user character varying, status_type_user boolean, id_mail_server numeric, mailing_setting_taxpayer boolean, from_setting_taxpayer character varying, subject_setting_taxpayer character varying, html_setting_taxpayer text, download_note_setting_taxpayer character varying, logo_path_setting_taxpayer character varying)
    LANGUAGE plpgsql
    AS $$
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
			 
$$;


ALTER FUNCTION business.dml_taxpayer_update_modified(id_user_ numeric, _id_taxpayer numeric, _id_company numeric, _id_user numeric, _id_setting_taxpayer numeric, _type_emission business."TYPE_EMISSION", _business_name_taxpayer character varying, _tradename_taxpayer character varying, _ruc_taxpayer character varying, _dir_matriz_taxpayer character varying, _signature_password_taxpayer character varying, _signature_path_taxpayer character varying, _status_taxpayer boolean, _accounting_obliged business."TYPE_ACCOUNTING_OBLIGED", _status_by_batch_taxpayer boolean, _deleted_taxpayer boolean, _id_person numeric, _id_type_user numeric, _name_user character varying, _password_user character varying, _avatar_user character varying, _status_user boolean, _id_academic numeric, _id_job numeric, _dni_person character varying, _name_person character varying, _last_name_person character varying, _address_person character varying, _phone_person character varying, _title_academic character varying, _abbreviation_academic character varying, _nivel_academic character varying, _name_job character varying, _address_job character varying, _phone_job character varying, _position_job character varying) OWNER TO postgres;

--
-- TOC entry 419 (class 1255 OID 26060)
-- Name: dml_taxpayer_upload_signature(numeric, numeric, character varying); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_taxpayer_upload_signature(_id_user numeric, _id_taxpayer numeric, _new_path character varying) RETURNS TABLE(status_upload_signature boolean, old_path character varying, new_path character varying)
    LANGUAGE plpgsql
    AS $$
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
			
$$;


ALTER FUNCTION business.dml_taxpayer_upload_signature(_id_user numeric, _id_taxpayer numeric, _new_path character varying) OWNER TO postgres;

--
-- TOC entry 445 (class 1255 OID 26088)
-- Name: dml_voucher_by_batch_by_institution(numeric, numeric, business."TYPE_VOUCHER", character varying); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_voucher_by_batch_by_institution(id_user_ numeric, _id_institution numeric, _type_voucher business."TYPE_VOUCHER", _emission_date_voucher character varying) RETURNS TABLE(id_sequence numeric, id_institution numeric, id_establishment numeric, id_emission_point numeric, bvs_type_environment business."TYPE_ENVIRONMENT", bvs_type_voucher business."TYPE_VOUCHER", number_code_sequence character varying, deleted_sequence boolean, value_establishment character varying, description_establishment character varying, value_emission_point character varying, description_emission_point character varying, id_taxpayer numeric, bvi_type_environment business."TYPE_ENVIRONMENT", name_institution character varying, description_institution character varying, address_institution character varying, status_institution boolean, bvv_type_voucher business."TYPE_VOUCHER", access_key_voucher character varying, body_voucher json, id_company numeric, id_user numeric, id_setting_taxpayer numeric, type_emission business."TYPE_EMISSION", business_name_taxpayer character varying, tradename_taxpayer character varying, ruc_taxpayer character varying, dir_matriz_taxpayer character varying, signature_password_taxpayer character varying, signature_path_taxpayer character varying, status_taxpayer boolean, accounting_obliged business."TYPE_ACCOUNTING_OBLIGED", id_mail_server numeric, mailing_setting_taxpayer boolean, from_setting_taxpayer character varying, subject_setting_taxpayer character varying, html_setting_taxpayer text, download_note_setting_taxpayer character varying, logo_path_setting_taxpayer character varying, save_alfresco boolean, wait_autorization numeric, batch_shipping boolean, max_generation_pdf numeric, wait_generation_pdf numeric)
    LANGUAGE plpgsql
    AS $$
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
			
$$;


ALTER FUNCTION business.dml_voucher_by_batch_by_institution(id_user_ numeric, _id_institution numeric, _type_voucher business."TYPE_VOUCHER", _emission_date_voucher character varying) OWNER TO postgres;

--
-- TOC entry 446 (class 1255 OID 26090)
-- Name: dml_voucher_by_batch_by_taxpayer(numeric, numeric, business."TYPE_VOUCHER", character varying); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_voucher_by_batch_by_taxpayer(id_user_ numeric, _id_taxpayer numeric, _type_voucher business."TYPE_VOUCHER", _emission_date_voucher character varying) RETURNS TABLE(id_sequence numeric, id_institution numeric, id_establishment numeric, id_emission_point numeric, bvs_type_environment business."TYPE_ENVIRONMENT", bvs_type_voucher business."TYPE_VOUCHER", number_code_sequence character varying, deleted_sequence boolean, value_establishment character varying, description_establishment character varying, value_emission_point character varying, description_emission_point character varying, id_taxpayer numeric, bvi_type_environment business."TYPE_ENVIRONMENT", name_institution character varying, description_institution character varying, address_institution character varying, status_institution boolean, bvv_type_voucher business."TYPE_VOUCHER", access_key_voucher character varying, body_voucher json, id_company numeric, id_user numeric, id_setting_taxpayer numeric, type_emission business."TYPE_EMISSION", business_name_taxpayer character varying, tradename_taxpayer character varying, ruc_taxpayer character varying, dir_matriz_taxpayer character varying, signature_password_taxpayer character varying, signature_path_taxpayer character varying, status_taxpayer boolean, accounting_obliged business."TYPE_ACCOUNTING_OBLIGED", id_mail_server numeric, mailing_setting_taxpayer boolean, from_setting_taxpayer character varying, subject_setting_taxpayer character varying, html_setting_taxpayer text, download_note_setting_taxpayer character varying, logo_path_setting_taxpayer character varying, save_alfresco boolean, wait_autorization numeric, batch_shipping boolean, max_generation_pdf numeric, wait_generation_pdf numeric)
    LANGUAGE plpgsql
    AS $$
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
			
$$;


ALTER FUNCTION business.dml_voucher_by_batch_by_taxpayer(id_user_ numeric, _id_taxpayer numeric, _type_voucher business."TYPE_VOUCHER", _emission_date_voucher character varying) OWNER TO postgres;

--
-- TOC entry 442 (class 1255 OID 26084)
-- Name: dml_voucher_cancel(numeric, numeric, character varying); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_voucher_cancel(id_user_ numeric, _id_institution numeric, _access_key_voucher character varying) RETURNS TABLE(id_voucher numeric, id_institution numeric, bvv_type_environment business."TYPE_ENVIRONMENT", type_emission business."TYPE_EMISSION", type_voucher business."TYPE_VOUCHER", number_voucher character varying, access_key_voucher character varying, emission_date_voucher timestamp without time zone, authorization_date_voucher timestamp without time zone, buyer_identifier_voucher character varying, body_voucher json, internal_status_voucher business."TYPE_VOUCHER_STATUS", global_status_voucher business."TYPE_VOUCHER_STATUS", action_pdf_voucher boolean, action_email_voucher boolean, action_alfresco_voucher boolean, messages_voucher json, deleted_voucher boolean, id_taxpayer numeric, bvi_type_environment business."TYPE_ENVIRONMENT", name_institution character varying, description_institution character varying, address_institution character varying, status_institution boolean)
    LANGUAGE plpgsql
    AS $$
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
			 
$$;


ALTER FUNCTION business.dml_voucher_cancel(id_user_ numeric, _id_institution numeric, _access_key_voucher character varying) OWNER TO postgres;

--
-- TOC entry 447 (class 1255 OID 26092)
-- Name: dml_voucher_complete_process(numeric, numeric, character varying, business."TYPE_VOUCHER"); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_voucher_complete_process(id_user_ numeric, _id_institution numeric, _access_key_voucher character varying, _type_voucher business."TYPE_VOUCHER") RETURNS TABLE(id_sequence numeric, id_institution numeric, id_establishment numeric, id_emission_point numeric, bvs_type_environment business."TYPE_ENVIRONMENT", bvs_type_voucher business."TYPE_VOUCHER", number_code_sequence character varying, deleted_sequence boolean, value_establishment character varying, description_establishment character varying, value_emission_point character varying, description_emission_point character varying, id_taxpayer numeric, bvi_type_environment business."TYPE_ENVIRONMENT", name_institution character varying, description_institution character varying, address_institution character varying, status_institution boolean, bvv_type_voucher business."TYPE_VOUCHER", access_key_voucher character varying, body_voucher json, id_company numeric, id_user numeric, id_setting_taxpayer numeric, type_emission business."TYPE_EMISSION", business_name_taxpayer character varying, tradename_taxpayer character varying, ruc_taxpayer character varying, dir_matriz_taxpayer character varying, signature_password_taxpayer character varying, signature_path_taxpayer character varying, status_taxpayer boolean, accounting_obliged business."TYPE_ACCOUNTING_OBLIGED", id_mail_server numeric, mailing_setting_taxpayer boolean, from_setting_taxpayer character varying, subject_setting_taxpayer character varying, html_setting_taxpayer text, download_note_setting_taxpayer character varying, logo_path_setting_taxpayer character varying, save_alfresco boolean, wait_autorization numeric)
    LANGUAGE plpgsql
    AS $$
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
			
$$;


ALTER FUNCTION business.dml_voucher_complete_process(id_user_ numeric, _id_institution numeric, _access_key_voucher character varying, _type_voucher business."TYPE_VOUCHER") OWNER TO postgres;

--
-- TOC entry 452 (class 1255 OID 26020)
-- Name: dml_voucher_create(numeric, numeric, business."TYPE_ENVIRONMENT", business."TYPE_EMISSION", business."TYPE_VOUCHER", character varying, character varying, timestamp without time zone, timestamp without time zone, character varying, json, business."TYPE_VOUCHER_STATUS", business."TYPE_VOUCHER_STATUS", boolean, boolean, boolean, json, boolean); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_voucher_create(id_user_ numeric, _id_institution numeric, _type_environment business."TYPE_ENVIRONMENT", _type_emission business."TYPE_EMISSION", _type_voucher business."TYPE_VOUCHER", _number_voucher character varying, _access_key_voucher character varying, _emission_date_voucher timestamp without time zone, _authorization_date_voucher timestamp without time zone, _buyer_identifier_voucher character varying, _body_voucher json, _internal_status_voucher business."TYPE_VOUCHER_STATUS", _global_status_voucher business."TYPE_VOUCHER_STATUS", _action_pdf_voucher boolean, _action_email_voucher boolean, _action_alfresco_voucher boolean, _messages_voucher json, _deleted_voucher boolean) RETURNS numeric
    LANGUAGE plpgsql
    AS $_$
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
			
$_$;


ALTER FUNCTION business.dml_voucher_create(id_user_ numeric, _id_institution numeric, _type_environment business."TYPE_ENVIRONMENT", _type_emission business."TYPE_EMISSION", _type_voucher business."TYPE_VOUCHER", _number_voucher character varying, _access_key_voucher character varying, _emission_date_voucher timestamp without time zone, _authorization_date_voucher timestamp without time zone, _buyer_identifier_voucher character varying, _body_voucher json, _internal_status_voucher business."TYPE_VOUCHER_STATUS", _global_status_voucher business."TYPE_VOUCHER_STATUS", _action_pdf_voucher boolean, _action_email_voucher boolean, _action_alfresco_voucher boolean, _messages_voucher json, _deleted_voucher boolean) OWNER TO postgres;

--
-- TOC entry 439 (class 1255 OID 26081)
-- Name: dml_voucher_create_modified(numeric, numeric, business."TYPE_VOUCHER", character varying, character varying, character varying, json, business."TYPE_VOUCHER_STATUS", business."TYPE_VOUCHER_STATUS"); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE OR REPLACE FUNCTION business.dml_voucher_create_modified(
	id_user_ numeric,
	_id_institution numeric,
	_type_voucher business."TYPE_VOUCHER",
	_number_voucher character varying,
	_emission_date_voucher timestamp without time zone,
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

				_ID_VOUCHER = (select * from business.dml_voucher_create(id_user_, _id_institution, _TYPE_ENVIRONMENT, _TYPE_EMISSION, _type_voucher, NUMBER_VOUCHER_, _access_key_voucher, _emission_date_voucher, null, _buyer_identifier_voucher, _body_voucher,  _internal_status_voucher, _global_status_voucher, false, false, false, '[]', false));

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

ALTER FUNCTION business.dml_voucher_create_modified(numeric, numeric, business."TYPE_VOUCHER", character varying, timestamp without time zone, character varying, character varying, json, business."TYPE_VOUCHER_STATUS", business."TYPE_VOUCHER_STATUS")
    OWNER TO postgres;
--
-- TOC entry 411 (class 1255 OID 26022)
-- Name: dml_voucher_delete(numeric, numeric); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_voucher_delete(id_user_ numeric, _id_voucher numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_DELETED NUMERIC;
				_COUNT_DEPENDENCY NUMERIC;
				_RETURNING NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_COUNT = (select count(*) from business.view_voucher t where t.id_voucher = $2);
					
				IF (_COUNT = 1) THEN
					_COUNT_DELETED = (select count(*) from business.view_voucher t where t.id_voucher = $2 and deleted_voucher = true); 
					IF (_COUNT_DELETED = 0) THEN 
						_COUNT_DEPENDENCY = (select * from core.utils_get_table_dependency('business','voucher', $2));
						
						IF (_COUNT_DEPENDENCY > 0) THEN
							_EXCEPTION = 'No se puede eliminar el registro, mantiene dependencia en otros procesos.';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						ELSE
							FOR _X IN UPDATE business.voucher SET deleted_voucher=true WHERE id_voucher = $2 RETURNING id_voucher LOOP
								_RETURNING = _X.id_voucher;
							END LOOP;
							IF (_RETURNING >= 1) THEN
								_SAVE_LOG = (select * from core.global_save_log());
								IF (_SAVE_LOG) THEN
									_RESPONSE = (core.dml_system_event_create($1,'voucher',$2,'DELETE', now()::timestamp, false));
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
								_EXCEPTION = 'Ocurrió un error al eliminar el registro';
								RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
							END IF;
						END IF;
					ELSE
						_EXCEPTION = 'EL registro ya se encuentra eliminado';
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
			 $_$;


ALTER FUNCTION business.dml_voucher_delete(id_user_ numeric, _id_voucher numeric) OWNER TO postgres;

--
-- TOC entry 448 (class 1255 OID 26094)
-- Name: dml_voucher_download(numeric, character varying); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_voucher_download(_id_institution numeric, _access_key_voucher character varying) RETURNS TABLE(id_voucher numeric, id_institution numeric, bvv_type_environment business."TYPE_ENVIRONMENT", bvv_type_emission business."TYPE_EMISSION", type_voucher business."TYPE_VOUCHER", number_voucher character varying, access_key_voucher character varying, emission_date_voucher timestamp without time zone, authorization_date_voucher timestamp without time zone, buyer_identifier_voucher character varying, body_voucher json, internal_status_voucher business."TYPE_VOUCHER_STATUS", global_status_voucher business."TYPE_VOUCHER_STATUS", action_pdf_voucher boolean, action_email_voucher boolean, action_alfresco_voucher boolean, messages_voucher json, deleted_voucher boolean, id_taxpayer numeric, bvi_type_environment business."TYPE_ENVIRONMENT", name_institution character varying, description_institution character varying, address_institution character varying, status_institution boolean)
    LANGUAGE plpgsql
    AS $$
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
			 
$$;


ALTER FUNCTION business.dml_voucher_download(_id_institution numeric, _access_key_voucher character varying) OWNER TO postgres;

--
-- TOC entry 450 (class 1255 OID 26079)
-- Name: dml_voucher_reception(numeric, numeric, business."TYPE_VOUCHER", character varying, boolean); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_voucher_reception(id_user_ numeric, _id_institution numeric, _type_voucher business."TYPE_VOUCHER", _access_key_voucher character varying, _istosolve boolean) RETURNS TABLE(id_voucher numeric, number_voucher numeric, emission_date_voucher character varying, sequence numeric, id_sequence numeric, id_institution numeric, id_establishment numeric, id_emission_point numeric, bvs_type_environment business."TYPE_ENVIRONMENT", bvs_type_voucher business."TYPE_VOUCHER", number_code_sequence character varying, deleted_sequence boolean, value_establishment character varying, description_establishment character varying, value_emission_point character varying, description_emission_point character varying, id_taxpayer numeric, bvi_type_environment business."TYPE_ENVIRONMENT", name_institution character varying, description_institution character varying, address_institution character varying, status_institution boolean, id_company numeric, id_user numeric, id_setting_taxpayer numeric, type_emission business."TYPE_EMISSION", business_name_taxpayer character varying, tradename_taxpayer character varying, ruc_taxpayer character varying, dir_matriz_taxpayer character varying, signature_password_taxpayer character varying, signature_path_taxpayer character varying, status_taxpayer boolean, accounting_obliged business."TYPE_ACCOUNTING_OBLIGED", id_mail_server numeric, mailing_setting_taxpayer boolean, from_setting_taxpayer character varying, subject_setting_taxpayer character varying, html_setting_taxpayer text, download_note_setting_taxpayer character varying, logo_path_setting_taxpayer character varying, save_alfresco boolean, wait_autorization numeric)
    LANGUAGE plpgsql
    AS $$
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
			
$$;


ALTER FUNCTION business.dml_voucher_reception(id_user_ numeric, _id_institution numeric, _type_voucher business."TYPE_VOUCHER", _access_key_voucher character varying, _istosolve boolean) OWNER TO postgres;

--
-- TOC entry 444 (class 1255 OID 26086)
-- Name: dml_voucher_reception_instantly(numeric, numeric, character varying, business."TYPE_VOUCHER"); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_voucher_reception_instantly(id_user_ numeric, _id_institution numeric, _access_key_voucher character varying, _type_voucher business."TYPE_VOUCHER") RETURNS TABLE(id_sequence numeric, id_institution numeric, id_establishment numeric, id_emission_point numeric, bvs_type_environment business."TYPE_ENVIRONMENT", bvs_type_voucher business."TYPE_VOUCHER", number_code_sequence character varying, deleted_sequence boolean, value_establishment character varying, description_establishment character varying, value_emission_point character varying, description_emission_point character varying, id_taxpayer numeric, bvi_type_environment business."TYPE_ENVIRONMENT", name_institution character varying, description_institution character varying, address_institution character varying, status_institution boolean, bvv_type_voucher business."TYPE_VOUCHER", access_key_voucher character varying, body_voucher json, id_company numeric, id_user numeric, id_setting_taxpayer numeric, type_emission business."TYPE_EMISSION", business_name_taxpayer character varying, tradename_taxpayer character varying, ruc_taxpayer character varying, dir_matriz_taxpayer character varying, signature_password_taxpayer character varying, signature_path_taxpayer character varying, status_taxpayer boolean, accounting_obliged business."TYPE_ACCOUNTING_OBLIGED", id_mail_server numeric, mailing_setting_taxpayer boolean, from_setting_taxpayer character varying, subject_setting_taxpayer character varying, html_setting_taxpayer text, download_note_setting_taxpayer character varying, logo_path_setting_taxpayer character varying, save_alfresco boolean, wait_autorization numeric)
    LANGUAGE plpgsql
    AS $$
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
			
$$;


ALTER FUNCTION business.dml_voucher_reception_instantly(id_user_ numeric, _id_institution numeric, _access_key_voucher character varying, _type_voucher business."TYPE_VOUCHER") OWNER TO postgres;

--
-- TOC entry 443 (class 1255 OID 26085)
-- Name: dml_voucher_reverse_cancel(numeric, numeric, character varying); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_voucher_reverse_cancel(id_user_ numeric, _id_institution numeric, _access_key_voucher character varying) RETURNS TABLE(id_voucher numeric, id_institution numeric, bvv_type_environment business."TYPE_ENVIRONMENT", type_emission business."TYPE_EMISSION", type_voucher business."TYPE_VOUCHER", number_voucher character varying, access_key_voucher character varying, emission_date_voucher timestamp without time zone, authorization_date_voucher timestamp without time zone, buyer_identifier_voucher character varying, body_voucher json, internal_status_voucher business."TYPE_VOUCHER_STATUS", global_status_voucher business."TYPE_VOUCHER_STATUS", action_pdf_voucher boolean, action_email_voucher boolean, action_alfresco_voucher boolean, messages_voucher json, deleted_voucher boolean, id_taxpayer numeric, bvi_type_environment business."TYPE_ENVIRONMENT", name_institution character varying, description_institution character varying, address_institution character varying, status_institution boolean)
    LANGUAGE plpgsql
    AS $$
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
			 
$$;


ALTER FUNCTION business.dml_voucher_reverse_cancel(id_user_ numeric, _id_institution numeric, _access_key_voucher character varying) OWNER TO postgres;

--
-- TOC entry 410 (class 1255 OID 26021)
-- Name: dml_voucher_update(numeric, numeric, numeric, business."TYPE_ENVIRONMENT", business."TYPE_EMISSION", business."TYPE_VOUCHER", character varying, character varying, timestamp without time zone, timestamp without time zone, character varying, json, business."TYPE_VOUCHER_STATUS", business."TYPE_VOUCHER_STATUS", boolean, boolean, boolean, json, boolean); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_voucher_update(id_user_ numeric, _id_voucher numeric, _id_institution numeric, _type_environment business."TYPE_ENVIRONMENT", _type_emission business."TYPE_EMISSION", _type_voucher business."TYPE_VOUCHER", _number_voucher character varying, _access_key_voucher character varying, _emission_date_voucher timestamp without time zone, _authorization_date_voucher timestamp without time zone, _buyer_identifier_voucher character varying, _body_voucher json, _internal_status_voucher business."TYPE_VOUCHER_STATUS", _global_status_voucher business."TYPE_VOUCHER_STATUS", _action_pdf_voucher boolean, _action_email_voucher boolean, _action_alfresco_voucher boolean, _messages_voucher json, _deleted_voucher boolean) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_ATT NUMERIC;
				_COUNT_DELETED NUMERIC;
				_COUNT_EXTERNALS_IDS NUMERIC;
				_RETURNING NUMERIC;
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
			
				_COUNT = (select count(*) from business.view_voucher t where t.id_voucher = $2);
				
				IF (_COUNT = 1) THEN
					_COUNT_DELETED = (select count(*) from business.view_voucher t where t.id_voucher = $2 and deleted_voucher = true); 
					IF (_COUNT_DELETED = 0) THEN
						
						_COUNT_ATT = (select count(*) from business.view_voucher t where t.access_key_voucher = _access_key_voucher and t.id_voucher != _id_voucher);
						
						IF (_COUNT_ATT = 0) THEN 
							FOR _X IN UPDATE business.voucher SET id_institution=$3, type_environment=$4, type_emission=$5, type_voucher=$6, number_voucher=$7, access_key_voucher=$8, emission_date_voucher=$9, authorization_date_voucher=$10, buyer_identifier_voucher=$11, body_voucher=$12, internal_status_voucher=$13, global_status_voucher=$14, action_pdf_voucher=$15, action_email_voucher=$16, action_alfresco_voucher=$17, messages_voucher=$18, deleted_voucher=$19 WHERE id_voucher=$2 RETURNING id_voucher LOOP
								_RETURNING = _X.id_voucher;
							END LOOP;

							IF (_RETURNING >= 1) THEN
								_SAVE_LOG = (select * from core.global_save_log());
								IF (_SAVE_LOG) THEN
									_RESPONSE = (core.dml_system_event_create($1,'voucher',$2,'UPDATE', now()::timestamp, false));
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
							_EXCEPTION = 'Ya existe un registro con el access_key_voucher '||_access_key_voucher||'';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						END IF;
					ELSE 
						_EXCEPTION = 'EL registro se encuentra eliminado';
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
			 $_$;


ALTER FUNCTION business.dml_voucher_update(id_user_ numeric, _id_voucher numeric, _id_institution numeric, _type_environment business."TYPE_ENVIRONMENT", _type_emission business."TYPE_EMISSION", _type_voucher business."TYPE_VOUCHER", _number_voucher character varying, _access_key_voucher character varying, _emission_date_voucher timestamp without time zone, _authorization_date_voucher timestamp without time zone, _buyer_identifier_voucher character varying, _body_voucher json, _internal_status_voucher business."TYPE_VOUCHER_STATUS", _global_status_voucher business."TYPE_VOUCHER_STATUS", _action_pdf_voucher boolean, _action_email_voucher boolean, _action_alfresco_voucher boolean, _messages_voucher json, _deleted_voucher boolean) OWNER TO postgres;

--
-- TOC entry 440 (class 1255 OID 26082)
-- Name: dml_voucher_update_modified(numeric, numeric, numeric, business."TYPE_ENVIRONMENT", business."TYPE_EMISSION", business."TYPE_VOUCHER", character varying, character varying, timestamp without time zone, timestamp without time zone, character varying, json, business."TYPE_VOUCHER_STATUS", business."TYPE_VOUCHER_STATUS", boolean, boolean, boolean, json, boolean); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_voucher_update_modified(id_user_ numeric, _id_voucher numeric, _id_institution numeric, _type_environment business."TYPE_ENVIRONMENT", _type_emission business."TYPE_EMISSION", _type_voucher business."TYPE_VOUCHER", _number_voucher character varying, _access_key_voucher character varying, _emission_date_voucher timestamp without time zone, _authorization_date_voucher timestamp without time zone, _buyer_identifier_voucher character varying, _body_voucher json, _internal_status_voucher business."TYPE_VOUCHER_STATUS", _global_status_voucher business."TYPE_VOUCHER_STATUS", _action_pdf_voucher boolean, _action_email_voucher boolean, _action_alfresco_voucher boolean, _messages_voucher json, _deleted_voucher boolean) RETURNS TABLE(id_voucher numeric, id_institution numeric, bvv_type_environment business."TYPE_ENVIRONMENT", bvv_type_emission business."TYPE_EMISSION", type_voucher business."TYPE_VOUCHER", number_voucher character varying, access_key_voucher character varying, emission_date_voucher timestamp without time zone, authorization_date_voucher timestamp without time zone, buyer_identifier_voucher character varying, body_voucher json, internal_status_voucher business."TYPE_VOUCHER_STATUS", global_status_voucher business."TYPE_VOUCHER_STATUS", action_pdf_voucher boolean, action_email_voucher boolean, action_alfresco_voucher boolean, messages_voucher json, deleted_voucher boolean, id_taxpayer numeric, bvi_type_environment business."TYPE_ENVIRONMENT", name_institution character varying, description_institution character varying, address_institution character varying, status_institution boolean)
    LANGUAGE plpgsql
    AS $$
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
			 
$$;


ALTER FUNCTION business.dml_voucher_update_modified(id_user_ numeric, _id_voucher numeric, _id_institution numeric, _type_environment business."TYPE_ENVIRONMENT", _type_emission business."TYPE_EMISSION", _type_voucher business."TYPE_VOUCHER", _number_voucher character varying, _access_key_voucher character varying, _emission_date_voucher timestamp without time zone, _authorization_date_voucher timestamp without time zone, _buyer_identifier_voucher character varying, _body_voucher json, _internal_status_voucher business."TYPE_VOUCHER_STATUS", _global_status_voucher business."TYPE_VOUCHER_STATUS", _action_pdf_voucher boolean, _action_email_voucher boolean, _action_alfresco_voucher boolean, _messages_voucher json, _deleted_voucher boolean) OWNER TO postgres;

--
-- TOC entry 441 (class 1255 OID 26083)
-- Name: dml_voucher_validation(numeric, numeric, character varying, business."TYPE_VOUCHER"); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.dml_voucher_validation(id_user_ numeric, _id_institution numeric, _access_key_voucher character varying, _type_voucher business."TYPE_VOUCHER") RETURNS TABLE(id_voucher numeric, id_institution numeric, bvv_type_environment business."TYPE_ENVIRONMENT", bvv_type_emission business."TYPE_EMISSION", type_voucher business."TYPE_VOUCHER", number_voucher character varying, access_key_voucher character varying, emission_date_voucher timestamp without time zone, authorization_date_voucher timestamp without time zone, buyer_identifier_voucher character varying, body_voucher json, internal_status_voucher business."TYPE_VOUCHER_STATUS", global_status_voucher business."TYPE_VOUCHER_STATUS", action_pdf_voucher boolean, action_email_voucher boolean, action_alfresco_voucher boolean, messages_voucher json, deleted_voucher boolean, id_taxpayer numeric, bvi_type_environment business."TYPE_ENVIRONMENT", name_institution character varying, description_institution character varying, address_institution character varying, status_institution boolean)
    LANGUAGE plpgsql
    AS $$
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
			
$$;


ALTER FUNCTION business.dml_voucher_validation(id_user_ numeric, _id_institution numeric, _access_key_voucher character varying, _type_voucher business."TYPE_VOUCHER") OWNER TO postgres;

--
-- TOC entry 413 (class 1255 OID 26052)
-- Name: validation_institution_overview(numeric, business."TYPE_VOUCHER"); Type: FUNCTION; Schema: business; Owner: postgres
--

CREATE FUNCTION business.validation_institution_overview(_id_institution numeric, _type_voucher business."TYPE_VOUCHER") RETURNS boolean
    LANGUAGE plpgsql
    AS $$
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
			 
$$;


ALTER FUNCTION business.validation_institution_overview(_id_institution numeric, _type_voucher business."TYPE_VOUCHER") OWNER TO postgres;

--
-- TOC entry 332 (class 1255 OID 25736)
-- Name: auth_check_session(numeric, json); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.auth_check_session(_id_session numeric, _agent_session json) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION core.auth_check_session(_id_session numeric, _agent_session json) OWNER TO postgres;

--
-- TOC entry 330 (class 1255 OID 25733)
-- Name: auth_check_user(character varying); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.auth_check_user(_name_user character varying) RETURNS TABLE(status_check_user boolean, _expiration_verification_code numeric)
    LANGUAGE plpgsql
    AS $$
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
-- select * from core.auth_check_user('david.freire@gmail.com')
$$;


ALTER FUNCTION core.auth_check_user(_name_user character varying) OWNER TO postgres;

--
-- TOC entry 451 (class 1255 OID 25734)
-- Name: auth_reset_password(character varying, character varying); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.auth_reset_password(_name_user character varying, _new_password character varying) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
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
-- select * from core.auth_reset_password('david.freire@gmail.com', 'nuevacontraseña')
$$;


ALTER FUNCTION core.auth_reset_password(_name_user character varying, _new_password character varying) OWNER TO postgres;

--
-- TOC entry 329 (class 1255 OID 25731)
-- Name: auth_sign_in(character varying, character varying, character varying, json); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.auth_sign_in(_name_user character varying, _password_user character varying, _host_session character varying, _agent_session json) RETURNS TABLE(status_sign_in boolean, id_session numeric, id_user numeric, id_company numeric, id_person numeric, id_type_user numeric, name_user character varying, avatar_user character varying, status_user boolean, id_setting numeric, name_company character varying, status_company boolean, expiration_token numeric, inactivity_time numeric, dni_person character varying, name_person character varying, last_name_person character varying, address_person character varying, phone_person character varying, id_profile numeric, name_type_user character varying, description_type_user character varying, status_type_user boolean, type_profile core."TYPE_PROFILE", name_profile character varying, description_profile character varying, status_profile boolean, navigation json)
    LANGUAGE plpgsql
    AS $$
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
	_SESSION_COUNT = (select count(*) from core.view_session vs inner join core.view_user vu on vs.id_user = vu.id_user where vu.name_user = 'david.freire@gmail.com' and vs.status_session = true);
	
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
	-- select * from  core.auth_sign_in('david.freire@gmail.com', 'IvD7dt+mfsPPpD23ZSFPXA==')
	-- select * from core.security_cap_aes_decrypt('IvD7dt+mfsPPpD23ZSFPXA==')
$$;


ALTER FUNCTION core.auth_sign_in(_name_user character varying, _password_user character varying, _host_session character varying, _agent_session json) OWNER TO postgres;

--
-- TOC entry 331 (class 1255 OID 25735)
-- Name: auth_sign_out(character varying, numeric); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.auth_sign_out(_name_user character varying, _id_session numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION core.auth_sign_out(_name_user character varying, _id_session numeric) OWNER TO postgres;

--
-- TOC entry 335 (class 1255 OID 25823)
-- Name: dml_academic_create(numeric, character varying, character varying, character varying, boolean); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_academic_create(id_user_ numeric, _title_academic character varying, _abbreviation_academic character varying, _nivel_academic character varying, _deleted_academic boolean) RETURNS numeric
    LANGUAGE plpgsql
    AS $_$
			DECLARE
				_RESPONSE BOOLEAN DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_ATT NUMERIC;
				_RETURNING NUMERIC;
				_CURRENT_ID NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			BEGIN
				_CURRENT_ID = (select nextval('core.serial_academic')-1);
				_COUNT = (select count(*) from core.view_academic t where t.id_academic = _CURRENT_ID);

				IF (_COUNT = 0) THEN
				
					_COUNT_ATT = (select count(*) from core.view_academic t where t.id_academic = _CURRENT_ID);
				
					IF (_COUNT_ATT = 0) THEN 
						FOR _X IN INSERT INTO core.academic(id_academic, title_academic, abbreviation_academic, nivel_academic, deleted_academic) VALUES (_CURRENT_ID, $2 , $3 , $4 , $5 ) RETURNING id_academic LOOP
							_RETURNING = _X.id_academic;
						END LOOP;

						IF (_RETURNING >= 1) THEN
							_SAVE_LOG = (select * from core.global_save_log());
							IF (_SAVE_LOG) THEN
								_RESPONSE = (core.dml_system_event_create($1,'academic',_CURRENT_ID,'CREATE', now()::timestamp, false));
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
						_EXCEPTION = 'Ya existe un registro con el id_academic '||_id_academic||'';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
				ELSE
					_EXCEPTION = 'El registro con id '||_CURRENT_ID||' ya se encuentra registrado';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_CURRENT_ID >= 1) THEN
						EXECUTE 'select setval(''core.serial_academic'', '||_CURRENT_ID||')';
					END IF;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			END;
			$_$;


ALTER FUNCTION core.dml_academic_create(id_user_ numeric, _title_academic character varying, _abbreviation_academic character varying, _nivel_academic character varying, _deleted_academic boolean) OWNER TO postgres;

--
-- TOC entry 337 (class 1255 OID 25825)
-- Name: dml_academic_delete(numeric, numeric); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_academic_delete(id_user_ numeric, _id_academic numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_DELETED NUMERIC;
				_COUNT_DEPENDENCY NUMERIC;
				_RETURNING NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_COUNT = (select count(*) from core.view_academic t where t.id_academic = $2);
					
				IF (_COUNT = 1) THEN
					_COUNT_DELETED = (select count(*) from core.view_academic t where t.id_academic = $2 and deleted_academic = true); 
					IF (_COUNT_DELETED = 0) THEN 
						_COUNT_DEPENDENCY = (select * from core.utils_get_table_dependency('core','academic', $2));
						
						IF (_COUNT_DEPENDENCY > 0) THEN
							_EXCEPTION = 'No se puede eliminar el registro, mantiene dependencia en otros procesos.';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						ELSE
							FOR _X IN UPDATE core.academic SET deleted_academic=true WHERE id_academic = $2 RETURNING id_academic LOOP
								_RETURNING = _X.id_academic;
							END LOOP;
							IF (_RETURNING >= 1) THEN
								_SAVE_LOG = (select * from core.global_save_log());
								IF (_SAVE_LOG) THEN
									_RESPONSE = (core.dml_system_event_create($1,'academic',$2,'DELETE', now()::timestamp, false));
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
								_EXCEPTION = 'Ocurrió un error al eliminar el registro';
								RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
							END IF;
						END IF;
					ELSE
						_EXCEPTION = 'EL registro ya se encuentra eliminado';
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
			 $_$;


ALTER FUNCTION core.dml_academic_delete(id_user_ numeric, _id_academic numeric) OWNER TO postgres;

--
-- TOC entry 336 (class 1255 OID 25824)
-- Name: dml_academic_update(numeric, numeric, character varying, character varying, character varying, boolean); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_academic_update(id_user_ numeric, _id_academic numeric, _title_academic character varying, _abbreviation_academic character varying, _nivel_academic character varying, _deleted_academic boolean) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_ATT NUMERIC;
				_COUNT_DELETED NUMERIC;
				_RETURNING NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
				_COUNT = (select count(*) from core.view_academic t where t.id_academic = $2);
				
				IF (_COUNT = 1) THEN
					_COUNT_DELETED = (select count(*) from core.view_academic t where t.id_academic = $2 and deleted_academic = true); 
					IF (_COUNT_DELETED = 0) THEN
						
						_COUNT_ATT = (select count(*) from core.view_academic t where t.id_academic = _id_academic and t.id_academic != _id_academic);
						
						IF (_COUNT_ATT = 0) THEN 
							FOR _X IN UPDATE core.academic SET title_academic=$3, abbreviation_academic=$4, nivel_academic=$5, deleted_academic=$6 WHERE id_academic=$2 RETURNING id_academic LOOP
								_RETURNING = _X.id_academic;
							END LOOP;

							IF (_RETURNING >= 1) THEN
								_SAVE_LOG = (select * from core.global_save_log());
								IF (_SAVE_LOG) THEN
									_RESPONSE = (core.dml_system_event_create($1,'academic',$2,'UPDATE', now()::timestamp, false));
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
							_EXCEPTION = 'Ya existe un registro con el id_academic '||_id_academic||'';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						END IF;
					ELSE 
						_EXCEPTION = 'EL registro se encuentra eliminado';
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
			 $_$;


ALTER FUNCTION core.dml_academic_update(id_user_ numeric, _id_academic numeric, _title_academic character varying, _abbreviation_academic character varying, _nivel_academic character varying, _deleted_academic boolean) OWNER TO postgres;

--
-- TOC entry 353 (class 1255 OID 25841)
-- Name: dml_company_create(numeric, numeric, character varying, character varying, character varying, boolean, boolean); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_company_create(id_user_ numeric, _id_setting numeric, _name_company character varying, _acronym_company character varying, _address_company character varying, _status_company boolean, _deleted_company boolean) RETURNS numeric
    LANGUAGE plpgsql
    AS $_$
			DECLARE
				_RESPONSE BOOLEAN DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_ATT NUMERIC;
				_COUNT_EXTERNALS_IDS NUMERIC;
				_RETURNING NUMERIC;
				_CURRENT_ID NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			BEGIN 
			-- setting
			_COUNT_EXTERNALS_IDS = (select count(*) from core.view_setting v where v.id_setting = _id_setting);
				
			IF (_COUNT_EXTERNALS_IDS = 0) THEN
				_EXCEPTION = 'El id '||_id_setting||' de la tabla setting no se encuentra registrado';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
			END IF;
			
				_CURRENT_ID = (select nextval('core.serial_company')-1);
				_COUNT = (select count(*) from core.view_company t where t.id_company = _CURRENT_ID);

				IF (_COUNT = 0) THEN
				
					_COUNT_ATT = (select count(*) from core.view_company t where t.name_company = _name_company);
				
					IF (_COUNT_ATT = 0) THEN 
						FOR _X IN INSERT INTO core.company(id_company, id_setting, name_company, acronym_company, address_company, status_company, deleted_company) VALUES (_CURRENT_ID, $2 , $3 , $4 , $5 , $6 , $7 ) RETURNING id_company LOOP
							_RETURNING = _X.id_company;
						END LOOP;

						IF (_RETURNING >= 1) THEN
							_SAVE_LOG = (select * from core.global_save_log());
							IF (_SAVE_LOG) THEN
								_RESPONSE = (core.dml_system_event_create($1,'company',_CURRENT_ID,'CREATE', now()::timestamp, false));
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
						_EXCEPTION = 'Ya existe un registro con el name_company '||_name_company||'';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
				ELSE
					_EXCEPTION = 'El registro con id '||_CURRENT_ID||' ya se encuentra registrado';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_CURRENT_ID >= 1) THEN
						EXECUTE 'select setval(''core.serial_company'', '||_CURRENT_ID||')';
					END IF;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			END;
			$_$;


ALTER FUNCTION core.dml_company_create(id_user_ numeric, _id_setting numeric, _name_company character varying, _acronym_company character varying, _address_company character varying, _status_company boolean, _deleted_company boolean) OWNER TO postgres;

--
-- TOC entry 365 (class 1255 OID 25924)
-- Name: dml_company_create_modified(numeric); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_company_create_modified(id_user_ numeric) RETURNS TABLE(id_company numeric, id_setting numeric, name_company character varying, acronym_company character varying, address_company character varying, status_company boolean, deleted_company boolean, expiration_token numeric, expiration_verification_code numeric, inactivity_time numeric, session_limit numeric, save_alfresco boolean, wait_autorization numeric, batch_shipping boolean, max_generation_pdf numeric, wait_generation_pdf numeric)
    LANGUAGE plpgsql
    AS $$
			DECLARE
				_ID_SETTING NUMERIC;
				_ID_COMPANY NUMERIC;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			BEGIN
				_ID_SETTING = (select * from core.dml_setting_create(id_user_, 30000, 30000, 30000, 5, false, 3, false, 10, 20, false));
				
				IF (_ID_SETTING >= 1) THEN
					_ID_COMPANY = (select * from core.dml_company_create(id_user_, _ID_SETTING, 'Nueva empresa', '', '', false, false) );
					
					IF (_ID_COMPANY >= 1) THEN
						RETURN QUERY select vc.id_company, vc.id_setting, vc.name_company, vc.acronym_company, vc.address_company, vc.status_company, vc.deleted_company, vs.expiration_token, vs.expiration_verification_code, vs.inactivity_time, vs.session_limit, vs.save_alfresco, vs.wait_autorization, vs.batch_shipping, vs.max_generation_pdf, vs.wait_generation_pdf from core.view_company vc
							inner join core.view_setting vs on vc.id_setting = vs.id_setting where vc.id_company = _ID_COMPANY;
					ELSE
						_EXCEPTION = 'Ocurrió un error al ingresar una nueva empresa';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
				ELSE
					_EXCEPTION = 'Ocurrió un error al ingresar la configuración';
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
			
$$;


ALTER FUNCTION core.dml_company_create_modified(id_user_ numeric) OWNER TO postgres;

--
-- TOC entry 356 (class 1255 OID 25843)
-- Name: dml_company_delete(numeric, numeric); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_company_delete(id_user_ numeric, _id_company numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_DELETED NUMERIC;
				_COUNT_DEPENDENCY NUMERIC;
				_RETURNING NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_COUNT = (select count(*) from core.view_company t where t.id_company = $2);
					
				IF (_COUNT = 1) THEN
					_COUNT_DELETED = (select count(*) from core.view_company t where t.id_company = $2 and deleted_company = true); 
					IF (_COUNT_DELETED = 0) THEN 
						_COUNT_DEPENDENCY = (select * from core.utils_get_table_dependency('core','company', $2));
						
						IF (_COUNT_DEPENDENCY > 0) THEN
							_EXCEPTION = 'No se puede eliminar el registro, mantiene dependencia en otros procesos.';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						ELSE
							FOR _X IN UPDATE core.company SET deleted_company=true WHERE id_company = $2 RETURNING id_company LOOP
								_RETURNING = _X.id_company;
							END LOOP;
							IF (_RETURNING >= 1) THEN
								_SAVE_LOG = (select * from core.global_save_log());
								IF (_SAVE_LOG) THEN
									_RESPONSE = (core.dml_system_event_create($1,'company',$2,'DELETE', now()::timestamp, false));
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
								_EXCEPTION = 'Ocurrió un error al eliminar el registro';
								RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
							END IF;
						END IF;
					ELSE
						_EXCEPTION = 'EL registro ya se encuentra eliminado';
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
			 $_$;


ALTER FUNCTION core.dml_company_delete(id_user_ numeric, _id_company numeric) OWNER TO postgres;

--
-- TOC entry 367 (class 1255 OID 25926)
-- Name: dml_company_delete_modified(numeric, numeric); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_company_delete_modified(id_user_ numeric, _id_company numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
			 DECLARE
			 	_ID_SETTING NUMERIC;
			 	_DELETE_SETTING BOOLEAN;
			 	_DELETE_COMPANY BOOLEAN;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_ID_SETTING = (select vs.id_setting from core.view_company vc inner join core.view_setting vs on vc.id_setting = vs.id_setting where vc.id_company = _id_company);
			 
			 	IF (_ID_SETTING >= 1) THEN
			 		_DELETE_COMPANY = (select * from core.dml_company_delete(id_user_, _id_company));
					
					IF (_DELETE_COMPANY) THEN
			 			_DELETE_SETTING = (select * from core.dml_setting_delete(id_user_, _id_setting));
						
						IF (_DELETE_SETTING) THEN
							return true;
						ELSE
							_EXCEPTION = 'Ocurrió un error al eliminar la configuración';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						END IF;
					ELSE
						_EXCEPTION = 'Ocurrió un error al eliminar la empresa';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			 	ELSE
					_EXCEPTION = 'No se encontró la configuración';
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
			 
$$;


ALTER FUNCTION core.dml_company_delete_modified(id_user_ numeric, _id_company numeric) OWNER TO postgres;

--
-- TOC entry 355 (class 1255 OID 25842)
-- Name: dml_company_update(numeric, numeric, numeric, character varying, character varying, character varying, boolean, boolean); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_company_update(id_user_ numeric, _id_company numeric, _id_setting numeric, _name_company character varying, _acronym_company character varying, _address_company character varying, _status_company boolean, _deleted_company boolean) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_ATT NUMERIC;
				_COUNT_DELETED NUMERIC;
				_COUNT_EXTERNALS_IDS NUMERIC;
				_RETURNING NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN 
			-- setting
			_COUNT_EXTERNALS_IDS = (select count(*) from core.view_setting v where v.id_setting = _id_setting);
				
			IF (_COUNT_EXTERNALS_IDS = 0) THEN
				_EXCEPTION = 'El id '||_id_setting||' de la tabla setting no se encuentra registrado';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
			END IF;
			
				_COUNT = (select count(*) from core.view_company t where t.id_company = $2);
				
				IF (_COUNT = 1) THEN
					_COUNT_DELETED = (select count(*) from core.view_company t where t.id_company = $2 and deleted_company = true); 
					IF (_COUNT_DELETED = 0) THEN
						
						_COUNT_ATT = (select count(*) from core.view_company t where t.name_company = _name_company and t.id_company != _id_company);
						
						IF (_COUNT_ATT = 0) THEN 
							FOR _X IN UPDATE core.company SET id_setting=$3, name_company=$4, acronym_company=$5, address_company=$6, status_company=$7, deleted_company=$8 WHERE id_company=$2 RETURNING id_company LOOP
								_RETURNING = _X.id_company;
							END LOOP;

							IF (_RETURNING >= 1) THEN
								_SAVE_LOG = (select * from core.global_save_log());
								IF (_SAVE_LOG) THEN
									_RESPONSE = (core.dml_system_event_create($1,'company',$2,'UPDATE', now()::timestamp, false));
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
							_EXCEPTION = 'Ya existe un registro con el name_company '||_name_company||'';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						END IF;
					ELSE 
						_EXCEPTION = 'EL registro se encuentra eliminado';
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
			 $_$;


ALTER FUNCTION core.dml_company_update(id_user_ numeric, _id_company numeric, _id_setting numeric, _name_company character varying, _acronym_company character varying, _address_company character varying, _status_company boolean, _deleted_company boolean) OWNER TO postgres;

--
-- TOC entry 366 (class 1255 OID 25925)
-- Name: dml_company_update_modified(numeric, numeric, numeric, character varying, character varying, character varying, boolean, boolean, numeric, numeric, numeric, numeric, boolean, numeric, boolean, numeric, numeric); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_company_update_modified(id_user_ numeric, _id_company numeric, _id_setting numeric, _name_company character varying, _acronym_company character varying, _address_company character varying, _status_company boolean, _deleted_company boolean, _expiration_token numeric, _expiration_verification_code numeric, _inactivity_time numeric, _session_limit numeric, _save_alfresco boolean, _wait_autorization numeric, _batch_shipping boolean, _max_generation_pdf numeric, _wait_generation_pdf numeric) RETURNS TABLE(id_company numeric, id_setting numeric, name_company character varying, acronym_company character varying, address_company character varying, status_company boolean, deleted_company boolean, expiration_token numeric, expiration_verification_code numeric, inactivity_time numeric, session_limit numeric, save_alfresco boolean, wait_autorization numeric, batch_shipping boolean, max_generation_pdf numeric, wait_generation_pdf numeric)
    LANGUAGE plpgsql
    AS $$
			 DECLARE
			 	_UPDATE_SETTING BOOLEAN;
			 	_UPDATE_COMPANY BOOLEAN;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_UPDATE_SETTING = (select * from core.dml_setting_update(id_user_, _id_setting, _expiration_token, _expiration_verification_code, _inactivity_time, _session_limit, _save_alfresco, _wait_autorization, _batch_shipping, _max_generation_pdf, _wait_generation_pdf, false));

			 	IF (_UPDATE_SETTING) THEN
			 		_UPDATE_COMPANY = (select * from core.dml_company_update(id_user_, _id_company, _id_setting, _name_company, _acronym_company, _address_company, _status_company, _deleted_company));
				
					IF (_UPDATE_COMPANY) THEN
						RETURN QUERY select vc.id_company, vc.id_setting, vc.name_company, vc.acronym_company, vc.address_company, vc.status_company, vc.deleted_company, vs.expiration_token, vs.expiration_verification_code, vs.inactivity_time, vs.session_limit, vs.save_alfresco, vs.wait_autorization, vs.batch_shipping, vs.max_generation_pdf, vs.wait_generation_pdf from core.view_company vc
							inner join core.view_setting vs on vc.id_setting = vs.id_setting where vc.id_company = _id_company;
					ELSE
						_EXCEPTION = 'Ocurrió un error al actualizar la empresa';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
				ELSE
					_EXCEPTION = 'Ocurrió un error al actualizar la configuración';
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
			 
$$;


ALTER FUNCTION core.dml_company_update_modified(id_user_ numeric, _id_company numeric, _id_setting numeric, _name_company character varying, _acronym_company character varying, _address_company character varying, _status_company boolean, _deleted_company boolean, _expiration_token numeric, _expiration_verification_code numeric, _inactivity_time numeric, _session_limit numeric, _save_alfresco boolean, _wait_autorization numeric, _batch_shipping boolean, _max_generation_pdf numeric, _wait_generation_pdf numeric) OWNER TO postgres;

--
-- TOC entry 338 (class 1255 OID 25826)
-- Name: dml_job_create(numeric, character varying, character varying, character varying, character varying, boolean); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_job_create(id_user_ numeric, _name_job character varying, _address_job character varying, _phone_job character varying, _position_job character varying, _deleted_job boolean) RETURNS numeric
    LANGUAGE plpgsql
    AS $_$
			DECLARE
				_RESPONSE BOOLEAN DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_ATT NUMERIC;
				_RETURNING NUMERIC;
				_CURRENT_ID NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			BEGIN
				_CURRENT_ID = (select nextval('core.serial_job')-1);
				_COUNT = (select count(*) from core.view_job t where t.id_job = _CURRENT_ID);

				IF (_COUNT = 0) THEN
				
					_COUNT_ATT = (select count(*) from core.view_job t where t.id_job = _CURRENT_ID);
				
					IF (_COUNT_ATT = 0) THEN 
						FOR _X IN INSERT INTO core.job(id_job, name_job, address_job, phone_job, position_job, deleted_job) VALUES (_CURRENT_ID, $2 , $3 , $4 , $5 , $6 ) RETURNING id_job LOOP
							_RETURNING = _X.id_job;
						END LOOP;

						IF (_RETURNING >= 1) THEN
							_SAVE_LOG = (select * from core.global_save_log());
							IF (_SAVE_LOG) THEN
								_RESPONSE = (core.dml_system_event_create($1,'job',_CURRENT_ID,'CREATE', now()::timestamp, false));
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
						_EXCEPTION = 'Ya existe un registro con el id_job '||_id_job||'';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
				ELSE
					_EXCEPTION = 'El registro con id '||_CURRENT_ID||' ya se encuentra registrado';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_CURRENT_ID >= 1) THEN
						EXECUTE 'select setval(''core.serial_job'', '||_CURRENT_ID||')';
					END IF;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			END;
			$_$;


ALTER FUNCTION core.dml_job_create(id_user_ numeric, _name_job character varying, _address_job character varying, _phone_job character varying, _position_job character varying, _deleted_job boolean) OWNER TO postgres;

--
-- TOC entry 340 (class 1255 OID 25828)
-- Name: dml_job_delete(numeric, numeric); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_job_delete(id_user_ numeric, _id_job numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_DELETED NUMERIC;
				_COUNT_DEPENDENCY NUMERIC;
				_RETURNING NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_COUNT = (select count(*) from core.view_job t where t.id_job = $2);
					
				IF (_COUNT = 1) THEN
					_COUNT_DELETED = (select count(*) from core.view_job t where t.id_job = $2 and deleted_job = true); 
					IF (_COUNT_DELETED = 0) THEN 
						_COUNT_DEPENDENCY = (select * from core.utils_get_table_dependency('core','job', $2));
						
						IF (_COUNT_DEPENDENCY > 0) THEN
							_EXCEPTION = 'No se puede eliminar el registro, mantiene dependencia en otros procesos.';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						ELSE
							FOR _X IN UPDATE core.job SET deleted_job=true WHERE id_job = $2 RETURNING id_job LOOP
								_RETURNING = _X.id_job;
							END LOOP;
							IF (_RETURNING >= 1) THEN
								_SAVE_LOG = (select * from core.global_save_log());
								IF (_SAVE_LOG) THEN
									_RESPONSE = (core.dml_system_event_create($1,'job',$2,'DELETE', now()::timestamp, false));
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
								_EXCEPTION = 'Ocurrió un error al eliminar el registro';
								RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
							END IF;
						END IF;
					ELSE
						_EXCEPTION = 'EL registro ya se encuentra eliminado';
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
			 $_$;


ALTER FUNCTION core.dml_job_delete(id_user_ numeric, _id_job numeric) OWNER TO postgres;

--
-- TOC entry 339 (class 1255 OID 25827)
-- Name: dml_job_update(numeric, numeric, character varying, character varying, character varying, character varying, boolean); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_job_update(id_user_ numeric, _id_job numeric, _name_job character varying, _address_job character varying, _phone_job character varying, _position_job character varying, _deleted_job boolean) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_ATT NUMERIC;
				_COUNT_DELETED NUMERIC;
				_RETURNING NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
				_COUNT = (select count(*) from core.view_job t where t.id_job = $2);
				
				IF (_COUNT = 1) THEN
					_COUNT_DELETED = (select count(*) from core.view_job t where t.id_job = $2 and deleted_job = true); 
					IF (_COUNT_DELETED = 0) THEN
						
						_COUNT_ATT = (select count(*) from core.view_job t where t.id_job = _id_job and t.id_job != _id_job);
						
						IF (_COUNT_ATT = 0) THEN 
							FOR _X IN UPDATE core.job SET name_job=$3, address_job=$4, phone_job=$5, position_job=$6, deleted_job=$7 WHERE id_job=$2 RETURNING id_job LOOP
								_RETURNING = _X.id_job;
							END LOOP;

							IF (_RETURNING >= 1) THEN
								_SAVE_LOG = (select * from core.global_save_log());
								IF (_SAVE_LOG) THEN
									_RESPONSE = (core.dml_system_event_create($1,'job',$2,'UPDATE', now()::timestamp, false));
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
							_EXCEPTION = 'Ya existe un registro con el id_job '||_id_job||'';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						END IF;
					ELSE 
						_EXCEPTION = 'EL registro se encuentra eliminado';
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
			 $_$;


ALTER FUNCTION core.dml_job_update(id_user_ numeric, _id_job numeric, _name_job character varying, _address_job character varying, _phone_job character varying, _position_job character varying, _deleted_job boolean) OWNER TO postgres;

--
-- TOC entry 370 (class 1255 OID 25844)
-- Name: dml_navigation_create(numeric, numeric, character varying, character varying, core."TYPE_NAVIGATION", boolean, json, boolean); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_navigation_create(id_user_ numeric, _id_company numeric, _name_navigation character varying, _description_navigation character varying, _type_navigation core."TYPE_NAVIGATION", _status_navigation boolean, _content_navigation json, _deleted_navigation boolean) RETURNS numeric
    LANGUAGE plpgsql
    AS $_$
			DECLARE
				_RESPONSE BOOLEAN DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_ATT NUMERIC;
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
			
				_CURRENT_ID = (select nextval('core.serial_navigation')-1);
				_COUNT = (select count(*) from core.view_navigation t where t.id_navigation = _CURRENT_ID);

				IF (_COUNT = 0) THEN
				
					_COUNT_ATT = (select count(*) from core.view_navigation t where t.name_navigation = _name_navigation and t.id_company = _id_company);
				
					IF (_COUNT_ATT = 0) THEN 
						FOR _X IN INSERT INTO core.navigation(id_navigation, id_company, name_navigation, description_navigation, type_navigation, status_navigation, content_navigation, deleted_navigation) VALUES (_CURRENT_ID, $2 , $3 , $4 , $5 , $6 , $7 , $8 ) RETURNING id_navigation LOOP
							_RETURNING = _X.id_navigation;
						END LOOP;

						IF (_RETURNING >= 1) THEN
							_SAVE_LOG = (select * from core.global_save_log());
							IF (_SAVE_LOG) THEN
								_RESPONSE = (core.dml_system_event_create($1,'navigation',_CURRENT_ID,'CREATE', now()::timestamp, false));
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
						_EXCEPTION = 'Ya existe un registro con el nombre de navegación '||_name_navigation||'';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
				ELSE
					_EXCEPTION = 'El registro con id '||_CURRENT_ID||' ya se encuentra registrado';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_CURRENT_ID >= 1) THEN
						EXECUTE 'select setval(''core.serial_navigation'', '||_CURRENT_ID||')';
					END IF;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			END;
			
$_$;


ALTER FUNCTION core.dml_navigation_create(id_user_ numeric, _id_company numeric, _name_navigation character varying, _description_navigation character varying, _type_navigation core."TYPE_NAVIGATION", _status_navigation boolean, _content_navigation json, _deleted_navigation boolean) OWNER TO postgres;

--
-- TOC entry 371 (class 1255 OID 25929)
-- Name: dml_navigation_create_modified(numeric); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_navigation_create_modified(id_user_ numeric) RETURNS TABLE(id_navigation numeric, id_company numeric, name_navigation character varying, description_navigation character varying, type_navigation core."TYPE_NAVIGATION", status_navigation boolean, content_navigation json, deleted_navigation boolean)
    LANGUAGE plpgsql
    AS $$
			DECLARE
				_ID_COMPANY NUMERIC;
				_ID_NAVIGATION NUMERIC;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			BEGIN
				-- Get the id company _ID_COMPANY
				_ID_COMPANY = (select vu.id_company from core.view_user vu where vu.id_user = id_user_); 
				
				_ID_NAVIGATION = (select * from core.dml_navigation_create(id_user_, _ID_COMPANY, 'Nueva navegación', '', 'defaultNavigation', false, '[]', false));
				
				IF (_ID_NAVIGATION >= 1) THEN
					RETURN QUERY select * from core.view_navigation vn where vn.id_navigation = _ID_NAVIGATION;
				ELSE
					_EXCEPTION = 'Ocurrió un error al ingresar la navegación';
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
			
$$;


ALTER FUNCTION core.dml_navigation_create_modified(id_user_ numeric) OWNER TO postgres;

--
-- TOC entry 357 (class 1255 OID 25846)
-- Name: dml_navigation_delete(numeric, numeric); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_navigation_delete(id_user_ numeric, _id_navigation numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_DELETED NUMERIC;
				_COUNT_DEPENDENCY NUMERIC;
				_RETURNING NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_COUNT = (select count(*) from core.view_navigation t where t.id_navigation = $2);
					
				IF (_COUNT = 1) THEN
					_COUNT_DELETED = (select count(*) from core.view_navigation t where t.id_navigation = $2 and deleted_navigation = true); 
					IF (_COUNT_DELETED = 0) THEN 
						_COUNT_DEPENDENCY = (select * from core.utils_get_table_dependency('core','navigation', $2));
						
						IF (_COUNT_DEPENDENCY > 0) THEN
							_EXCEPTION = 'No se puede eliminar el registro, mantiene dependencia en otros procesos.';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						ELSE
							FOR _X IN UPDATE core.navigation SET deleted_navigation=true WHERE id_navigation = $2 RETURNING id_navigation LOOP
								_RETURNING = _X.id_navigation;
							END LOOP;
							IF (_RETURNING >= 1) THEN
								_SAVE_LOG = (select * from core.global_save_log());
								IF (_SAVE_LOG) THEN
									_RESPONSE = (core.dml_system_event_create($1,'navigation',$2,'DELETE', now()::timestamp, false));
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
								_EXCEPTION = 'Ocurrió un error al eliminar el registro';
								RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
							END IF;
						END IF;
					ELSE
						_EXCEPTION = 'EL registro ya se encuentra eliminado';
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
			 $_$;


ALTER FUNCTION core.dml_navigation_delete(id_user_ numeric, _id_navigation numeric) OWNER TO postgres;

--
-- TOC entry 372 (class 1255 OID 25845)
-- Name: dml_navigation_update(numeric, numeric, numeric, character varying, character varying, core."TYPE_NAVIGATION", boolean, json, boolean); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_navigation_update(id_user_ numeric, _id_navigation numeric, _id_company numeric, _name_navigation character varying, _description_navigation character varying, _type_navigation core."TYPE_NAVIGATION", _status_navigation boolean, _content_navigation json, _deleted_navigation boolean) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_ATT NUMERIC;
				_COUNT_DELETED NUMERIC;
				_COUNT_EXTERNALS_IDS NUMERIC;
				_RETURNING NUMERIC;
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
			
				_COUNT = (select count(*) from core.view_navigation t where t.id_navigation = $2);
				
				IF (_COUNT = 1) THEN
					_COUNT_DELETED = (select count(*) from core.view_navigation t where t.id_navigation = $2 and deleted_navigation = true); 
					IF (_COUNT_DELETED = 0) THEN
						
						_COUNT_ATT = (select count(*) from core.view_navigation t where t.name_navigation = _name_navigation and t.id_navigation != _id_navigation and t.id_navigation = _id_navigation);
						
						IF (_COUNT_ATT = 0) THEN 
							FOR _X IN UPDATE core.navigation SET id_company=$3, name_navigation=$4, description_navigation=$5, type_navigation=$6, status_navigation=$7, content_navigation=$8, deleted_navigation=$9 WHERE id_navigation=$2 RETURNING id_navigation LOOP
								_RETURNING = _X.id_navigation;
							END LOOP;

							IF (_RETURNING >= 1) THEN
								_SAVE_LOG = (select * from core.global_save_log());
								IF (_SAVE_LOG) THEN
									_RESPONSE = (core.dml_system_event_create($1,'navigation',$2,'UPDATE', now()::timestamp, false));
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
							_EXCEPTION = 'Ya existe un registro con el nombre de navegación '||_name_navigation||'';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						END IF;
					ELSE 
						_EXCEPTION = 'EL registro se encuentra eliminado';
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
			 
$_$;


ALTER FUNCTION core.dml_navigation_update(id_user_ numeric, _id_navigation numeric, _id_company numeric, _name_navigation character varying, _description_navigation character varying, _type_navigation core."TYPE_NAVIGATION", _status_navigation boolean, _content_navigation json, _deleted_navigation boolean) OWNER TO postgres;

--
-- TOC entry 373 (class 1255 OID 25930)
-- Name: dml_navigation_update_modified(numeric, numeric, numeric, character varying, character varying, core."TYPE_NAVIGATION", boolean, json, boolean); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_navigation_update_modified(id_user_ numeric, _id_navigation numeric, _id_company numeric, _name_navigation character varying, _description_navigation character varying, _type_navigation core."TYPE_NAVIGATION", _status_navigation boolean, _content_navigation json, _deleted_navigation boolean) RETURNS TABLE(id_navigation numeric, id_company numeric, name_navigation character varying, description_navigation character varying, type_navigation core."TYPE_NAVIGATION", status_navigation boolean, content_navigation json, deleted_navigation boolean)
    LANGUAGE plpgsql
    AS $$
			DECLARE
				_UPDATE_NAVIGATION BOOLEAN;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			BEGIN
				_UPDATE_NAVIGATION = (select * from core.dml_navigation_update(id_user_, _id_navigation, _id_company, _name_navigation, _description_navigation, _type_navigation, _status_navigation, _content_navigation, _deleted_navigation));
				
				IF (_UPDATE_NAVIGATION) THEN
					RETURN QUERY select * from core.view_navigation vn where vn.id_navigation = _id_navigation;
				ELSE
					_EXCEPTION = 'Ocurrió un error al actualizar la navegación';
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
			
$$;


ALTER FUNCTION core.dml_navigation_update_modified(id_user_ numeric, _id_navigation numeric, _id_company numeric, _name_navigation character varying, _description_navigation character varying, _type_navigation core."TYPE_NAVIGATION", _status_navigation boolean, _content_navigation json, _deleted_navigation boolean) OWNER TO postgres;

--
-- TOC entry 341 (class 1255 OID 25829)
-- Name: dml_person_create(numeric, numeric, numeric, character varying, character varying, character varying, character varying, character varying, boolean); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_person_create(id_user_ numeric, _id_academic numeric, _id_job numeric, _dni_person character varying, _name_person character varying, _last_name_person character varying, _address_person character varying, _phone_person character varying, _deleted_person boolean) RETURNS numeric
    LANGUAGE plpgsql
    AS $_$
			DECLARE
				_RESPONSE BOOLEAN DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_ATT NUMERIC;
				_COUNT_EXTERNALS_IDS NUMERIC;
				_RETURNING NUMERIC;
				_CURRENT_ID NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			BEGIN 
			-- academic
			_COUNT_EXTERNALS_IDS = (select count(*) from core.view_academic v where v.id_academic = _id_academic);
				
			IF (_COUNT_EXTERNALS_IDS = 0) THEN
				_EXCEPTION = 'El id '||_id_academic||' de la tabla academic no se encuentra registrado';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
			END IF;
			 
			-- job
			_COUNT_EXTERNALS_IDS = (select count(*) from core.view_job v where v.id_job = _id_job);
				
			IF (_COUNT_EXTERNALS_IDS = 0) THEN
				_EXCEPTION = 'El id '||_id_job||' de la tabla job no se encuentra registrado';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
			END IF;
			
				_CURRENT_ID = (select nextval('core.serial_person')-1);
				_COUNT = (select count(*) from core.view_person t where t.id_person = _CURRENT_ID);

				IF (_COUNT = 0) THEN
				
					_COUNT_ATT = (select count(*) from core.view_person t where t.dni_person = _dni_person);
				
					IF (_COUNT_ATT = 0) THEN 
						FOR _X IN INSERT INTO core.person(id_person, id_academic, id_job, dni_person, name_person, last_name_person, address_person, phone_person, deleted_person) VALUES (_CURRENT_ID, $2 , $3 , $4 , $5 , $6 , $7 , $8 , $9 ) RETURNING id_person LOOP
							_RETURNING = _X.id_person;
						END LOOP;

						IF (_RETURNING >= 1) THEN
							_SAVE_LOG = (select * from core.global_save_log());
							IF (_SAVE_LOG) THEN
								_RESPONSE = (core.dml_system_event_create($1,'person',_CURRENT_ID,'CREATE', now()::timestamp, false));
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
						_EXCEPTION = 'Ya existe un registro con el dni_person '||_dni_person||'';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
				ELSE
					_EXCEPTION = 'El registro con id '||_CURRENT_ID||' ya se encuentra registrado';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_CURRENT_ID >= 1) THEN
						EXECUTE 'select setval(''core.serial_person'', '||_CURRENT_ID||')';
					END IF;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			END;
			$_$;


ALTER FUNCTION core.dml_person_create(id_user_ numeric, _id_academic numeric, _id_job numeric, _dni_person character varying, _name_person character varying, _last_name_person character varying, _address_person character varying, _phone_person character varying, _deleted_person boolean) OWNER TO postgres;

--
-- TOC entry 343 (class 1255 OID 25831)
-- Name: dml_person_delete(numeric, numeric); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_person_delete(id_user_ numeric, _id_person numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_DELETED NUMERIC;
				_COUNT_DEPENDENCY NUMERIC;
				_RETURNING NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_COUNT = (select count(*) from core.view_person t where t.id_person = $2);
					
				IF (_COUNT = 1) THEN
					_COUNT_DELETED = (select count(*) from core.view_person t where t.id_person = $2 and deleted_person = true); 
					IF (_COUNT_DELETED = 0) THEN 
						_COUNT_DEPENDENCY = (select * from core.utils_get_table_dependency('core','person', $2));
						
						IF (_COUNT_DEPENDENCY > 0) THEN
							_EXCEPTION = 'No se puede eliminar el registro, mantiene dependencia en otros procesos.';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						ELSE
							FOR _X IN UPDATE core.person SET deleted_person=true WHERE id_person = $2 RETURNING id_person LOOP
								_RETURNING = _X.id_person;
							END LOOP;
							IF (_RETURNING >= 1) THEN
								_SAVE_LOG = (select * from core.global_save_log());
								IF (_SAVE_LOG) THEN
									_RESPONSE = (core.dml_system_event_create($1,'person',$2,'DELETE', now()::timestamp, false));
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
								_EXCEPTION = 'Ocurrió un error al eliminar el registro';
								RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
							END IF;
						END IF;
					ELSE
						_EXCEPTION = 'EL registro ya se encuentra eliminado';
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
			 $_$;


ALTER FUNCTION core.dml_person_delete(id_user_ numeric, _id_person numeric) OWNER TO postgres;

--
-- TOC entry 342 (class 1255 OID 25830)
-- Name: dml_person_update(numeric, numeric, numeric, numeric, character varying, character varying, character varying, character varying, character varying, boolean); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_person_update(id_user_ numeric, _id_person numeric, _id_academic numeric, _id_job numeric, _dni_person character varying, _name_person character varying, _last_name_person character varying, _address_person character varying, _phone_person character varying, _deleted_person boolean) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_ATT NUMERIC;
				_COUNT_DELETED NUMERIC;
				_COUNT_EXTERNALS_IDS NUMERIC;
				_RETURNING NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN 
			-- academic
			_COUNT_EXTERNALS_IDS = (select count(*) from core.view_academic v where v.id_academic = _id_academic);
				
			IF (_COUNT_EXTERNALS_IDS = 0) THEN
				_EXCEPTION = 'El id '||_id_academic||' de la tabla academic no se encuentra registrado';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
			END IF;
			 
			-- job
			_COUNT_EXTERNALS_IDS = (select count(*) from core.view_job v where v.id_job = _id_job);
				
			IF (_COUNT_EXTERNALS_IDS = 0) THEN
				_EXCEPTION = 'El id '||_id_job||' de la tabla job no se encuentra registrado';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
			END IF;
			
				_COUNT = (select count(*) from core.view_person t where t.id_person = $2);
				
				IF (_COUNT = 1) THEN
					_COUNT_DELETED = (select count(*) from core.view_person t where t.id_person = $2 and deleted_person = true); 
					IF (_COUNT_DELETED = 0) THEN
						
						_COUNT_ATT = (select count(*) from core.view_person t where t.dni_person = _dni_person and t.id_person != _id_person);
						
						IF (_COUNT_ATT = 0) THEN 
							FOR _X IN UPDATE core.person SET id_academic=$3, id_job=$4, dni_person=$5, name_person=$6, last_name_person=$7, address_person=$8, phone_person=$9, deleted_person=$10 WHERE id_person=$2 RETURNING id_person LOOP
								_RETURNING = _X.id_person;
							END LOOP;

							IF (_RETURNING >= 1) THEN
								_SAVE_LOG = (select * from core.global_save_log());
								IF (_SAVE_LOG) THEN
									_RESPONSE = (core.dml_system_event_create($1,'person',$2,'UPDATE', now()::timestamp, false));
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
							_EXCEPTION = 'Ya existe un registro con el dni_person '||_dni_person||'';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						END IF;
					ELSE 
						_EXCEPTION = 'EL registro se encuentra eliminado';
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
			 $_$;


ALTER FUNCTION core.dml_person_update(id_user_ numeric, _id_person numeric, _id_academic numeric, _id_job numeric, _dni_person character varying, _name_person character varying, _last_name_person character varying, _address_person character varying, _phone_person character varying, _deleted_person boolean) OWNER TO postgres;

--
-- TOC entry 374 (class 1255 OID 25847)
-- Name: dml_profile_create(numeric, numeric, core."TYPE_PROFILE", character varying, character varying, boolean, boolean); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_profile_create(id_user_ numeric, _id_company numeric, _type_profile core."TYPE_PROFILE", _name_profile character varying, _description_profile character varying, _status_profile boolean, _deleted_profile boolean) RETURNS numeric
    LANGUAGE plpgsql
    AS $_$
			DECLARE
				_RESPONSE BOOLEAN DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_ATT NUMERIC;
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
			
				_CURRENT_ID = (select nextval('core.serial_profile')-1);
				_COUNT = (select count(*) from core.view_profile t where t.id_profile = _CURRENT_ID);

				IF (_COUNT = 0) THEN
				
					_COUNT_ATT = (select count(*) from core.view_profile t where t.name_profile = _name_profile and t.id_company =_id_company);
				
					IF (_COUNT_ATT = 0) THEN 
						FOR _X IN INSERT INTO core.profile(id_profile, id_company, type_profile, name_profile, description_profile, status_profile, deleted_profile) VALUES (_CURRENT_ID, $2 , $3 , $4 , $5 , $6 , $7 ) RETURNING id_profile LOOP
							_RETURNING = _X.id_profile;
						END LOOP;

						IF (_RETURNING >= 1) THEN
							_SAVE_LOG = (select * from core.global_save_log());
							IF (_SAVE_LOG) THEN
								_RESPONSE = (core.dml_system_event_create($1,'profile',_CURRENT_ID,'CREATE', now()::timestamp, false));
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
						_EXCEPTION = 'Ya existe un registro con el nombre de perfil '||_name_profile||'';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
				ELSE
					_EXCEPTION = 'El registro con id '||_CURRENT_ID||' ya se encuentra registrado';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_CURRENT_ID >= 1) THEN
						EXECUTE 'select setval(''core.serial_profile'', '||_CURRENT_ID||')';
					END IF;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			END;
			
$_$;


ALTER FUNCTION core.dml_profile_create(id_user_ numeric, _id_company numeric, _type_profile core."TYPE_PROFILE", _name_profile character varying, _description_profile character varying, _status_profile boolean, _deleted_profile boolean) OWNER TO postgres;

--
-- TOC entry 375 (class 1255 OID 25931)
-- Name: dml_profile_create_modified(numeric); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_profile_create_modified(id_user_ numeric) RETURNS TABLE(id_profile numeric, id_company numeric, type_profile core."TYPE_PROFILE", name_profile character varying, description_profile character varying, status_profile boolean, deleted_profile boolean)
    LANGUAGE plpgsql
    AS $$
			DECLARE
				_ID_COMPANY NUMERIC;
				_ID_PROFILE NUMERIC;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			BEGIN
				-- Get the id company _ID_COMPANY
				_ID_COMPANY = (select vu.id_company from core.view_user vu where vu.id_user = id_user_); 
				
				_ID_PROFILE = (select * from core.dml_profile_create(id_user_, _ID_COMPANY, 'commonProfile', 'Nuevo perfil', '', false, false));
				IF (_ID_PROFILE >= 1) THEN
					RETURN QUERY select * from core.view_profile vp where vp.id_profile = _ID_PROFILE;
				ELSE
					_EXCEPTION = 'Ocurrió un error al ingresar el perfil';
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
			
$$;


ALTER FUNCTION core.dml_profile_create_modified(id_user_ numeric) OWNER TO postgres;

--
-- TOC entry 359 (class 1255 OID 25849)
-- Name: dml_profile_delete(numeric, numeric); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_profile_delete(id_user_ numeric, _id_profile numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_DELETED NUMERIC;
				_COUNT_DEPENDENCY NUMERIC;
				_RETURNING NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_COUNT = (select count(*) from core.view_profile t where t.id_profile = $2);
					
				IF (_COUNT = 1) THEN
					_COUNT_DELETED = (select count(*) from core.view_profile t where t.id_profile = $2 and deleted_profile = true); 
					IF (_COUNT_DELETED = 0) THEN 
						_COUNT_DEPENDENCY = (select * from core.utils_get_table_dependency('core','profile', $2));
						
						IF (_COUNT_DEPENDENCY > 0) THEN
							_EXCEPTION = 'No se puede eliminar el registro, mantiene dependencia en otros procesos.';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						ELSE
							FOR _X IN UPDATE core.profile SET deleted_profile=true WHERE id_profile = $2 RETURNING id_profile LOOP
								_RETURNING = _X.id_profile;
							END LOOP;
							IF (_RETURNING >= 1) THEN
								_SAVE_LOG = (select * from core.global_save_log());
								IF (_SAVE_LOG) THEN
									_RESPONSE = (core.dml_system_event_create($1,'profile',$2,'DELETE', now()::timestamp, false));
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
								_EXCEPTION = 'Ocurrió un error al eliminar el registro';
								RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
							END IF;
						END IF;
					ELSE
						_EXCEPTION = 'EL registro ya se encuentra eliminado';
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
			 $_$;


ALTER FUNCTION core.dml_profile_delete(id_user_ numeric, _id_profile numeric) OWNER TO postgres;

--
-- TOC entry 378 (class 1255 OID 25933)
-- Name: dml_profile_delete_modified(numeric, numeric); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_profile_delete_modified(id_user_ numeric, _id_profile numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
			 DECLARE
				_X RECORD;
				_DELETE_NAVIGATION BOOLEAN;
				_DELETE_PROFILE BOOLEAN;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
				FOR _X IN select * from core.view_profile_navigation cvpn where cvpn.id_profile = _id_profile LOOP
					_DELETE_NAVIGATION = (select * from core.dml_profile_navigation_delete(id_user_, _X.id_profile_navigation));
				END LOOP;
				
				_DELETE_PROFILE = (select * from core.dml_profile_delete(id_user_, _id_profile));
				IF (_DELETE_PROFILE) THEN
					RETURN true;
				ELSE
					_EXCEPTION = 'Ocurrió un error al eliminar el perfil';
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
			 
$$;


ALTER FUNCTION core.dml_profile_delete_modified(id_user_ numeric, _id_profile numeric) OWNER TO postgres;

--
-- TOC entry 344 (class 1255 OID 25832)
-- Name: dml_profile_navigation_create(numeric, numeric, numeric); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_profile_navigation_create(id_user_ numeric, _id_profile numeric, _id_navigation numeric) RETURNS numeric
    LANGUAGE plpgsql
    AS $_$
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
			-- profile
			_COUNT_EXTERNALS_IDS = (select count(*) from core.view_profile v where v.id_profile = _id_profile);
				
			IF (_COUNT_EXTERNALS_IDS = 0) THEN
				_EXCEPTION = 'El id '||_id_profile||' de la tabla profile no se encuentra registrado';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
			END IF;
			 
			-- navigation
			_COUNT_EXTERNALS_IDS = (select count(*) from core.view_navigation v where v.id_navigation = _id_navigation);
				
			IF (_COUNT_EXTERNALS_IDS = 0) THEN
				_EXCEPTION = 'El id '||_id_navigation||' de la tabla navigation no se encuentra registrado';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
			END IF;
			
				_CURRENT_ID = (select nextval('core.serial_profile_navigation')-1);
				_COUNT = (select count(*) from core.view_profile_navigation t where t.id_profile_navigation = _CURRENT_ID);

				IF (_COUNT = 0) THEN
					FOR _X IN INSERT INTO core.profile_navigation(id_profile_navigation, id_profile, id_navigation) VALUES (_CURRENT_ID, $2 , $3 ) RETURNING id_profile_navigation LOOP
						_RETURNING = _X.id_profile_navigation;
					END LOOP;
					
					IF (_RETURNING >= 1) THEN
						_SAVE_LOG = (select * from core.global_save_log());
						IF (_SAVE_LOG) THEN
							_RESPONSE = (core.dml_system_event_create($1,'profile_navigation',_CURRENT_ID,'CREATE', now()::timestamp, false));
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
						EXECUTE 'select setval(''core.serial_profile_navigation'', '||_CURRENT_ID||')';
					END IF;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			END;
			$_$;


ALTER FUNCTION core.dml_profile_navigation_create(id_user_ numeric, _id_profile numeric, _id_navigation numeric) OWNER TO postgres;

--
-- TOC entry 380 (class 1255 OID 25934)
-- Name: dml_profile_navigation_create_modified(numeric, numeric); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_profile_navigation_create_modified(id_user_ numeric, _id_profile numeric) RETURNS TABLE(id_profile_navigation numeric, id_profile numeric, id_navigation numeric, type_profile core."TYPE_PROFILE", name_profile character varying, description_profile character varying, status_profile boolean, name_navigation character varying, description_navigation character varying, type_navigation core."TYPE_NAVIGATION", status_navigation boolean, content_navigation json)
    LANGUAGE plpgsql
    AS $$
			DECLARE
				_ID_COMPANY numeric;
				_ID_NAVIGATION numeric;
				_ID_PROFILE_NAVIGATION NUMERIC;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			BEGIN
				-- Get the id company _ID_COMPANY
				_ID_COMPANY = (select vu.id_company from core.view_user vu where vu.id_user = id_user_); 
				
				_ID_NAVIGATION = (select navigations.id_navigation from (select vn.id_navigation from core.view_navigation vn where vn.id_company = _ID_COMPANY) as navigations 
					LEFT JOIN (select distinct vpn.id_navigation from core.view_profile_navigation vpn inner join core.view_navigation vn on vpn.id_navigation = vn.id_navigation where vpn.id_profile = _id_profile and vn.id_company = _ID_COMPANY) as navigationsAssigned 
					on navigations.id_navigation = navigationsAssigned.id_navigation where navigationsAssigned.id_navigation IS NULL order by navigations.id_navigation asc limit 1);

				IF (_ID_NAVIGATION >= 1) THEN
					_ID_PROFILE_NAVIGATION = (select * from core.dml_profile_navigation_create(id_user_, _id_profile, _ID_NAVIGATION));
					
					IF (_ID_PROFILE_NAVIGATION >= 1) THEN
						RETURN QUERY select vpn.id_profile_navigation, vpn.id_profile, vpn.id_navigation, vp.type_profile, vp.name_profile, vp.description_profile, vp.status_profile, vn.name_navigation, vn.description_navigation, vn.type_navigation, vn.status_navigation, vn.content_navigation from core.view_profile_navigation vpn
							inner join core.view_profile vp on vpn.id_profile = vp.id_profile
							inner join core.view_navigation vn on vpn.id_navigation = vn.id_navigation where vpn.id_profile_navigation = _ID_PROFILE_NAVIGATION;
					ELSE
						_EXCEPTION = 'Ocurrió un error al ingresar la navegación al perfil';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
				ELSE
					_EXCEPTION = 'No se encontraron navegaciones registradas';
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
			
$$;


ALTER FUNCTION core.dml_profile_navigation_create_modified(id_user_ numeric, _id_profile numeric) OWNER TO postgres;

--
-- TOC entry 346 (class 1255 OID 25834)
-- Name: dml_profile_navigation_delete(numeric, numeric); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_profile_navigation_delete(id_user_ numeric, _id_profile_navigation numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_DEPENDENCY NUMERIC;
				_RETURNING NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_COUNT = (select count(*) from core.view_profile_navigation t where t.id_profile_navigation = $2);
					
				IF (_COUNT = 1) THEN
					_COUNT_DEPENDENCY = (select * from core.utils_get_table_dependency('core','profile_navigation', $2));
						
					IF (_COUNT_DEPENDENCY > 0) THEN
						_EXCEPTION = 'No se puede eliminar el registro, mantiene dependencia en otros procesos.';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					ELSE
						FOR _X IN DELETE FROM core.profile_navigation WHERE id_profile_navigation = $2 RETURNING id_profile_navigation LOOP
							_RETURNING = _X.id_profile_navigation;
						END LOOP;
						IF (_RETURNING >= 1) THEN
							_SAVE_LOG = (select * from core.global_save_log());
							IF (_SAVE_LOG) THEN
								_RESPONSE = (core.dml_system_event_create($1,'profile_navigation',$2,'DELETE', now()::timestamp, false));
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
							_EXCEPTION = 'Ocurrió un error al eliminar el registro';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						END IF;
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
			 $_$;


ALTER FUNCTION core.dml_profile_navigation_delete(id_user_ numeric, _id_profile_navigation numeric) OWNER TO postgres;

--
-- TOC entry 345 (class 1255 OID 25833)
-- Name: dml_profile_navigation_update(numeric, numeric, numeric, numeric); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_profile_navigation_update(id_user_ numeric, _id_profile_navigation numeric, _id_profile numeric, _id_navigation numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_EXTERNALS_IDS NUMERIC;
				_RETURNING NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN 
			-- profile
			_COUNT_EXTERNALS_IDS = (select count(*) from core.view_profile v where v.id_profile = _id_profile);
				
			IF (_COUNT_EXTERNALS_IDS = 0) THEN
				_EXCEPTION = 'El id '||_id_profile||' de la tabla profile no se encuentra registrado';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
			END IF;
			 
			-- navigation
			_COUNT_EXTERNALS_IDS = (select count(*) from core.view_navigation v where v.id_navigation = _id_navigation);
				
			IF (_COUNT_EXTERNALS_IDS = 0) THEN
				_EXCEPTION = 'El id '||_id_navigation||' de la tabla navigation no se encuentra registrado';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
			END IF;
			
			 	_COUNT = (select count(*) from core.view_profile_navigation t where t.id_profile_navigation = $2);
			
				IF (_COUNT = 1) THEN
					FOR _X IN UPDATE core.profile_navigation SET id_profile=$3, id_navigation=$4 WHERE id_profile_navigation=$2 RETURNING id_profile_navigation LOOP
						_RETURNING = _X.id_profile_navigation;
					END LOOP;
						
					IF (_RETURNING >= 1) THEN
						_SAVE_LOG = (select * from core.global_save_log());
						IF (_SAVE_LOG) THEN
							_RESPONSE = (core.dml_system_event_create($1,'profile_navigation',$2,'UPDATE', now()::timestamp, false));
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
			 $_$;


ALTER FUNCTION core.dml_profile_navigation_update(id_user_ numeric, _id_profile_navigation numeric, _id_profile numeric, _id_navigation numeric) OWNER TO postgres;

--
-- TOC entry 381 (class 1255 OID 25935)
-- Name: dml_profile_navigation_update_modified(numeric, numeric, numeric, numeric); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_profile_navigation_update_modified(id_user_ numeric, _id_profile_navigation numeric, _id_profile numeric, _id_navigation numeric) RETURNS TABLE(id_profile_navigation numeric, id_profile numeric, id_navigation numeric, type_profile core."TYPE_PROFILE", name_profile character varying, description_profile character varying, status_profile boolean, name_navigation character varying, description_navigation character varying, type_navigation core."TYPE_NAVIGATION", status_navigation boolean, content_navigation json)
    LANGUAGE plpgsql
    AS $$
			DECLARE
				_UPDATE_PROFILE_NAVIGATION BOOLEAN;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			BEGIN
				_UPDATE_PROFILE_NAVIGATION = (select * from core.dml_profile_navigation_update(id_user_, _id_profile_navigation, _id_profile, _id_navigation));
				
				IF (_UPDATE_PROFILE_NAVIGATION) THEN
					RETURN QUERY select vpn.id_profile_navigation, vpn.id_profile, vpn.id_navigation, vp.type_profile, vp.name_profile, vp.description_profile, vp.status_profile, vn.name_navigation, vn.description_navigation, vn.type_navigation, vn.status_navigation, vn.content_navigation from core.view_profile_navigation vpn
							inner join core.view_profile vp on vpn.id_profile = vp.id_profile
							inner join core.view_navigation vn on vpn.id_navigation = vn.id_navigation where vpn.id_profile_navigation = _id_profile_navigation;
				ELSE
					_EXCEPTION = 'Ocurrió un error al actualizar la navegación';
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
			
$$;


ALTER FUNCTION core.dml_profile_navigation_update_modified(id_user_ numeric, _id_profile_navigation numeric, _id_profile numeric, _id_navigation numeric) OWNER TO postgres;

--
-- TOC entry 376 (class 1255 OID 25848)
-- Name: dml_profile_update(numeric, numeric, numeric, core."TYPE_PROFILE", character varying, character varying, boolean, boolean); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_profile_update(id_user_ numeric, _id_profile numeric, _id_company numeric, _type_profile core."TYPE_PROFILE", _name_profile character varying, _description_profile character varying, _status_profile boolean, _deleted_profile boolean) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_ATT NUMERIC;
				_COUNT_DELETED NUMERIC;
				_COUNT_EXTERNALS_IDS NUMERIC;
				_RETURNING NUMERIC;
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
			
				_COUNT = (select count(*) from core.view_profile t where t.id_profile = $2);
				
				IF (_COUNT = 1) THEN
					_COUNT_DELETED = (select count(*) from core.view_profile t where t.id_profile = $2 and deleted_profile = true); 
					IF (_COUNT_DELETED = 0) THEN
						
						_COUNT_ATT = (select count(*) from core.view_profile t where t.name_profile = _name_profile and t.id_profile != _id_profile and t.id_company = _id_company);
						
						IF (_COUNT_ATT = 0) THEN 
							FOR _X IN UPDATE core.profile SET id_company=$3, type_profile=$4, name_profile=$5, description_profile=$6, status_profile=$7, deleted_profile=$8 WHERE id_profile=$2 RETURNING id_profile LOOP
								_RETURNING = _X.id_profile;
							END LOOP;

							IF (_RETURNING >= 1) THEN
								_SAVE_LOG = (select * from core.global_save_log());
								IF (_SAVE_LOG) THEN
									_RESPONSE = (core.dml_system_event_create($1,'profile',$2,'UPDATE', now()::timestamp, false));
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
							_EXCEPTION = 'Ya existe un registro con el nombre de perfil '||_name_profile||'';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						END IF;
					ELSE 
						_EXCEPTION = 'EL registro se encuentra eliminado';
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
			 
$_$;


ALTER FUNCTION core.dml_profile_update(id_user_ numeric, _id_profile numeric, _id_company numeric, _type_profile core."TYPE_PROFILE", _name_profile character varying, _description_profile character varying, _status_profile boolean, _deleted_profile boolean) OWNER TO postgres;

--
-- TOC entry 377 (class 1255 OID 25932)
-- Name: dml_profile_update_modified(numeric, numeric, numeric, core."TYPE_PROFILE", character varying, character varying, boolean, boolean); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_profile_update_modified(id_user_ numeric, _id_profile numeric, _id_company numeric, _type_profile core."TYPE_PROFILE", _name_profile character varying, _description_profile character varying, _status_profile boolean, _deleted_profile boolean) RETURNS TABLE(id_profile numeric, id_company numeric, type_profile core."TYPE_PROFILE", name_profile character varying, description_profile character varying, status_profile boolean, deleted_profile boolean)
    LANGUAGE plpgsql
    AS $$
			 DECLARE
			 	_UPDATE_PROFILE BOOLEAN;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_UPDATE_PROFILE = (select * from core.dml_profile_update(id_user_, _id_profile, _id_company, _type_profile, _name_profile, _description_profile, _status_profile, _deleted_profile));

			 	IF (_UPDATE_PROFILE) THEN
					RETURN QUERY select * from core.view_profile vp where vp.id_profile = _id_profile;
				ELSE
					_EXCEPTION = 'Ocurrió un error al actualizar el perfil';
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
			 
$$;


ALTER FUNCTION core.dml_profile_update_modified(id_user_ numeric, _id_profile numeric, _id_company numeric, _type_profile core."TYPE_PROFILE", _name_profile character varying, _description_profile character varying, _status_profile boolean, _deleted_profile boolean) OWNER TO postgres;

--
-- TOC entry 392 (class 1255 OID 25944)
-- Name: dml_session_by_company_release_all(numeric, numeric); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_session_by_company_release_all(id_user_ numeric, _id_company numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
			 	_COUNT_SESSION NUMERIC;
				_RELEASE_SESSION boolean;
				_RESPONSE BOOLEAN;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_COUNT_SESSION = (select count(*) from core.view_session vs inner join core.view_user vu on vs.id_user = vu.id_user where vu.id_company = _id_company and vs.status_session = true);
				
				IF (_COUNT_SESSION = 0) THEN
					_EXCEPTION = 'La empresa '||_id_company||' no tiene sessiones activas';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				
				-- Sessions of company
				FOR _X IN select vs.id_session from core.view_session vs inner join core.view_user vu on vs.id_user = vu.id_user where vu.id_company = _id_company and vs.status_session = true LOOP
					_RELEASE_SESSION = (select * from core.dml_session_release(_X.id_session));
				END LOOP;
				
				IF (_RELEASE_SESSION) THEN
					_SAVE_LOG = (select * from core.global_save_log());
					IF (_SAVE_LOG) THEN
						_RESPONSE = (core.dml_system_event_create($1,'session',$2,'byCompanyReleaseAll', now()::timestamp, false));
						IF (_RESPONSE != true) THEN
							_EXCEPTION = 'Ocurrió un error al registrar el evento del sistema';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						END IF;
					END IF;
					RETURN true;
				ELSE
					_EXCEPTION = 'Ocurrió un error al liberar las sessiones de la empresa '||_id_company||'';
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
			 
$_$;


ALTER FUNCTION core.dml_session_by_company_release_all(id_user_ numeric, _id_company numeric) OWNER TO postgres;

--
-- TOC entry 390 (class 1255 OID 25942)
-- Name: dml_session_by_session_release(numeric, numeric); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_session_by_session_release(id_user_ numeric, _id_session numeric) RETURNS TABLE(id_session_ numeric, id_user numeric, host_session character varying, agent_session json, date_sign_in_session timestamp without time zone, date_sign_out_session timestamp without time zone, status_session boolean, id_company numeric, id_person numeric, id_type_user numeric, name_user character varying, password_user character varying, avatar_user character varying, status_user boolean, id_setting numeric, name_company character varying, status_company boolean, id_academic numeric, id_job numeric, dni_person character varying, name_person character varying, last_name_person character varying, address_person character varying, phone_person character varying, name_type_user character varying, description_type_user character varying, status_type_user boolean, id_profile numeric, type_profile core."TYPE_PROFILE", name_profile character varying, description_profile character varying, status_profile boolean)
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RELEASE_SESSION boolean;
				_RESPONSE BOOLEAN;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN 
				_RELEASE_SESSION = (select * from core.dml_session_release(_id_session));
				
				IF (_RELEASE_SESSION) THEN
					_SAVE_LOG = (select * from core.global_save_log());
					IF (_SAVE_LOG) THEN
						_RESPONSE = (core.dml_system_event_create($1,'session',$2,'bySessionRelease', now()::timestamp, false));
						IF (_RESPONSE != true) THEN
							_EXCEPTION = 'Ocurrió un error al registrar el evento del sistema';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						END IF;
					END IF;
					RETURN query select vs.id_session as id_session_, vs.id_user, vs.host_session, vs.agent_session, vs.date_sign_in_session, vs.date_sign_out_session, vs.status_session, vu.id_company, vu.id_person, vu.id_type_user, vu.name_user, vu.password_user, vu.avatar_user, vu.status_user, vc.id_setting, vc.name_company, vc.status_company, vp.id_academic, vp.id_job, vp.dni_person, vp.name_person, vp.last_name_person, vp.address_person, vp.phone_person, vtu.name_type_user, vtu.description_type_user, vtu.status_type_user, vpr.id_profile, vpr.type_profile, vpr.name_profile, vpr.description_profile, vpr.status_profile from core.view_session vs
						inner join core.view_user vu on vs.id_user = vu.id_user
						inner join core.view_company vc on vu.id_company = vc.id_company
						inner join core.view_person vp on vu.id_person = vp.id_person
						inner join core.view_type_user vtu on vtu.id_type_user = vu.id_type_user
						inner join core.view_profile vpr on vtu.id_profile = vpr.id_profile
						where vs.id_session = _id_session;
				ELSE
					_EXCEPTION = 'Ocurrió un error al liberar la sessión';
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
			 
$_$;


ALTER FUNCTION core.dml_session_by_session_release(id_user_ numeric, _id_session numeric) OWNER TO postgres;

--
-- TOC entry 391 (class 1255 OID 25943)
-- Name: dml_session_by_user_release_all(numeric, numeric); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_session_by_user_release_all(id_user_ numeric, _id_user numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
			 	_COUNT_SESSION NUMERIC;
				_RELEASE_SESSION boolean;
				_RESPONSE BOOLEAN;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_COUNT_SESSION = (select count(*) from core.view_session vs where vs.id_user = _id_user and vs.status_session = true);
				
				IF (_COUNT_SESSION = 0) THEN
					_EXCEPTION = 'El usuario '||_id_user||' no tiene sessiones activas';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				
				FOR _X IN select vs.id_session from core.view_session vs where vs.id_user = _id_user and vs.status_session = true LOOP
					_RELEASE_SESSION = (select * from core.dml_session_release(_X.id_session));
				END LOOP;
				
				IF (_RELEASE_SESSION) THEN
					_SAVE_LOG = (select * from core.global_save_log());
					IF (_SAVE_LOG) THEN
						_RESPONSE = (core.dml_system_event_create($1,'session',$2,'byUserReleaseAll', now()::timestamp, false));
						IF (_RESPONSE != true) THEN
							_EXCEPTION = 'Ocurrió un error al registrar el evento del sistema';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						END IF;
					END IF;
					RETURN true;
				ELSE
					_EXCEPTION = 'Ocurrió un error al liberar las sessiones del usuario '||_id_user||'';
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
			 
$_$;


ALTER FUNCTION core.dml_session_by_user_release_all(id_user_ numeric, _id_user numeric) OWNER TO postgres;

--
-- TOC entry 389 (class 1255 OID 25857)
-- Name: dml_session_create(numeric, numeric, character varying, json, timestamp without time zone, timestamp without time zone, boolean); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_session_create(id_user_ numeric, _id_user numeric, _host_session character varying, _agent_session json, _date_sign_in_session timestamp without time zone, _date_sign_out_session timestamp without time zone, _status_session boolean) RETURNS numeric
    LANGUAGE plpgsql
    AS $_$
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
			-- user
			_COUNT_EXTERNALS_IDS = (select count(*) from core.view_user v where v.id_user = _id_user);
				
			IF (_COUNT_EXTERNALS_IDS = 0) THEN
				_EXCEPTION = 'El id '||_id_user||' de la tabla user no se encuentra registrado';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
			END IF;
			
				_CURRENT_ID = (select nextval('core.serial_session')-1);
				_COUNT = (select count(*) from core.view_session t where t.id_session = _CURRENT_ID);

				IF (_COUNT = 0) THEN
					FOR _X IN INSERT INTO core.session(id_session, id_user, host_session, agent_session, date_sign_in_session, status_session) VALUES (_CURRENT_ID, $2 , $3 , $4 , $5 , $7 ) RETURNING id_session LOOP
						_RETURNING = _X.id_session;
					END LOOP;
					
					IF (_RETURNING >= 1) THEN
						_SAVE_LOG = (select * from core.global_save_log());
						IF (_SAVE_LOG) THEN
							_RESPONSE = (core.dml_system_event_create($1,'session',_CURRENT_ID,'CREATE', now()::timestamp, false));
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
						EXECUTE 'select setval(''core.serial_session'', '||_CURRENT_ID||')';
					END IF;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			END;
			
$_$;


ALTER FUNCTION core.dml_session_create(id_user_ numeric, _id_user numeric, _host_session character varying, _agent_session json, _date_sign_in_session timestamp without time zone, _date_sign_out_session timestamp without time zone, _status_session boolean) OWNER TO postgres;

--
-- TOC entry 364 (class 1255 OID 25859)
-- Name: dml_session_delete(numeric, numeric); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_session_delete(id_user_ numeric, _id_session numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_DEPENDENCY NUMERIC;
				_RETURNING NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_COUNT = (select count(*) from core.view_session t where t.id_session = $2);
					
				IF (_COUNT = 1) THEN
					_COUNT_DEPENDENCY = (select * from core.utils_get_table_dependency('core','session', $2));
						
					IF (_COUNT_DEPENDENCY > 0) THEN
						_EXCEPTION = 'No se puede eliminar el registro, mantiene dependencia en otros procesos.';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					ELSE
						FOR _X IN DELETE FROM core.session WHERE id_session = $2 RETURNING id_session LOOP
							_RETURNING = _X.id_session;
						END LOOP;
						IF (_RETURNING >= 1) THEN
							_SAVE_LOG = (select * from core.global_save_log());
							IF (_SAVE_LOG) THEN
								_RESPONSE = (core.dml_system_event_create($1,'session',$2,'DELETE', now()::timestamp, false));
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
							_EXCEPTION = 'Ocurrió un error al eliminar el registro';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						END IF;
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
			 $_$;


ALTER FUNCTION core.dml_session_delete(id_user_ numeric, _id_session numeric) OWNER TO postgres;

--
-- TOC entry 379 (class 1255 OID 25941)
-- Name: dml_session_release(numeric); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_session_release(_id_session numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_COUNT NUMERIC;
				_RETURNING NUMERIC;
				_X RECORD;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN 
			 	_COUNT = (select count(*) from core.view_session t where t.id_session = $1);
				
				IF (_COUNT = 1) THEN
					FOR _X IN UPDATE core.session SET date_sign_out_session = now()::timestamp, status_session = false WHERE id_session = $1 RETURNING id_session LOOP
						_RETURNING = _X.id_session;
					END LOOP;
					
					IF (_RETURNING >= 1) THEN
						RETURN true;
					ELSE
						RETURN false;
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
			 
$_$;


ALTER FUNCTION core.dml_session_release(_id_session numeric) OWNER TO postgres;

--
-- TOC entry 358 (class 1255 OID 25858)
-- Name: dml_session_update(numeric, numeric, numeric, character varying, json, timestamp without time zone, timestamp without time zone, boolean); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_session_update(id_user_ numeric, _id_session numeric, _id_user numeric, _host_session character varying, _agent_session json, _date_sign_in_session timestamp without time zone, _date_sign_out_session timestamp without time zone, _status_session boolean) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_EXTERNALS_IDS NUMERIC;
				_RETURNING NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN 
			-- user
			_COUNT_EXTERNALS_IDS = (select count(*) from core.view_user v where v.id_user = _id_user);
				
			IF (_COUNT_EXTERNALS_IDS = 0) THEN
				_EXCEPTION = 'El id '||_id_user||' de la tabla user no se encuentra registrado';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
			END IF;
			
			 	_COUNT = (select count(*) from core.view_session t where t.id_session = $2);
			
				IF (_COUNT = 1) THEN
					FOR _X IN UPDATE core.session SET id_user=$3, host_session=$4, agent_session=$5, date_sign_in_session=$6, date_sign_out_session=$7, status_session=$8 WHERE id_session=$2 RETURNING id_session LOOP
						_RETURNING = _X.id_session;
					END LOOP;
						
					IF (_RETURNING >= 1) THEN
						_SAVE_LOG = (select * from core.global_save_log());
						IF (_SAVE_LOG) THEN
							_RESPONSE = (core.dml_system_event_create($1,'session',$2,'UPDATE', now()::timestamp, false));
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
			 $_$;


ALTER FUNCTION core.dml_session_update(id_user_ numeric, _id_session numeric, _id_user numeric, _host_session character varying, _agent_session json, _date_sign_in_session timestamp without time zone, _date_sign_out_session timestamp without time zone, _status_session boolean) OWNER TO postgres;

--
-- TOC entry 347 (class 1255 OID 25835)
-- Name: dml_setting_create(numeric, numeric, numeric, numeric, numeric, boolean, numeric, boolean, numeric, numeric, boolean); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_setting_create(id_user_ numeric, _expiration_token numeric, _expiration_verification_code numeric, _inactivity_time numeric, _session_limit numeric, _save_alfresco boolean, _wait_autorization numeric, _batch_shipping boolean, _max_generation_pdf numeric, _wait_generation_pdf numeric, _deleted_setting boolean) RETURNS numeric
    LANGUAGE plpgsql
    AS $_$
			DECLARE
				_RESPONSE BOOLEAN DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_ATT NUMERIC;
				_RETURNING NUMERIC;
				_CURRENT_ID NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			BEGIN
				_CURRENT_ID = (select nextval('core.serial_setting')-1);
				_COUNT = (select count(*) from core.view_setting t where t.id_setting = _CURRENT_ID);

				IF (_COUNT = 0) THEN
				
					_COUNT_ATT = (select count(*) from core.view_setting t where t.id_setting = _CURRENT_ID);
				
					IF (_COUNT_ATT = 0) THEN 
						FOR _X IN INSERT INTO core.setting(id_setting, expiration_token, expiration_verification_code, inactivity_time, session_limit, save_alfresco, wait_autorization, batch_shipping, max_generation_pdf, wait_generation_pdf, deleted_setting) VALUES (_CURRENT_ID, $2 , $3 , $4 , $5 , $6 , $7 , $8 , $9 , $10 , $11 ) RETURNING id_setting LOOP
							_RETURNING = _X.id_setting;
						END LOOP;

						IF (_RETURNING >= 1) THEN
							_SAVE_LOG = (select * from core.global_save_log());
							IF (_SAVE_LOG) THEN
								_RESPONSE = (core.dml_system_event_create($1,'setting',_CURRENT_ID,'CREATE', now()::timestamp, false));
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
						_EXCEPTION = 'Ya existe un registro con el id_setting '||_id_setting||'';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
				ELSE
					_EXCEPTION = 'El registro con id '||_CURRENT_ID||' ya se encuentra registrado';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_CURRENT_ID >= 1) THEN
						EXECUTE 'select setval(''core.serial_setting'', '||_CURRENT_ID||')';
					END IF;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			END;
			$_$;


ALTER FUNCTION core.dml_setting_create(id_user_ numeric, _expiration_token numeric, _expiration_verification_code numeric, _inactivity_time numeric, _session_limit numeric, _save_alfresco boolean, _wait_autorization numeric, _batch_shipping boolean, _max_generation_pdf numeric, _wait_generation_pdf numeric, _deleted_setting boolean) OWNER TO postgres;

--
-- TOC entry 349 (class 1255 OID 25837)
-- Name: dml_setting_delete(numeric, numeric); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_setting_delete(id_user_ numeric, _id_setting numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_DELETED NUMERIC;
				_COUNT_DEPENDENCY NUMERIC;
				_RETURNING NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_COUNT = (select count(*) from core.view_setting t where t.id_setting = $2);
					
				IF (_COUNT = 1) THEN
					_COUNT_DELETED = (select count(*) from core.view_setting t where t.id_setting = $2 and deleted_setting = true); 
					IF (_COUNT_DELETED = 0) THEN 
						_COUNT_DEPENDENCY = (select * from core.utils_get_table_dependency('core','setting', $2));
						
						IF (_COUNT_DEPENDENCY > 0) THEN
							_EXCEPTION = 'No se puede eliminar el registro, mantiene dependencia en otros procesos.';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						ELSE
							FOR _X IN UPDATE core.setting SET deleted_setting=true WHERE id_setting = $2 RETURNING id_setting LOOP
								_RETURNING = _X.id_setting;
							END LOOP;
							IF (_RETURNING >= 1) THEN
								_SAVE_LOG = (select * from core.global_save_log());
								IF (_SAVE_LOG) THEN
									_RESPONSE = (core.dml_system_event_create($1,'setting',$2,'DELETE', now()::timestamp, false));
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
								_EXCEPTION = 'Ocurrió un error al eliminar el registro';
								RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
							END IF;
						END IF;
					ELSE
						_EXCEPTION = 'EL registro ya se encuentra eliminado';
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
			 $_$;


ALTER FUNCTION core.dml_setting_delete(id_user_ numeric, _id_setting numeric) OWNER TO postgres;

--
-- TOC entry 348 (class 1255 OID 25836)
-- Name: dml_setting_update(numeric, numeric, numeric, numeric, numeric, numeric, boolean, numeric, boolean, numeric, numeric, boolean); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_setting_update(id_user_ numeric, _id_setting numeric, _expiration_token numeric, _expiration_verification_code numeric, _inactivity_time numeric, _session_limit numeric, _save_alfresco boolean, _wait_autorization numeric, _batch_shipping boolean, _max_generation_pdf numeric, _wait_generation_pdf numeric, _deleted_setting boolean) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_ATT NUMERIC;
				_COUNT_DELETED NUMERIC;
				_RETURNING NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
				_COUNT = (select count(*) from core.view_setting t where t.id_setting = $2);
				
				IF (_COUNT = 1) THEN
					_COUNT_DELETED = (select count(*) from core.view_setting t where t.id_setting = $2 and deleted_setting = true); 
					IF (_COUNT_DELETED = 0) THEN
						
						_COUNT_ATT = (select count(*) from core.view_setting t where t.id_setting = _id_setting and t.id_setting != _id_setting);
						
						IF (_COUNT_ATT = 0) THEN 
							FOR _X IN UPDATE core.setting SET expiration_token=$3, expiration_verification_code=$4, inactivity_time=$5, session_limit=$6, save_alfresco=$7, wait_autorization=$8, batch_shipping=$9, max_generation_pdf=$10, wait_generation_pdf=$11, deleted_setting=$12 WHERE id_setting=$2 RETURNING id_setting LOOP
								_RETURNING = _X.id_setting;
							END LOOP;

							IF (_RETURNING >= 1) THEN
								_SAVE_LOG = (select * from core.global_save_log());
								IF (_SAVE_LOG) THEN
									_RESPONSE = (core.dml_system_event_create($1,'setting',$2,'UPDATE', now()::timestamp, false));
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
							_EXCEPTION = 'Ya existe un registro con el id_setting '||_id_setting||'';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						END IF;
					ELSE 
						_EXCEPTION = 'EL registro se encuentra eliminado';
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
			 $_$;


ALTER FUNCTION core.dml_setting_update(id_user_ numeric, _id_setting numeric, _expiration_token numeric, _expiration_verification_code numeric, _inactivity_time numeric, _session_limit numeric, _save_alfresco boolean, _wait_autorization numeric, _batch_shipping boolean, _max_generation_pdf numeric, _wait_generation_pdf numeric, _deleted_setting boolean) OWNER TO postgres;

--
-- TOC entry 360 (class 1255 OID 25853)
-- Name: dml_system_event_create(numeric, character varying, numeric, character varying, timestamp without time zone, boolean); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_system_event_create(_id_user numeric, _table_system_event character varying, _row_system_event numeric, _action_system_event character varying, _date_system_event timestamp without time zone, _deleted_system_event boolean) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			DECLARE
				_RESPONSE BOOLEAN DEFAULT false;
				_COUNT NUMERIC;
				_RETURNING NUMERIC;
				_CURRENT_ID NUMERIC;
				_X RECORD;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			BEGIN
				_CURRENT_ID = (select nextval('core.serial_system_event')-1);
				_COUNT = (select count(*) from core.view_system_event t where t.id_system_event = _CURRENT_ID);
				
				IF (_COUNT = 0) THEN
					FOR _X IN INSERT INTO core.system_event(id_system_event, id_user, table_system_event, row_system_event, action_system_event, date_system_event, deleted_system_event) VALUES (_CURRENT_ID, $1 , $2 , $3 , $4 , $5 , $6 ) RETURNING id_system_event LOOP
						_RETURNING = _X.id_system_event;
					END LOOP;
					
					IF (_RETURNING >= 1) THEN
						RETURN true;
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
						EXECUTE 'select setval(''core.serial_system_event'', '||_CURRENT_ID||')';
					END IF;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			END;
			$_$;


ALTER FUNCTION core.dml_system_event_create(_id_user numeric, _table_system_event character varying, _row_system_event numeric, _action_system_event character varying, _date_system_event timestamp without time zone, _deleted_system_event boolean) OWNER TO postgres;

--
-- TOC entry 361 (class 1255 OID 25854)
-- Name: dml_type_user_create(numeric, numeric, numeric, character varying, character varying, boolean, boolean); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_type_user_create(id_user_ numeric, _id_company numeric, _id_profile numeric, _name_type_user character varying, _description_type_user character varying, _status_type_user boolean, _deleted_type_user boolean) RETURNS numeric
    LANGUAGE plpgsql
    AS $_$
			DECLARE
				_RESPONSE BOOLEAN DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_ATT NUMERIC;
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
			 
			-- profile
			_COUNT_EXTERNALS_IDS = (select count(*) from core.view_profile v where v.id_profile = _id_profile);
				
			IF (_COUNT_EXTERNALS_IDS = 0) THEN
				_EXCEPTION = 'El id '||_id_profile||' de la tabla profile no se encuentra registrado';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
			END IF;
			
				_CURRENT_ID = (select nextval('core.serial_type_user')-1);
				_COUNT = (select count(*) from core.view_type_user t where t.id_type_user = _CURRENT_ID);

				IF (_COUNT = 0) THEN
				
					_COUNT_ATT = (select count(*) from core.view_type_user t where t.id_type_user = _CURRENT_ID);
				
					IF (_COUNT_ATT = 0) THEN 
						FOR _X IN INSERT INTO core.type_user(id_type_user, id_company, id_profile, name_type_user, description_type_user, status_type_user, deleted_type_user) VALUES (_CURRENT_ID, $2 , $3 , $4 , $5 , $6 , $7 ) RETURNING id_type_user LOOP
							_RETURNING = _X.id_type_user;
						END LOOP;

						IF (_RETURNING >= 1) THEN
							_SAVE_LOG = (select * from core.global_save_log());
							IF (_SAVE_LOG) THEN
								_RESPONSE = (core.dml_system_event_create($1,'type_user',_CURRENT_ID,'CREATE', now()::timestamp, false));
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
						_EXCEPTION = 'Ya existe un registro con el id_type_user '||_id_type_user||'';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
				ELSE
					_EXCEPTION = 'El registro con id '||_CURRENT_ID||' ya se encuentra registrado';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_CURRENT_ID >= 1) THEN
						EXECUTE 'select setval(''core.serial_type_user'', '||_CURRENT_ID||')';
					END IF;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			END;
			$_$;


ALTER FUNCTION core.dml_type_user_create(id_user_ numeric, _id_company numeric, _id_profile numeric, _name_type_user character varying, _description_type_user character varying, _status_type_user boolean, _deleted_type_user boolean) OWNER TO postgres;

--
-- TOC entry 382 (class 1255 OID 25936)
-- Name: dml_type_user_create_modified(numeric); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_type_user_create_modified(id_user_ numeric) RETURNS TABLE(id_type_user numeric, id_company numeric, id_profile numeric, name_type_user character varying, description_type_user character varying, status_type_user boolean, deleted_type_user boolean, name_company character varying, acronym_company character varying, address_company character varying, status_company boolean, type_profile core."TYPE_PROFILE", name_profile character varying, description_profile character varying, status_profile boolean)
    LANGUAGE plpgsql
    AS $$
			DECLARE
				_ID_COMPANY NUMERIC;
				_ID_PROFILE NUMERIC;
				_ID_TYPE_USER NUMERIC;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			BEGIN
				-- Get the id company _ID_COMPANY
				_ID_COMPANY = (select vu.id_company from core.view_user vu where vu.id_user = id_user_); 
			
				_ID_PROFILE = (select cvp.id_profile from core.view_profile cvp order by cvp.id_profile desc limit 1);

				IF (_ID_PROFILE >= 1) THEN
					_ID_TYPE_USER = (select * from core.dml_type_user_create(id_user_, _ID_COMPANY, _id_profile, 'Nuevo tipo de usuario', '', false, false));
	
					IF (_ID_TYPE_USER >= 1) THEN
						RETURN QUERY select ctu.id_type_user, ctu.id_company, ctu.id_profile, ctu.name_type_user, ctu.description_type_user, ctu.status_type_user, ctu.deleted_type_user, cvc.name_company, cvc.acronym_company, cvc.address_company, cvc.status_company, cvp.type_profile, cvp.name_profile, cvp.description_profile, cvp.status_profile from core.view_type_user ctu
							inner join core.view_company cvc on ctu.id_company = cvc.id_company
							inner join core.view_profile cvp on ctu.id_profile = cvp.id_profile
							where ctu.id_type_user = _ID_TYPE_USER;
					 ELSE
						_EXCEPTION = 'Ocurrió un error al ingresar type_user';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
				ELSE
					_EXCEPTION = 'No se encontraron perfiles registradas';
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
			
$$;


ALTER FUNCTION core.dml_type_user_create_modified(id_user_ numeric) OWNER TO postgres;

--
-- TOC entry 363 (class 1255 OID 25856)
-- Name: dml_type_user_delete(numeric, numeric); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_type_user_delete(id_user_ numeric, _id_type_user numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_DELETED NUMERIC;
				_COUNT_DEPENDENCY NUMERIC;
				_RETURNING NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_COUNT = (select count(*) from core.view_type_user t where t.id_type_user = $2);
					
				IF (_COUNT = 1) THEN
					_COUNT_DELETED = (select count(*) from core.view_type_user t where t.id_type_user = $2 and deleted_type_user = true); 
					IF (_COUNT_DELETED = 0) THEN 
						_COUNT_DEPENDENCY = (select * from core.utils_get_table_dependency('core','type_user', $2));
						
						IF (_COUNT_DEPENDENCY > 0) THEN
							_EXCEPTION = 'No se puede eliminar el registro, mantiene dependencia en otros procesos.';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						ELSE
							FOR _X IN UPDATE core.type_user SET deleted_type_user=true WHERE id_type_user = $2 RETURNING id_type_user LOOP
								_RETURNING = _X.id_type_user;
							END LOOP;
							IF (_RETURNING >= 1) THEN
								_SAVE_LOG = (select * from core.global_save_log());
								IF (_SAVE_LOG) THEN
									_RESPONSE = (core.dml_system_event_create($1,'type_user',$2,'DELETE', now()::timestamp, false));
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
								_EXCEPTION = 'Ocurrió un error al eliminar el registro';
								RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
							END IF;
						END IF;
					ELSE
						_EXCEPTION = 'EL registro ya se encuentra eliminado';
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
			 $_$;


ALTER FUNCTION core.dml_type_user_delete(id_user_ numeric, _id_type_user numeric) OWNER TO postgres;

--
-- TOC entry 362 (class 1255 OID 25855)
-- Name: dml_type_user_update(numeric, numeric, numeric, numeric, character varying, character varying, boolean, boolean); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_type_user_update(id_user_ numeric, _id_type_user numeric, _id_company numeric, _id_profile numeric, _name_type_user character varying, _description_type_user character varying, _status_type_user boolean, _deleted_type_user boolean) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_ATT NUMERIC;
				_COUNT_DELETED NUMERIC;
				_COUNT_EXTERNALS_IDS NUMERIC;
				_RETURNING NUMERIC;
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
			 
			-- profile
			_COUNT_EXTERNALS_IDS = (select count(*) from core.view_profile v where v.id_profile = _id_profile);
				
			IF (_COUNT_EXTERNALS_IDS = 0) THEN
				_EXCEPTION = 'El id '||_id_profile||' de la tabla profile no se encuentra registrado';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
			END IF;
			
				_COUNT = (select count(*) from core.view_type_user t where t.id_type_user = $2);
				
				IF (_COUNT = 1) THEN
					_COUNT_DELETED = (select count(*) from core.view_type_user t where t.id_type_user = $2 and deleted_type_user = true); 
					IF (_COUNT_DELETED = 0) THEN
						
						_COUNT_ATT = (select count(*) from core.view_type_user t where t.id_type_user = _id_type_user and t.id_type_user != _id_type_user);
						
						IF (_COUNT_ATT = 0) THEN 
							FOR _X IN UPDATE core.type_user SET id_company=$3, id_profile=$4, name_type_user=$5, description_type_user=$6, status_type_user=$7, deleted_type_user=$8 WHERE id_type_user=$2 RETURNING id_type_user LOOP
								_RETURNING = _X.id_type_user;
							END LOOP;

							IF (_RETURNING >= 1) THEN
								_SAVE_LOG = (select * from core.global_save_log());
								IF (_SAVE_LOG) THEN
									_RESPONSE = (core.dml_system_event_create($1,'type_user',$2,'UPDATE', now()::timestamp, false));
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
							_EXCEPTION = 'Ya existe un registro con el id_type_user '||_id_type_user||'';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						END IF;
					ELSE 
						_EXCEPTION = 'EL registro se encuentra eliminado';
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
			 $_$;


ALTER FUNCTION core.dml_type_user_update(id_user_ numeric, _id_type_user numeric, _id_company numeric, _id_profile numeric, _name_type_user character varying, _description_type_user character varying, _status_type_user boolean, _deleted_type_user boolean) OWNER TO postgres;

--
-- TOC entry 383 (class 1255 OID 25937)
-- Name: dml_type_user_update_modified(numeric, numeric, numeric, numeric, character varying, character varying, boolean, boolean); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_type_user_update_modified(id_user_ numeric, _id_type_user numeric, _id_company numeric, _id_profile numeric, _name_type_user character varying, _description_type_user character varying, _status_type_user boolean, _deleted_type_user boolean) RETURNS TABLE(id_type_user numeric, id_company numeric, id_profile numeric, name_type_user character varying, description_type_user character varying, status_type_user boolean, deleted_type_user boolean, name_company character varying, acronym_company character varying, address_company character varying, status_company boolean, type_profile core."TYPE_PROFILE", name_profile character varying, description_profile character varying, status_profile boolean)
    LANGUAGE plpgsql
    AS $$
			 DECLARE
			 	_UPDATE_TYPE_USER BOOLEAN;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_UPDATE_TYPE_USER = (select * from core.dml_type_user_update(id_user_, _id_type_user, _id_company, _id_profile, _name_type_user, _description_type_user, _status_type_user, _deleted_type_user));

			 	IF (_UPDATE_TYPE_USER) THEN
					RETURN QUERY select ctu.id_type_user, ctu.id_company, ctu.id_profile, ctu.name_type_user, ctu.description_type_user, ctu.status_type_user, ctu.deleted_type_user, cvc.name_company, cvc.acronym_company, cvc.address_company, cvc.status_company, cvp.type_profile, cvp.name_profile, cvp.description_profile, cvp.status_profile from core.view_type_user ctu
						inner join core.view_company cvc on ctu.id_company = cvc.id_company
						inner join core.view_profile cvp on ctu.id_profile = cvp.id_profile
						where ctu.id_type_user = _id_type_user;
				ELSE
					_EXCEPTION = 'Ocurrió un error al actualizar type_user';
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
			 
$$;


ALTER FUNCTION core.dml_type_user_update_modified(id_user_ numeric, _id_type_user numeric, _id_company numeric, _id_profile numeric, _name_type_user character varying, _description_type_user character varying, _status_type_user boolean, _deleted_type_user boolean) OWNER TO postgres;

--
-- TOC entry 384 (class 1255 OID 25850)
-- Name: dml_user_create(numeric, numeric, numeric, numeric, character varying, character varying, character varying, boolean, boolean); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_user_create(id_user_ numeric, _id_company numeric, _id_person numeric, _id_type_user numeric, _name_user character varying, _password_user character varying, _avatar_user character varying, _status_user boolean, _deleted_user boolean) RETURNS numeric
    LANGUAGE plpgsql
    AS $_$
			DECLARE
				_RESPONSE BOOLEAN DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_ATT NUMERIC;
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
			 
			-- person
			_COUNT_EXTERNALS_IDS = (select count(*) from core.view_person v where v.id_person = _id_person);
				
			IF (_COUNT_EXTERNALS_IDS = 0) THEN
				_EXCEPTION = 'El id '||_id_person||' de la tabla person no se encuentra registrado';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
			END IF;
			 
			-- type_user
			_COUNT_EXTERNALS_IDS = (select count(*) from core.view_type_user v where v.id_type_user = _id_type_user);
				
			IF (_COUNT_EXTERNALS_IDS = 0) THEN
				_EXCEPTION = 'El id '||_id_type_user||' de la tabla profile no se encuentra registrado';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
			END IF;
			
				_CURRENT_ID = (select nextval('core.serial_user')-1);
				_COUNT = (select count(*) from core.view_user t where t.id_user = _CURRENT_ID);

				IF (_COUNT = 0) THEN
				
					_COUNT_ATT = (select count(*) from core.view_user t where t.name_user = _name_user and t.id_company = _id_company);
				
					IF (_COUNT_ATT = 0) THEN 
						FOR _X IN INSERT INTO core.user(id_user, id_company, id_person, id_type_user, name_user, password_user, avatar_user, status_user, deleted_user) VALUES (_CURRENT_ID, $2 , $3 , $4 , $5 , $6 , $7 , $8 , $9 ) RETURNING id_user LOOP
							_RETURNING = _X.id_user;
						END LOOP;

						IF (_RETURNING >= 1) THEN
							_SAVE_LOG = (select * from core.global_save_log());
							IF (_SAVE_LOG) THEN
								_RESPONSE = (core.dml_system_event_create($1,'user',_CURRENT_ID,'CREATE', now()::timestamp, false));
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
						_EXCEPTION = 'Ya existe un usuario con el correo '||_name_user||'';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
				ELSE
					_EXCEPTION = 'El registro con id '||_CURRENT_ID||' ya se encuentra registrado';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_CURRENT_ID >= 1) THEN
						EXECUTE 'select setval(''core.serial_user'', '||_CURRENT_ID||')';
					END IF;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			END;
			
$_$;


ALTER FUNCTION core.dml_user_create(id_user_ numeric, _id_company numeric, _id_person numeric, _id_type_user numeric, _name_user character varying, _password_user character varying, _avatar_user character varying, _status_user boolean, _deleted_user boolean) OWNER TO postgres;

--
-- TOC entry 385 (class 1255 OID 25938)
-- Name: dml_user_create_modified(numeric); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_user_create_modified(id_user_ numeric) RETURNS TABLE(id_user numeric, id_company numeric, id_person numeric, id_type_user numeric, name_user character varying, password_user character varying, avatar_user character varying, status_user boolean, deleted_user boolean, name_company character varying, status_company boolean, id_academic numeric, id_job numeric, dni_person character varying, name_person character varying, last_name_person character varying, address_person character varying, phone_person character varying, title_academic character varying, abbreviation_academic character varying, nivel_academic character varying, name_job character varying, address_job character varying, phone_job character varying, position_job character varying, name_type_user character varying, description_type_user character varying, status_type_user boolean, id_profile numeric, type_profile core."TYPE_PROFILE", name_profile character varying, description_profile character varying, status_profile boolean)
    LANGUAGE plpgsql
    AS $$
			DECLARE
				_ID_COMPANY NUMERIC;
				_ID_ACADEMIC NUMERIC;
				_ID_JOB NUMERIC;
				_ID_PERSON NUMERIC;
				_ID_PROFILE NUMERIC;
				_ID_TYPE_USER NUMERIC;
				_ID_USER NUMERIC;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			BEGIN
				_ID_COMPANY = (select vu.id_company from core.view_user vu where vu.id_user = id_user_);
				
				_ID_ACADEMIC = (select * from core.dml_academic_create(id_user_, '', '', '', false));
				
				IF (_ID_ACADEMIC >= 1) THEN
					_ID_JOB = (select * from core.dml_job_create(id_user_, '', '', '', '', false));
					
					IF (_ID_JOB >= 1) THEN
						_ID_PERSON = (select * from core.dml_person_create(id_user_, _ID_ACADEMIC, _ID_JOB, '', 'Nuevo', 'usuario', '', '', false));
						
						IF (_ID_PERSON >= 1) THEN
							_ID_PROFILE = (select vp.id_profile from core.view_profile vp order by vp.id_profile asc limit 1);
							
							IF (_ID_PROFILE >= 1) THEN
								_ID_TYPE_USER = (select vtu.id_type_user from core.view_type_user vtu order by vtu.id_type_user asc limit 1);

								IF (_ID_TYPE_USER >= 1) THEN
									_ID_USER = (select * from core.dml_user_create(id_user_, _ID_COMPANY, _ID_PERSON, _ID_TYPE_USER, 'new_user@wsfe.com', '', 'default.svg', false, false));
								
									IF (_ID_USER >= 1) THEN
										RETURN QUERY select vu.id_user, vu.id_company, vu.id_person, vu.id_type_user, vu.name_user, vu.password_user, vu.avatar_user, vu.status_user, vu.deleted_user, vc.name_company, vc.status_company, vp.id_academic, vp.id_job, vp.dni_person, vp.name_person, vp.last_name_person, vp.address_person, vp.phone_person, va.title_academic, va.abbreviation_academic, va.nivel_academic, vj.name_job, vj.address_job, vj.phone_job, vj.position_job, vtu.name_type_user, vtu.description_type_user, vtu.status_type_user, vpr.id_profile, vpr.type_profile, vpr.name_profile, vpr.description_profile, vpr.status_profile from core.view_user vu
											inner join core.view_company vc on vu.id_company = vc.id_company
											inner join core.view_person vp on vu.id_person = vp.id_person
											inner join core.view_academic va on vp.id_academic = va.id_academic
											inner join core.view_job vj on vp.id_job = vj.id_job
											inner join core.view_type_user vtu on vtu.id_type_user = vu.id_type_user
											inner join core.view_profile vpr on vtu.id_profile = vpr.id_profile 
											where vu.id_user = _ID_USER;
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
			
$$;


ALTER FUNCTION core.dml_user_create_modified(id_user_ numeric) OWNER TO postgres;

--
-- TOC entry 354 (class 1255 OID 25852)
-- Name: dml_user_delete(numeric, numeric); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_user_delete(id_user_ numeric, _id_user numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_DELETED NUMERIC;
				_COUNT_DEPENDENCY NUMERIC;
				_RETURNING NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_COUNT = (select count(*) from core.view_user t where t.id_user = $2);
					
				IF (_COUNT = 1) THEN
					_COUNT_DELETED = (select count(*) from core.view_user t where t.id_user = $2 and deleted_user = true); 
					IF (_COUNT_DELETED = 0) THEN 
						_COUNT_DEPENDENCY = (select * from core.utils_get_table_dependency('core','user', $2));
						
						IF (_COUNT_DEPENDENCY > 0) THEN
							_EXCEPTION = 'No se puede eliminar el registro, mantiene dependencia en otros procesos.';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						ELSE
							FOR _X IN UPDATE core.user SET deleted_user=true WHERE id_user = $2 RETURNING id_user LOOP
								_RETURNING = _X.id_user;
							END LOOP;
							IF (_RETURNING >= 1) THEN
								_SAVE_LOG = (select * from core.global_save_log());
								IF (_SAVE_LOG) THEN
									_RESPONSE = (core.dml_system_event_create($1,'user',$2,'DELETE', now()::timestamp, false));
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
								_EXCEPTION = 'Ocurrió un error al eliminar el registro';
								RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
							END IF;
						END IF;
					ELSE
						_EXCEPTION = 'EL registro ya se encuentra eliminado';
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
			 $_$;


ALTER FUNCTION core.dml_user_delete(id_user_ numeric, _id_user numeric) OWNER TO postgres;

--
-- TOC entry 388 (class 1255 OID 25940)
-- Name: dml_user_delete_modified(numeric, numeric); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_user_delete_modified(id_user_ numeric, _id_user numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
			 DECLARE
				_ID_PERSON NUMERIC;
				_ID_JOB NUMERIC;
				_ID_ACADEMIC NUMERIC;
				_DELETE_ACADEMIC BOOLEAN;
				_DELETE_JOB BOOLEAN;
				_DELETE_PERSON BOOLEAN;
			 	_DELETE_USER BOOLEAN;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_ID_PERSON = (select vu.id_person from core.view_user vu where vu.id_user = _id_user);
				_ID_JOB = (select vp.id_job from core.view_person vp where vp.id_person = _ID_PERSON);
				_ID_ACADEMIC = (select va.id_academic from core.view_academic va where va.id_academic = _ID_PERSON);
			 
			 	_DELETE_USER = (select * from core.dml_user_delete(id_user_, _id_user));
				
				IF (_DELETE_USER) THEN
			 		_DELETE_PERSON = (select * from core.dml_person_delete(id_user_, _ID_PERSON));
					
					IF (_DELETE_PERSON) THEN
			 			_DELETE_JOB = (select * from core.dml_job_delete(id_user_, _ID_JOB));
						
						IF (_DELETE_JOB) THEN
							_DELETE_ACADEMIC = (select * from core.dml_academic_delete(id_user_, _ID_ACADEMIC));
							
							IF (_DELETE_ACADEMIC) THEN
								return true;
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
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			 END;
			 
$$;


ALTER FUNCTION core.dml_user_delete_modified(id_user_ numeric, _id_user numeric) OWNER TO postgres;

--
-- TOC entry 334 (class 1255 OID 25738)
-- Name: dml_user_remove_avatar(numeric); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_user_remove_avatar(_id_user numeric) RETURNS TABLE(status_remove_avatar boolean, current_path character varying)
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION core.dml_user_remove_avatar(_id_user numeric) OWNER TO postgres;

--
-- TOC entry 386 (class 1255 OID 25851)
-- Name: dml_user_update(numeric, numeric, numeric, numeric, numeric, character varying, character varying, character varying, boolean, boolean); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_user_update(id_user_ numeric, _id_user numeric, _id_company numeric, _id_person numeric, _id_type_user numeric, _name_user character varying, _password_user character varying, _avatar_user character varying, _status_user boolean, _deleted_user boolean) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_ATT NUMERIC;
				_COUNT_DELETED NUMERIC;
				_COUNT_EXTERNALS_IDS NUMERIC;
				_RETURNING NUMERIC;
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
			 
			-- person
			_COUNT_EXTERNALS_IDS = (select count(*) from core.view_person v where v.id_person = _id_person);
				
			IF (_COUNT_EXTERNALS_IDS = 0) THEN
				_EXCEPTION = 'El id '||_id_person||' de la tabla person no se encuentra registrado';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
			END IF;
			 
			-- type_user
			_COUNT_EXTERNALS_IDS = (select count(*) from core.view_type_user v where v.id_type_user = _id_type_user);
				
			IF (_COUNT_EXTERNALS_IDS = 0) THEN
				_EXCEPTION = 'El id '||_id_profile||' de la tabla profile no se encuentra registrado';
				RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
			END IF;
			
				_COUNT = (select count(*) from core.view_user t where t.id_user = $2);
				
				IF (_COUNT = 1) THEN
					_COUNT_DELETED = (select count(*) from core.view_user t where t.id_user = $2 and deleted_user = true); 
					IF (_COUNT_DELETED = 0) THEN
						
						_COUNT_ATT = (select count(*) from core.view_user t where t.name_user = _name_user and t.id_user != _id_user);
						
						IF (_COUNT_ATT = 0) THEN 
							FOR _X IN UPDATE core.user SET id_company=$3, id_person=$4, id_type_user=$5, name_user=$6, password_user=$7, avatar_user=$8, status_user=$9, deleted_user=$10 WHERE id_user=$2 RETURNING id_user LOOP
								_RETURNING = _X.id_user;
							END LOOP;

							IF (_RETURNING >= 1) THEN
								_SAVE_LOG = (select * from core.global_save_log());
								IF (_SAVE_LOG) THEN
									_RESPONSE = (core.dml_system_event_create($1,'user',$2,'UPDATE', now()::timestamp, false));
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
							_EXCEPTION = 'Ya existe un usuario con el coreo '||_name_user||'';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						END IF;
					ELSE 
						_EXCEPTION = 'EL registro se encuentra eliminado';
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
			 
$_$;


ALTER FUNCTION core.dml_user_update(id_user_ numeric, _id_user numeric, _id_company numeric, _id_person numeric, _id_type_user numeric, _name_user character varying, _password_user character varying, _avatar_user character varying, _status_user boolean, _deleted_user boolean) OWNER TO postgres;

--
-- TOC entry 387 (class 1255 OID 25939)
-- Name: dml_user_update_modified(numeric, numeric, numeric, numeric, numeric, character varying, character varying, character varying, boolean, boolean, numeric, numeric, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_user_update_modified(id_user_ numeric, _id_user numeric, _id_company numeric, _id_person numeric, _id_type_user numeric, _name_user character varying, _password_user character varying, _avatar_user character varying, _status_user boolean, _deleted_user boolean, _id_academic numeric, _id_job numeric, _dni_person character varying, _name_person character varying, _last_name_person character varying, _address_person character varying, _phone_person character varying, _title_academic character varying, _abbreviation_academic character varying, _nivel_academic character varying, _name_job character varying, _address_job character varying, _phone_job character varying, _position_job character varying) RETURNS TABLE(id_user numeric, id_company numeric, id_person numeric, id_type_user numeric, name_user character varying, password_user character varying, avatar_user character varying, status_user boolean, deleted_user boolean, name_company character varying, status_company boolean, id_academic numeric, id_job numeric, dni_person character varying, name_person character varying, last_name_person character varying, address_person character varying, phone_person character varying, title_academic character varying, abbreviation_academic character varying, nivel_academic character varying, name_job character varying, address_job character varying, phone_job character varying, position_job character varying, name_type_user character varying, description_type_user character varying, status_type_user boolean, id_profile numeric, type_profile core."TYPE_PROFILE", name_profile character varying, description_profile character varying, status_profile boolean)
    LANGUAGE plpgsql
    AS $$
			 DECLARE
				_UPDATE_ACADEMIC BOOLEAN;
				_UPDATE_JOB BOOLEAN;
				_UPDATE_PERSON BOOLEAN;
			 	_UPDATE_USER BOOLEAN;
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
								RETURN QUERY select vu.id_user, vu.id_company, vu.id_person, vu.id_type_user, vu.name_user, vu.password_user, vu.avatar_user, vu.status_user, vu.deleted_user, vc.name_company, vc.status_company, vp.id_academic, vp.id_job, vp.dni_person, vp.name_person, vp.last_name_person, vp.address_person, vp.phone_person, va.title_academic, va.abbreviation_academic, va.nivel_academic, vj.name_job, vj.address_job, vj.phone_job, vj.position_job, vtu.name_type_user, vtu.description_type_user, vtu.status_type_user, vpr.id_profile, vpr.type_profile, vpr.name_profile, vpr.description_profile, vpr.status_profile from core.view_user vu
										inner join core.view_company vc on vu.id_company = vc.id_company
										inner join core.view_person vp on vu.id_person = vp.id_person
										inner join core.view_academic va on vp.id_academic = va.id_academic
										inner join core.view_job vj on vp.id_job = vj.id_job
										inner join core.view_type_user vtu on vtu.id_type_user = vu.id_type_user
										inner join core.view_profile vpr on vtu.id_profile = vpr.id_profile 
										where vu.id_user = _id_user;							
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
			 
$$;


ALTER FUNCTION core.dml_user_update_modified(id_user_ numeric, _id_user numeric, _id_company numeric, _id_person numeric, _id_type_user numeric, _name_user character varying, _password_user character varying, _avatar_user character varying, _status_user boolean, _deleted_user boolean, _id_academic numeric, _id_job numeric, _dni_person character varying, _name_person character varying, _last_name_person character varying, _address_person character varying, _phone_person character varying, _title_academic character varying, _abbreviation_academic character varying, _nivel_academic character varying, _name_job character varying, _address_job character varying, _phone_job character varying, _position_job character varying) OWNER TO postgres;

--
-- TOC entry 333 (class 1255 OID 25737)
-- Name: dml_user_upload_avatar(numeric, character varying); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_user_upload_avatar(_id_user numeric, _new_avatar character varying) RETURNS TABLE(status_upload_avatar boolean, old_path character varying, new_path character varying)
    LANGUAGE plpgsql
    AS $$
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
			
$$;


ALTER FUNCTION core.dml_user_upload_avatar(_id_user numeric, _new_avatar character varying) OWNER TO postgres;

--
-- TOC entry 350 (class 1255 OID 25838)
-- Name: dml_validation_create(numeric, numeric, core."TYPE_VALIDATION", boolean, character varying, character varying, boolean); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_validation_create(id_user_ numeric, _id_company numeric, _type_validation core."TYPE_VALIDATION", _status_validation boolean, _pattern_validation character varying, _message_validation character varying, _deleted_validation boolean) RETURNS numeric
    LANGUAGE plpgsql
    AS $_$
			DECLARE
				_RESPONSE BOOLEAN DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_ATT NUMERIC;
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
			
				_CURRENT_ID = (select nextval('core.serial_validation')-1);
				_COUNT = (select count(*) from core.view_validation t where t.id_validation = _CURRENT_ID);

				IF (_COUNT = 0) THEN
				
					_COUNT_ATT = (select count(*) from core.view_validation t where t.id_validation = _CURRENT_ID);
				
					IF (_COUNT_ATT = 0) THEN 
						FOR _X IN INSERT INTO core.validation(id_validation, id_company, type_validation, status_validation, pattern_validation, message_validation, deleted_validation) VALUES (_CURRENT_ID, $2 , $3 , $4 , $5 , $6 , $7 ) RETURNING id_validation LOOP
							_RETURNING = _X.id_validation;
						END LOOP;

						IF (_RETURNING >= 1) THEN
							_SAVE_LOG = (select * from core.global_save_log());
							IF (_SAVE_LOG) THEN
								_RESPONSE = (core.dml_system_event_create($1,'validation',_CURRENT_ID,'CREATE', now()::timestamp, false));
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
						_EXCEPTION = 'Ya existe un registro con el id_validation '||_id_validation||'';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
				ELSE
					_EXCEPTION = 'El registro con id '||_CURRENT_ID||' ya se encuentra registrado';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				END IF;
				exception when others then 
					-- RAISE NOTICE '%', SQLERRM;
					IF (_CURRENT_ID >= 1) THEN
						EXECUTE 'select setval(''core.serial_validation'', '||_CURRENT_ID||')';
					END IF;
					IF (_EXCEPTION = 'Internal Error') THEN
						RAISE EXCEPTION '%',SQLERRM USING DETAIL = '_database';
					ELSE
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
			END;
			$_$;


ALTER FUNCTION core.dml_validation_create(id_user_ numeric, _id_company numeric, _type_validation core."TYPE_VALIDATION", _status_validation boolean, _pattern_validation character varying, _message_validation character varying, _deleted_validation boolean) OWNER TO postgres;

--
-- TOC entry 368 (class 1255 OID 25927)
-- Name: dml_validation_create_modified(numeric, core."TYPE_VALIDATION"); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_validation_create_modified(id_user_ numeric, _type_validation core."TYPE_VALIDATION") RETURNS TABLE(id_validation numeric, id_company numeric, type_validation core."TYPE_VALIDATION", status_validation boolean, pattern_validation character varying, message_validation character varying, deleted_validation boolean, name_company character varying, status_company boolean)
    LANGUAGE plpgsql
    AS $$
			DECLARE
				_ID_COMPANY NUMERIC;
				_COUNT_TYPE_VALIDATION NUMERIC;
				_ID_VALIDATION NUMERIC;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			BEGIN
				_ID_COMPANY = (select vu.id_company from core.view_user vu where vu.id_user = id_user_);

				_COUNT_TYPE_VALIDATION = (select count(*) from core.view_validation vv where vv.type_validation = _type_validation and vv.id_company = _ID_COMPANY);
				
				IF (_COUNT_TYPE_VALIDATION = 0) THEN
					_ID_VALIDATION = (select * from core.dml_validation_create(id_user_, _ID_COMPANY, _type_validation, false, 'patter', 'mensaje', false));
					
					IF (_ID_VALIDATION >= 1) THEN
						RETURN QUERY select vv.id_validation, vv.id_company, vv.type_validation, vv.status_validation, vv.pattern_validation, vv.message_validation, vv.deleted_validation, vc.name_company, vc.status_company from core.view_validation vv
							inner join core.view_company vc on vv.id_company = vc.id_company where vv.id_validation = _ID_VALIDATION;
					ELSE
						_EXCEPTION = 'Ocurrió un error al ingresar la validación';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
				ELSE
					_EXCEPTION = 'Ya existe una validacion de tipo '||_type_validation||'';
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
			
$$;


ALTER FUNCTION core.dml_validation_create_modified(id_user_ numeric, _type_validation core."TYPE_VALIDATION") OWNER TO postgres;

--
-- TOC entry 352 (class 1255 OID 25840)
-- Name: dml_validation_delete(numeric, numeric); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_validation_delete(id_user_ numeric, _id_validation numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_DELETED NUMERIC;
				_COUNT_DEPENDENCY NUMERIC;
				_RETURNING NUMERIC;
				_X RECORD;
				_SAVE_LOG BOOLEAN DEFAULT false;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
			 	_COUNT = (select count(*) from core.view_validation t where t.id_validation = $2);
					
				IF (_COUNT = 1) THEN
					_COUNT_DELETED = (select count(*) from core.view_validation t where t.id_validation = $2 and deleted_validation = true); 
					IF (_COUNT_DELETED = 0) THEN 
						_COUNT_DEPENDENCY = (select * from core.utils_get_table_dependency('core','validation', $2));
						
						IF (_COUNT_DEPENDENCY > 0) THEN
							_EXCEPTION = 'No se puede eliminar el registro, mantiene dependencia en otros procesos.';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						ELSE
							FOR _X IN UPDATE core.validation SET deleted_validation=true WHERE id_validation = $2 RETURNING id_validation LOOP
								_RETURNING = _X.id_validation;
							END LOOP;
							IF (_RETURNING >= 1) THEN
								_SAVE_LOG = (select * from core.global_save_log());
								IF (_SAVE_LOG) THEN
									_RESPONSE = (core.dml_system_event_create($1,'validation',$2,'DELETE', now()::timestamp, false));
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
								_EXCEPTION = 'Ocurrió un error al eliminar el registro';
								RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
							END IF;
						END IF;
					ELSE
						_EXCEPTION = 'EL registro ya se encuentra eliminado';
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
			 $_$;


ALTER FUNCTION core.dml_validation_delete(id_user_ numeric, _id_validation numeric) OWNER TO postgres;

--
-- TOC entry 351 (class 1255 OID 25839)
-- Name: dml_validation_update(numeric, numeric, numeric, core."TYPE_VALIDATION", boolean, character varying, character varying, boolean); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_validation_update(id_user_ numeric, _id_validation numeric, _id_company numeric, _type_validation core."TYPE_VALIDATION", _status_validation boolean, _pattern_validation character varying, _message_validation character varying, _deleted_validation boolean) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT NUMERIC;
				_COUNT_ATT NUMERIC;
				_COUNT_DELETED NUMERIC;
				_COUNT_EXTERNALS_IDS NUMERIC;
				_RETURNING NUMERIC;
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
			
				_COUNT = (select count(*) from core.view_validation t where t.id_validation = $2);
				
				IF (_COUNT = 1) THEN
					_COUNT_DELETED = (select count(*) from core.view_validation t where t.id_validation = $2 and deleted_validation = true); 
					IF (_COUNT_DELETED = 0) THEN
						
						_COUNT_ATT = (select count(*) from core.view_validation t where t.id_validation = _id_validation and t.id_validation != _id_validation);
						
						IF (_COUNT_ATT = 0) THEN 
							FOR _X IN UPDATE core.validation SET id_company=$3, type_validation=$4, status_validation=$5, pattern_validation=$6, message_validation=$7, deleted_validation=$8 WHERE id_validation=$2 RETURNING id_validation LOOP
								_RETURNING = _X.id_validation;
							END LOOP;

							IF (_RETURNING >= 1) THEN
								_SAVE_LOG = (select * from core.global_save_log());
								IF (_SAVE_LOG) THEN
									_RESPONSE = (core.dml_system_event_create($1,'validation',$2,'UPDATE', now()::timestamp, false));
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
							_EXCEPTION = 'Ya existe un registro con el id_validation '||_id_validation||'';
							RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
						END IF;
					ELSE 
						_EXCEPTION = 'EL registro se encuentra eliminado';
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
			 $_$;


ALTER FUNCTION core.dml_validation_update(id_user_ numeric, _id_validation numeric, _id_company numeric, _type_validation core."TYPE_VALIDATION", _status_validation boolean, _pattern_validation character varying, _message_validation character varying, _deleted_validation boolean) OWNER TO postgres;

--
-- TOC entry 369 (class 1255 OID 25928)
-- Name: dml_validation_update_modified(numeric, numeric, numeric, core."TYPE_VALIDATION", boolean, character varying, character varying, boolean); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.dml_validation_update_modified(id_user_ numeric, _id_validation numeric, _id_company numeric, _type_validation core."TYPE_VALIDATION", _status_validation boolean, _pattern_validation character varying, _message_validation character varying, _deleted_validation boolean) RETURNS TABLE(id_validation numeric, id_company numeric, type_validation core."TYPE_VALIDATION", status_validation boolean, pattern_validation character varying, message_validation character varying, deleted_validation boolean, name_company character varying, status_company boolean)
    LANGUAGE plpgsql
    AS $$
			DECLARE
				_COUNT_TYPE_VALIDATION NUMERIC;
				_UPDATE_VALIDATION BOOLEAN;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			BEGIN
				_COUNT_TYPE_VALIDATION = (select count(*) from core.view_validation vv where vv.type_validation = _type_validation and vv.id_validation != _id_validation and vv.id_company = _id_company);
				
				IF (_COUNT_TYPE_VALIDATION = 0) THEN
					_UPDATE_VALIDATION = (select * from core.dml_validation_update(id_user_, _id_validation, _id_company, _type_validation, _status_validation, _pattern_validation, _message_validation, false));
					
					IF (_UPDATE_VALIDATION) THEN
						RETURN QUERY select vv.id_validation, vv.id_company, vv.type_validation, vv.status_validation, vv.pattern_validation, vv.message_validation, vv.deleted_validation, vc.name_company, vc.status_company from core.view_validation vv
							inner join core.view_company vc on vv.id_company = vc.id_company where vv.id_validation = _ID_VALIDATION;
					ELSE
						_EXCEPTION = 'Ocurrió un error al actualizar la validación';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					END IF;
				ELSE
					_EXCEPTION = 'Ya existe una validacion de tipo '||_type_validation||'';
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
			
$$;


ALTER FUNCTION core.dml_validation_update_modified(id_user_ numeric, _id_validation numeric, _id_company numeric, _type_validation core."TYPE_VALIDATION", _status_validation boolean, _pattern_validation character varying, _message_validation character varying, _deleted_validation boolean) OWNER TO postgres;

--
-- TOC entry 321 (class 1255 OID 25487)
-- Name: global_encryption_password(); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.global_encryption_password() RETURNS text
    LANGUAGE plpgsql
    AS $_$
DECLARE
	-- (OJO) LA CONTRASEÑA TIENE QUE SER DE 16 DIGITOS --
  	_PASSWORD TEXT DEFAULT 'eNcRyP$WSFE$2022';
	BEGIN
		RETURN _PASSWORD;
	END;
$_$;


ALTER FUNCTION core.global_encryption_password() OWNER TO postgres;

--
-- TOC entry 306 (class 1255 OID 25449)
-- Name: global_save_log(); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.global_save_log() RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
  	_STATE_SAVE_LOGS BOOLEAN DEFAULT true;
	BEGIN	
		RETURN _STATE_SAVE_LOGS;
	END;
$$;


ALTER FUNCTION core.global_save_log() OWNER TO postgres;

--
-- TOC entry 327 (class 1255 OID 25493)
-- Name: security_cap_aes_decrypt(character varying); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.security_cap_aes_decrypt(_text_encrypted character varying) RETURNS text
    LANGUAGE plpgsql
    AS $_$
DECLARE
  	_HEX TEXT DEFAULT '';
  	_PASS_ENCRYPT_ENCRYPTED TEXT DEFAULT '';
  	_TEXT_ALGORITHM_ENCRYPTED TEXT DEFAULT '';
  	_TEXT TEXT DEFAULT '';
	BEGIN
		_PASS_ENCRYPT_ENCRYPTED = (select * from core.security_cap_algorithm_encrypt((select * from core.global_encryption_password())));
		_HEX = (select encode((_PASS_ENCRYPT_ENCRYPTED)::bytea, 'hex'));
		
		_TEXT_ALGORITHM_ENCRYPTED = (select convert_from(
		  core.decrypt_iv(
			decode(''||$1||'','base64')::bytea,
			decode(''||_HEX||'','hex')::bytea,
			decode(''||_HEX||'','hex')::bytea, 
			'aes'
		  ),
		  'utf8'
		));
		
		_TEXT = (select * from core.security_cap_algorithm_decrypt(_TEXT_ALGORITHM_ENCRYPTED));
	
		RETURN _TEXT;
	END;
$_$;


ALTER FUNCTION core.security_cap_aes_decrypt(_text_encrypted character varying) OWNER TO postgres;

--
-- TOC entry 326 (class 1255 OID 25492)
-- Name: security_cap_aes_encrypt(character varying); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.security_cap_aes_encrypt(_text character varying) RETURNS text
    LANGUAGE plpgsql
    AS $_$
DECLARE
  	_HEX TEXT DEFAULT '';
	_PASS_ENCRYPT_ENCRYPTED TEXT DEFAULT '';
	_TEXT_ENCRYPTED TEXT DEFAULT '';
  	_CIPHER_TEXT TEXT DEFAULT '';
	_CIPHER_TEXT_BASE64 TEXT DEFAULT '';
	BEGIN	
		_PASS_ENCRYPT_ENCRYPTED = (select * from core.security_cap_algorithm_encrypt((select * from core.global_encryption_password())));
		_TEXT_ENCRYPTED = (select * from core.security_cap_algorithm_encrypt($1));
		
		_HEX = (select encode((_PASS_ENCRYPT_ENCRYPTED)::bytea, 'hex'));
		
		_CIPHER_TEXT = (select core.encrypt_iv(
			(''||_TEXT_ENCRYPTED||'')::bytea,
			decode(''||_HEX||'','hex')::bytea,
			decode(''||_HEX||'','hex')::bytea,
			'aes'::text
		  )::text);
		  
		  _CIPHER_TEXT_BASE64 = (select encode((''||_CIPHER_TEXT||'')::bytea, 'base64'));
		  
		RETURN _CIPHER_TEXT_BASE64;
	END;
$_$;


ALTER FUNCTION core.security_cap_aes_encrypt(_text character varying) OWNER TO postgres;

--
-- TOC entry 325 (class 1255 OID 25491)
-- Name: security_cap_algorithm_decrypt(character varying); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.security_cap_algorithm_decrypt(_string_position_invert character varying) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
  	_STRING_INVERT TEXT DEFAULT '';
	_TEXT TEXT DEFAULT '';
	BEGIN	
		_STRING_INVERT = (select * from core.security_cap_string_position_invert(_string_position_invert));
		_TEXT = (select * from core.security_cap_string_invert(_STRING_INVERT));
		RETURN _TEXT;
	END;
$$;


ALTER FUNCTION core.security_cap_algorithm_decrypt(_string_position_invert character varying) OWNER TO postgres;

--
-- TOC entry 324 (class 1255 OID 25490)
-- Name: security_cap_algorithm_encrypt(character varying); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.security_cap_algorithm_encrypt(_text character varying) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
  	_STRING_INVERT TEXT DEFAULT '';
	_STRING_POSITION_INVERT TEXT DEFAULT '';
	BEGIN	
		_STRING_INVERT = (select * from core.security_cap_string_invert(_text));
		_STRING_POSITION_INVERT = (select * from core.security_cap_string_position_invert(_STRING_INVERT));
		RETURN _STRING_POSITION_INVERT;
	END;
$$;


ALTER FUNCTION core.security_cap_algorithm_encrypt(_text character varying) OWNER TO postgres;

--
-- TOC entry 322 (class 1255 OID 25488)
-- Name: security_cap_string_invert(character varying); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.security_cap_string_invert(_string character varying) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
  	_INVERTED TEXT DEFAULT '';
	H_ TEXT DEFAULT '';
	_X RECORD;
	BEGIN	
		FOR _X IN REVERSE char_length(_string)..1 LOOP
			_INVERTED = CONCAT(_INVERTED, (select substring(_string, _X, 1)));
        END LOOP;
		RETURN _INVERTED;
	END;
$$;


ALTER FUNCTION core.security_cap_string_invert(_string character varying) OWNER TO postgres;

--
-- TOC entry 323 (class 1255 OID 25489)
-- Name: security_cap_string_position_invert(character varying); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.security_cap_string_position_invert(_string character varying) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
  	_POSITION_INVERTED TEXT DEFAULT '';
	_FIRST TEXT DEFAULT '';
	_SECOND TEXT DEFAULT '';
	_INTERMEDIATE_POSITION INTEGER;
	_X RECORD;
	BEGIN	
		_INTERMEDIATE_POSITION = char_length(_string) / 2;
		_FIRST = substring(_string, 1, _INTERMEDIATE_POSITION);
		
		IF (char_length(_string) % 2 = 0)THEN
			_SECOND = substring(_string, _INTERMEDIATE_POSITION +1, char_length(_string));
			_POSITION_INVERTED = CONCAT(_SECOND,_FIRST);
		ELSE 
			_SECOND = substring(_string, _INTERMEDIATE_POSITION +2, char_length(_string));
			_POSITION_INVERTED = CONCAT(_SECOND,substring(_string, _INTERMEDIATE_POSITION+1, 1),_FIRST);
		END IF;
		RETURN _POSITION_INVERTED;
	END;
$$;


ALTER FUNCTION core.security_cap_string_position_invert(_string character varying) OWNER TO postgres;

--
-- TOC entry 328 (class 1255 OID 25730)
-- Name: utils_get_date_maximum_hour(); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.utils_get_date_maximum_hour() RETURNS timestamp without time zone
    LANGUAGE plpgsql
    AS $$
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
			 
$$;


ALTER FUNCTION core.utils_get_date_maximum_hour() OWNER TO postgres;

--
-- TOC entry 304 (class 1255 OID 25438)
-- Name: utils_get_table_dependency(character varying, character varying, numeric); Type: FUNCTION; Schema: core; Owner: postgres
--

CREATE FUNCTION core.utils_get_table_dependency(_schema character varying, _table_name character varying, _id_deleted numeric) RETURNS numeric
    LANGUAGE plpgsql
    AS $_$
			 DECLARE
				_RESPONSE boolean DEFAULT false;
				_COUNT_TABLE NUMERIC;
				_COUNT_ID NUMERIC;
				_COUNT NUMERIC = 0;
				_COUNT_ROW_DELETED NUMERIC; 
				_TABLE CHARACTER VARYING DEFAULT '';
				_ID CHARACTER VARYING DEFAULT '';
				_X RECORD;
				_Y RECORD;
				_Z RECORD;
				_EXCEPTION TEXT DEFAULT 'Internal Error';
			 BEGIN
				_COUNT_TABLE = (SELECT count(*) FROM information_schema.tables t WHERE t.table_schema = ''||$1||'' and t.table_type = 'BASE TABLE' and t.table_name = ''||$2||'');
				
				IF (_COUNT_TABLE != 1) THEN
					_EXCEPTION = 'La tabla '||$2||' no se encuentra registrada';
					RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
				ELSE
					FOR _X IN EXECUTE 'SELECT count(*) FROM '||$1||'.'||$2||' t WHERE t.id_'||$2||' = '||$3||'' LOOP
						_COUNT_ID = _X.count;
					END LOOP;
					
					IF (_COUNT_ID = 0) THEN
						_EXCEPTION = 'El registro con id '||$3||' no se encuentra registrado en la tabla '||$2||'';
						RAISE EXCEPTION '%',_EXCEPTION USING DETAIL = '_database';
					ELSE 
						FOR _Y IN SELECT c.table_name::character varying as _table FROM information_schema.columns c WHERE c.table_schema = ''||$1||'' and c.column_name = 'id_'||$2||'' and c.is_nullable = 'NO' and c.ordinal_position != 1 LOOP
							_TABLE = ''||$1||'.'||_Y._table||'';
							_ID = 't.id_'||$2||'';
							
							_COUNT_ROW_DELETED = (SELECT count(*) FROM information_schema.columns t WHERE t.table_schema = ''||$1||'' and t.table_name = ''||_Y._table||'' and t.column_name = 'deleted_'||_Y._table||'');
							
							IF (_COUNT_ROW_DELETED) THEN
								FOR _Z IN EXECUTE 'select count(*) from '||$1||'.view_'||_Y._table||' t where '||_ID||' = '||$3||'' LOOP
									-- DEBUG
									IF (_Z.count >= 1) THEN
										RAISE NOTICE 'TABLE = %', _Y._table;
										RAISE NOTICE 'ID = %', $3;
									END IF;
									-- DEBUG
									_COUNT = _COUNT + _Z.count;
								END LOOP;
							ELSE
								FOR _Z IN EXECUTE 'select count(*) from '||_TABLE||' t where '||_ID||' = '||$3||'' LOOP
									-- DEBUG
									IF (_Z.count >= 1) THEN
										RAISE NOTICE 'TABLE = %', _Y._table;
										RAISE NOTICE 'ID = %', $3;
									END IF;
									-- DEBUG
									_COUNT = _COUNT + _Z.count;
								END LOOP;
							END IF;
						END LOOP;
						RETURN _COUNT;
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
			 -- select * from core.utils_get_table_dependency('core','user', 1)
			 
$_$;


ALTER FUNCTION core.utils_get_table_dependency(_schema character varying, _table_name character varying, _id_deleted numeric) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 25614)
-- Name: emission_point; Type: TABLE; Schema: business; Owner: postgres
--

CREATE TABLE business.emission_point (
    id_emission_point numeric(5,0) NOT NULL,
    id_taxpayer numeric(5,0) NOT NULL,
    value_emission_point character varying(3),
    description_emission_point character varying(250),
    deleted_emission_point boolean
);


ALTER TABLE business.emission_point OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 25609)
-- Name: establishment; Type: TABLE; Schema: business; Owner: postgres
--

CREATE TABLE business.establishment (
    id_establishment numeric(5,0) NOT NULL,
    id_taxpayer numeric(5,0) NOT NULL,
    value_establishment character varying(3),
    description_establishment character varying(250),
    deleted_establishment boolean
);


ALTER TABLE business.establishment OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 25588)
-- Name: institution; Type: TABLE; Schema: business; Owner: postgres
--

CREATE TABLE business.institution (
    id_institution numeric(5,0) NOT NULL,
    id_taxpayer numeric(5,0) NOT NULL,
    type_environment business."TYPE_ENVIRONMENT" NOT NULL,
    name_institution character varying(100),
    description_institution character varying(250),
    address_institution character varying(300),
    status_institution boolean,
    status_by_batch_institution boolean,
    deleted_institution boolean
);


ALTER TABLE business.institution OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 25627)
-- Name: mail_server; Type: TABLE; Schema: business; Owner: postgres
--

CREATE TABLE business.mail_server (
    id_mail_server numeric(2,0) NOT NULL,
    id_taxpayer numeric(5,0),
    type_mail_server business."TYPE_MAIL_SERVER",
    host_mail_server character varying(67),
    port_mail_server numeric(5,0),
    secure_mail_server boolean,
    user_mail_server character varying(320),
    password_mail_server character varying(250),
    status_mail_server boolean
);


ALTER TABLE business.mail_server OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 25596)
-- Name: sequence; Type: TABLE; Schema: business; Owner: postgres
--

CREATE TABLE business.sequence (
    id_sequence numeric(5,0) NOT NULL,
    id_institution numeric(5,0) NOT NULL,
    id_establishment numeric(5,0) NOT NULL,
    id_emission_point numeric(5,0) NOT NULL,
    type_environment business."TYPE_ENVIRONMENT" NOT NULL,
    type_voucher business."TYPE_VOUCHER" NOT NULL,
    number_code_sequence character varying(8),
    status_sequence boolean,
    deleted_sequence boolean
);


ALTER TABLE business.sequence OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 25959)
-- Name: serial_emission_point; Type: SEQUENCE; Schema: business; Owner: postgres
--

CREATE SEQUENCE business.serial_emission_point
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 99999
    CACHE 1;


ALTER TABLE business.serial_emission_point OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 25957)
-- Name: serial_establishment; Type: SEQUENCE; Schema: business; Owner: postgres
--

CREATE SEQUENCE business.serial_establishment
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 99999
    CACHE 1;


ALTER TABLE business.serial_establishment OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 25955)
-- Name: serial_institution; Type: SEQUENCE; Schema: business; Owner: postgres
--

CREATE SEQUENCE business.serial_institution
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 99999
    CACHE 1;


ALTER TABLE business.serial_institution OWNER TO postgres;

--
-- TOC entry 266 (class 1259 OID 26096)
-- Name: serial_institution_1; Type: SEQUENCE; Schema: business; Owner: apiwsfe
--

CREATE SEQUENCE business.serial_institution_1
    START WITH 2
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 9999999999
    CACHE 1;


ALTER TABLE business.serial_institution_1 OWNER TO apiwsfe;

--
-- TOC entry 269 (class 1259 OID 26102)
-- Name: serial_institution_2; Type: SEQUENCE; Schema: business; Owner: apiwsfe
--

CREATE SEQUENCE business.serial_institution_2
    START WITH 2
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 9999999999
    CACHE 1;


ALTER TABLE business.serial_institution_2 OWNER TO apiwsfe;

--
-- TOC entry 254 (class 1259 OID 25961)
-- Name: serial_mail_server; Type: SEQUENCE; Schema: business; Owner: postgres
--

CREATE SEQUENCE business.serial_mail_server
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 99
    CACHE 1;


ALTER TABLE business.serial_mail_server OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 25963)
-- Name: serial_sequence; Type: SEQUENCE; Schema: business; Owner: postgres
--

CREATE SEQUENCE business.serial_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 99999
    CACHE 1;


ALTER TABLE business.serial_sequence OWNER TO postgres;

--
-- TOC entry 267 (class 1259 OID 26098)
-- Name: serial_sequence_1; Type: SEQUENCE; Schema: business; Owner: apiwsfe
--

CREATE SEQUENCE business.serial_sequence_1
    START WITH 2
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 9999999999
    CACHE 1;


ALTER TABLE business.serial_sequence_1 OWNER TO apiwsfe;

--
-- TOC entry 268 (class 1259 OID 26100)
-- Name: serial_sequence_2; Type: SEQUENCE; Schema: business; Owner: apiwsfe
--

CREATE SEQUENCE business.serial_sequence_2
    START WITH 2
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 9999999999
    CACHE 1;


ALTER TABLE business.serial_sequence_2 OWNER TO apiwsfe;

--
-- TOC entry 270 (class 1259 OID 26104)
-- Name: serial_sequence_3; Type: SEQUENCE; Schema: business; Owner: apiwsfe
--

CREATE SEQUENCE business.serial_sequence_3
    START WITH 2
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 9999999999
    CACHE 1;


ALTER TABLE business.serial_sequence_3 OWNER TO apiwsfe;

--
-- TOC entry 271 (class 1259 OID 26106)
-- Name: serial_sequence_4; Type: SEQUENCE; Schema: business; Owner: apiwsfe
--

CREATE SEQUENCE business.serial_sequence_4
    START WITH 2
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 9999999999
    CACHE 1;


ALTER TABLE business.serial_sequence_4 OWNER TO apiwsfe;

--
-- TOC entry 257 (class 1259 OID 25967)
-- Name: serial_setting_taxpayer; Type: SEQUENCE; Schema: business; Owner: postgres
--

CREATE SEQUENCE business.serial_setting_taxpayer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 99999
    CACHE 1;


ALTER TABLE business.serial_setting_taxpayer OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 25953)
-- Name: serial_taxpayer; Type: SEQUENCE; Schema: business; Owner: postgres
--

CREATE SEQUENCE business.serial_taxpayer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 99999
    CACHE 1;


ALTER TABLE business.serial_taxpayer OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 25965)
-- Name: serial_voucher; Type: SEQUENCE; Schema: business; Owner: postgres
--

CREATE SEQUENCE business.serial_voucher
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 9999999999
    CACHE 1;


ALTER TABLE business.serial_voucher OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 25619)
-- Name: setting_taxpayer; Type: TABLE; Schema: business; Owner: postgres
--

CREATE TABLE business.setting_taxpayer (
    id_setting_taxpayer numeric(5,0) NOT NULL,
    id_mail_server numeric(5,0),
    mailing_setting_taxpayer boolean,
    from_setting_taxpayer character varying(250),
    subject_setting_taxpayer character varying(250),
    html_setting_taxpayer text,
    download_note_setting_taxpayer character varying(500),
    logo_path_setting_taxpayer character varying(100)
);


ALTER TABLE business.setting_taxpayer OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 25580)
-- Name: taxpayer; Type: TABLE; Schema: business; Owner: postgres
--

CREATE TABLE business.taxpayer (
    id_taxpayer numeric(5,0) NOT NULL,
    id_company numeric(5,0) NOT NULL,
    id_user numeric(10,0) NOT NULL,
    id_setting_taxpayer numeric(5,0) NOT NULL,
    type_emission business."TYPE_EMISSION",
    business_name_taxpayer character varying(300),
    tradename_taxpayer character varying(300),
    ruc_taxpayer character varying(13),
    dir_matriz_taxpayer character varying(300),
    signature_password_taxpayer character varying(250),
    signature_path_taxpayer character varying(100),
    status_taxpayer boolean,
    accounting_obliged business."TYPE_ACCOUNTING_OBLIGED",
    status_by_batch_taxpayer boolean,
    deleted_taxpayer boolean
);


ALTER TABLE business.taxpayer OWNER TO postgres;

--
-- TOC entry 261 (class 1259 OID 25981)
-- Name: view_emission_point; Type: VIEW; Schema: business; Owner: postgres
--

CREATE VIEW business.view_emission_point AS
 SELECT t.id_emission_point,
    t.id_taxpayer,
    t.value_emission_point,
    t.description_emission_point,
    t.deleted_emission_point
   FROM business.emission_point t
  WHERE (t.deleted_emission_point = false)
  ORDER BY t.id_emission_point DESC;


ALTER TABLE business.view_emission_point OWNER TO postgres;

--
-- TOC entry 260 (class 1259 OID 25977)
-- Name: view_establishment; Type: VIEW; Schema: business; Owner: postgres
--

CREATE VIEW business.view_establishment AS
 SELECT t.id_establishment,
    t.id_taxpayer,
    t.value_establishment,
    t.description_establishment,
    t.deleted_establishment
   FROM business.establishment t
  WHERE (t.deleted_establishment = false)
  ORDER BY t.id_establishment DESC;


ALTER TABLE business.view_establishment OWNER TO postgres;

--
-- TOC entry 259 (class 1259 OID 25973)
-- Name: view_institution; Type: VIEW; Schema: business; Owner: postgres
--

CREATE VIEW business.view_institution AS
 SELECT t.id_institution,
    t.id_taxpayer,
    t.type_environment,
    t.name_institution,
    t.description_institution,
    t.address_institution,
    t.status_institution,
    t.status_by_batch_institution,
    t.deleted_institution
   FROM business.institution t
  WHERE (t.deleted_institution = false)
  ORDER BY t.id_institution DESC;


ALTER TABLE business.view_institution OWNER TO postgres;

--
-- TOC entry 262 (class 1259 OID 25985)
-- Name: view_mail_server; Type: VIEW; Schema: business; Owner: postgres
--

CREATE VIEW business.view_mail_server AS
 SELECT t.id_mail_server,
    t.id_taxpayer,
    t.type_mail_server,
    t.host_mail_server,
    t.port_mail_server,
    t.secure_mail_server,
    t.user_mail_server,
    t.password_mail_server,
    t.status_mail_server
   FROM business.mail_server t
  ORDER BY t.id_mail_server DESC;


ALTER TABLE business.view_mail_server OWNER TO postgres;

--
-- TOC entry 263 (class 1259 OID 25989)
-- Name: view_sequence; Type: VIEW; Schema: business; Owner: postgres
--

CREATE VIEW business.view_sequence AS
 SELECT t.id_sequence,
    t.id_institution,
    t.id_establishment,
    t.id_emission_point,
    t.type_environment,
    t.type_voucher,
    t.number_code_sequence,
    t.status_sequence,
    t.deleted_sequence
   FROM business.sequence t
  WHERE (t.deleted_sequence = false)
  ORDER BY t.id_sequence DESC;


ALTER TABLE business.view_sequence OWNER TO postgres;

--
-- TOC entry 265 (class 1259 OID 25998)
-- Name: view_setting_taxpayer; Type: VIEW; Schema: business; Owner: postgres
--

CREATE VIEW business.view_setting_taxpayer AS
 SELECT t.id_setting_taxpayer,
    t.id_mail_server,
    t.mailing_setting_taxpayer,
    t.from_setting_taxpayer,
    t.subject_setting_taxpayer,
    t.html_setting_taxpayer,
    t.download_note_setting_taxpayer,
    t.logo_path_setting_taxpayer
   FROM business.setting_taxpayer t
  ORDER BY t.id_setting_taxpayer DESC;


ALTER TABLE business.view_setting_taxpayer OWNER TO postgres;

--
-- TOC entry 258 (class 1259 OID 25969)
-- Name: view_taxpayer; Type: VIEW; Schema: business; Owner: postgres
--

CREATE VIEW business.view_taxpayer AS
 SELECT t.id_taxpayer,
    t.id_company,
    t.id_user,
    t.id_setting_taxpayer,
    t.type_emission,
    t.business_name_taxpayer,
    t.tradename_taxpayer,
    t.ruc_taxpayer,
    t.dir_matriz_taxpayer,
    t.signature_password_taxpayer,
    t.signature_path_taxpayer,
    t.status_taxpayer,
    t.accounting_obliged,
    t.status_by_batch_taxpayer,
    t.deleted_taxpayer
   FROM business.taxpayer t
  WHERE (t.deleted_taxpayer = false)
  ORDER BY t.id_taxpayer DESC;


ALTER TABLE business.view_taxpayer OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 25601)
-- Name: voucher; Type: TABLE; Schema: business; Owner: postgres
--

CREATE TABLE business.voucher (
    id_voucher numeric(10,0) NOT NULL,
    id_institution numeric(5,0) NOT NULL,
    type_environment business."TYPE_ENVIRONMENT" NOT NULL,
    type_emission business."TYPE_EMISSION" NOT NULL,
    type_voucher business."TYPE_VOUCHER" NOT NULL,
    number_voucher character varying(50),
    access_key_voucher character varying(49),
    emission_date_voucher timestamp without time zone,
    authorization_date_voucher timestamp without time zone,
    buyer_identifier_voucher character varying(13),
    body_voucher json,
    internal_status_voucher business."TYPE_VOUCHER_STATUS",
    global_status_voucher business."TYPE_VOUCHER_STATUS",
    action_pdf_voucher boolean,
    action_email_voucher boolean,
    action_alfresco_voucher boolean,
    messages_voucher json,
    deleted_voucher boolean
);


ALTER TABLE business.voucher OWNER TO postgres;

--
-- TOC entry 264 (class 1259 OID 25993)
-- Name: view_voucher; Type: VIEW; Schema: business; Owner: postgres
--

CREATE VIEW business.view_voucher AS
 SELECT t.id_voucher,
    t.id_institution,
    t.type_environment,
    t.type_emission,
    t.type_voucher,
    t.number_voucher,
    t.access_key_voucher,
    t.emission_date_voucher,
    t.authorization_date_voucher,
    t.buyer_identifier_voucher,
    t.body_voucher,
    t.internal_status_voucher,
    t.global_status_voucher,
    t.action_pdf_voucher,
    t.action_email_voucher,
    t.action_alfresco_voucher,
    t.messages_voucher,
    t.deleted_voucher
   FROM business.voucher t
  WHERE (t.deleted_voucher = false)
  ORDER BY t.id_voucher DESC;


ALTER TABLE business.view_voucher OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 25494)
-- Name: academic; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.academic (
    id_academic numeric(10,0) NOT NULL,
    title_academic character varying(250),
    abbreviation_academic character varying(50),
    nivel_academic character varying(100),
    deleted_academic boolean
);


ALTER TABLE core.academic OWNER TO postgres;

--
-- TOC entry 203 (class 1259 OID 25499)
-- Name: company; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.company (
    id_company numeric(5,0) NOT NULL,
    id_setting numeric(5,0) NOT NULL,
    name_company character varying(100),
    acronym_company character varying(50),
    address_company character varying(250),
    status_company boolean,
    deleted_company boolean
);


ALTER TABLE core.company OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 25504)
-- Name: job; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.job (
    id_job numeric(10,0) NOT NULL,
    name_job character varying(200),
    address_job character varying(200),
    phone_job character varying(13),
    position_job character varying(150),
    deleted_job boolean
);


ALTER TABLE core.job OWNER TO postgres;

--
-- TOC entry 205 (class 1259 OID 25512)
-- Name: navigation; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.navigation (
    id_navigation numeric(5,0) NOT NULL,
    id_company numeric(5,0) NOT NULL,
    name_navigation character varying(100),
    description_navigation character varying(250),
    type_navigation core."TYPE_NAVIGATION" NOT NULL,
    status_navigation boolean,
    content_navigation json,
    deleted_navigation boolean
);


ALTER TABLE core.navigation OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 25520)
-- Name: person; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.person (
    id_person numeric(10,0) NOT NULL,
    id_academic numeric(10,0) NOT NULL,
    id_job numeric(10,0) NOT NULL,
    dni_person character varying(20),
    name_person character varying(150),
    last_name_person character varying(150),
    address_person character varying(150),
    phone_person character varying(13),
    deleted_person boolean
);


ALTER TABLE core.person OWNER TO postgres;

--
-- TOC entry 207 (class 1259 OID 25528)
-- Name: profile; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.profile (
    id_profile numeric(5,0) NOT NULL,
    id_company numeric(5,0) NOT NULL,
    type_profile core."TYPE_PROFILE" NOT NULL,
    name_profile character varying(100),
    description_profile character varying(250),
    status_profile boolean,
    deleted_profile boolean
);


ALTER TABLE core.profile OWNER TO postgres;

--
-- TOC entry 208 (class 1259 OID 25533)
-- Name: profile_navigation; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.profile_navigation (
    id_profile_navigation numeric(5,0) NOT NULL,
    id_profile numeric(5,0) NOT NULL,
    id_navigation numeric(5,0) NOT NULL
);


ALTER TABLE core.profile_navigation OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 25745)
-- Name: serial_academic; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.serial_academic
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 9999999999
    CACHE 1;


ALTER TABLE core.serial_academic OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 25757)
-- Name: serial_company; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.serial_company
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 99999
    CACHE 1;


ALTER TABLE core.serial_company OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 25747)
-- Name: serial_job; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.serial_job
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 9999999999
    CACHE 1;


ALTER TABLE core.serial_job OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 25759)
-- Name: serial_navigation; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.serial_navigation
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 99999
    CACHE 1;


ALTER TABLE core.serial_navigation OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 25749)
-- Name: serial_person; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.serial_person
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 9999999999
    CACHE 1;


ALTER TABLE core.serial_person OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 25761)
-- Name: serial_profile; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.serial_profile
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 99999
    CACHE 1;


ALTER TABLE core.serial_profile OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 25751)
-- Name: serial_profile_navigation; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.serial_profile_navigation
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 99999
    CACHE 1;


ALTER TABLE core.serial_profile_navigation OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 25769)
-- Name: serial_session; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.serial_session
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 999999999999999
    CACHE 1;


ALTER TABLE core.serial_session OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 25753)
-- Name: serial_setting; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.serial_setting
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 99999
    CACHE 1;


ALTER TABLE core.serial_setting OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 25765)
-- Name: serial_system_event; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.serial_system_event
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 9999999999
    CACHE 1;


ALTER TABLE core.serial_system_event OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 25767)
-- Name: serial_type_user; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.serial_type_user
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 99999
    CACHE 1;


ALTER TABLE core.serial_type_user OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 25763)
-- Name: serial_user; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.serial_user
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 9999999999
    CACHE 1;


ALTER TABLE core.serial_user OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 25755)
-- Name: serial_validation; Type: SEQUENCE; Schema: core; Owner: postgres
--

CREATE SEQUENCE core.serial_validation
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 99999
    CACHE 1;


ALTER TABLE core.serial_validation OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 25567)
-- Name: session; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.session (
    id_session numeric(15,0) NOT NULL,
    id_user numeric(10,0) NOT NULL,
    host_session character varying(67),
    agent_session json,
    date_sign_in_session timestamp without time zone,
    date_sign_out_session timestamp without time zone,
    status_session boolean
);


ALTER TABLE core.session OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 25538)
-- Name: setting; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.setting (
    id_setting numeric(5,0) NOT NULL,
    expiration_token numeric(10,0),
    expiration_verification_code numeric(10,0),
    inactivity_time numeric(10,0),
    session_limit numeric(2,0),
    save_alfresco boolean,
    wait_autorization numeric(7,0),
    batch_shipping boolean,
    max_generation_pdf numeric(3,0),
    wait_generation_pdf numeric(7,0),
    deleted_setting boolean
);


ALTER TABLE core.setting OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 25543)
-- Name: system_event; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.system_event (
    id_system_event numeric(10,0) NOT NULL,
    id_user numeric(10,0) NOT NULL,
    table_system_event character varying(50),
    row_system_event numeric(10,0),
    action_system_event character varying(50),
    date_system_event timestamp without time zone,
    deleted_system_event boolean
);


ALTER TABLE core.system_event OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 25575)
-- Name: type_user; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.type_user (
    id_type_user numeric(5,0) NOT NULL,
    id_company numeric(5,0) NOT NULL,
    id_profile numeric(5,0) NOT NULL,
    name_type_user character varying(100),
    description_type_user character varying(250),
    status_type_user boolean,
    deleted_type_user boolean
);


ALTER TABLE core.type_user OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 25548)
-- Name: user; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core."user" (
    id_user numeric(10,0) NOT NULL,
    id_company numeric(5,0) NOT NULL,
    id_person numeric(10,0) NOT NULL,
    id_type_user numeric(5,0) NOT NULL,
    name_user character varying(320),
    password_user character varying(250),
    avatar_user character varying(50),
    status_user boolean,
    deleted_user boolean
);


ALTER TABLE core."user" OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 25556)
-- Name: validation; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.validation (
    id_validation numeric(5,0) NOT NULL,
    id_company numeric(5,0) NOT NULL,
    type_validation core."TYPE_VALIDATION" NOT NULL,
    status_validation boolean NOT NULL,
    pattern_validation character varying(500),
    message_validation character varying(250),
    deleted_validation boolean
);


ALTER TABLE core.validation OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 25771)
-- Name: view_academic; Type: VIEW; Schema: core; Owner: postgres
--

CREATE VIEW core.view_academic AS
 SELECT t.id_academic,
    t.title_academic,
    t.abbreviation_academic,
    t.nivel_academic,
    t.deleted_academic
   FROM core.academic t
  WHERE (t.deleted_academic = false)
  ORDER BY t.id_academic DESC;


ALTER TABLE core.view_academic OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 25795)
-- Name: view_company; Type: VIEW; Schema: core; Owner: postgres
--

CREATE VIEW core.view_company AS
 SELECT t.id_company,
    t.id_setting,
    t.name_company,
    t.acronym_company,
    t.address_company,
    t.status_company,
    t.deleted_company
   FROM core.company t
  WHERE (t.deleted_company = false)
  ORDER BY t.id_company DESC;


ALTER TABLE core.view_company OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 25775)
-- Name: view_job; Type: VIEW; Schema: core; Owner: postgres
--

CREATE VIEW core.view_job AS
 SELECT t.id_job,
    t.name_job,
    t.address_job,
    t.phone_job,
    t.position_job,
    t.deleted_job
   FROM core.job t
  WHERE (t.deleted_job = false)
  ORDER BY t.id_job DESC;


ALTER TABLE core.view_job OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 25799)
-- Name: view_navigation; Type: VIEW; Schema: core; Owner: postgres
--

CREATE VIEW core.view_navigation AS
 SELECT t.id_navigation,
    t.id_company,
    t.name_navigation,
    t.description_navigation,
    t.type_navigation,
    t.status_navigation,
    t.content_navigation,
    t.deleted_navigation
   FROM core.navigation t
  WHERE (t.deleted_navigation = false)
  ORDER BY t.id_navigation DESC;


ALTER TABLE core.view_navigation OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 25779)
-- Name: view_person; Type: VIEW; Schema: core; Owner: postgres
--

CREATE VIEW core.view_person AS
 SELECT t.id_person,
    t.id_academic,
    t.id_job,
    t.dni_person,
    t.name_person,
    t.last_name_person,
    t.address_person,
    t.phone_person,
    t.deleted_person
   FROM core.person t
  WHERE (t.deleted_person = false)
  ORDER BY t.id_person DESC;


ALTER TABLE core.view_person OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 25803)
-- Name: view_profile; Type: VIEW; Schema: core; Owner: postgres
--

CREATE VIEW core.view_profile AS
 SELECT t.id_profile,
    t.id_company,
    t.type_profile,
    t.name_profile,
    t.description_profile,
    t.status_profile,
    t.deleted_profile
   FROM core.profile t
  WHERE (t.deleted_profile = false)
  ORDER BY t.id_profile DESC;


ALTER TABLE core.view_profile OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 25783)
-- Name: view_profile_navigation; Type: VIEW; Schema: core; Owner: postgres
--

CREATE VIEW core.view_profile_navigation AS
 SELECT t.id_profile_navigation,
    t.id_profile,
    t.id_navigation
   FROM core.profile_navigation t
  ORDER BY t.id_profile_navigation DESC;


ALTER TABLE core.view_profile_navigation OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 25819)
-- Name: view_session; Type: VIEW; Schema: core; Owner: postgres
--

CREATE VIEW core.view_session AS
 SELECT t.id_session,
    t.id_user,
    t.host_session,
    t.agent_session,
    t.date_sign_in_session,
    t.date_sign_out_session,
    t.status_session
   FROM core.session t
  ORDER BY t.id_session DESC;


ALTER TABLE core.view_session OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 25787)
-- Name: view_setting; Type: VIEW; Schema: core; Owner: postgres
--

CREATE VIEW core.view_setting AS
 SELECT t.id_setting,
    t.expiration_token,
    t.expiration_verification_code,
    t.inactivity_time,
    t.session_limit,
    t.save_alfresco,
    t.wait_autorization,
    t.batch_shipping,
    t.max_generation_pdf,
    t.wait_generation_pdf,
    t.deleted_setting
   FROM core.setting t
  WHERE (t.deleted_setting = false)
  ORDER BY t.id_setting DESC;


ALTER TABLE core.view_setting OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 25811)
-- Name: view_system_event; Type: VIEW; Schema: core; Owner: postgres
--

CREATE VIEW core.view_system_event AS
 SELECT t.id_system_event,
    t.id_user,
    t.table_system_event,
    t.row_system_event,
    t.action_system_event,
    t.date_system_event,
    t.deleted_system_event
   FROM core.system_event t
  WHERE (t.deleted_system_event = false)
  ORDER BY t.id_system_event DESC;


ALTER TABLE core.view_system_event OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 25815)
-- Name: view_type_user; Type: VIEW; Schema: core; Owner: postgres
--

CREATE VIEW core.view_type_user AS
 SELECT t.id_type_user,
    t.id_company,
    t.id_profile,
    t.name_type_user,
    t.description_type_user,
    t.status_type_user,
    t.deleted_type_user
   FROM core.type_user t
  WHERE (t.deleted_type_user = false)
  ORDER BY t.id_type_user DESC;


ALTER TABLE core.view_type_user OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 25807)
-- Name: view_user; Type: VIEW; Schema: core; Owner: postgres
--

CREATE VIEW core.view_user AS
 SELECT t.id_user,
    t.id_company,
    t.id_person,
    t.id_type_user,
    t.name_user,
    t.password_user,
    t.avatar_user,
    t.status_user,
    t.deleted_user
   FROM core."user" t
  WHERE (t.deleted_user = false)
  ORDER BY t.id_user DESC;


ALTER TABLE core.view_user OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 25791)
-- Name: view_validation; Type: VIEW; Schema: core; Owner: postgres
--

CREATE VIEW core.view_validation AS
 SELECT t.id_validation,
    t.id_company,
    t.type_validation,
    t.status_validation,
    t.pattern_validation,
    t.message_validation,
    t.deleted_validation
   FROM core.validation t
  WHERE (t.deleted_validation = false)
  ORDER BY t.id_validation DESC;


ALTER TABLE core.view_validation OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 25945)
-- Name: view_validation_inner_company_user; Type: VIEW; Schema: core; Owner: postgres
--

CREATE VIEW core.view_validation_inner_company_user AS
 SELECT vv.id_validation,
    vv.id_company,
    vv.type_validation,
    vv.status_validation,
    vv.pattern_validation,
    vv.message_validation,
    vv.deleted_validation,
    vu.name_user
   FROM ((core.view_validation vv
     JOIN core.view_company vc ON ((vv.id_company = vc.id_company)))
     JOIN core.view_user vu ON ((vu.id_company = vc.id_company)))
  WHERE (vv.status_validation = true);


ALTER TABLE core.view_validation_inner_company_user OWNER TO postgres;

--
-- TOC entry 3481 (class 0 OID 25614)
-- Dependencies: 220
-- Data for Name: emission_point; Type: TABLE DATA; Schema: business; Owner: postgres
--

COPY business.emission_point (id_emission_point, id_taxpayer, value_emission_point, description_emission_point, deleted_emission_point) FROM stdin;
1	1	001	Punto de emisión 001	f
\.


--
-- TOC entry 3480 (class 0 OID 25609)
-- Dependencies: 219
-- Data for Name: establishment; Type: TABLE DATA; Schema: business; Owner: postgres
--

COPY business.establishment (id_establishment, id_taxpayer, value_establishment, description_establishment, deleted_establishment) FROM stdin;
1	1	001	Establecimiento 001	f
2	1	002	Establecimiento 001	f
\.


--
-- TOC entry 3477 (class 0 OID 25588)
-- Dependencies: 216
-- Data for Name: institution; Type: TABLE DATA; Schema: business; Owner: postgres
--

COPY business.institution (id_institution, id_taxpayer, type_environment, name_institution, description_institution, address_institution, status_institution, status_by_batch_institution, deleted_institution) FROM stdin;
2	1	2	patronato	Institución para el patronato	PASTAZA / PUYO / 9 DE OCTUBRE 1288 Y C. ATAHUALPA	t	f	f
1	1	2	municipio	Institución para el municipio	PASTAZA / PUYO / 9 DE OCTUBRE 1288 Y FRANCISCO DE ORELLANA	t	f	f
\.


--
-- TOC entry 3483 (class 0 OID 25627)
-- Dependencies: 222
-- Data for Name: mail_server; Type: TABLE DATA; Schema: business; Owner: postgres
--

COPY business.mail_server (id_mail_server, id_taxpayer, type_mail_server, host_mail_server, port_mail_server, secure_mail_server, user_mail_server, password_mail_server, status_mail_server) FROM stdin;
1	1	office365	smtp.office365.com	587	f	facturacion.electronica@puyo.gob.ec	RzzGHoqw6xehI8JW2L/vroqUfYyyCzZlylHDxy3Ll/I=	t
\.


--
-- TOC entry 3478 (class 0 OID 25596)
-- Dependencies: 217
-- Data for Name: sequence; Type: TABLE DATA; Schema: business; Owner: postgres
--

COPY business.sequence (id_sequence, id_institution, id_establishment, id_emission_point, type_environment, type_voucher, number_code_sequence, status_sequence, deleted_sequence) FROM stdin;
1	1	1	1	1	01	12345678	t	f
2	1	1	1	2	01	12345678	t	f
3	2	2	1	1	01	12345678	t	f
4	2	2	1	2	01	12345678	t	f
\.


--
-- TOC entry 3482 (class 0 OID 25619)
-- Dependencies: 221
-- Data for Name: setting_taxpayer; Type: TABLE DATA; Schema: business; Owner: postgres
--

COPY business.setting_taxpayer (id_setting_taxpayer, id_mail_server, mailing_setting_taxpayer, from_setting_taxpayer, subject_setting_taxpayer, html_setting_taxpayer, download_note_setting_taxpayer, logo_path_setting_taxpayer) FROM stdin;
1	1	t	GADMCP <facturacion.electronica@puyo.gob.ec>	GADMCP - Envío de comprobantes electrónicos	<div>\n    <strong>SALUDOS CORDIALES.</strong> Este comprobante ha sido generado automáticamente por un sistema de facturación\n    electrónica, por lo tanto no es necesario que responda este mensaje.\n    <br>\n    <br>\n    <strong>Estimado(a),</strong><br>\n    ${razonSocialComprador}<br><br>\n    Información del comprobante electrónico<br>\n    <strong>Comprobante:</strong> ${codDoc}<br>\n    <strong>Número Documento:</strong> ${estab}-${ptoEmi}-${secuencial}<br>\n    <strong>Fecha de emisión:</strong> ${fechaEmision}<br>\n    <strong>Monto total:</strong> ${importeTotal}<br>\n    <br>\n    <br>\n    Adjuntamos el comprobante en formato: <strong>XML y PDF</strong>\n</div>	Usted puede descargar su factura en: https://facturacion.puyo.gob.ec/	logo-1-575594.png
\.


--
-- TOC entry 3476 (class 0 OID 25580)
-- Dependencies: 215
-- Data for Name: taxpayer; Type: TABLE DATA; Schema: business; Owner: postgres
--

COPY business.taxpayer (id_taxpayer, id_company, id_user, id_setting_taxpayer, type_emission, business_name_taxpayer, tradename_taxpayer, ruc_taxpayer, dir_matriz_taxpayer, signature_password_taxpayer, signature_path_taxpayer, status_taxpayer, accounting_obliged, status_by_batch_taxpayer, deleted_taxpayer) FROM stdin;
1	1	2	1	1	GOBIERNO AUTONOMO DESCENTRALIZADO MUNICIPAL DEL CANTON PASTAZA	GADMCP	1660000250001	PASTAZA / PUYO / 9 DE OCTUBRE 1288 Y FRANCISCO DE ORELLANA	PpRVUjAMYd9D0FmPTw2SUQ==	signature-1-760920.p12	t	NO	f	f
\.

-- TOC entry 3475 (class 0 OID 25575)
-- Dependencies: 214
-- Data for Name: type_user; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.type_user (id_type_user, id_company, id_profile, name_type_user, description_type_user, status_type_user, deleted_type_user) FROM stdin;
1	1	1	Administrador	Tipo de usuario para el administrador	t	f
2	1	2	Consulta	Tipo de usuario para las consultas	t	f
3	1	3	Jefe	Tipo de usuario para los jefes pertinentes	t	f
\.


--
-- TOC entry 3472 (class 0 OID 25548)
-- Dependencies: 211
-- Data for Name: user; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core."user" (id_user, id_company, id_person, id_type_user, name_user, password_user, avatar_user, status_user, deleted_user) FROM stdin;
4	1	4	3	monicaespin06@gmail.com	MnPQNaXtWZm/QLeDsCaDLA==	default.svg	t	f
5	1	5	3	mastersyscomputer@hotmail.com	HwT5drY+1pK3mrDqPuaPBA==	default.svg	t	f
3	1	3	3	aeugenia1965@hotmail.com	n/LOhLCO/VstfNndoxr/BQ==	default.svg	t	f
1	1	1	1	david.freire@gmail.com	J0oxaiK1wrJ1puhHL7dc9Q==	avatar-1-66561.jpg	t	f
2	1	2	1	municipio@puyo.gob.ec	obGCw7WcILf9eYD3RdztaA==	avatar-2-815103.jpg	t	f
\.


--
-- TOC entry 3473 (class 0 OID 25556)
-- Dependencies: 212
-- Data for Name: validation; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.validation (id_validation, id_company, type_validation, status_validation, pattern_validation, message_validation, deleted_validation) FROM stdin;
\.


--
-- TOC entry 3517 (class 0 OID 0)
-- Dependencies: 253
-- Name: serial_emission_point; Type: SEQUENCE SET; Schema: business; Owner: postgres
--

SELECT pg_catalog.setval('business.serial_emission_point', 2, true);


--
-- TOC entry 3518 (class 0 OID 0)
-- Dependencies: 252
-- Name: serial_establishment; Type: SEQUENCE SET; Schema: business; Owner: postgres
--

SELECT pg_catalog.setval('business.serial_establishment', 3, true);


--
-- TOC entry 3519 (class 0 OID 0)
-- Dependencies: 251
-- Name: serial_institution; Type: SEQUENCE SET; Schema: business; Owner: postgres
--

SELECT pg_catalog.setval('business.serial_institution', 3, true);


--
-- TOC entry 3520 (class 0 OID 0)
-- Dependencies: 266
-- Name: serial_institution_1; Type: SEQUENCE SET; Schema: business; Owner: apiwsfe
--

SELECT pg_catalog.setval('business.serial_institution_1', 6, true);


--
-- TOC entry 3521 (class 0 OID 0)
-- Dependencies: 269
-- Name: serial_institution_2; Type: SEQUENCE SET; Schema: business; Owner: apiwsfe
--

SELECT pg_catalog.setval('business.serial_institution_2', 1, true);


--
-- TOC entry 3522 (class 0 OID 0)
-- Dependencies: 254
-- Name: serial_mail_server; Type: SEQUENCE SET; Schema: business; Owner: postgres
--

SELECT pg_catalog.setval('business.serial_mail_server', 2, true);


--
-- TOC entry 3523 (class 0 OID 0)
-- Dependencies: 255
-- Name: serial_sequence; Type: SEQUENCE SET; Schema: business; Owner: postgres
--

SELECT pg_catalog.setval('business.serial_sequence', 5, true);


--
-- TOC entry 3524 (class 0 OID 0)
-- Dependencies: 267
-- Name: serial_sequence_1; Type: SEQUENCE SET; Schema: business; Owner: apiwsfe
--

SELECT pg_catalog.setval('business.serial_sequence_1', 1351, true);


--
-- TOC entry 3525 (class 0 OID 0)
-- Dependencies: 268
-- Name: serial_sequence_2; Type: SEQUENCE SET; Schema: business; Owner: apiwsfe
--

SELECT pg_catalog.setval('business.serial_sequence_2', 10872, true);


--
-- TOC entry 3526 (class 0 OID 0)
-- Dependencies: 270
-- Name: serial_sequence_3; Type: SEQUENCE SET; Schema: business; Owner: apiwsfe
--

SELECT pg_catalog.setval('business.serial_sequence_3', 100, true);


--
-- TOC entry 3527 (class 0 OID 0)
-- Dependencies: 271
-- Name: serial_sequence_4; Type: SEQUENCE SET; Schema: business; Owner: apiwsfe
--

SELECT pg_catalog.setval('business.serial_sequence_4', 7228, true);


--
-- TOC entry 3528 (class 0 OID 0)
-- Dependencies: 257
-- Name: serial_setting_taxpayer; Type: SEQUENCE SET; Schema: business; Owner: postgres
--

SELECT pg_catalog.setval('business.serial_setting_taxpayer', 2, true);


--
-- TOC entry 3529 (class 0 OID 0)
-- Dependencies: 250
-- Name: serial_taxpayer; Type: SEQUENCE SET; Schema: business; Owner: postgres
--

SELECT pg_catalog.setval('business.serial_taxpayer', 2, true);


--
-- TOC entry 3530 (class 0 OID 0)
-- Dependencies: 256
-- Name: serial_voucher; Type: SEQUENCE SET; Schema: business; Owner: postgres
--

SELECT pg_catalog.setval('business.serial_voucher', 20955, true);


--
-- TOC entry 3531 (class 0 OID 0)
-- Dependencies: 223
-- Name: serial_academic; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.serial_academic', 6, true);


--
-- TOC entry 3532 (class 0 OID 0)
-- Dependencies: 229
-- Name: serial_company; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.serial_company', 2, true);


--
-- TOC entry 3533 (class 0 OID 0)
-- Dependencies: 224
-- Name: serial_job; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.serial_job', 6, true);


--
-- TOC entry 3534 (class 0 OID 0)
-- Dependencies: 230
-- Name: serial_navigation; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.serial_navigation', 10, true);


--
-- TOC entry 3535 (class 0 OID 0)
-- Dependencies: 225
-- Name: serial_person; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.serial_person', 6, true);


--
-- TOC entry 3536 (class 0 OID 0)
-- Dependencies: 231
-- Name: serial_profile; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.serial_profile', 4, true);


--
-- TOC entry 3537 (class 0 OID 0)
-- Dependencies: 226
-- Name: serial_profile_navigation; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.serial_profile_navigation', 10, true);


--
-- TOC entry 3538 (class 0 OID 0)
-- Dependencies: 235
-- Name: serial_session; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.serial_session', 1553, true);


--
-- TOC entry 3539 (class 0 OID 0)
-- Dependencies: 227
-- Name: serial_setting; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.serial_setting', 2, true);


--
-- TOC entry 3540 (class 0 OID 0)
-- Dependencies: 233
-- Name: serial_system_event; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.serial_system_event', 31641, true);


--
-- TOC entry 3541 (class 0 OID 0)
-- Dependencies: 234
-- Name: serial_type_user; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.serial_type_user', 4, true);


--
-- TOC entry 3542 (class 0 OID 0)
-- Dependencies: 232
-- Name: serial_user; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.serial_user', 6, true);


--
-- TOC entry 3543 (class 0 OID 0)
-- Dependencies: 228
-- Name: serial_validation; Type: SEQUENCE SET; Schema: core; Owner: postgres
--

SELECT pg_catalog.setval('core.serial_validation', 1, true);


--
-- TOC entry 3287 (class 2606 OID 25618)
-- Name: emission_point emission_point_pkey; Type: CONSTRAINT; Schema: business; Owner: postgres
--

ALTER TABLE ONLY business.emission_point
    ADD CONSTRAINT emission_point_pkey PRIMARY KEY (id_emission_point);


--
-- TOC entry 3285 (class 2606 OID 25613)
-- Name: establishment establishment_pkey; Type: CONSTRAINT; Schema: business; Owner: postgres
--

ALTER TABLE ONLY business.establishment
    ADD CONSTRAINT establishment_pkey PRIMARY KEY (id_establishment);


--
-- TOC entry 3279 (class 2606 OID 25595)
-- Name: institution institution_pkey; Type: CONSTRAINT; Schema: business; Owner: postgres
--

ALTER TABLE ONLY business.institution
    ADD CONSTRAINT institution_pkey PRIMARY KEY (id_institution);


--
-- TOC entry 3291 (class 2606 OID 25634)
-- Name: mail_server mail_server_pkey; Type: CONSTRAINT; Schema: business; Owner: postgres
--

ALTER TABLE ONLY business.mail_server
    ADD CONSTRAINT mail_server_pkey PRIMARY KEY (id_mail_server);


--
-- TOC entry 3281 (class 2606 OID 25600)
-- Name: sequence sequence_pkey; Type: CONSTRAINT; Schema: business; Owner: postgres
--

ALTER TABLE ONLY business.sequence
    ADD CONSTRAINT sequence_pkey PRIMARY KEY (id_sequence);


--
-- TOC entry 3289 (class 2606 OID 25626)
-- Name: setting_taxpayer setting_taxpayer_pkey; Type: CONSTRAINT; Schema: business; Owner: postgres
--

ALTER TABLE ONLY business.setting_taxpayer
    ADD CONSTRAINT setting_taxpayer_pkey PRIMARY KEY (id_setting_taxpayer);


--
-- TOC entry 3277 (class 2606 OID 25587)
-- Name: taxpayer taxpayer_pkey; Type: CONSTRAINT; Schema: business; Owner: postgres
--

ALTER TABLE ONLY business.taxpayer
    ADD CONSTRAINT taxpayer_pkey PRIMARY KEY (id_taxpayer);


--
-- TOC entry 3283 (class 2606 OID 25608)
-- Name: voucher voucher_pkey; Type: CONSTRAINT; Schema: business; Owner: postgres
--

ALTER TABLE ONLY business.voucher
    ADD CONSTRAINT voucher_pkey PRIMARY KEY (id_voucher);


--
-- TOC entry 3251 (class 2606 OID 25498)
-- Name: academic academic_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.academic
    ADD CONSTRAINT academic_pkey PRIMARY KEY (id_academic);


--
-- TOC entry 3253 (class 2606 OID 25503)
-- Name: company company_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.company
    ADD CONSTRAINT company_pkey PRIMARY KEY (id_company);


--
-- TOC entry 3255 (class 2606 OID 25511)
-- Name: job job_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.job
    ADD CONSTRAINT job_pkey PRIMARY KEY (id_job);


--
-- TOC entry 3257 (class 2606 OID 25519)
-- Name: navigation navigation_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.navigation
    ADD CONSTRAINT navigation_pkey PRIMARY KEY (id_navigation);


--
-- TOC entry 3259 (class 2606 OID 25527)
-- Name: person person_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.person
    ADD CONSTRAINT person_pkey PRIMARY KEY (id_person);


--
-- TOC entry 3263 (class 2606 OID 25537)
-- Name: profile_navigation profile_navigation_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.profile_navigation
    ADD CONSTRAINT profile_navigation_pkey PRIMARY KEY (id_profile_navigation);


--
-- TOC entry 3261 (class 2606 OID 25532)
-- Name: profile profile_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.profile
    ADD CONSTRAINT profile_pkey PRIMARY KEY (id_profile);


--
-- TOC entry 3273 (class 2606 OID 25574)
-- Name: session session_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (id_session);


--
-- TOC entry 3265 (class 2606 OID 25542)
-- Name: setting setting_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.setting
    ADD CONSTRAINT setting_pkey PRIMARY KEY (id_setting);


--
-- TOC entry 3267 (class 2606 OID 25547)
-- Name: system_event system_event_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.system_event
    ADD CONSTRAINT system_event_pkey PRIMARY KEY (id_system_event);


--
-- TOC entry 3275 (class 2606 OID 25579)
-- Name: type_user type_user_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.type_user
    ADD CONSTRAINT type_user_pkey PRIMARY KEY (id_type_user);


--
-- TOC entry 3269 (class 2606 OID 25555)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id_user);


--
-- TOC entry 3271 (class 2606 OID 25563)
-- Name: validation validation_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.validation
    ADD CONSTRAINT validation_pkey PRIMARY KEY (id_validation);


--
-- TOC entry 3308 (class 2606 OID 25715)
-- Name: emission_point emission_point_id_taxpayer_fkey; Type: FK CONSTRAINT; Schema: business; Owner: postgres
--

ALTER TABLE ONLY business.emission_point
    ADD CONSTRAINT emission_point_id_taxpayer_fkey FOREIGN KEY (id_taxpayer) REFERENCES business.taxpayer(id_taxpayer) NOT VALID;


--
-- TOC entry 3307 (class 2606 OID 25710)
-- Name: establishment establishment_id_taxpayer_fkey; Type: FK CONSTRAINT; Schema: business; Owner: postgres
--

ALTER TABLE ONLY business.establishment
    ADD CONSTRAINT establishment_id_taxpayer_fkey FOREIGN KEY (id_taxpayer) REFERENCES business.taxpayer(id_taxpayer) NOT VALID;


--
-- TOC entry 3302 (class 2606 OID 25685)
-- Name: institution institution_id_taxpayer_fkey; Type: FK CONSTRAINT; Schema: business; Owner: postgres
--

ALTER TABLE ONLY business.institution
    ADD CONSTRAINT institution_id_taxpayer_fkey FOREIGN KEY (id_taxpayer) REFERENCES business.taxpayer(id_taxpayer) NOT VALID;


--
-- TOC entry 3310 (class 2606 OID 25725)
-- Name: mail_server mail_server_id_taxpayer_fkey; Type: FK CONSTRAINT; Schema: business; Owner: postgres
--

ALTER TABLE ONLY business.mail_server
    ADD CONSTRAINT mail_server_id_taxpayer_fkey FOREIGN KEY (id_taxpayer) REFERENCES business.taxpayer(id_taxpayer) NOT VALID;


--
-- TOC entry 3305 (class 2606 OID 25700)
-- Name: sequence sequence_id_emission_point_fkey; Type: FK CONSTRAINT; Schema: business; Owner: postgres
--

ALTER TABLE ONLY business.sequence
    ADD CONSTRAINT sequence_id_emission_point_fkey FOREIGN KEY (id_emission_point) REFERENCES business.emission_point(id_emission_point) NOT VALID;


--
-- TOC entry 3304 (class 2606 OID 25695)
-- Name: sequence sequence_id_establishment_fkey; Type: FK CONSTRAINT; Schema: business; Owner: postgres
--

ALTER TABLE ONLY business.sequence
    ADD CONSTRAINT sequence_id_establishment_fkey FOREIGN KEY (id_establishment) REFERENCES business.establishment(id_establishment) NOT VALID;


--
-- TOC entry 3303 (class 2606 OID 25690)
-- Name: sequence sequence_id_institution_fkey; Type: FK CONSTRAINT; Schema: business; Owner: postgres
--

ALTER TABLE ONLY business.sequence
    ADD CONSTRAINT sequence_id_institution_fkey FOREIGN KEY (id_institution) REFERENCES business.institution(id_institution) NOT VALID;


--
-- TOC entry 3309 (class 2606 OID 25720)
-- Name: setting_taxpayer setting_taxpayer_id_mail_server_fkey; Type: FK CONSTRAINT; Schema: business; Owner: postgres
--

ALTER TABLE ONLY business.setting_taxpayer
    ADD CONSTRAINT setting_taxpayer_id_mail_server_fkey FOREIGN KEY (id_mail_server) REFERENCES business.mail_server(id_mail_server) NOT VALID;


--
-- TOC entry 3299 (class 2606 OID 25670)
-- Name: taxpayer taxpayer_id_company_fkey; Type: FK CONSTRAINT; Schema: business; Owner: postgres
--

ALTER TABLE ONLY business.taxpayer
    ADD CONSTRAINT taxpayer_id_company_fkey FOREIGN KEY (id_company) REFERENCES core.company(id_company) NOT VALID;


--
-- TOC entry 3301 (class 2606 OID 25680)
-- Name: taxpayer taxpayer_id_setting_taxpayer_fkey; Type: FK CONSTRAINT; Schema: business; Owner: postgres
--

ALTER TABLE ONLY business.taxpayer
    ADD CONSTRAINT taxpayer_id_setting_taxpayer_fkey FOREIGN KEY (id_setting_taxpayer) REFERENCES business.setting_taxpayer(id_setting_taxpayer) NOT VALID;


--
-- TOC entry 3300 (class 2606 OID 25675)
-- Name: taxpayer taxpayer_id_user_fkey; Type: FK CONSTRAINT; Schema: business; Owner: postgres
--

ALTER TABLE ONLY business.taxpayer
    ADD CONSTRAINT taxpayer_id_user_fkey FOREIGN KEY (id_user) REFERENCES core."user"(id_user) NOT VALID;


--
-- TOC entry 3306 (class 2606 OID 25705)
-- Name: voucher voucher_id_institution_fkey; Type: FK CONSTRAINT; Schema: business; Owner: postgres
--

ALTER TABLE ONLY business.voucher
    ADD CONSTRAINT voucher_id_institution_fkey FOREIGN KEY (id_institution) REFERENCES business.institution(id_institution) NOT VALID;


--
-- TOC entry 3292 (class 2606 OID 25635)
-- Name: navigation navigation_id_company_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.navigation
    ADD CONSTRAINT navigation_id_company_fkey FOREIGN KEY (id_company) REFERENCES core.company(id_company) NOT VALID;


--
-- TOC entry 3293 (class 2606 OID 25640)
-- Name: profile profile_id_company_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.profile
    ADD CONSTRAINT profile_id_company_fkey FOREIGN KEY (id_company) REFERENCES core.company(id_company) NOT VALID;


--
-- TOC entry 3296 (class 2606 OID 25655)
-- Name: session session_id_user_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.session
    ADD CONSTRAINT session_id_user_fkey FOREIGN KEY (id_user) REFERENCES core."user"(id_user) NOT VALID;


--
-- TOC entry 3294 (class 2606 OID 25645)
-- Name: system_event system_event_id_user_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.system_event
    ADD CONSTRAINT system_event_id_user_fkey FOREIGN KEY (id_user) REFERENCES core."user"(id_user) NOT VALID;


--
-- TOC entry 3297 (class 2606 OID 25660)
-- Name: type_user type_user_id_company_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.type_user
    ADD CONSTRAINT type_user_id_company_fkey FOREIGN KEY (id_company) REFERENCES core.company(id_company) NOT VALID;


--
-- TOC entry 3298 (class 2606 OID 25665)
-- Name: type_user type_user_id_profile_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.type_user
    ADD CONSTRAINT type_user_id_profile_fkey FOREIGN KEY (id_profile) REFERENCES core.profile(id_profile) NOT VALID;


--
-- TOC entry 3295 (class 2606 OID 25650)
-- Name: user user_id_type_user_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core."user"
    ADD CONSTRAINT user_id_type_user_fkey FOREIGN KEY (id_type_user) REFERENCES core.type_user(id_type_user) NOT VALID;


-- Completed on 2023-04-10 15:39:34

--
-- PostgreSQL database dump complete
--