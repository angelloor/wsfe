import { getSecuencialByAccessKey } from '../../utils/accessKey';
import { FullDate, getFullDate } from '../../utils/date';
import { generateImage2B64 } from '../../utils/global';
import {
	Group,
	GroupDate,
	InstitutionSQLServer,
	INSTITUTION_SQLSERVER,
	NameInstitutionSQLServer,
	TYPE_ENVIRONMENT,
	TYPE_ENVIRONMENT_ENUM,
	TYPE_VOUCHER_STATUS,
	TYPE_VOUCHER_STATUS_ENUM,
	VoucherSQLServer,
	_typeEnvironment,
	_typeVoucherStatus,
} from '../business/business.types';
import { Institution } from '../business/institution/institution.class';
import { Taxpayer } from '../business/taxpayer/taxpayer.class';
import { Voucher } from '../business/voucher/voucher.class';
import { User } from '../core/user/user.class';
/**
 * reportUser
 * @param users
 * @returns
 */
export const reportUser = async (users: User[]) => {
	return new Promise<string>(async (resolve) => {
		const generateRow = (users: User[]) => {
			let rowResult: string = '';
			users.map((item: User, index: number) => {
				rowResult += `<tr>
								<td>${index + 1}</td>
								<td>${item.name_user}</td>
								<td>${item.person.name_person}</td>
								<td>${item.person.last_name_person}</td>
								<td>${item.status_user}</td>
							</tr>
						`;
			});
			return rowResult;
		};

		const html: string = `<!DOCTYPE html>
		<html>
		
		<head>
			<meta charset="UTF-8">
			${STYLES}
		</head>
		<body>
			<div class="reporte">
				${await generateHeader('Reporte de usuarios')}
				<div class="containerBody">
					<div class="title">
						<h2>Usuarios</h2>
					</div>
					<table class="tableInst">
						<thead>
							<tr>
								<td>#</td>
								<td>name_user</td>
								<td>name_person</td>
								<td>last_name_person</td>
								<td>status_user</td>
							</tr>
						</thead>
						<tbody>
						${users.length > 0 ? `${generateRow(users)}` : ''}		
						</tbody>
					</table>
				</div>
			</div>
		</body>
		
		</html>`;
		resolve(html);
	});
};
/**
 * reportByRangeEmissionDateVoucher
 * @param vouchers
 * @returns
 */
