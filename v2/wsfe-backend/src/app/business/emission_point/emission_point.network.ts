import express from 'express';
import { error, success } from '../../../network/response';
import { MessageAPI } from '../../../utils/message/message.type';
import { EmissionPoint } from './emission_point.class';
import { validation } from './emission_point.controller';
const routerEmissionPoint = express.Router();

routerEmissionPoint.post('/create', async (req: any, res: any) => {
	await validation(req.body, req.url, req.headers.token)
		.then((emissionPoint: EmissionPoint) => {
			success(res, emissionPoint);
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});

routerEmissionPoint.get(
	'/read/:value_emission_point',
	async (req: any, res: any) => {
		await validation(req.params, req.url, req.headers.token)
			.then((emissionPoints: EmissionPoint[]) => {
				res.status(200).send(emissionPoints);
			})
			.catch((err: MessageAPI | any) => {
				error(res, err);
			});
	}
);

routerEmissionPoint.get(
	'/byTaxpayerRead/:taxpayer/:value_emission_point',
	async (req: any, res: any) => {
		await validation(req.params, req.url, req.headers.token)
			.then((emissionPoints: EmissionPoint[]) => {
				res.status(200).send(emissionPoints);
			})
			.catch((err: MessageAPI | any) => {
				error(res, err);
			});
	}
);

routerEmissionPoint.get(
	'/specificRead/:id_emission_point',
	async (req: any, res: any) => {
		await validation(req.params, req.url, req.headers.token)
			.then((emissionPoint: EmissionPoint) => {
				res.status(200).send(emissionPoint);
			})
			.catch((err: MessageAPI | any) => {
				error(res, err);
			});
	}
);

routerEmissionPoint.patch('/update', async (req: any, res: any) => {
	await validation(req.body, req.url, req.headers.token)
		.then((emissionPoint: EmissionPoint) => {
			success(res, emissionPoint);
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});

routerEmissionPoint.delete('/delete', async (req: any, res: any) => {
	await validation(req.query, req.url, req.headers.token)
		.then((response: boolean) => {
			success(res, response);
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});

export { routerEmissionPoint };
