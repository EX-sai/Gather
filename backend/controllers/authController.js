import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { validationResult } from "express-validator";

const generateToken = (user) => {

	return jwt.sign(
		{
			email: user.email,
			role: user.role,
			userId: user.id // Include user ID if available
		},
		process.env.JWT_SECRET, {
			expiresIn: "8h",
			algorithm: 'HS256', // Explicit algorithm
			issuer: 'EMS', // Optional but helpful
			audience: 'web-client' // Optional but helpful
	});
};



// Login Controller (Updated)
export const login = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ where: { email } });

		if (!user) {
			return res.status(400).json({ message: "Invalid email or password." });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res.status(400).json({ message: "Invalid email or password." });
		}

		const token = generateToken(user);

		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 3600000,
		});

		res.status(200).json({
			message: "Login successful!",
			token,
			user: {
				name: user.name,
				email: user.email,
				role: user.role,  // Ensure this is correct
				profile_visibility: user.profile_visibility
			}
		});
	} catch (error) {
		res.status(500).json({ message: "Login failed!", error: error.message });
	}
};



export const signup = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { name, email, password, role } = req.body;

	try {
		const existingUser = await User.findOne({ where: { email } });
		if (existingUser) {
			return res.status(400).json({ message: "Email already in use." });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const userRole = role === 'organiser' ? 'organiser' : 'customer'; // Default to customer if invalid

		const newUser = await User.create({
			name,
			email,
			password: hashedPassword,
			role: userRole,
		});

		const token = generateToken(newUser);

		res.status(201).json({ message: "User registered successfully!", token, role: newUser.role });
	} catch (error) {
		res.status(500).json({ message: "Signup failed!", error: error.message });
	}
};




// Add this to your authController.js
// Add this verify endpoint
export const verifyToken = async (req, res) => {
	try {
		const token = req.headers.authorization?.split(' ')[1];

		if (!token) {
			return res.status(401).json({ valid: false });
		}

		jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if (err) {
				return res.status(401).json({ valid: false });
			}
			res.status(200).json({ valid: true, user: decoded });
		});
	} catch (error) {
		res.status(500).json({ message: "Token verification failed", error: error.message });
	}
};


// Logout Controller
export const logout = (req, res) => {
	res.clearCookie("token");
	res.status(200).json({ message: "Logged out successfully!" });
};


// Get all users (admin only)
export const getAllUsers = async (req, res) => {
	try {
		const users = await User.findAll({
			attributes: ['name', 'email', 'role', 'profile_visibility', 'creation_date'],
			order: [['creation_date', 'DESC']]
		});
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ message: "Failed to fetch users", error: error.message });
	}
};

// Delete user (admin only)
export const deleteUser = async (req, res) => {
	try {
		const { email } = req.params;
		const user = await User.findOne({ where: { email } });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		await user.destroy();
		res.status(200).json({ message: "User deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Failed to delete user", error: error.message });
	}
};

// Update user (admin only)
export const updateUser = async (req, res) => {
	try {
		const { email } = req.params;
		const { name, role, profile_visibility } = req.body;

		const user = await User.findOne({ where: { email } });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		user.name = name || user.name;
		user.role = role || user.role;
		user.profile_visibility = profile_visibility || user.profile_visibility;

		await user.save();

		res.status(200).json({
			message: "User updated successfully",
			user: {
				name: user.name,
				email: user.email,
				role: user.role,
				profile_visibility: user.profile_visibility,
				creation_date: user.creation_date
			}
		});
	} catch (error) {
		res.status(500).json({ message: "Failed to update user", error: error.message });
	}
};

// Create user (admin only)
export const createUser = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { name, email, password, role, profile_visibility } = req.body;

	try {
		// Check if user already exists
		const existingUser = await User.findOne({ where: { email } });
		if (existingUser) {
			return res.status(400).json({ message: "Email already in use." });
		}

		// Validate role
		const validRoles = ['admin', 'organiser', 'customer'];
		if (!validRoles.includes(role)) {
			return res.status(400).json({ message: "Invalid role specified." });
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create new user
		const newUser = await User.create({
			name,
			email,
			password: hashedPassword,
			role,
			profile_visibility: profile_visibility || 'public'
		});

		res.status(201).json({
			message: "User created successfully!",
			user: {
				name: newUser.name,
				email: newUser.email,
				role: newUser.role,
				profile_visibility: newUser.profile_visibility,
				creation_date: newUser.creation_date
			}
		});
	} catch (error) {
		res.status(500).json({ message: "User creation failed!", error: error.message });
	}
};