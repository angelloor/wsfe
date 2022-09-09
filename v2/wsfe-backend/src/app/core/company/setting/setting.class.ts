export class Setting {
	/** Attributes */
	public id_user_?: number;
	public id_setting: number;
	public expiration_token?: number;
	public expiration_verification_code?: number;
	public inactivity_time?: number;
	public session_limit?: number;
	public save_alfresco?: boolean;
	public wait_autorization?: number;
	public batch_shipping?: boolean;
	public max_generation_pdf?: number;
	public wait_generation_pdf?: number;
	public deleted_setting?: boolean;
	/** Constructor */
	constructor(
		id_user_: number = 0,
		id_setting: number = 0,
		expiration_token: number = 0,
		expiration_verification_code: number = 0,
		inactivity_time: number = 0,
		session_limit: number = 0,
		save_alfresco: boolean = false,
		wait_autorization: number = 0,
		batch_shipping: boolean = false,
		max_generation_pdf: number = 0,
		wait_generation_pdf: number = 0,
		deleted_setting: boolean = false
	) {
		this.id_user_ = id_user_;
		this.id_setting = id_setting;
		this.expiration_token = expiration_token;
		this.expiration_verification_code = expiration_verification_code;
		this.inactivity_time = inactivity_time;
		this.session_limit = session_limit;

		this.save_alfresco = save_alfresco;
		this.wait_autorization = wait_autorization;
		this.batch_shipping = batch_shipping;
		this.max_generation_pdf = max_generation_pdf;
		this.wait_generation_pdf = wait_generation_pdf;

		this.deleted_setting = deleted_setting;
	}
	/** Setters and Getters */
	set _id_user_(id_user_: number) {
		this.id_user_ = id_user_;
	}
	get _id_user_() {
		return this.id_user_!;
	}

	set _id_setting(id_setting: number) {
		this.id_setting = id_setting;
	}
	get _id_setting() {
		return this.id_setting;
	}

	set _expiration_token(expiration_token: number) {
		this.expiration_token = expiration_token;
	}
	get _expiration_token() {
		return this.expiration_token!;
	}

	set _expiration_verification_code(expiration_verification_code: number) {
		this.expiration_verification_code = expiration_verification_code;
	}
	get _expiration_verification_code() {
		return this.expiration_verification_code!;
	}

	set _inactivity_time(inactivity_time: number) {
		this.inactivity_time = inactivity_time;
	}
	get _inactivity_time() {
		return this.inactivity_time!;
	}

	set _session_limit(session_limit: number) {
		this.session_limit = session_limit;
	}
	get _session_limit() {
		return this.session_limit!;
	}

	set _save_alfresco(save_alfresco: boolean) {
		this.save_alfresco = save_alfresco;
	}
	get _save_alfresco() {
		return this.save_alfresco!;
	}
	set _wait_autorization(wait_autorization: number) {
		this.wait_autorization = wait_autorization;
	}
	get _wait_autorization() {
		return this.wait_autorization!;
	}
	set _batch_shipping(batch_shipping: boolean) {
		this.batch_shipping = batch_shipping;
	}
	get _batch_shipping() {
		return this.batch_shipping!;
	}
	set _max_generation_pdf(max_generation_pdf: number) {
		this.max_generation_pdf = max_generation_pdf;
	}
	get _max_generation_pdf() {
		return this.max_generation_pdf!;
	}
	set _wait_generation_pdf(wait_generation_pdf: number) {
		this.wait_generation_pdf = wait_generation_pdf;
	}
	get _wait_generation_pdf() {
		return this.wait_generation_pdf!;
	}

	set _deleted_setting(deleted_setting: boolean) {
		this.deleted_setting = deleted_setting;
	}
	get _deleted_setting() {
		return this.deleted_setting!;
	}
}
