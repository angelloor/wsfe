import express from 'express';
import { error, success } from '../../../network/response';
import { MessageAPI } from '../../../utils/message/message.type';
import { MailServer } from './mail_server.class';
import { validation } from './mail_server.controller';
const routerMailServer = express.Router();

routerMailServer.post('/create', async (req: any, res: any) => {
	await validation(req.body, req.url, req.headers.token)
		.then((mailServer: MailServer) => {
			success(res, mailServer);
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});

routerMailServer.get('/read/:host_mail_server', async (req: any, res: any) => {
	await validation(req.params, req.url, req.headers.token)
		.then((mailServers: MailServer[]) => {
			res.status(200).send(mailServers);
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});

routerMailServer.get(
	'/byTaxpayerRead/:taxpayer/:host_mail_server',
	async (req: any, res: any) => {
		await validation(req.params, req.url, req.headers.token)
			.then((mailServers: MailServer[]) => {
				res.status(200).send(mailServers);
			})
			.catch((err: MessageAPI | any) => {
				error(res, err);
			});
	}
);

routerMailServer.get(
	'/specificRead/:id_mail_server',
	async (req: any, res: any) => {
		await validation(req.params, req.url, req.headers.token)
			.then((mailServer: MailServer) => {
				res.status(200).send(mailServer);
			})
			.catch((err: MessageAPI | any) => {
				error(res, err);
			});
	}
);

routerMailServer.patch('/update', async (req: any, res: any) => {
	await validation(req.body, req.url, req.headers.token)
		.then((mailServer: MailServer) => {
			success(res, mailServer);
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});

routerMailServer.delete('/delete', async (req: any, res: any) => {
	await validation(req.query, req.url, req.headers.token)
		.then((response: boolean) => {
			success(res, response);
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});

export { routerMailServer };
