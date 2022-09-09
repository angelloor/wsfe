import express from 'express';
import { error, success } from '../../../network/response';
import { MessageAPI } from '../../../utils/message/message.type';
import { Institution } from './institution.class';
import { validation } from './institution.controller';
const routerInstitution = express.Router();

routerInstitution.post('/create', async (req: any, res: any) => {
	await validation(req.body, req.url, req.headers.token)
		.then((institution: Institution) => {
			success(res, institution);
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});

routerInstitution.get('/read/:name_institution', async (req: any, res: any) => {
	await validation(req.params, req.url, req.headers.token)
		.then((institutions: Institution[]) => {
			res.status(200).send(institutions);
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});

routerInstitution.get(
	'/byTaxpayerRead/:taxpayer/:name_institution',
	async (req: any, res: any) => {
		await validation(req.params, req.url, req.headers.token)
			.then((institutions: Institution[]) => {
				res.status(200).send(institutions);
			})
			.catch((err: MessageAPI | any) => {
				error(res, err);
			});
	}
);

routerInstitution.get(
	'/specificRead/:id_institution',
	async (req: any, res: any) => {
		await validation(req.params, req.url, req.headers.token)
			.then((institution: Institution) => {
				res.status(200).send(institution);
			})
			.catch((err: MessageAPI | any) => {
				error(res, err);
			});
	}
);

routerInstitution.patch('/update', async (req: any, res: any) => {
	await validation(req.body, req.url, req.headers.token)
		.then((institution: Institution) => {
			success(res, institution);
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});

routerInstitution.post(
	'/changeStatusByBatchInstitution',
	async (req: any, res: any) => {
		await validation(req.body, req.url, req.headers.token)
			.then((institution: Institution) => {
				success(res, institution);
			})
			.catch((err: MessageAPI | any) => {
				error(res, err);
			});
	}
);

routerInstitution.delete('/delete', async (req: any, res: any) => {
	await validation(req.query, req.url, req.headers.token)
		.then((response: boolean) => {
			success(res, response);
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});

export { routerInstitution };
