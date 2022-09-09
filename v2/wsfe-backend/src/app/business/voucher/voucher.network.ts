import express from 'express';
import { error, success } from '../../../network/response';
import { MessageAPI } from '../../../utils/message/message.type';
import { Voucher } from './voucher.class';
import { validation } from './voucher.controller';
const routerVoucher = express.Router();

routerVoucher.post('/recepcionComprobante', async (req: any, res: any) => {
	await validation(req.body, req.url, req.headers.token)
		.then((voucher: Voucher) => {
			success(res, voucher);
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});

routerVoucher.get(
	'/read/:type_environment/:access_key_voucher',
	async (req: any, res: any) => {
		await validation(req.params, req.url, req.headers.token)
			.then((vouchers: Voucher[]) => {
				res.status(200).send(vouchers);
			})
			.catch((err: MessageAPI | any) => {
				error(res, err);
			});
	}
);

routerVoucher.get('/specificRead/:id_voucher', async (req: any, res: any) => {
	await validation(req.params, req.url, req.headers.token)
		.then((voucher: Voucher) => {
			res.status(200).send(voucher);
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});

routerVoucher.get(
	'/byInstitutionRead/:type_environment/:institution',
	async (req: any, res: any) => {
		await validation(req.params, req.url, req.headers.token)
			.then((vouchers: Voucher[]) => {
				res.status(200).send(vouchers);
			})
			.catch((err: MessageAPI | any) => {
				error(res, err);
			});
	}
);

routerVoucher.get(
	'/byAccessKeyVoucherRead/:access_key_voucher',
	async (req: any, res: any) => {
		await validation(req.params, req.url, req.headers.token)
			.then((vouchers: Voucher) => {
				res.status(200).send(vouchers);
			})
			.catch((err: MessageAPI | any) => {
				error(res, err);
			});
	}
);

routerVoucher.get(
	'/byBuyerIdentifierVoucherRead/:type_environment/:buyer_identifier_voucher/:page_number/:amount/:order_by',
	async (req: any, res: any) => {
		await validation(req.params, req.url, req.headers.token)
			.then((vouchers: Voucher) => {
				res.status(200).send(vouchers);
			})
			.catch((err: MessageAPI | any) => {
				error(res, err);
			});
	}
);

routerVoucher.get(
	'/byBuyerIdentifierVoucherAndSearchByParameterRead/:type_environment/:buyer_identifier_voucher/:access_key_voucher',
	async (req: any, res: any) => {
		await validation(req.params, req.url, req.headers.token)
			.then((vouchers: Voucher) => {
				res.status(200).send(vouchers);
			})
			.catch((err: MessageAPI | any) => {
				error(res, err);
			});
	}
);

routerVoucher.get(
	'/byBuyerIdentifierAndEmissionYearVoucherRead/:type_environment/:buyer_identifier_voucher/:emission_date_voucher/:page_number/:amount/:order_by',
	async (req: any, res: any) => {
		await validation(req.params, req.url, req.headers.token)
			.then((vouchers: Voucher) => {
				res.status(200).send(vouchers);
			})
			.catch((err: MessageAPI | any) => {
				error(res, err);
			});
	}
);

routerVoucher.get(
	'/byBuyerIdentifierAndRangeEmissionDateVoucherRead/:type_environment/:buyer_identifier_voucher/:emission_date_voucher/:authorization_date_voucher',
	async (req: any, res: any) => {
		await validation(req.params, req.url, req.headers.token)
			.then((vouchers: Voucher) => {
				res.status(200).send(vouchers);
			})
			.catch((err: MessageAPI | any) => {
				error(res, err);
			});
	}
);

routerVoucher.post('/downloadVoucher', async (req: any, res: any) => {
	await validation(req.body, req.url, req.headers.token)
		.then((data: string) => {
			res.sendFile(data);
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});

routerVoucher.get(
	'/vouchersOfSQLServerRead/:institution/:emission_date_voucher/:authorization_date_voucher/:internal_status_voucher',
	async (req: any, res: any) => {
		await validation(req.params, req.url, req.headers.token)
			.then((vouchers: Voucher) => {
				res.status(200).send(vouchers);
			})
			.catch((err: MessageAPI | any) => {
				error(res, err);
			});
	}
);

routerVoucher.get(
	'/vouchersOfSQLServerByParameterRead/:number_voucher',
	async (req: any, res: any) => {
		await validation(req.params, req.url, req.headers.token)
			.then((vouchers: Voucher) => {
				res.status(200).send(vouchers);
			})
			.catch((err: MessageAPI | any) => {
				error(res, err);
			});
	}
);

routerVoucher.get(
	'/byRangeEmissionDateVoucherRead/:type_environment/:institution/:emission_date_voucher/:authorization_date_voucher/:internal_status_voucher',
	async (req: any, res: any) => {
		await validation(req.params, req.url, req.headers.token)
			.then((vouchers: Voucher) => {
				res.status(200).send(vouchers);
			})
			.catch((err: MessageAPI | any) => {
				error(res, err);
			});
	}
);

routerVoucher.patch('/update', async (req: any, res: any) => {
	await validation(req.body, req.url, req.headers.token)
		.then((voucher: Voucher) => {
			success(res, voucher);
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});

routerVoucher.delete('/delete', async (req: any, res: any) => {
	await validation(req.query, req.url, req.headers.token)
		.then((response: boolean) => {
			success(res, response);
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});
/**
 * Global Routes
 */
routerVoucher.post('/cancelVoucher', async (req: any, res: any) => {
	await validation(req.body, req.url, req.headers.token)
		.then((voucher: Voucher) => {
			success(res, voucher);
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});

routerVoucher.post('/autorizacionComprobante', async (req: any, res: any) => {
	await validation(req.body, req.url, req.headers.token)
		.then((voucher: Voucher) => {
			success(res, voucher);
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});

routerVoucher.post('/reverseCancelVoucher', async (req: any, res: any) => {
	await validation(req.body, req.url, req.headers.token)
		.then((voucher: Voucher) => {
			success(res, voucher);
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});

routerVoucher.post(
	'/recepcionComprobanteInstantly',
	async (req: any, res: any) => {
		await validation(req.body, req.url, req.headers.token)
			.then((voucher: Voucher) => {
				success(res, voucher);
			})
			.catch((err: MessageAPI | any) => {
				error(res, err);
			});
	}
);

routerVoucher.post(
	'/sendVoucherByBatchByInstitution',
	async (req: any, res: any) => {
		await validation(req.body, req.url, req.headers.token)
			.then((voucher: Voucher) => {
				success(res, voucher);
			})
			.catch((err: MessageAPI | any) => {
				error(res, err);
			});
	}
);

routerVoucher.post(
	'/sendVoucherByBatchByTaxpayer',
	async (req: any, res: any) => {
		await validation(req.body, req.url, req.headers.token)
			.then((voucher: Voucher) => {
				success(res, voucher);
			})
			.catch((err: MessageAPI | any) => {
				error(res, err);
			});
	}
);

routerVoucher.post('/completeProcess', async (req: any, res: any) => {
	await validation(req.body, req.url, req.headers.token)
		.then((voucher: Voucher) => {
			success(res, voucher);
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});

routerVoucher.post('/getBodyVoucher', async (req: any, res: any) => {
	await validation(req.body, req.url, req.headers.token)
		.then((voucher: Voucher) => {
			res.status(200).send(voucher);
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});

routerVoucher.post(
	'/resolveRecepcionComprobante',
	async (req: any, res: any) => {
		await validation(req.body, req.url, req.headers.token)
			.then((voucher: Voucher) => {
				success(res, voucher);
			})
			.catch((err: MessageAPI | any) => {
				error(res, err);
			});
	}
);

routerVoucher.post('/bringVouchersOfSQLServer', async (req: any, res: any) => {
	await validation(req.body, req.url, req.headers.token)
		.then((voucher: Voucher) => {
			success(res, voucher);
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});

routerVoucher.post(
	'/signInWithBuyerIdentifierVoucher',
	async (req: any, res: any) => {
		await validation(req.body, req.url, req.headers.token)
			.then((voucher: Voucher) => {
				success(res, voucher);
			})
			.catch((err: MessageAPI | any) => {
				error(res, err);
			});
	}
);

/**
 * Reports
 */
routerVoucher.post(
	'/reportByRangeEmissionDateVoucher',
	async (req: any, res: any) => {
		await validation(req.body, req.url, req.headers.token)
			.then((response: any) => {
				if (response.code == '06-010') {
					/**
					 * Set message in headers
					 * message in exposedHeaders (index.js)
					 */
					res.set('message', JSON.stringify(response));
					res.send();
				} else {
					/**
					 * Set name_report in headers
					 * name_report in exposedHeaders (index.js)
					 */
					res.set('name_report', response.name_report);
					/**
					 * Send the file
					 */
					res.sendFile(response.pathFinal);
				}
			})
			.catch((err: MessageAPI | any) => {
				error(res, err);
			});
	}
);

routerVoucher.post('/reportVouchersOfSQLServer', async (req: any, res: any) => {
	await validation(req.body, req.url, req.headers.token)
		.then((response: any) => {
			if (response.code == '06-010') {
				/**
				 * Set message in headers
				 * message in exposedHeaders (index.js)
				 */
				res.set('message', JSON.stringify(response));
				res.send();
			} else {
				/**
				 * Set name_report in headers
				 * name_report in exposedHeaders (index.js)
				 */
				res.set('name_report', response.name_report);
				/**
				 * Send the file
				 */
				res.sendFile(response.pathFinal);
			}
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});

routerVoucher.post(
	'/reportResumeVouchersOfSQLServer',
	async (req: any, res: any) => {
		await validation(req.body, req.url, req.headers.token)
			.then((response: any) => {
				if (response.code == '06-010') {
					/**
					 * Set message in headers
					 * message in exposedHeaders (index.js)
					 */
					res.set('message', JSON.stringify(response));
					res.send();
				} else {
					/**
					 * Set name_report in headers
					 * name_report in exposedHeaders (index.js)
					 */
					res.set('name_report', response.name_report);
					/**
					 * Send the file
					 */
					res.sendFile(response.pathFinal);
				}
			})
			.catch((err: MessageAPI | any) => {
				error(res, err);
			});
	}
);

export { routerVoucher };
