import express from 'express';
import { error, success } from '../../../network/response';
import { MessageAPI } from '../../../utils/message/message.type';
import { Establishment } from './establishment.class';
import { validation } from './establishment.controller';
const routerEstablishment = express.Router();

routerEstablishment.post('/create', async (req: any, res: any) => {
	await validation(req.body, req.url, req.headers.token)
		.then((establishment: Establishment) => {
			success(res, establishment);
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});

routerEstablishment.get(
	'/read/:value_establishment',
	async (req: any, res: any) => {
		await validation(req.params, req.url, req.headers.token)
			.then((establishments: Establishment[]) => {
				res.status(200).send(establishments);
			})
			.catch((err: MessageAPI | any) => {
				error(res, err);
			});
	}
);

routerEstablishment.get(
	'/byTaxpayerRead/:taxpayer/:value_establishment',
	async (req: any, res: any) => {
		await validation(req.params, req.url, req.headers.token)
			.then((establishments: Establishment[]) => {
				res.status(200).send(establishments);
			})
			.catch((err: MessageAPI | any) => {
				error(res, err);
			});
	}
);

routerEstablishment.get(
	'/specificRead/:id_establishment',
	async (req: any, res: any) => {
		await validation(req.params, req.url, req.headers.token)
			.then((establishment: Establishment) => {
				res.status(200).send(establishment);
			})
			.catch((err: MessageAPI | any) => {
				error(res, err);
			});
	}
);

routerEstablishment.patch('/update', async (req: any, res: any) => {
	await validation(req.body, req.url, req.headers.token)
		.then((establishment: Establishment) => {
			success(res, establishment);
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});

routerEstablishment.delete('/delete', async (req: any, res: any) => {
	await validation(req.query, req.url, req.headers.token)
		.then((response: boolean) => {
			success(res, response);
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});

export { routerEstablishment };
