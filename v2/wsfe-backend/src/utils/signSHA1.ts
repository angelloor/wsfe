const Buffer = require('buffer/').Buffer;
import btoa from 'btoa';
import converter from 'hex2dec';
import moment from 'moment';
import { OCSP_CERTIFICATION_ENTITIES } from '../app/business/business.types';
import { asciiToString, deleteNaN, stringToAscii } from './global';
import { _messages } from './message/message';
const forge = require('node-forge');
// const fs = require('fs')
/**
 * Función para realizar el firmado mediante el estándar XAdESBES
 */
export const signVoucher = (
	signature_taxpayer: any,
	signature_password_taxpayer: string,
	stringXMLFormatted: string
) => {
	return new Promise<string>(async (resolve, reject) => {
		try {
			/**
			 * Hacemos el tratamiento para crear el XML valido
			 */
			const arrayAscii: number[] = stringToAscii(stringXMLFormatted);
			const arrayAsciiNaN: number[] = deleteNaN(arrayAscii);
			const treatyXML: string = asciiToString(arrayAsciiNaN);
			/**
			 * Obtenemos el contenido de la firma P12
			 */
			var arrayUint8 = new Uint8Array(signature_taxpayer);
			var p12B64: string = forge.util.binary.base64.encode(arrayUint8);
			var p12Der: string = forge.util.decode64(p12B64);
			var p12Asn1: any = forge.asn1.fromDer(p12Der);
			var p12: any = forge.pkcs12.pkcs12FromAsn1(
				p12Asn1,
				signature_password_taxpayer
			);
			/**
			 * Obtenemos el key de la firma
			 */
			var certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
			/**
			 * Posicion del Alias de la firma, ayuda a aumentar la compatibilidad de las entidades certificadoras en el ecuador
			 * La posicion del Alias de la firma tiene que ser de tipo digitalSignature: true
			 * Encontramos el Alias que sea de tipo firma digital
			 */
			let positionAlias: any;
			for (
				let indexOne = 0;
				indexOne < certBags[forge.oids.certBag].length;
				indexOne++
			) {
				let baseCert = certBags[forge.oids.certBag][indexOne].cert;
				for (let index = 0; index < baseCert.extensions.length; index++) {
					if (baseCert.extensions[index].digitalSignature) {
						positionAlias = indexOne;
						index = baseCert.extensions.length;
						indexOne = certBags[forge.oids.certBag].length;
					}
				}
			}
			/**
			 * Seleccionar el certificado que se usara de acuerdo a la posicion del Alias
			 * fs.writeFileSync(`src/ANF.json`, JSON.stringify(cert))
			 */
			var cert = certBags[forge.oids.certBag][positionAlias].cert;
			/**
			 * Establecer </ds:X509IssuerName> de acuerdo a la firma (Nombre de la entidad certificadora)
			 */
			let certificationEntity = '';
			let X509IssuerName = '';
			/**
			 * Sacamos el nombre de la entidad de certificacion del certificado desencriptado
			 */
			for (let index = 0; index < cert.issuer.attributes.length; index++) {
				if (cert.issuer.attributes[index].name == 'organizationName') {
					certificationEntity = cert.issuer.attributes[index].value;
				}
			}

			if (certificationEntity == 'CONSEJO DE LA JUDICATURA') {
				X509IssuerName = OCSP_CERTIFICATION_ENTITIES.consejoJudicatura;
			} else if (certificationEntity == 'BANCO CENTRAL DEL ECUADOR') {
				X509IssuerName = OCSP_CERTIFICATION_ENTITIES.bancoCentral;
			} else if (certificationEntity == 'SECURITY DATA S.A. 1') {
				X509IssuerName = OCSP_CERTIFICATION_ENTITIES.secutiryData;
			} else if (
				certificationEntity == 'ANFAC AUTORIDAD DE CERTIFICACION ECUADOR C.A.'
			) {
				X509IssuerName = OCSP_CERTIFICATION_ENTITIES.anf;
			} else {
				reject(_messages[5]);
				return;
			}
			/**
			 * sacar los datos de la firma
			 */
			var pkcs8bags = p12.getBags({
				bagType: forge.pki.oids.pkcs8ShroudedKeyBag,
			});

			/** obtener la key de acuerdo a la posicion del alias (aqui se toma en cuenta que en las propiedades de la firma el digitalSignature sea TRUE)*/
			var pkcs8 = pkcs8bags[forge.oids.pkcs8ShroudedKeyBag][positionAlias];
			var key = pkcs8.key;

			if (key == null) {
				key = pkcs8.asn1;
			}

			var certificateX509Pem = forge.pki.certificateToPem(cert);

			var certificateX509 = certificateX509Pem;
			certificateX509 = certificateX509.substr(certificateX509.indexOf('\n'));
			certificateX509 = certificateX509.substr(
				0,
				certificateX509.indexOf('\n-----END CERTIFICATE-----')
			);

			certificateX509 = certificateX509
				.replace(/\r?\n|\r/g, '')
				.replace(/([^\0]{76})/g, '$1\n');
			/**
			 * Pasar certificado a formato DER y sacar su hash
			 */
			var certificateX509Asn1 = forge.pki.certificateToAsn1(cert);
			var certificateX509Der = forge.asn1.toDer(certificateX509Asn1).getBytes();
			var certificateX509DerHash = sha1Base64(certificateX509Der);
			/**
			 * Numero Serial del P12
			 */
			var X509SerialNumber = converter.hexToDec(cert.serialNumber);
			/**
			 * Sacar el exponente
			 */
			var exponent = hexToBase64(key.e.data[0].toString(16));
			var modulus = bigint2base64(key.n);

			var sha1Voucher = sha1Base64UTF8(
				treatyXML.replace('<?xml version="1.0" encoding="UTF-8"?>\n', '')
			);
			// fs.writeFileSync(`src/xml.xml`, treatyXML.replace('<?xml version="1.0" encoding="UTF-8"?>\n', ''))

			var xmlns =
				'xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:etsi="http://uri.etsi.org/01903/v1.3.2#"';
			/**
			 * 8 Numeros aleatorios involucrados en las propiedades de la firma
			 */
			var CertificateNumber = generateRandom();
			var SignatureNumber = generateRandom();
			var SignedPropertiesNumber = generateRandom();
			var SignedInfoNumber = generateRandom();
			var SignedPropertiesIdNumber = generateRandom();
			var ReferenceIdNumber = generateRandom();
			var SignatureValueNumber = generateRandom();
			var ObjectNumber = generateRandom();

			var SignedProperties = '';
			/**
			 * Inicio SignedProperties
			 */
			SignedProperties +=
				'<etsi:SignedProperties Id="Signature' +
				SignatureNumber +
				'-SignedProperties' +
				SignedPropertiesNumber +
				'">';
			SignedProperties += '<etsi:SignedSignatureProperties>';
			SignedProperties += '<etsi:SigningTime>';

			SignedProperties += moment().format('YYYY-MM-DDTHH:mm:ssZ');

			SignedProperties += '</etsi:SigningTime>';
			SignedProperties += '<etsi:SigningCertificate>';
			SignedProperties += '<etsi:Cert>';
			SignedProperties += '<etsi:CertDigest>';
			SignedProperties +=
				'<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
			SignedProperties += '</ds:DigestMethod>';
			SignedProperties += '<ds:DigestValue>';

			SignedProperties += certificateX509DerHash;

			SignedProperties += '</ds:DigestValue>';
			SignedProperties += '</etsi:CertDigest>';
			SignedProperties += '<etsi:IssuerSerial>';
			SignedProperties += '<ds:X509IssuerName>';

			/** X509IssuerName de acuerdo a la entidad de certificacion */
			SignedProperties += X509IssuerName;

			SignedProperties += '</ds:X509IssuerName>';
			SignedProperties += '<ds:X509SerialNumber>';

			SignedProperties += X509SerialNumber;

			SignedProperties += '</ds:X509SerialNumber>';
			SignedProperties += '</etsi:IssuerSerial>';
			SignedProperties += '</etsi:Cert>';
			SignedProperties += '</etsi:SigningCertificate>';
			SignedProperties += '</etsi:SignedSignatureProperties>';
			SignedProperties += '<etsi:SignedDataObjectProperties>';
			SignedProperties +=
				'<etsi:DataObjectFormat ObjectReference="#Reference-ID-' +
				ReferenceIdNumber +
				'">';
			SignedProperties += '<etsi:Description>';

			SignedProperties += 'Desarrollado por GADMCP - Angel Loor';

			SignedProperties += '</etsi:Description>';
			SignedProperties += '<etsi:MimeType>';
			SignedProperties += 'text/xml';
			SignedProperties += '</etsi:MimeType>';
			SignedProperties += '</etsi:DataObjectFormat>';
			SignedProperties += '</etsi:SignedDataObjectProperties>';
			SignedProperties += '</etsi:SignedProperties>';
			/**
			 * Fin SignedProperties
			 */
			var SignedPropertiesParaHash = SignedProperties.replace(
				'<etsi:SignedProperties',
				'<etsi:SignedProperties ' + xmlns
			);

			var sha1SignedProperties = sha1Base64(SignedPropertiesParaHash);

			var KeyInfo = '';

			KeyInfo += '<ds:KeyInfo Id="Certificate' + CertificateNumber + '">';
			KeyInfo += '<ds:X509Data>';
			KeyInfo += '<ds:X509Certificate>';
			/**
			 * Certificado X509 codificado en Base64
			 */
			KeyInfo += certificateX509;

			KeyInfo += '\n</ds:X509Certificate>';
			KeyInfo += '</ds:X509Data>';
			KeyInfo += '<ds:KeyValue>';
			KeyInfo += '<ds:RSAKeyValue>';
			KeyInfo += '<ds:Modulus>';
			/**
			 * Modulo del Certificado X509
			 */
			KeyInfo += modulus;

			KeyInfo += '\n</ds:Modulus>';
			KeyInfo += '<ds:Exponent>';
			/**
			 * KeyInfo += 'AQAB'
			 */
			KeyInfo += exponent;

			KeyInfo += '</ds:Exponent>';
			KeyInfo += '</ds:RSAKeyValue>';
			KeyInfo += '</ds:KeyValue>';
			KeyInfo += '</ds:KeyInfo>';

			var KeyInfoParaHash = KeyInfo.replace(
				'<ds:KeyInfo',
				'<ds:KeyInfo ' + xmlns
			);

			var sha1Certificate = sha1Base64(KeyInfoParaHash);

			var SignedInfo = '';

			SignedInfo +=
				'<ds:SignedInfo Id="Signature-SignedInfo' + SignedInfoNumber + '">';
			SignedInfo +=
				'<ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315">';
			SignedInfo += '</ds:CanonicalizationMethod>';
			SignedInfo +=
				'<ds:SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1">';
			SignedInfo += '</ds:SignatureMethod>';
			SignedInfo +=
				'<ds:Reference Id="SignedPropertiesID' +
				SignedPropertiesIdNumber +
				'" Type="http://uri.etsi.org/01903#SignedProperties" URI="#Signature' +
				SignatureNumber +
				'-SignedProperties' +
				SignedPropertiesNumber +
				'">';
			SignedInfo +=
				'<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
			SignedInfo += '</ds:DigestMethod>';
			SignedInfo += '<ds:DigestValue>';
			/**
			 * hash o digest del elemento <etsi:SignedProperties>
			 */
			SignedInfo += sha1SignedProperties;

			SignedInfo += '</ds:DigestValue>';
			SignedInfo += '</ds:Reference>';
			SignedInfo +=
				'<ds:Reference URI="#Certificate' + CertificateNumber + '">';
			SignedInfo +=
				'<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
			SignedInfo += '</ds:DigestMethod>';
			SignedInfo += '<ds:DigestValue>';
			/**
			 * hash o digest del certificado X509
			 */
			SignedInfo += sha1Certificate;

			SignedInfo += '</ds:DigestValue>';
			SignedInfo += '</ds:Reference>';
			SignedInfo +=
				'<ds:Reference Id="Reference-ID-' +
				ReferenceIdNumber +
				'" URI="#comprobante">';
			SignedInfo += '<ds:Transforms>';
			SignedInfo +=
				'<ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature">';
			SignedInfo += '</ds:Transform>';
			SignedInfo += '</ds:Transforms>';
			SignedInfo +=
				'<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
			SignedInfo += '</ds:DigestMethod>';
			SignedInfo += '<ds:DigestValue>';
			/**
			 * hash o digest de todo el archivo XML identificado por el id="comprobante"
			 */
			SignedInfo += sha1Voucher;

			SignedInfo += '</ds:DigestValue>';
			SignedInfo += '</ds:Reference>';
			SignedInfo += '</ds:SignedInfo>';

			var SignedInfoParaFirma = SignedInfo.replace(
				'<ds:SignedInfo',
				'<ds:SignedInfo ' + xmlns
			);
			/**
			 * obtenemos el hash de la firma en formato PEM (teniendo en cuenta que hay que tener 76 caracteres por reglon)
			 */
			var md = forge.md.sha1.create();
			md.update(SignedInfoParaFirma, 'utf8');
			var signature = btoa(key.sign(md))
				.match(/.{1,76}/g)!
				.join('\n');

			var XAdESBES = '';
			/**
			 * Inicio de la firma digital
			 */
			XAdESBES +=
				'<ds:Signature ' + xmlns + ' Id="Signature' + SignatureNumber + '">';
			XAdESBES += SignedInfo;

			XAdESBES +=
				'<ds:SignatureValue Id="SignatureValue' + SignatureValueNumber + '">';
			/**
			 * Valor de la firma digital -> encriptado con la llave privada del certificado digital
			 */
			XAdESBES += signature;

			XAdESBES += '\n</ds:SignatureValue>';
			XAdESBES += KeyInfo;
			XAdESBES +=
				'<ds:Object Id="Signature' +
				SignatureNumber +
				'-Object' +
				ObjectNumber +
				'">';
			XAdESBES +=
				'<etsi:QualifyingProperties Target="#Signature' +
				SignatureNumber +
				'">';
			/**
			 * Elemento <etsi:SignedProperties>
			 */
			XAdESBES += SignedProperties;

			XAdESBES += '</etsi:QualifyingProperties>';
			XAdESBES += '</ds:Object>';
			XAdESBES += '</ds:Signature>';
			/**
			 * Fin de la firma digital
			 */
			resolve(treatyXML.replace(/(<[^<]+)$/, XAdESBES + '$1'));
		} catch (error: any) {
			reject(error.toString());
		}
	});
};
/**
 * Función para pasar de sha1 a Base64
 */
