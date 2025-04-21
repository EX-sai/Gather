import Events from "../models/Event.js";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import EventRegistration from "../models/EventRegistration.js";
import { sendEmail } from "../services/emailService.js";
import User from "../models/User.js";
import { Op } from "sequelize";


// Define the upload directory
const uploadDir = path.join(process.cwd(), "public", "user_uploads");

// Ensure the directory exists before uploading files
const ensureUploadDir = async () => {
	try {
		await fs.access(uploadDir);
	} catch (error) {
		await fs.mkdir(uploadDir, { recursive: true });
	}
};

// Set up Multer storage
const storage = multer.diskStorage({
	destination: async function (req, file, cb) {
		await ensureUploadDir();
		cb(null, uploadDir);
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
	},
});

// File filter for images only
const fileFilter = (_, file, cb) => {
	const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
	const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
	const ext = path.extname(file.originalname).toLowerCase();

	if (allowedMimes.includes(file.mimetype) && allowedExts.includes(ext)) {
		cb(null, true);
	} else {
		cb(new Error("Only JPG, PNG, GIF, and WebP files are allowed!"), false);
	}
};

// Configure Multer
export const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
});

// Create Event
export const createEvent = async (req, res) => {
	try {
		const { title, description, startDate, endDate, time, location, price } = req.body;
		const organiserId = req.user.email; // Get organiser from logged in user

		// Validate user is organiser or admin
		if (req.user.role !== 'organiser' && req.user.role !== 'admin') {
			return res.status(403).json({ message: "Only organisers can create events" });
		}

		// Validate dates
		if (new Date(startDate) >= new Date(endDate)) {
			return res.status(400).json({ message: "End date must be after start date" });
		}

		const eventData = {
			title,
			description,
			startDate,
			endDate,
			time,
			location,
			price: price || 0,
			organiserId
		};

		if (req.file) {
			console.log("File saved at:", req.file.path);
			eventData.image = `${req.protocol}://${req.get("host")}/user_uploads/${req.file.filename}`;
		}

		const event = await Events.create(eventData);
		res.status(201).json(event);
	} catch (error) {
		console.error("Create Event Error:", error);

		if (req.file) {
			try {
				await fs.unlink(req.file.path);
			} catch (err) {
				console.error("Error deleting file:", err);
			}
		}

		res.status(500).json({
			message: "Something went wrong",
			error: error.message
		});
	}
};

export const getAllEvents = async (req, res) => {
	try {
		const { search, location, page = 1, limit = 10 } = req.query;

		const whereClause = {};

		// Search title or description
		if (search) {
			whereClause[Op.or] = [
				{ title: { [Op.like]: `%${search}%` } },
				{ description: { [Op.like]: `%${search}%` } }
			];
		}

		// Filter by location
		if (location) {
			whereClause.location = { [Op.like]: `%${location}%` };
		}

		// Pagination logic
		const offset = (parseInt(page) - 1) * parseInt(limit);

		const { rows: events, count: total } = await Events.findAndCountAll({
			where: whereClause,
			limit: parseInt(limit),
			offset: offset,
			order: [['startDate', 'ASC']],
		});

		res.status(200).json({
			page: parseInt(page),
			totalPages: Math.ceil(total / limit),
			totalEvents: total,
			events,
		});
	} catch (error) {
		res.status(500).json({
			message: "Something went wrong",
			error: error.message
		});
	}
};




// Get Event by ID
export const getEventById = async (req, res) => {
	try {
		const event = await Events.findByPk(req.params.id);
		if (!event) return res.status(404).json({ message: "Event not found" });

		res.status(200).json(event);
	} catch (error) {
		res.status(500).json({
			message: "Something went wrong",
			error: error.message
		});
	}
};

// Update Event
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const updateEvent = async (req, res) => {
	try {
		const event = await Events.findByPk(req.params.id);
		if (!event) return res.status(404).json({ message: "Event not found" });

		const { startDate, endDate } = req.body;

		// Validate dates if they're being updated
		if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
			return res.status(400).json({ message: "End date must be after start date" });
		}

		const updateData = {
			title: req.body.title,
			description: req.body.description,
			startDate: req.body.startDate,
			endDate: req.body.endDate,
			time: req.body.time,
			location: req.body.location,
			price: req.body.price || 0,
		};

		// Handle file upload if exists
		if (req.file) {
			// Delete old image if it exists
			if (event.image) {
				// Extract filename from the full URL
				const imageUrl = new URL(event.image);
				const filename = path.basename(imageUrl.pathname);
				const imagePath = path.join(uploadDir, filename);

				try {
					await fs.unlink(imagePath);
					console.log("✅ Old image deleted:", imagePath);
				} catch (err) {
					console.error("❌ Error deleting old file:", err);
				}
			}
			// Store new image with proper URL
			updateData.image = `${req.protocol}://${req.get("host")}/user_uploads/${req.file.filename}`;
		}

		await event.update(updateData);
		res.status(200).json(event);
	} catch (error) {
		console.error("❌ Update Event Error:", error);

		// Delete uploaded file if an error occurs
		if (req.file) {
			try {
				await fs.unlink(req.file.path);
				console.log("✅ Uploaded file deleted due to error:", req.file.path);
			} catch (err) {
				console.error("❌ Error deleting uploaded file:", err);
			}
		}

		res.status(500).json({
			message: "Something went wrong",
			error: error.message,
		});
	}
};