export const reportByRangeEmissionDateVoucher = async (
	voucher: Voucher,
	vouchers: Voucher[]
) => {
	return new Promise<string>(async (resolve, reject) => {
		try {
			const taxpayer: Taxpayer = vouchers[0].institution.taxpayer;
			/**
			 * Instance the class
			 */
			let _institution = new Institution();
			_institution.taxpayer = taxpayer;

			let institutions: Institution[] = [];

			await _institution
				.byTaxpayerRead()
				.then((_institutions: Institution[]) => {
					institutions = _institutions;
				})
				.catch((error: string) => {
					console.log(error);
				});

			const generateGroups = (vouchers: Voucher[]) => {
				let groups: Group[] = [];

				vouchers.map(async (voucher: Voucher, index: number) => {
					const fullDate: FullDate = getFullDate(
						voucher.emission_date_voucher!,
						0
					);

					const id_institution: number = voucher.institution.id_institution;

					const institution: Institution = institutions.find(
						(_institution: Institution) =>
							_institution.id_institution == id_institution
					)!;

					const group: Group = groups.find(
						(_group: Group) => _group.id == id_institution
					)!;

					const groupIndex: number = groups.findIndex(
						(_group: Group) => _group.id == id_institution
					);

					if (group) {
						const rowResult = `<tr>
						<td>${index + 1}</td>
						<td>${fullDate.day}-${fullDate.month}-${fullDate.fullYear}</td>
						<td>${voucher.number_voucher}</td>
						<td>${getSecuencialByAccessKey(voucher.access_key_voucher!)}</td>
						<td>${voucher.access_key_voucher}</td>
						<td>${voucher.body_voucher.identificacionComprador}</td>
						<td>${
							getTypeSelectVoucherStatus(voucher.internal_status_voucher!)
								.name_type
						}</td>
						<td>${voucher.body_voucher.importeTotal}</td>
						</tr>`;

						groups[groupIndex] = {
							...group,
							html: group.html + rowResult,
							total: group.total + voucher.body_voucher.importeTotal,
						};
					} else {
						const rowResult = `<tr>
						<td>${index + 1}</td>
						<td>${fullDate.day}-${fullDate.month}-${fullDate.fullYear}</td>
						<td>${voucher.number_voucher}</td>
						<td>${getSecuencialByAccessKey(voucher.access_key_voucher!)}</td>
						<td>${voucher.access_key_voucher}</td>
						<td>${voucher.body_voucher.identificacionComprador}</td>
						<td>${
							getTypeSelectVoucherStatus(voucher.internal_status_voucher!)
								.name_type
						}</td>
						<td>${voucher.body_voucher.importeTotal}</td>
						</tr>`;

						groups.push({
							id: id_institution,
							name: institution.name_institution!,
							html: rowResult,
							subtotal_0: 0,
							total: voucher.body_voucher.importeTotal,
						});
					}
				});
				return groups;
			};

			const groups: Group[] = generateGroups(vouchers);

			const generateRow = (groups: Group[]) => {
				let html: string = '';
				let total_total: number = 0;
				let isLast: boolean = false;

				groups.map((_group: Group, index: number) => {
					total_total += _group.total!;

					let htmlGroup: string = _group.html;
					let htmlTotal: string = '';

					if (groups.length === index + 1) {
						isLast = true;
						htmlTotal = `
						<tr>
							<td>&nbsp;</td>
						</tr>
						<tr>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td><strong>Total</strong></td>
						<td><strong>${total_total.toFixed(2)}</td</strong>
						</tr>`;
					}

					/**
					 * Add final row
					 */
					htmlGroup += `<tr>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td><strong>Total</strong></td>
					<td>${_group.total.toFixed(2)}</td>
					</tr>`;

					html += `<div class="title">
					<h2>${_group.name}</h2>
				</div>
				<table class="tableInst">
					<thead>
						<tr>
							<td>N°</td>
							<td>Emisión</td>
							<td>Comprobante</td>
							<td>Factura</td>
							<td>Autorización</td>
							<td>Identificación</td>
							<td>Estado</td>
							<td>Total</td>
						</tr>
					</thead>
					<tbody>
						${htmlGroup}
						${isLast ? htmlTotal : ''}	
					</tbody>
				</table>`;
				});
				return html;
			};

			const id_institution_query: any = voucher.institution.id_institution;
			const internal_status_voucher_query: TYPE_VOUCHER_STATUS | any =
				voucher.internal_status_voucher!;
			const type_environment_query: TYPE_ENVIRONMENT =
				voucher.type_environment!;

			const fde: FullDate = getFullDate(voucher.emission_date_voucher!);
			const fda: FullDate = getFullDate(voucher.authorization_date_voucher!);

			const query_parameters: string = `<h3><strong>Ambiente: </strong>${
				getTypeSelectEnvironment(type_environment_query).name_type
			}</h3>
			<h3><strong>Institución: </strong>${
				id_institution_query != '*'
					? institutions.find(
							(_institution: Institution) =>
								(_institution.id_institution = id_institution_query)
					  )!.name_institution
					: id_institution_query
			}</h3>
			<h3><strong>Intervalo de fechas: </strong>${fde.fullYear}-${fde.month}-${
				fde.day
			} - ${fda.fullYear}-${fda.month}-${fda.day}</h3>
			<h3><strong>Estado: </strong>${
				internal_status_voucher_query != '*'
					? getTypeSelectVoucherStatus(internal_status_voucher_query).name_type
					: internal_status_voucher_query
			}</h3>`;

			const html: string = `<!DOCTYPE html>
			<html>
			
			<head>
				<meta charset="UTF-8">
				${STYLES}
			</head>
			<body>
				<div class="reporte">
					${await generateHeader(
						'Reporte de comprobantes electronicos',
						query_parameters
					)}
					<div class="containerBody">
						${vouchers.length > 0 ? `${generateRow(groups)}` : ''}
					</div>
				</div>
			</body>
			
			</html>`;
			resolve(html);
		} catch (error: any) {
			reject(error.toString());
		}
	});
};
/**
 * reportByRangeEmissionDateVoucher
 * @param vouchers
 * @returns
 */