const sha1Base64 = (string: string) => {
	var md = forge.md.sha1.create();
	md.update(string);
	return Buffer(md.digest().toHex(), 'hex').toString('base64');
};
/**
 * Función para pasar de sha1 a Base64 (Compatibilidad con caracteres especiales)
 */
const sha1Base64UTF8 = (string: string) => {
	var md = forge.md.sha1.create();
	md.update(string, 'utf8');
	return Buffer(md.digest().toHex(), 'hex').toString('base64');
};
/**
 * Función para pasar de hex a Base64
 */
const hexToBase64 = (str: any) => {
	var hex: any = ('00' + str).slice(0 - str.length - (str.length % 2));
	return btoa(
		String.fromCharCode.apply(
			null,
			hex
				.replace(/\r|\n/g, '')
				.replace(/([\da-fA-F]{2}) ?/g, '0x$1 ')
				.replace(/ +$/, '')
				.split(' ')
		)
	);
};
/**
 * Función para pasar de bigint a Base64
 */
const bigint2base64 = (bigint: any) => {
	var base64: any = '';
	base64 = btoa(
		bigint
			.toString(16)
			.match(/\w{2}/g)
			.map(function (a: any) {
				return String.fromCharCode(parseInt(a, 16));
			})
			.join('')
	);
	base64 = base64.match(/.{1,76}/g).join('\n');
	return base64;
};
/**
 * Función para generar un numero aleatorio para las propiedades de la firma
 */
const generateRandom = () => {
	return Math.floor(Math.random() * 999000) + 990;
};
