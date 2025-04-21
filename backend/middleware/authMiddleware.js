// authMiddleware.js
import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({
			message: "Authorization header missing or malformed",
			solution: "Ensure you include 'Bearer ' before your token"
		});
	}

	const token = authHeader.split(' ')[1];

	try {

		const decoded = jwt.verify(token, process.env.JWT_SECRET, {
			algorithms: ['HS256'], // Explicitly specify algorithm
			ignoreExpiration: false, // Explicitly check expiration
			clockTolerance: 30, // 30 seconds tolerance for clock skew
		});

		req.user = decoded;
		next();
	} catch (error) {

		let message = "Invalid token";
		if (error.name === 'TokenExpiredError') {
			message = `Token expired at ${error.expiredAt}`;
		} else if (error.name === 'JsonWebTokenError') {
			message = `JWT Error: ${error.message}`;
		}

		return res.status(401).json({
			message,
			error: error.name,
			solution: "Check token expiration and signing secret"
		});
	}
};

export default authMiddleware;