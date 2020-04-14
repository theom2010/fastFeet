import Mail from '../../lib/Mail';

class CreationDeliveryMail {
	get key() {
		return 'CreationDeliveryMail';
	}

	async handle({ data }) {
		const { deliveryman, product, recipient } = data;

		await Mail.sendMail({
			to: `${deliveryman.name} <${deliveryman.email}>`,
			subject: 'Nova Entrega Disponível',
			template: 'CreationDelivery',
			context: {
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

export default new CreationDeliveryMail();
