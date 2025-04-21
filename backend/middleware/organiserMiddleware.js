const organiserMiddleware = (req, res, next) => {
	if (req.user.role !== 'organiser' && req.user.role !== 'admin') {
		return res.status(403).json({ message: "Organiser access required" });
	}
	next();
};

export default organiserMiddleware;