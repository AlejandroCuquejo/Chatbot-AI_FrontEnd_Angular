export class MessageResponse {
	code!: number | undefined;
	error!: string | undefined;
	status!: number | undefined;
	data!: any;
	listData!: any[] | undefined;
	message!: string | undefined;
	alertType!: string | undefined;
}
