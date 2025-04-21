// backend/controllers/customerController.js
import { Op } from "sequelize";
import { Events, EventRegistration } from "../models/index.js";

export const getCustomerDashboard = async (req, res) => {
	try {
		const customerEmail = req.user.email;

		// ── Personal Stats ───────────────────────────────
		// 1) My Events (number of registrations)
		const registrationCount = await EventRegistration.count({
			where: { customerEmail }
		});

		// 2) Tickets Purchased (same as registrations here)
		const ticketsPurchased = registrationCount;

		// 3) Total Spent (sum of event.price for each registration)
		const regs = await EventRegistration.findAll({
			where: { customerEmail },
			include: [{ model: Events, as: "event", attributes: ["price"] }]
		});
		const totalSpent = regs.reduce((sum, r) => sum + (r.event?.price || 0), 0);

		// 4) Friends Invited (no friends model yet—default to 0)
		const friendsInvited = 0;

		const personalStats = [
			{ title: "My Events", value: registrationCount },
			{ title: "Tickets Purchased", value: ticketsPurchased },
			{ title: "Total Spent", value: `$${totalSpent}` },
			{ title: "Friends Invited", value: friendsInvited },
		];

		// ── My Tickets ────────────────────────────────────
		const myRegs = await EventRegistration.findAll({
			where: { customerEmail },
			include: [{ model: Events, as: "event" }],
			order: [["registrationDate", "DESC"]]
		});

		const myTickets = myRegs.map((reg) => {
			const evt = reg.event;
			return {
				id: evt.id,
				title: evt.title,
				date: evt.startDate,    // you can format this on the frontend
				time: evt.time,
				location: evt.location,
				ticketType: "Standard", // default type
				image: evt.image,
			};
		});

		// ── Recommended Events ────────────────────────────
		const registeredIds = myRegs.map((r) => r.eventId);
		const now = new Date();

		const recommendedRaw = await Events.findAll({
			where: {
				id: { [Op.notIn]: registeredIds.length ? registeredIds : [null] },
				startDate: { [Op.gte]: now }
			},
			order: [["startDate", "ASC"]],
			limit: 5
		});

		const recommendedEvents = recommendedRaw.map((evt) => ({
			id: evt.id,
			title: evt.title,
			date: evt.startDate,
			time: evt.time,
			location: evt.location,
			price: `$${evt.price}`,
			image: evt.image
		}));

		// ── Send Payload ──────────────────────────────────
		return res.status(200).json({
			personalStats,
			myTickets,
			recommendedEvents
		});
	} catch (error) {
		console.error("Customer Dashboard Error:", error);
		return res.status(500).json({
			message: "Failed to fetch customer dashboard data."
		});
	}
};