export const reportVouchersOfSQLServer = async (
	voucher: Voucher,
	voucherSQLServer: VoucherSQLServer[]
) => {
	return new Promise<string>(async (resolve, reject) => {
		try {
			const generateGroups = (voucherSQLServer: VoucherSQLServer[]) => {
				let groups: Group[] = [];

				voucherSQLServer.map(
					async (voucherSQLServer: VoucherSQLServer, index: number) => {
						const fullDate: FullDate = getFullDate(
							voucherSQLServer.fechaemision.toString()
						);

						const name_institution: NameInstitutionSQLServer =
							voucherSQLServer.institution;

						const group: Group = groups.find(
							(_group: Group) => _group.name == name_institution
						)!;

						const groupIndex: number = groups.findIndex(
							(_group: Group) => _group.name == name_institution
						);

						if (group) {
							const subtotal_0: number =
								voucherSQLServer.iva == 0.0 ? voucherSQLServer.total! : 0;
							const subtotal_12: number =
								voucherSQLServer.iva == 0.0 ? 0 : voucherSQLServer.total!;

							const iva: number = voucherSQLServer.iva;

							const total: number =
								voucherSQLServer.total! + voucherSQLServer.iva;

							const rowResult = `<tr>
						<td>${index + 1}</td>
						<td>${fullDate.day}-${fullDate.month}-${fullDate.fullYear}</td>
						<td>${voucherSQLServer.numerodocumento}</td>
						<td>${voucherSQLServer.razonsocialcomprador}</td>
						<td>${voucherSQLServer.detalle}</td>
						<td>${subtotal_0.toFixed(2)}</td>
						<td>${subtotal_12.toFixed(2)}</td>
						<td>${iva.toFixed(2)}</td>
						<td>${total.toFixed(2)}</td>
						</tr>`;

							groups[groupIndex] = {
								...group,
								html: group.html + rowResult,
								subtotal_0: group.subtotal_0! + subtotal_0,
								subtotal_12: group.subtotal_12! + subtotal_12,
								iva: group.iva! + iva,
								total: group.total + total,
							};
						} else {
							const subtotal_0: number =
								voucherSQLServer.iva == 0.0 ? voucherSQLServer.total! : 0;
							const subtotal_12: number =
								voucherSQLServer.iva == 0.0 ? 0 : voucherSQLServer.total!;

							const iva: number = voucherSQLServer.iva;

							const total: number =
								voucherSQLServer.total! + voucherSQLServer.iva;

							const rowResult = `<tr>
						<td>${index + 1}</td>
						<td>${fullDate.day}-${fullDate.month}-${fullDate.fullYear}</td>
						<td>${voucherSQLServer.numerodocumento}</td>
						<td>${voucherSQLServer.razonsocialcomprador}</td>
						<td>${voucherSQLServer.detalle}</td>
						<td>${subtotal_0.toFixed(2)}</td>
						<td>${subtotal_12.toFixed(2)}</td>
						<td>${iva.toFixed(2)}</td>
						<td>${total.toFixed(2)}</td>
						</tr>`;

							groups.push({
								id: name_institution,
								name: name_institution,
								html: rowResult,
								subtotal_0,
								subtotal_12,
								iva,
								total,
							});
						}
					}
				);
				return groups;
			};

			const groups: Group[] = generateGroups(voucherSQLServer);

			const generateRow = (groups: Group[]) => {
				let html: string = '';
				let total_subtotal_0: number = 0;
				let total_subtotal_12: number = 0;
				let total_iva: number = 0;
				let total_total: number = 0;
				let isLast: boolean = false;

				groups.map((_group: Group, index: number) => {
					total_subtotal_0 += _group.subtotal_0!;
					total_subtotal_12 += _group.subtotal_12!;
					total_iva += _group.iva!;
					total_total += _group.total!;

					let htmlGroup: string = _group.html;
					let htmlTotal: string = '';

					if (groups.length === index + 1) {
						isLast = true;
						htmlTotal = `
						<tr>
							<td>&nbsp;</td>
						</tr>
						<tr>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td><strong>Total</strong></td>
						<td><strong>${total_subtotal_0!.toFixed(2)}</strong></td>
						<td><strong>${total_subtotal_12!.toFixed(2)}</strong></td>
						<td><strong>${total_iva!.toFixed(2)}</strong></td>
						<td><strong>${total_total.toFixed(2)}</td</strong>
						</tr>`;
					}
					/**
					 * Add final row
					 */
					htmlGroup += `<tr>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td><strong>Total ${_group.name}</strong></td>
					<td>${_group.subtotal_0!.toFixed(2)}</td>
					<td>${_group.subtotal_12!.toFixed(2)}</td>
					<td>${_group.iva!.toFixed(2)}</td>
					<td>${_group.total.toFixed(2)}</td>
					</tr>`;

					html += `<div class="title">
					<h2>${_group.name}</h2>
				</div>
				<table class="tableInst">
					<thead>
						<tr>
							<td>N°</td>
							<td>Emisión</td>
							<td>Comprobante</td>
							<td>Nombre</td>
							<td>Detalle</td>
							<td>0%</td>
							<td>12%</td>
							<td>IVA</td>
							<td>TOTAL</td>
						</tr>
					</thead>
					<tbody>
						${htmlGroup}
						${isLast ? htmlTotal : ''}	
					</tbody>
				</table>`;
				});
				return html;
			};

			const id_institution_query: any = voucher.institution.id_institution;
			const internal_status_voucher_query: TYPE_VOUCHER_STATUS | any =
				voucher.internal_status_voucher!;

			const fde: FullDate = getFullDate(voucher.emission_date_voucher!);
			const fda: FullDate = getFullDate(voucher.authorization_date_voucher!);

			const query_parameters: string = `<h3><strong>Institución: </strong>${
				id_institution_query != '*'
					? INSTITUTION_SQLSERVER.find(
							(_institutionSQLServer: InstitutionSQLServer) =>
								_institutionSQLServer.id_institution == id_institution_query
					  )?.name_institution
					: id_institution_query
			}</h3>
			<h3><strong>Intervalo de fechas: </strong>${fde.fullYear}-${fde.month}-${
				fde.day
			} - ${fda.fullYear}-${fda.month}-${fda.day}</h3>
			<h3><strong>Estado: </strong>${
				internal_status_voucher_query != '*'
					? getTypeSelectVoucherStatus(internal_status_voucher_query).name_type
					: internal_status_voucher_query
			}</h3>`;

			const html: string = `<!DOCTYPE html>
			<html>
			
			<head>
				<meta charset="UTF-8">
				${STYLES}
			</head>
			<body>
				<div class="reporte">
					${await generateHeader(
						'Reporte detallado de comprobantes SQLServer',
						query_parameters
					)}
					<div class="containerBody">
						${voucherSQLServer.length > 0 ? `${generateRow(groups)}` : ''}
					</div>
				</div>
			</body>
			
			</html>`;
			resolve(html);
		} catch (error: any) {
			reject(error.toString());
		}
	});
};
/**
 * reportByRangeEmissionDateVoucher
 * @param vouchers
 * @returns
 */
