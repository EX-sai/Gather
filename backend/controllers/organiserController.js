// backend/controllers/organiserController.js
import { Op } from "sequelize";
import { Events, EventRegistration } from "../models/index.js";

export const getOrganiserDashboard = async (req, res) => {
	try {
		const organiserEmail = req.user.email;
		const rangeDays = parseInt(req.query.range, 10) || 7;

		// 1) Total Events
		const totalEvents = await Events.count({
			where: { organiserId: organiserEmail }
		});

		// 2) Total Registrations for this organiser's events
		const totalRegistrations = await EventRegistration.count({
			include: [{
				model: Events,
				as: "event",
				where: { organiserId: organiserEmail }
			}]
		});

		// 3) Total Revenue = sum of event.price for each registration
		const regsWithEvent = await EventRegistration.findAll({
			include: [{
				model: Events,
				as: "event",
				attributes: ["price"],
				where: { organiserId: organiserEmail }
			}]
		});
		const totalRevenue = regsWithEvent.reduce(
			(sum, reg) => sum + (reg.event?.price || 0),
			0
		);

		// 4) Upcoming Events (next 5)
		const now = new Date();
		const upcomingRaw = await Events.findAll({
			where: {
				organiserId: organiserEmail,
				startDate: { [Op.gte]: now }
			},
			order: [["startDate", "ASC"]],
			limit: 5
		});
		const upcomingEvents = await Promise.all(
			upcomingRaw.map(async (evt) => {
				const registered = await EventRegistration.count({
					where: { eventId: evt.id }
				});
				return {
					id: evt.id,
					title: evt.title,
					startDate: evt.startDate,
					endDate: evt.endDate,
					time: evt.time,
					location: evt.location,
					price: evt.price,
					image: evt.image,
					registered
				};
			})
		);

		// 5) Chart data for last N days
		const chartData = [];
		for (let i = rangeDays - 1; i >= 0; i--) {
			const dayStart = new Date();
			dayStart.setDate(dayStart.getDate() - i);
			dayStart.setHours(0, 0, 0, 0);
			const dayEnd = new Date(dayStart);
			dayEnd.setDate(dayEnd.getDate() + 1);

			// registrations that day
			const dailyRegs = await EventRegistration.count({
				where: {
					registrationDate: { [Op.gte]: dayStart, [Op.lt]: dayEnd }
				},
				include: [{
					model: Events,
					as: "event",
					where: { organiserId: organiserEmail }
				}]
			});

			// revenue that day
			const regsPeriod = await EventRegistration.findAll({
				where: {
					registrationDate: { [Op.gte]: dayStart, [Op.lt]: dayEnd }
				},
				include: [{
					model: Events,
					as: "event",
					attributes: ["price"],
					where: { organiserId: organiserEmail }
				}]
			});
			const dailyRevenue = regsPeriod.reduce(
				(sum, r) => sum + (r.event?.price || 0),
				0
			);

			chartData.push({
				name: dayStart.toLocaleDateString("en-US", { weekday: "short" }),
				registrations: dailyRegs,
				revenue: dailyRevenue
			});
		}

		return res.status(200).json({
			totalEvents,
			totalRegistrations,
			totalRevenue,
			upcomingEvents,
			chartData
		});
	} catch (error) {
		console.error("Organiser Dashboard Error:", error);
		return res
			.status(500)
			.json({ message: "Failed to fetch organiser dashboard data." });
	}
};
