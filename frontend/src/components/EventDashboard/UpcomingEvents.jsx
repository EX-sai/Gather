// components/EventDashboard/UpcomingEvents.jsx
import {
	Grid,
	Card,
	CardContent,
	Typography,
	Box,
	Button,
	Chip,
	CardMedia,
	Grow,
	Zoom,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

// Motion wrappers
const MotionCard = motion(Card);
const MotionButton = motion(Button);
const MotionChip = motion(Chip);

const UpcomingEvents = ({ cardStyle, events }) => {
	const [hoveredCard, setHoveredCard] = useState(null);

	return (
		<Box sx={{ mb: 5 }}>
			<Grow in timeout={800}>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						flexDirection: { xs: "column", sm: "row" },
						gap: 2,
						mb: 3,
					}}
				>
					<Typography variant="h6" fontWeight="bold">
						Upcoming Events
					</Typography>
					<MotionButton
						variant="contained"
						color="primary"
						startIcon={<AddIcon />}
						whileHover={{
							scale: 1.03,
							boxShadow: "0 6px 12px rgba(25, 118, 210, 0.3)",
						}}
						whileTap={{ scale: 0.98 }}
						sx={{
							px: 3,
							py: 1,
							borderRadius: 1,
							boxShadow: "0 3px 6px rgba(25, 118, 210, 0.2)",
							textTransform: "none",
						}}
					>
						<Link
							to="/o/dashboard/bookings"
							style={{ color: "white", textDecoration: "none" }}
						>
							Create New Event
						</Link>
					</MotionButton>
				</Box>
			</Grow>

			<Grid container spacing={3}>
				{events.map((event, index) => (
					<Grid item xs={12} sm={6} lg={4} key={event.id}>
						<Zoom in style={{ transitionDelay: `${index * 100}ms` }}>
							<div>
								<MotionCard
									onMouseEnter={() => setHoveredCard(event.id)}
									onMouseLeave={() => setHoveredCard(null)}
									whileHover={{
										y: -4,
										boxShadow: "0 8px 18px rgba(0, 0, 0, 0.08)",
									}}
									sx={{
										...cardStyle,
										display: "flex",
										flexDirection: "column",
										transition: "all 0.3s ease",
										borderRadius: 1,
										overflow: "hidden",
										height: "100%",
									}}
								>
									<CardMedia
										component="img"
										height="160"
										image={event.image}
										alt={event.title}
										sx={{
											height: { xs: 140, sm: 160, md: 180 },
											transition: "transform 0.4s ease",
											transform:
												hoveredCard === event.id
													? "scale(1.04)"
													: "scale(1)",
										}}
									/>
									<CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 2.5 } }}>
										<Typography
											variant="h6"
											fontWeight="bold"
											sx={{
												fontSize: { xs: "1.1rem", sm: "1.25rem" },
												color:
													hoveredCard === event.id
														? "primary.main"
														: "text.primary",
												transition: "color 0.3s ease",
											}}
										>
											{event.title}
										</Typography>
										<Typography
											variant="body2"
											color="text.secondary"
											sx={{ mt: 0.5 }}
										>
											{event.date} • {event.time}
										</Typography>
										<Box sx={{ mt: 1.5 }}>
											<MotionChip
												label={`${event.registered} Registered`}
												size="small"
												whileHover={{ scale: 1.03 }}
												sx={{
													bgcolor: "rgba(46, 125, 50, 0.1)",
													color: "#2e7d32",
													fontWeight: 500,
													fontSize: "0.8rem",
													borderRadius: 2,
													py: 0.5,
													"&:hover": {
														bgcolor: "rgba(46, 125, 50, 0.15)",
													},
												}}
											/>
										</Box>
									</CardContent>
								</MotionCard>
							</div>
						</Zoom>
					</Grid>
				))}
			</Grid>
		</Box>
	);
};

export default UpcomingEvents;


































// // components/EventDashboard/UpcomingEvents.jsx
// import {
// 	Grid,
// 	Card,
// 	CardContent,
// 	Typography,
// 	Box,
// 	Button,
// 	Chip,
// 	CardMedia,
// 	Grow,
// 	Zoom,
// } from "@mui/material";
// import { Add as AddIcon } from "@mui/icons-material";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { useState } from "react";

// // Wrap MUI components with motion for animations
// const MotionCard = motion.create(Card);
// const MotionButton = motion.create(Button);
// const MotionChip = motion.create(Chip);

// const UpcomingEvents = ({ cardStyle, events }) => {
// 	// Track which card is being hovered
// 	const [hoveredCard, setHoveredCard] = useState(null);

