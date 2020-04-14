import Mail from '../../lib/Mail';

class CancelationDeliveryMail {
	get key() {
		return 'CancelationDeliveryMail';
	}

	async handle({ data }) {
		const { deliveryman, product, recipient, description } = data;

		await Mail.sendMail({
			to: `${deliveryman.name} <${deliveryman.email}>`,
			subject: 'Cancelamento de Entrega',
			template: 'CancelationDelivery',
			context: {
				description,
				deliveryman: deliveryman.name,
				product,
				recipient: recipient.name,
				street: recipient.street,
				number: recipient.number,
				city: recipient.city,
				state: recipient.state,
				zip_code: recipient.zip_code,
			},
		});
	}
}

export default new CancelationDeliveryMail();
