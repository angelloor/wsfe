/*==============================================================*/
/* DROP SCHEMA: PUBLIC			                                */
/*==============================================================*/
DROP SCHEMA public;

/*==============================================================*/
/* SCHEMA: DEV			                                        */
/*==============================================================*/
CREATE SCHEMA dev
    AUTHORIZATION postgres;


/*==============================================================*/
/* SCHEMA: CORE			                                        */
/*==============================================================*/
CREATE SCHEMA core
    AUTHORIZATION postgres;

/*==============================================================*/
/* Type: TYPE_NAVIGATION                                        */
/*==============================================================*/
CREATE TYPE core."TYPE_NAVIGATION" AS ENUM
    ('defaultNavigation', 'compactNavigation', 'futuristicNavigation', 'horizontalNavigation');

/*==============================================================*/
/* Type: TYPE_VALIDATION                                        */
/*==============================================================*/
CREATE TYPE core."TYPE_VALIDATION" AS ENUM
    ('validationPassword', 'validationDNI', 'validationPhoneNumber');

/*==============================================================*/
/* Type: TYPE_PROFILE                                           */
/*==============================================================*/
CREATE TYPE core."TYPE_PROFILE" AS ENUM
    ('administator', 'commonProfile');

/*==============================================================*/
/* SCHEMA: BUSINESS		                                        */
/*==============================================================*/
CREATE SCHEMA business
    AUTHORIZATION postgres;

/*==============================================================*/
/* Type: TYPE_EMISSION                                           */
/*==============================================================*/
CREATE TYPE business."TYPE_EMISSION" AS ENUM
    ('1');

/*==============================================================*/
/* Type: TYPE_ACCOUNTINZG_OBLIGED                                */
/*==============================================================*/
CREATE TYPE business."TYPE_ACCOUNTING_OBLIGED" AS ENUM
    ('SI', 'NO');
    
/*==============================================================*/
/* Type: TYPE_PROFILE                                           */
/*==============================================================*/
CREATE TYPE business."TYPE_ENVIRONMENT" AS ENUM
    ('1', '2');

/*==============================================================*/
/* Type: TYPE_VOUCHER                                           */
/*==============================================================*/
CREATE TYPE business."TYPE_VOUCHER" AS ENUM
    ('01', '03', '04', '05', '06', '07');

/*==============================================================*/
/* Type: TYPE_VOUCHER_STATUS                                    */
/*==============================================================*/
CREATE TYPE business."TYPE_VOUCHER_STATUS" AS ENUM
    ('pending', 'authorized', 'canceled', 'removed');

/*==============================================================*/
/* Type: TYPE_MAIL_SERVER                                       */
/*==============================================================*/
CREATE TYPE business."TYPE_MAIL_SERVER" AS ENUM
    ('office365', 'gmail');