// 	return (
// 		<Box sx={{ mb: 4 }}>
// 			<Grow in={true} timeout={800}>
// 				<Box
// 					sx={{
// 						display: "flex",
// 						flexDirection: { xs: "column", sm: "row" },
// 						justifyContent: "space-between",
// 						alignItems: { xs: "flex-start", sm: "center" },
// 						mb: 2,
// 						gap: { xs: 1, sm: 0 },
// 					}}
// 				>
// 					<Typography
// 						variant="h6"
// 						component="h2"
// 						fontWeight="bold"
// 						sx={{ mb: { xs: 1, sm: 0 } }}
// 					>
// 						Upcoming Events
// 					</Typography>
// 					<MotionButton
// 						variant="contained"
// 						color="primary"
// 						startIcon={<AddIcon />}
// 						whileHover={{
// 							scale: 1.02,
// 							boxShadow: "0 6px 12px rgba(25, 118, 210, 0.3)",
// 						}}
// 						whileTap={{ scale: 0.98 }}
// 						sx={{
// 							borderRadius: 1, // Sharp corners instead of rounded
// 							px: 3,
// 							py: 0.75,
// 							boxShadow: "0 3px 8px rgba(25, 118, 210, 0.2)",
// 							transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
// 							width: { xs: "100%", sm: "auto" },
// 						}}
// 					>
// 						<Link
// 							to="/o/dashboard/bookings"
// 							style={{ color: "white", textDecoration: "none" }}
// 						>
// 							Create New Event
// 						</Link>
// 					</MotionButton>
// 				</Box>
// 			</Grow>
// 			<Grid container spacing={2}>
// 				{events.map((event, index) => (
// 					<Grid item xs={12} sm={6} lg={4} key={event.id}>
// 						<Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
// 							<div>
// 								<MotionCard
// 									onMouseEnter={() => setHoveredCard(event.id)}
// 									onMouseLeave={() => setHoveredCard(null)}
// 									whileHover={{
// 										y: -5,
// 										boxShadow: "0 8px 16px rgba(0, 0, 0, 0.08)",
// 										transition: { duration: 0.3 }
// 									}}
// 									sx={{
// 										...cardStyle,
// 										overflow: "hidden",
// 										height: "100%",
// 										display: "flex",
// 										flexDirection: "column",
// 										transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
// 										borderRadius: 1, // Much sharper corners
// 									}}
// 								>
// 									<Box sx={{ overflow: "hidden" }}>
// 										<CardMedia
// 											component="img"
// 											height="160"
// 											image={event.image}
// 											alt={event.title}
// 											sx={{
// 												height: { xs: 140, sm: 160, md: 180 },
// 												transition: "transform 0.4s cubic-bezier(0.2, 0, 0.2, 1)",
// 												transform: hoveredCard === event.id ? "scale(1.04)" : "scale(1)",
// 											}}
// 										/>
// 									</Box>
// 									<CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 2.5 } }}>
// 										<Typography
// 											gutterBottom
// 											variant="h6"
// 											component="div"
// 											fontWeight="bold"
// 											sx={{
// 												fontSize: { xs: '1.1rem', sm: '1.25rem' },
// 												transition: "color 0.3s ease",
// 												color: hoveredCard === event.id ? "primary.main" : "text.primary",
// 											}}
// 										>
// 											{event.title}
// 										</Typography>
// 										<Typography
// 											variant="body2"
// 											color="text.secondary"
// 											sx={{
// 												mb: 0.5,
// 												fontSize: { xs: '0.875rem', sm: '0.9375rem' }
// 											}}
// 										>
// 											{event.date} • {event.time}
// 										</Typography>
// 										<Box sx={{ mt: 1.5 }}>
// 											<MotionChip
// 												label={`${event.registered} Registered`}
// 												size="small"
// 												whileHover={{ scale: 1.02 }}
// 												sx={{
// 													bgcolor: "rgba(46, 125, 50, 0.1)",
// 													color: "#2e7d32",
// 													fontWeight: "medium",
// 													borderRadius: 2, // Much less rounded
// 													py: 0.5,
// 													fontSize: { xs: '0.75rem', sm: '0.8125rem' },
// 													transition: "all 0.2s ease",
// 													"&:hover": {
// 														bgcolor: "rgba(46, 125, 50, 0.15)",
// 													}
// 												}}
// 											/>
// 										</Box>
// 									</CardContent>
// 								</MotionCard>
// 							</div>
// 						</Zoom>
// 					</Grid>
// 				))}
// 			</Grid>
// 		</Box>
// 	);
// };

// export default UpcomingEvents;