export const reportResumeVouchersOfSQLServer = async (
	voucher: Voucher,
	voucherSQLServer: VoucherSQLServer[]
) => {
	return new Promise<string>(async (resolve, reject) => {
		try {
			const generateGroups = (voucherSQLServer: VoucherSQLServer[]) => {
				let groups: GroupDate[] = [];
				let groupsFinal: GroupDate[] = [];

				voucherSQLServer.map(
					async (voucherSQLServer: VoucherSQLServer, index: number) => {
						const fullDate: FullDate = getFullDate(
							voucherSQLServer.fechaemision.toString()
						);

						const date: string = `${fullDate.day}-${fullDate.month}-${fullDate.fullYear}`;
						const name_institution: NameInstitutionSQLServer =
							voucherSQLServer.institution;

						const group: GroupDate = groups.find(
							(_group: GroupDate) =>
								_group.date == date && _group.name == name_institution
						)!;

						const groupIndex: number = groups.findIndex(
							(_group: GroupDate) =>
								_group.date == date && _group.name == name_institution
						);

						if (group) {
							const subtotal_0: number =
								voucherSQLServer.iva == 0.0 ? voucherSQLServer.total! : 0;
							const subtotal_12: number =
								voucherSQLServer.iva == 0.0 ? 0 : voucherSQLServer.total!;

							const iva: number = voucherSQLServer.iva;

							const total: number =
								voucherSQLServer.total! + voucherSQLServer.iva;

							groups[groupIndex] = {
								...group,
								date,
								subtotal_0: group.subtotal_0! + subtotal_0,
								subtotal_12: group.subtotal_12! + subtotal_12,
								iva: group.iva! + iva,
								total: group.total + total,
								count: group.count! + 1,
							};
						} else {
							const subtotal_0: number =
								voucherSQLServer.iva == 0.0 ? voucherSQLServer.total! : 0;
							const subtotal_12: number =
								voucherSQLServer.iva == 0.0 ? 0 : voucherSQLServer.total!;

							const iva: number = voucherSQLServer.iva;

							const total: number =
								voucherSQLServer.total! + voucherSQLServer.iva;

							groups.push({
								id: name_institution,
								date,
								name: name_institution,
								html: '',
								subtotal_0,
								subtotal_12,
								iva,
								total,
								count: 1,
							});
						}
					}
				);
				return groups;
			};

			const groups: GroupDate[] = generateGroups(voucherSQLServer);

			const generateGroupFinal = (groups: GroupDate[]) => {
				let groupsFinal: GroupDate[] = [];

				let total_subtotal_0: number = 0;
				let total_subtotal_12: number = 0;
				let total_iva: number = 0;
				let total_total: number = 0;
				let total_count: number = 0;

				groups.map((_group: GroupDate) => {
					total_subtotal_0 += _group.subtotal_0!;
					total_subtotal_12 += _group.subtotal_12!;
					total_iva += _group.iva!;

					total_total += _group.total!;
					total_count += _group.count!;

					const name_institution: NameInstitutionSQLServer = _group.name;

					const groupFinal: GroupDate = groupsFinal.find(
						(_group: GroupDate) => _group.name == name_institution
					)!;

					const groupIndex: number = groupsFinal.findIndex(
						(_group: GroupDate) => _group.name == name_institution
					);

					if (groupFinal) {
						const subtotal_0: number = _group.subtotal_0;
						const subtotal_12: number = _group.subtotal_12!;
						const iva: number = _group.iva!;
						const total: number = _group.total;

						let html = `<tr>
						<td><strong>${_group.date}</td</strong>
						<td>${_group.subtotal_0!.toFixed(2)}</td>
						<td>${_group.subtotal_12!.toFixed(2)}</td>
						<td>${_group.iva!.toFixed(2)}</td>
						<td>${_group.total.toFixed(2)}</td>
						<td>${_group.count}</td>
						</tr>`;

						groupsFinal[groupIndex] = {
							...groupFinal,
							html: groupFinal.html + html,
							subtotal_0: groupFinal.subtotal_0! + subtotal_0,
							subtotal_12: groupFinal.subtotal_12! + subtotal_12,
							iva: groupFinal.iva! + iva,
							total: groupFinal.total + total,
							count: groupFinal.count! + _group.count!,
						};
					} else {
						let html = `<tr>
						<td><strong>${_group.date}</td</strong>
						<td>${_group.subtotal_0!.toFixed(2)}</td>
						<td>${_group.subtotal_12!.toFixed(2)}</td>
						<td>${_group.iva!.toFixed(2)}</td>
						<td>${_group.total.toFixed(2)}</td>
						<td>${_group.count}</td>
						</tr>`;

						groupsFinal.push({
							id: name_institution,
							date: _group.date,
							name: name_institution,
							html: html,
							subtotal_0: _group.subtotal_0!,
							subtotal_12: _group.subtotal_12!,
							iva: _group.iva!,
							total: _group.total!,
							count: _group.count,
						});
					}
				});
				return groupsFinal;
			};

			const groupFinal: GroupDate[] = generateGroupFinal(groups);

			const generateRow = (groupFinal: GroupDate[]) => {
				let html: string = '';
				let htmlTotal: string = '';
				let total_subtotal_0: number = 0;
				let total_subtotal_12: number = 0;
				let total_iva: number = 0;
				let total_total: number = 0;
				let total_count: number = 0;
				let isLast: boolean = false;

				groupFinal.map((_group: Group, index: number) => {
					total_subtotal_0 += _group.subtotal_0!;
					total_subtotal_12 += _group.subtotal_12!;
					total_iva += _group.iva!;
					total_total += _group.total!;
					total_count += _group.count!;

					let htmlBody: string = _group.html;
					let htmlFooter: string = '';
					/**
					 * Add final row of institution
					 */
					htmlFooter = `
					<tr>
						<td>&nbsp;</td>
					</tr>
					<tr>
					<td><strong>Total ${_group.name}</strong></td>
					<td>${_group.subtotal_0!.toFixed(2)}</td>
					<td>${_group.subtotal_12!.toFixed(2)}</td>
					<td>${_group.iva!.toFixed(2)}</td>
					<td>${_group.total.toFixed(2)}</td>
					<td>${_group.count}</td>
					</tr>`;

					htmlBody += htmlFooter;

					/**
					 * Add total row
					 */
					if (groupFinal.length === index + 1) {
						isLast = true;
						htmlTotal = `
						<tr>
							<td>&nbsp;</td>
						</tr>
						<tr>
						<td><strong>Total</strong></td>
						<td><strong>${total_subtotal_0!.toFixed(2)}</strong></td>
						<td><strong>${total_subtotal_12!.toFixed(2)}</strong></td>
						<td><strong>${total_iva!.toFixed(2)}</strong></td>
						<td><strong>${total_total.toFixed(2)}</td</strong>
						<td><strong>${total_count}</td</strong>
						</tr>`;
					}

					html += `<div class="title">
					<h2>${_group.name}</h2>
				</div>
				<table class="tableInst">
					<thead>
						<tr>
							<td>FECHA</td>
							<td>BASE(0%)BASE(0%)</td>
							<td>BASE(12%)</td>
							<td>IVA</td>
							<td>TOTAL</td>
							<td>TOTAL COMPROBANTES</td>
						</tr>
					</thead>
					<tbody>
						${htmlBody}
						${isLast ? htmlTotal : ''}	
					</tbody>
				</table>`;
				});
				return html;
			};

			const fde: FullDate = getFullDate(voucher.emission_date_voucher!);
			const fda: FullDate = getFullDate(voucher.authorization_date_voucher!);

			const id_institution_query: any = voucher.institution.id_institution;
			const internal_status_voucher_query: TYPE_VOUCHER_STATUS | any =
				voucher.internal_status_voucher!;

			const query_parameters: string = `<h3><strong>Institución: </strong>${
				id_institution_query != '*'
					? INSTITUTION_SQLSERVER.find(
							(_institutionSQLServer: InstitutionSQLServer) =>
								_institutionSQLServer.id_institution == id_institution_query
					  )?.name_institution
					: id_institution_query
			}</h3>
			<h3><strong>Intervalo de fechas: </strong>${fde.fullYear}-${fde.month}-${
				fde.day
			} - ${fda.fullYear}-${fda.month}-${fda.day}</h3>
			<h3><strong>Estado: </strong>${
				internal_status_voucher_query != '*'
					? getTypeSelectVoucherStatus(internal_status_voucher_query).name_type
					: internal_status_voucher_query
			}</h3>`;

			const html: string = `<!DOCTYPE html>
			<html>

			<head>
				<meta charset="UTF-8">
				${STYLES}
			</head>
			<body>
				<div class="reporte">
					${await generateHeader(
						'Reporte consolidado de comprobantes SQLServer',
						query_parameters
					)}
					<div class="containerBody">
						${voucherSQLServer.length > 0 ? `${generateRow(groupFinal)}` : ''}
					</div>
				</div>
			</body>

			</html>`;
			resolve(html);
		} catch (error: any) {
			reject(error.toString());
		}
	});
};
/**
 * STYLES
 */