// Delete Event
export const deleteEvent = async (req, res) => {
	try {
		const event = await Events.findByPk(req.params.id);
		if (!event) return res.status(404).json({ message: "Event not found" });

		// Delete associated image if exists
		if (event.image) {
			try {
				const imageUrl = new URL(event.image);
				const filename = path.basename(imageUrl.pathname);
				const imagePath = path.join(uploadDir, filename);
				await fs.unlink(imagePath);
				console.log("Deleted image:", imagePath);
			} catch (err) {
				console.error("Error deleting image:", err);
				// Don't fail the entire operation if image deletion fails
			}
		}

		// First delete all registrations
		await EventRegistration.destroy({
			where: { eventId: req.params.id }
		});

		// Then delete the event itself
		await event.destroy();

		res.status(200).json({
			message: "Event and all associated registrations deleted successfully",
			deletedEventId: req.params.id
		});

	} catch (error) {
		console.error("Delete error:", error);
		res.status(500).json({
			message: "Failed to delete event",
			error: error.message
		});
	}
};

// Register for Event
export const registerForEvent = async (req, res) => {
	try {
		const { eventId } = req.params;
		const customerEmail = req.user.email;

		// Check if event exists
		const event = await Events.findByPk(eventId);
		if (!event) {
			return res.status(404).json({ message: "Event not found" });
		}

		// Check if user is already registered
		const existingRegistration = await EventRegistration.findOne({
			where: { eventId, customerEmail }
		});
		if (existingRegistration) {
			return res.status(400).json({ message: "Already registered for this event" });
		}

		// Create registration
		await EventRegistration.create({ eventId, customerEmail });

		// Increment registered count
		await event.increment('registered');

		// Get customer and organiser details
		const customer = await User.findByPk(customerEmail);
		const organiser = await User.findByPk(event.organiserId);

		// Send notifications
		const eventUrl = `${req.protocol}://${req.get('host')}/events/${eventId}`;

		const customerEmailHtml = `
		<h2>Thank you for registering for ${event.title}!</h2>
		<p><strong>Date:</strong> ${event.startDate} - ${event.endDate}</p>
		<p><strong>Time:</strong> ${event.time}</p>
		<p><strong>Location:</strong> ${event.location}</p>
		<p><strong>Description:</strong> ${event.description}</p>
		<p>You can view your event <a href="${eventUrl}">here</a>.</p>
	`;

		await sendEmail(
			customer.email,
			`Registration Confirmation: ${event.title}`,
			`You've registered for ${event.title}`,
			customerEmailHtml
		);

		const organiserEmailHtml = `
		<h2>New Registration for Your Event: ${event.title}</h2>
		<p><strong>Customer:</strong> ${customer.name} (${customer.email})</p>
		<p><strong>Event:</strong> ${event.title}</p>
		<p><strong>Date:</strong> ${event.startDate} - ${event.endDate}</p>
		<p><strong>Time:</strong> ${event.time}</p>
		<p><strong>Location:</strong> ${event.location}</p>
		<p><strong>Description:</strong> ${event.description}</p>
		<p>Event link: <a href="${eventUrl}">${event.title}</a></p>
	`;

		await sendEmail(
			organiser.email,
			`New Registration: ${customer.name} for ${event.title}`,
			`${customer.name} registered for your event`,
			organiserEmailHtml
		);


		res.status(201).json({ message: "Successfully registered for event" });
	} catch (error) {
		res.status(500).json({
			message: "Registration failed",
			error: error.message
		});
	}
};

// Get events by organiser
export const getEventsByOrganiser = async (req, res) => {
	try {
		const { organiserId } = req.params;
		const events = await Events.findAll({
			where: { organiserId },
			order: [['startDate', 'ASC']]
		});
		res.status(200).json(events);
	} catch (error) {
		res.status(500).json({
			message: "Failed to fetch events",
			error: error.message
		});
	}
};

// Get registered events for customer
export const getRegisteredEvents = async (req, res) => {
	try {
		const customerEmail = req.user.email;
		const registrations = await EventRegistration.findAll({
			where: { customerEmail },
			include: [{
				model: Events,   // ✅ corrected model
				as: 'event'      // ✅ assuming association is defined correctly
			}]
		});

		const events = registrations.map(reg => reg.event);
		res.status(200).json(events);
	} catch (error) {
		res.status(500).json({
			message: "Failed to fetch registered events",
			error: error.message
		});
	}
};
