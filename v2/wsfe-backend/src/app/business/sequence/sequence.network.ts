import express from 'express';
import { error, success } from '../../../network/response';
import { MessageAPI } from '../../../utils/message/message.type';
import { Sequence } from './sequence.class';
import { validation } from './sequence.controller';
const routerSequence = express.Router();

routerSequence.post('/create', async (req: any, res: any) => {
	await validation(req.body, req.url, req.headers.token)
		.then((sequence: Sequence) => {
			success(res, sequence);
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});

routerSequence.get('/read/:type_voucher', async (req: any, res: any) => {
	await validation(req.params, req.url, req.headers.token)
		.then((sequences: Sequence[]) => {
			res.status(200).send(sequences);
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});

routerSequence.get(
	'/byInstitutionRead/:institution/:type_voucher',
	async (req: any, res: any) => {
		await validation(req.params, req.url, req.headers.token)
			.then((sequences: Sequence[]) => {
				res.status(200).send(sequences);
			})
			.catch((err: MessageAPI | any) => {
				error(res, err);
			});
	}
);

routerSequence.get('/specificRead/:id_sequence', async (req: any, res: any) => {
	await validation(req.params, req.url, req.headers.token)
		.then((sequence: Sequence) => {
			res.status(200).send(sequence);
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});

routerSequence.patch('/update', async (req: any, res: any) => {
	await validation(req.body, req.url, req.headers.token)
		.then((sequence: Sequence) => {
			success(res, sequence);
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});

routerSequence.delete('/delete', async (req: any, res: any) => {
	await validation(req.query, req.url, req.headers.token)
		.then((response: boolean) => {
			success(res, response);
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});

export { routerSequence };