const STYLES: string = `<style>
body {
	display: flex;
	align-items: center;
	background-color: gray;
	justify-content: center;
	font-family: "Times New Roman", Times, serif;
}

.reporte {
	width: 930px;
	height: auto;
	background-color: white;
	padding: 30px;
	padding-top: 20px;
}

.reporte>.header {
	display: flex;
	align-items: center;
	justify-content: center;
}

.reporte>.header>.containerLogo {
	width: 20%;
}

.reporte>.header>.containerLogo>img {
	width: 100%;
}

.reporte>.header>.containerTitle {
	display: flex;
	flex-direction: column;
	align-items: flex;
	justify-content: center;
	width: 80%;
	margin-left: 30px;
}

.reporte>.header>.containerTitle>h1 {
	color: black;
	font-size: 22px;
	font-weight: bold;
	margin: 2px;
}

.reporte>.header>.containerTitle>h2 {
	color: black;
	font-size: 16px;
	font-weight: 300;
	margin: 2px;
}

.reporte>.header>.containerTitle>h3 {
	color: black;
	font-size: 12px;
	font-weight: 300;
	margin: 2px;
}

.reporte>.containerBody>.title>h2 {
	color: black;
	font-size: 16px;
	font-weight: bold;
	padding: 0px 6px;
}

.reporte>.containerBody>.tableInst {
	width: 100%;
}

.reporte>.containerBody>.tableInst>thead>tr>td {
	color: black;
	font-size: 12px;
	font-weight: bold;
	padding: 5px 5px;

}

.reporte>.containerBody>.tableInst>tbody>tr>td {
	color: black;
	font-size: 12px;
	font-weight: lighter;
	padding: 1px 5px;
}

.reporte>.containerBody>.tableInst>tbody>.total>td {
	color: black;
	font-size: 13px;
	font-weight: bold;
	padding: 1px 5px;
}
</style>`;
/**
 * generateHeader
 * @returns header string
 */
