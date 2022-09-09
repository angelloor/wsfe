import express from 'express';
import { error, success } from '../../../network/response';
import { uploadSignature } from '../../../utils/fileStorage';
import { MessageAPI } from '../../../utils/message/message.type';
import { Taxpayer } from './taxpayer.class';
import { validation } from './taxpayer.controller';
const routerTaxpayer = express.Router();

routerTaxpayer.post('/create', async (req: any, res: any) => {
	await validation(req.body, req.url, req.headers.token)
		.then((taxpayer: Taxpayer) => {
			success(res, taxpayer);
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});

routerTaxpayer.get(
	'/read/:business_name_taxpayer',
	async (req: any, res: any) => {
		await validation(req.params, req.url, req.headers.token)
			.then((taxpayers: Taxpayer[]) => {
				res.status(200).send(taxpayers);
			})
			.catch((err: MessageAPI | any) => {
				error(res, err);
			});
	}
);

routerTaxpayer.get('/specificRead/:id_taxpayer', async (req: any, res: any) => {
	await validation(req.params, req.url, req.headers.token)
		.then((taxpayer: Taxpayer) => {
			res.status(200).send(taxpayer);
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});

routerTaxpayer.patch('/update', async (req: any, res: any) => {
	await validation(req.body, req.url, req.headers.token)
		.then((taxpayer: Taxpayer) => {
			success(res, taxpayer);
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});

routerTaxpayer.post(
	'/changeStatusByBatchTaxpayer',
	async (req: any, res: any) => {
		await validation(req.body, req.url, req.headers.token)
			.then((taxpayer: Taxpayer) => {
				success(res, taxpayer);
			})
			.catch((err: MessageAPI | any) => {
				error(res, err);
			});
	}
);

routerTaxpayer.delete('/delete', async (req: any, res: any) => {
	await validation(req.query, req.url, req.headers.token)
		.then((response: boolean) => {
			success(res, response);
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});

routerTaxpayer.post(
	'/uploadSignature',
	uploadSignature.single(`signature`),
	async (req: any, res: any) => {
		await validation(req.body, req.url, req.headers.token)
			.then((response: any) => {
				success(res, response);
			})
			.catch((err) => {
				error(res, err);
			});
	}
);

routerTaxpayer.post('/removeSignature', async (req: any, res: any) => {
	await validation(req.body, req.url, req.headers.token)
		.then((response: any) => {
			success(res, response);
		})
		.catch((err) => {
			error(res, err);
		});
});

routerTaxpayer.post('/downloadSignature', async (req: any, res: any) => {
	await validation(req.body, req.url, req.headers.token)
		.then((data: any) => {
			res.sendFile(data);
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});

export { routerTaxpayer };
