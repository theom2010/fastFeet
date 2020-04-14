import { Op } from 'sequelize';
import * as Yup from 'yup';

import Deliveryman from '../models/Deliveryman';
import Delivery from '../models/Delivery';
import File from '../models/File';
import Recipient from '../models/Recipient';

import CreationDeliveryMail from '../jobs/CreationDeliveryMail';
import Queue from '../../lib/Queue';

class DeliveryController {
	async store(req, res) {
		/**
		 * Validating fields
		 */
		const schema = Yup.object().shape({
			product: Yup.string().required(),
			recipient_id: Yup.number().required(),
			deliveryman_id: Yup.number().required(),
		});

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({ error: 'validation fails' });
		}

		const { product, recipient_id, deliveryman_id } = req.body;

		/*
		 * Check recipient exists
		 */
		const recipientExists = await Recipient.findByPk(recipient_id);

		if (!recipientExists) {
			return res.status(400).json({ error: 'Recipient does not exists' });
		}

		/*
		 * Check deliveryman exists
		 */
		const deliveryman = await Deliveryman.findByPk(deliveryman_id);

		if (!deliveryman) {
			return res.status(400).json({ error: 'Delivery man does not exists' });
		}

		const {
			id,
			signature_id,
			end_date,
			start_date,
			canceled_at,
		} = await Delivery.create({
			product,
			deliveryman_id,
			recipient_id,
			status: 'PENDENTE',
		});

		/**
		 * Add email stack
		 */
		await Queue.add(CreationDeliveryMail.key, {
			deliveryman,
			recipient: recipientExists,
			product,
		});

		return res.json({
			id,
			product,
			recipient_id,
			deliveryman_id,
			signature_id,
			start_date,
			end_date,
			canceled_at,
		});
	}

	async show(req, res) {
		const { id } = req.params;

		const delivery = await Delivery.findByPk(id, {
			attributes: ['id', 'product'],
			include: [
				{
					model: Recipient,
					as: 'recipient',
					attributes: ['id', 'name'],
				},
				{
					model: Deliveryman,
					as: 'deliveryman',
					attributes: ['id', 'name'],
				},
			],
		});

		if (!delivery) {
			return res.status(400).json({ error: 'Delivery does not exists' });
		}

		return res.json(delivery);
	}

	async index(req, res) {
		const { query: productName, page = 1 } = req.query;

		/**
		 * Filter query or list all
		 */

		const response = productName
			? await Delivery.findAll({
					where: {
						product: {
							[Op.iLike]: `${productName}%`,
						},
					},
					order: ['id'],
					attributes: [
						'id',
						'product',
						'status',
						'start_date',
						'end_date',
						'canceled_at',
					],
					include: [
						{
							model: Recipient,
							as: 'recipient',
							paranoid: false,
							attributes: [
								'id',
								'name',
								'street',
								'number',
								'city',
								'state',
								'zip_code',
							],
						},
						{
							model: Deliveryman,
							as: 'deliveryman',
							attributes: ['id', 'name'],
						},
						{
							model: File,
							as: 'signature',
							attributes: ['id', 'url', 'path'],
						},
					],
			  })
			: await Delivery.findAll({
					attributes: [
						'id',
						'product',
						'status',
						'start_date',
						'end_date',
						'canceled_at',
					],
					order: ['id'],
					limit: 5,
					offset: (page - 1) * 5,
					include: [
						{
							model: Recipient,
							paranoid: false,
							as: 'recipient',
							attributes: [
								'id',
								'name',
								'street',
								'number',
								'city',
								'state',
								'zip_code',
							],
						},
						{
							model: Deliveryman,
							as: 'deliveryman',
							attributes: ['id', 'name'],
						},
						{
							model: File,
							as: 'signature',
							attributes: ['id', 'url', 'path'],
						},
					],
			  });

		return res.json(response);
	}

	async update(req, res) {
		/**
		 * Validating fields
		 */
		const schema = Yup.object().shape({
			product: Yup.string().notRequired(),
			recipient_id: Yup.number().notRequired(),
			deliveryman_id: Yup.number().notRequired(),
		});

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({ error: 'validation fails' });
		}

		const { id } = req.params;

		/*
		 * Check if delivery exists
		 */
		const delivery = await Delivery.findByPk(id);

		if (!delivery) {
			return res.status(400).json({ error: 'Delivery does not exists' });
		}

		const { product, recipient_id, deliveryman_id } = req.body;

		await delivery.update({ product, recipient_id, deliveryman_id });

		return res.json({});
	}

	async destroy(req, res) {
		const { id } = req.params;

		/*
		 * Check if delivery exists
		 */
		const delivery = await Delivery.findByPk(id);

		if (!delivery) {
			return res.status(400).json({ error: 'Delivery does not exists' });
		}

		/*
		 * Checks if start date
		 */
		if (delivery.start_date) {
			return res.status(400).json({ error: 'This Delivery already been sent' });
		}

		await delivery.destroy();

		return res.json({});
	}
}

export default new DeliveryController();
