// backend/controllers/adminController.js
import { Op } from "sequelize";
import { fn, col, literal } from "sequelize";
import { User, Events, EventRegistration } from "../models/index.js";

export const getAdminDashboard = async (req, res) => {
	try {
		// 1. Total users
		const totalUsers = await User.count();

		// (Placeholder) Monthly user growth %
		const userGrowthPercentage = 12.5;

		// 2. Active events (those with startDate >= now)
		const now = new Date();
		const activeEvents = await Events.count({
			where: {
				startDate: { [Op.gte]: now }
			}
		});

		const eventTrend = "up";
		const eventChangePercentage = 5.2;

		// 3. All registrations → transactions & revenue
		const registrations = await EventRegistration.findAll({
			include: [{ model: Events, as: "event", attributes: ["price"] }]
		});

		const transactions = registrations.length;
		const transactionTrend = "neutral";
		const transactionGrowthPercentage = 0.5;

		// Sum up each registration’s event.price
		const revenue = registrations.reduce(
			(sum, reg) => sum + (reg.event?.price || 0),
			0
		);
		const revenueTrend = "up";
		const revenueGrowthPercentage = 18.7;

		// 4. Recent Activities (latest users, regs, events)
		const recentUsers = await User.findAll({
			order: [["creation_date", "DESC"]],
			limit: 3
		});

		const recentRegistrations = await EventRegistration.findAll({
			order: [["registrationDate", "DESC"]],
			limit: 3,
			include: [
				{ model: User, as: "user", attributes: ["name"] },
				{ model: Events, as: "event", attributes: ["title"] }
			]
		});

		const recentEvents = await Events.findAll({
			order: [["createdAt", "DESC"]],
			limit: 3
		});

		const recentActivities = [];

		// New user sign‑ups
		recentUsers.forEach((u) =>
			recentActivities.push({
				title: "New user registered",
				description: `${u.name} signed up`,
				time: u.creation_date.toLocaleString(),
				icon: "👤"
			})
		);

		// New registrations
		recentRegistrations.forEach((r) =>
			recentActivities.push({
				title: "New event registration",
				description: `${r.user?.name} registered for "${r.event?.title}"`,
				time: r.registrationDate.toLocaleString(),
				icon: "📝"
			})
		);

		// New events
		recentEvents.forEach((e) =>
			recentActivities.push({
				title: "New event created",
				description: `Event "${e.title}" was added`,
				time: e.createdAt.toLocaleString(),
				icon: "📅"
			})
		);

		// ── 1) USER GROWTH: last 7 days ──────────────────────────
		const userGrowthData = [];
		for (let i = 6; i >= 0; i--) {
			const day = new Date();
			day.setDate(day.getDate() - i);
			const next = new Date(day);
			next.setDate(next.getDate() + 1);

			const count = await User.count({
				where: {
					creation_date: {
						[Op.gte]: day,
						[Op.lt]: next
					}
				}
			});

			// format date as e.g. "Apr 11"
			userGrowthData.push({
				date: day.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
				count
			});
		}

		// ── 2) EVENT POPULARITY: top 5 by registrations ────────

		const popularityRows = await EventRegistration.findAll({
			attributes: [
				"eventId",
				[fn("COUNT", col("eventId")), "count"]
			],
			group: ["eventId"],
			order: [[literal("count"), "DESC"]],
			limit: 5,
			include: [{
				model: Events,
				as: "event",
				attributes: ["title"]
			}]
		});

		const eventPopularityData = popularityRows.map(r => ({
			title: r.event.title,
			count: parseInt(r.get("count"), 10)
		}));

		// Sort by most recent and limit to 5
		recentActivities
			.sort((a, b) => new Date(b.time) - new Date(a.time));
		const limitedActivities = recentActivities.slice(0, 5);

		// Send dashboard payload
		return res.status(200).json({
			totalUsers,
			userGrowthPercentage,
			activeEvents,
			eventTrend,
			eventChangePercentage,
			revenue,
			revenueTrend,
			revenueGrowthPercentage,
			transactions,
			transactionTrend,
			transactionGrowthPercentage,
			recentActivities: limitedActivities,
			userGrowthData,
			eventPopularityData
		});
	} catch (error) {
		console.error("Dashboard Error:", error);
		return res
			.status(500)
			.json({ message: "Failed to fetch admin dashboard data." });
	}
};
