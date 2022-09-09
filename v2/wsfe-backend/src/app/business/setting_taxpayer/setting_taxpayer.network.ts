import express from 'express';
import { error, success } from '../../../network/response';
import { uploadLogo } from '../../../utils/fileStorage';
import { MessageAPI } from '../../../utils/message/message.type';
import { SettingTaxpayer } from './setting_taxpayer.class';
import { validation } from './setting_taxpayer.controller';
const routerSettingTaxpayer = express.Router();

routerSettingTaxpayer.get(
	'/read/:html_setting_taxpayer',
	async (req: any, res: any) => {
		await validation(req.params, req.url, req.headers.token)
			.then((settingTaxpayers: SettingTaxpayer[]) => {
				res.status(200).send(settingTaxpayers);
			})
			.catch((err: MessageAPI | any) => {
				error(res, err);
			});
	}
);

routerSettingTaxpayer.get(
	'/specificRead/:id_setting_taxpayer',
	async (req: any, res: any) => {
		await validation(req.params, req.url, req.headers.token)
			.then((settingTaxpayer: SettingTaxpayer) => {
				res.status(200).send(settingTaxpayer);
			})
			.catch((err: MessageAPI | any) => {
				error(res, err);
			});
	}
);

routerSettingTaxpayer.patch('/update', async (req: any, res: any) => {
	await validation(req.body, req.url, req.headers.token)
		.then((settingTaxpayer: SettingTaxpayer) => {
			success(res, settingTaxpayer);
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});

routerSettingTaxpayer.post(
	'/uploadLogo',
	uploadLogo.single(`logo`),
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

routerSettingTaxpayer.post('/removeLogo', async (req: any, res: any) => {
	await validation(req.body, req.url, req.headers.token)
		.then((response: any) => {
			success(res, response);
		})
		.catch((err) => {
			error(res, err);
		});
});

routerSettingTaxpayer.post('/downloadLogo', async (req: any, res: any) => {
	await validation(req.body, req.url, req.headers.token)
		.then((data: any) => {
			res.sendFile(data);
		})
		.catch((err: MessageAPI | any) => {
			error(res, err);
		});
});

export { routerSettingTaxpayer };