const generateHeader = (
	title: string,
	query_parameters: string = ''
): Promise<string> => {
	return new Promise<string>(async (resolve, reject) => {
		/**
		 * Generate Base64 information for the logo
		 */
		try {
			let b64Logo = await generateImage2B64(`./public/resource/img/logo.png`);
			const _getFullDate = getFullDate(new Date().toString());

			resolve(`<div class="header">
				<div class="containerLogo">
					<img src="data:image/png;base64, ${b64Logo}" alt="logo">
				</div>
				<div class="containerTitle">
					<h1>GOBIERNO AUTÓNOMO DESCENTRALIZADO MUNICIPAL DEL CANTÓN PASTAZA</h1>
					<h2>${title}</h2>${query_parameters}
					<h3><strong>Generado: </strong>${_getFullDate.day}-${_getFullDate.month}-${_getFullDate.fullYear} ${_getFullDate.hours}:${_getFullDate.minutes}:${_getFullDate.seconds}</h3>
				</div>
			</div>`);
		} catch (error: any) {
			reject(error.toString());
		}
	});
};
/**
 * getTypeSelectVoucherStatus
 */
const typeVoucherStatus: TYPE_VOUCHER_STATUS_ENUM[] = _typeVoucherStatus;

const getTypeSelectVoucherStatus = (
	type_voucher_status: TYPE_VOUCHER_STATUS
): TYPE_VOUCHER_STATUS_ENUM => {
	return typeVoucherStatus.find(
		(_voucherStatus: TYPE_VOUCHER_STATUS_ENUM) =>
			_voucherStatus.value_type == type_voucher_status
	)!;
};

/**
 * getTypeSelectVoucherStatus
 */
const typeEnvironment: TYPE_ENVIRONMENT_ENUM[] = _typeEnvironment;

const getTypeSelectEnvironment = (
	type_environment: TYPE_ENVIRONMENT
): TYPE_ENVIRONMENT_ENUM => {
	return typeEnvironment.find(
		(_typeEnvironment: TYPE_ENVIRONMENT_ENUM) =>
			_typeEnvironment.value_type == type_environment
	)!;
};
