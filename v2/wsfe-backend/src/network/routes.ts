import { routerEmissionPoint } from '../app/business/emission_point/emission_point.network';
import { routerEstablishment } from '../app/business/establishment/establishment.network';
import { routerInstitution } from '../app/business/institution/institution.network';
import { routerMailServer } from '../app/business/mail_server/mail_server.network';
import { routerSequence } from '../app/business/sequence/sequence.network';
import { routerSettingTaxpayer } from '../app/business/setting_taxpayer/setting_taxpayer.network';
import { routerTaxpayer } from '../app/business/taxpayer/taxpayer.network';
import { routerVoucher } from '../app/business/voucher/voucher.network';
import { routerAuth } from '../app/core/auth/auth.network';
import { routerCompany } from '../app/core/company/company.network';
import { routerNavigation } from '../app/core/navigation/navigation.network';
import { routerProfile } from '../app/core/profile/profile.network';
import { routerProfileNavigation } from '../app/core/profile_navigation/profile_navigation.network';
import { routerSession } from '../app/core/session/session.network';
import { routerSystemEvent } from '../app/core/system_event/system_event.network';
import { routerTypeUser } from '../app/core/type_user/type_user.network';
import { routerUser } from '../app/core/user/user.network';
import { routerValidation } from '../app/core/validation/validation.network';
import { routerReport } from '../app/report/report.network';

export const appRoutes = (app: any) => {
	/**
	 * Core Routes
	 */
	app.use('/app/core/auth', routerAuth);

	app.use('/app/core/company', routerCompany);
	app.use('/app/core/validation', routerValidation);

	app.use('/app/core/navigation', routerNavigation);
	app.use('/app/core/profile', routerProfile);
	app.use('/app/core/profile_navigation', routerProfileNavigation);

	app.use('/app/core/type_user', routerTypeUser);
	app.use('/app/core/user', routerUser);
	app.use('/app/core/system_event', routerSystemEvent);
	app.use('/app/core/session', routerSession);

	/**
	 * Business Routes
	 */
	app.use('/app/business/taxpayer', routerTaxpayer);
	app.use('/app/business/mail_server', routerMailServer);
	app.use('/app/business/setting_taxpayer', routerSettingTaxpayer);
	app.use('/app/business/institution', routerInstitution);
	app.use('/app/business/establishment', routerEstablishment);
	app.use('/app/business/emission_point', routerEmissionPoint);
	app.use('/app/business/sequence', routerSequence);
	app.use('/app/business/voucher', routerVoucher);

	/**
	 * Report Route
	 */
	app.use('/app/report', routerReport);
};
