export const defaultMail = () => {
	const html: string = `<h1>Hola mundo!</h1>`;
	return html;
};

export const forgotPasswordMail = (code: number, expiration: number) => {
	const html: string = `
	<div>
		<strong>Estimado(a).</strong><br>
		<p>Usted ha solicitado restablecer su contraseña, para poder continuar con la acción tiene que ingresar el siguiente código.</p>
		<strong>Codigo de confirmación: ${code}</strong><br>
		<strong>Tiempo de expiración: ${expiration} ${
		expiration > 1 ? `segundos` : `segundo`
	}</strong>
	 	<strong>Saludos Cordiales.</strong>
	</div>`;
	return html;
};

export const bringVouchersOfSQLServerMail = () => {
	return `
	<div>
		<strong>Estimado(a).</strong><br>
		<p>Resumen de comprobantes electrónicos pasados de SQLServer.</p>
	 	<strong>Saludos Cordiales.</strong>
	</div>`;
};

export const sendVoucherMail = () => {
	return `
	<div>
		<strong>Estimado(a).</strong><br>
		<p>Comprobantes enviados a autorizar.</p>
	 	<strong>Saludos Cordiales.</strong>
	</div>`;
};
