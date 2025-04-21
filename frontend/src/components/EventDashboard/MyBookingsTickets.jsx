import { useEffect, useState } from "react";
import eventService from "../../services/eventService";
import useAuth from "../../hooks/useAuth";

// MUI Components
import {
	Box,
	Typography,
	Button,
	Chip,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	DialogContentText,
	Fab,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	InputAdornment,
	IconButton,
	Card,
	CardContent,
	CardMedia,
	CardActionArea,
	CardActions,
	Grid,
	Avatar,
	CircularProgress,
	Alert,
	Tabs,
	Tab,
	Badge,
	Divider,
	useMediaQuery,
	useTheme,
	Tooltip,
	Drawer,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Container,
	Fade,
	Switch,
	FormControlLabel,
} from "@mui/material";

// Icons
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import EventNoteIcon from '@mui/icons-material/EventNote';
import {
	Visibility as VisibilityIcon,
	Edit as EditIcon,
	Delete as DeleteIcon,
	Add as AddIcon,
	Share as ShareIcon,
	Download as DownloadIcon,
	ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";

import Header from "./Header";
import Sidebar from "./Sidebar";
import EventModal from "./EventModal";

// Date formatting utility functions
const formatDate = (dateString) => {
	if (!dateString) return '';
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
};

const formatTime = (timeString) => {
	if (!timeString) return null;
	if (typeof timeString === 'string' && timeString.includes(' ')) {
		const timePart = timeString.split(' ')[1];
		return timePart.substring(0, 5);
	}
	if (typeof timeString === 'string' && timeString.includes(':')) {
		return timeString.substring(0, 5);
	}
	return null;
};

const MyBookingsTickets = () => {
	const { user } = useAuth();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

	// UI State
	const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
	const [viewMode, setViewMode] = useState('grid');
	const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
	const [activeTab, setActiveTab] = useState(0);

	// Filter State
	const [status, setStatus] = useState("All Status");
	const [selectedDate, setSelectedDate] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState("date");

	// Data State
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Modal States
	const [viewModalOpen, setViewModalOpen] = useState(false);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState(null);

	// EventModal States
	const [eventModalOpen, setEventModalOpen] = useState(false);
	const [currentEvent, setCurrentEvent] = useState({
		title: "",
		description: "",
		startDate: null,
		endDate: null,
		time: "",
		location: "",
		price: "",
		banner: null,
		image: null,
	});

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const events = user?.role === 'organiser'
					? await eventService.getEventsByOrganiser(user.email)
					: await eventService.getRegisteredEvents();
				setEvents(events);
				setError(null);
			} catch (err) {
				setError("Failed to load events");
				console.error("Error fetching events:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchEvents();
	}, [user]);

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	const handleStatusChange = (event) => {
		setStatus(event.target.value);
	};

	const handleDateChange = (event) => {
		setSelectedDate(event.target.value);
	};

	const handleView = (event) => {
		setSelectedEvent(event);
		setViewModalOpen(true);
	};

	const handleDelete = (event) => {
		setSelectedEvent(event);
		setDeleteModalOpen(true);
	};

	const handleDeleteConfirm = async () => {
		try {
			await eventService.deleteEvent(selectedEvent.id);
			setEvents(events.filter(event => event.id !== selectedEvent.id));
			setDeleteModalOpen(false);
		} catch (error) {
			console.error("Error deleting event:", error);
			setError("Failed to delete event");
		}
	};

	const handleEventChange = (field, value) => {
		setCurrentEvent(prev => ({
			...prev,
			[field]: value
		}));
	};

	const handleSaveEvent = async (formData, onUploadProgress) => {
		try {
			let savedEvent;
			if (currentEvent.id) {
				savedEvent = await eventService.updateEvent(currentEvent.id, formData);
				setEvents(events.map(event =>
					event.id === currentEvent.id ? savedEvent : event
				));
			} else {
				savedEvent = await eventService.createEvent(formData);
				setEvents([...events, savedEvent]);
			}
			setEventModalOpen(false);
			setCurrentEvent({
				title: "",
				description: "",
				startDate: null,
				endDate: null,
				time: "",
				location: "",
				price: "",
				banner: null,
				image: null,
			});
		} catch (error) {
			console.error("Error saving event:", error);
			setError(error.message || "Failed to save event");
			throw error;
		}
	};

	const handleEdit = (event) => {
		setCurrentEvent({
			id: event.id,
			title: event.title,
			description: event.description,
			startDate: new Date(event.startDate),
			endDate: new Date(event.endDate),
			time: event.time || "",
			location: event.location,
			price: event.price || "",
			image: event.image || null
		});
		setEventModalOpen(true);
	};

	const handleSortChange = (event) => {
		setSortBy(event.target.value);
	};

	const handleTabChange = (event, newValue) => {
		setActiveTab(newValue);
		if (newValue === 0) setStatus("All Status");
		if (newValue === 1) setStatus("Upcoming");
		if (newValue === 2) setStatus("Past");
	};

	const handleViewModeChange = (mode) => {
		setViewMode(mode);
	};

	const getStatusFromTab = (tabIndex) => {
		switch (tabIndex) {
			case 0: return "All Status";
			case 1: return "Upcoming";
			case 2: return "Past";
			default: return "All Status";
		}
	};

	const filteredEvents = events.filter((event) => {
		const matchesSearch =
			event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
			event.location.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesDate = !selectedDate ||
			new Date(event.startDate).toISOString().split('T')[0] === selectedDate;

		const currentStatus = getStatusFromTab(activeTab);
		const matchesStatus =
			currentStatus === "All Status" ||
			(currentStatus === "Upcoming" && new Date(event.startDate) > new Date()) ||
			(currentStatus === "Past" && new Date(event.startDate) <= new Date());

		return matchesSearch && matchesStatus && matchesDate;
	});

	// Sort the events
	const sortedEvents = [...filteredEvents].sort((a, b) => {
		switch (sortBy) {
			case "date":
				return new Date(a.startDate) - new Date(b.startDate);
			case "dateDesc":
				return new Date(b.startDate) - new Date(a.startDate);
			case "title":
				return a.title.localeCompare(b.title);
			case "titleDesc":
				return b.title.localeCompare(a.title);
			default:
				return new Date(a.startDate) - new Date(b.startDate);
		}
	});

	const getDisplayTime = (event) => {
		if (event.time) return formatTime(event.time);
		if (event.endDate) return formatTime(event.endDate);
		return null;
	};

	return (
		<Box sx={{
			display: "flex",
			flexDirection: "column",
			height: "100vh",
			width: "100vw",
			overflow: "hidden",
			position: "fixed",
			top: 0,
			left: 0,
			bgcolor: "#f9fafb",
		}
		}>
			<Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

			<Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
				<Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

				<Box component="main" sx={{
					flexGrow: 1,
					p: { xs: 2, md: 3 },
					overflow: "auto",
					backgroundColor: theme.palette.mode === 'light' ? '#f9fafb' : '#121212'
				}}>
					<Container maxWidth="xl" disableGutters >
						{/* Header Section */}
						< Box sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							mb: 3,
							flexWrap: { xs: 'wrap', md: 'nowrap' },
							gap: 2
						}}>
							<Typography variant="h5" component="h1" fontWeight="bold" >
								{user?.role === 'organiser' ? 'My Events' : 'My Bookings'}
							</Typography>

							< Box sx={{
								display: "flex",
								gap: 1,
								ml: { xs: 0, md: 'auto' },
								width: { xs: '100%', md: 'auto' }
							}}>
								{/* Search Bar */}
								< TextField
									placeholder="Search events..."
									variant="outlined"
									size="small"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									sx={{
										flexGrow: { xs: 1, md: 0 },
										width: { md: 220 },
										backgroundColor: theme.palette.background.paper,
										borderRadius: 1,
										'& .MuiOutlinedInput-root': {
											borderRadius: 1,
										}
									}}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start" >
												<SearchIcon sx={{ color: "text.secondary" }} />
											</InputAdornment>
										),
									}}
								/>

								{/* Filter Button (for mobile) */}
								<Tooltip title="Filters" >
									<IconButton
										sx={
											{
												display: { xs: 'flex', md: 'none' },
												backgroundColor: theme.palette.background.paper,
											}
										}
										onClick={() => setFilterDrawerOpen(true)}
									>
										<FilterListIcon />
									</IconButton>
								</Tooltip>

								{/* View Mode Toggle */}
								<Box sx={
									{
										display: { xs: 'none', sm: 'flex' },
										border: `1px solid ${theme.palette.divider}`,
										borderRadius: 1,
										backgroundColor: theme.palette.background.paper,
									}
								}>
									<Tooltip title="Grid View" >
										<IconButton
											onClick={() => handleViewModeChange('grid')}
											color={viewMode === 'grid' ? "primary" : "default"}
										>
											<GridViewIcon />
										</IconButton>
									</Tooltip>
									< Tooltip title="List View" >
										<IconButton
											onClick={() => handleViewModeChange('list')}
											color={viewMode === 'list' ? "primary" : "default"}
										>
											<ViewListIcon />
										</IconButton>
									</Tooltip>
								</Box>

								{/* Filters (desktop) */}
								<Box sx={
									{
										display: { xs: 'none', md: 'flex' },
										gap: 1
									}
								}>
									<FormControl
										sx={
											{
												minWidth: 130,
												backgroundColor: theme.palette.background.paper,
												borderRadius: 1
											}
										}
										size="small"
									>
										<InputLabel id="sort-by-label" > Sort By </InputLabel>
										< Select
											labelId="sort-by-label"
											value={sortBy}
											label="Sort By"
											onChange={handleSortChange}
										>
											<MenuItem value="date" > Date(Asc) </MenuItem>
											< MenuItem value="dateDesc" > Date(Desc) </MenuItem>
											< MenuItem value="title" > Title(A - Z) </MenuItem>
											< MenuItem value="titleDesc" > Title(Z - A) </MenuItem>
										</Select>
									</FormControl>

									< TextField
										label="Filter by Date"
										type="date"
										size="small"
										value={selectedDate}
										onChange={handleDateChange}
										sx={{
											width: 160,
											backgroundColor: theme.palette.background.paper,
											borderRadius: 1
										}}
										InputLabelProps={{ shrink: true }}
									/>
								</Box>
							</Box>
						</Box>

						{/* Tabs */}
						<Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
							<Tabs
								value={activeTab}
								onChange={handleTabChange}
								variant={isMobile ? "fullWidth" : "standard"}
								sx={{
									'& .MuiTab-root': {
										textTransform: 'none',
										fontWeight: 500,
										minWidth: 100,
									}
								}}
							>
								<Tab
									label={
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
											<Typography>All </Typography>
											< Chip
												label={events.length}
												size="small"
												sx={{ height: 20, fontSize: '0.75rem' }
												}
											/>
										</Box>
									}
								/>
								< Tab
									label={
										< Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
											<Typography>Upcoming </Typography>
											< Chip
												label={events.filter(e => new Date(e.startDate) > new Date()).length}
												size="small"
												color="primary"
												sx={{ height: 20, fontSize: '0.75rem' }}
											/>
										</Box>
									}
								/>
								< Tab
									label={
										< Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
											<Typography>Past </Typography>
											< Chip
												label={events.filter(e => new Date(e.startDate) <= new Date()).length}
												size="small"
												sx={{ height: 20, fontSize: '0.75rem', bgcolor: 'rgba(0,0,0,0.08)' }}
											/>
										</Box>
									}
								/>
							</Tabs>
						</Box>

						{/* Main Content */}
						{
							loading ? (
								<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }
								}>
									<CircularProgress />
								</Box>
							) : error ? (
								<Alert
									severity="error"
									sx={{
										mb: 3,
										borderRadius: 2,
										boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
									}}
								>
									{error}
								</Alert>
							) : sortedEvents.length === 0 ? (
								<Paper
									elevation={0}
									sx={{
										p: 4,
										borderRadius: 2,
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										justifyContent: 'center',
										textAlign: 'center',
										minHeight: '50vh',
										bgcolor: theme.palette.background.paper
									}}
								>
									<EventNoteIcon sx={{ fontSize: 60, color: theme.palette.action.disabled, mb: 2 }} />
									< Typography variant="h6" > No events found </Typography>
									< Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
										Try changing your search criteria or check back later
									</Typography>
									{
										user?.role === 'organiser' && (
											<Button
												variant="contained"
												startIcon={< AddIcon />}
												onClick={() => setEventModalOpen(true)}
											>
												Create New Event
											</Button>
										)}
								</Paper>
							) : viewMode === 'grid' ? (
								// Grid View
								<Grid container spacing={3} >
									{
										sortedEvents.map((event) => (
											<Grid item xs={12} sm={6} md={4} lg={3} key={event.id} >
												<Fade in={true} timeout={300} >
													<Card
														sx={{
															height: '100%',
															display: 'flex',
															flexDirection: 'column',
															borderRadius: 2,
															overflow: 'hidden',
															boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
															transition: 'transform 0.2s, box-shadow 0.2s',
															'&:hover': {
																transform: 'translateY(-4px)',
																boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
															}
														}}
													>
														<CardActionArea onClick={() => handleView(event)} sx={{ flexGrow: 1 }}>
															<CardMedia
																component="img"
																height="160"
																image={event.image || "/api/placeholder/400/320"}
																alt={event.title}
															/>
															<Box
																sx={
																	{
																		position: 'absolute',
																		top: 12,
																		right: 12,
																		display: 'flex',
																		gap: 1
																	}
																}
															>
																<Chip
																	label={new Date(event.startDate) > new Date() ? "Upcoming" : "Past"}
																	size="small"
																	sx={{
																		bgcolor: new Date(event.startDate) > new Date()
																			? "rgba(46, 125, 50, 0.9)"
																			: "rgba(97, 97, 97, 0.9)",
																		color: "#fff",
																		fontWeight: 500,
																		backdropFilter: 'blur(4px)',
																	}}
																/>
															</Box>
															< CardContent sx={{ flexGrow: 1, pb: 1 }}>
																<Typography gutterBottom variant="h6" component="div" noWrap >
																	{event.title}
																</Typography>

																< Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
																	<CalendarTodayIcon fontSize="small" color="action" />
																	<Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
																		{formatDate(event.startDate)}
																		{
																			event.startDate !== event.endDate &&
																			<Box component="span" sx={{ display: 'block' }
																			}>
																				to {formatDate(event.endDate)}
																			</Box>
																		}
																	</Typography>
																</Box>

																{
																	getDisplayTime(event) && (
																		<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
																			<AccessAlarmIcon fontSize="small" color="action" />
																			<Typography variant="body2" color="text.secondary" >
																				{getDisplayTime(event)}
																			</Typography>
																		</Box>
																	)
																}

																<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
																	<LocationOnIcon fontSize="small" color="action" />
																	<Typography variant="body2" color="text.secondary" noWrap >
																		{event.location}
																	</Typography>
																</Box>

																{
																	event.price && (
																		<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
																			<LocalOfferIcon fontSize="small" color="action" />
																			<Typography variant="body2" color="text.secondary" >
																				${event.price}
																			</Typography>
																		</Box>
																	)
																}
															</CardContent>
														</CardActionArea>

														< Divider />

														<CardActions sx={{ px: 2, py: 1, justifyContent: 'space-between' }}>
															<Button
																size="small"
																startIcon={< VisibilityIcon />}
																onClick={(e) => {
																	e.stopPropagation();
																	handleView(event);
																}}
															>
																View
															</Button>

															{
																user?.role === 'organiser' && (
																	<Box>
																		<IconButton
																			size="small"
																			color="primary"
																			onClick={(e) => {
																				e.stopPropagation();
																				handleEdit(event);
																			}
																			}
																		>
																			<EditIcon fontSize="small" />
																		</IconButton>
																		< IconButton
																			size="small"
																			color="error"
																			onClick={(e) => {
																				e.stopPropagation();
																				handleDelete(event);
																			}}
																		>
																			<DeleteIcon fontSize="small" />
																		</IconButton>
																	</Box>
																)}
														</CardActions>
													</Card>
												</Fade>
											</Grid>
										))}
								</Grid>
							) : (
								// List View
								<TableContainer
									component={Paper}
									sx={{
										borderRadius: 2,
										boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
										overflow: 'hidden'
									}}
								>
									<Table sx={{ minWidth: 650 }} aria-label="events table">
										<TableHead>
											<TableRow sx={
												{
													bgcolor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.05)'
												}
											}>
												<TableCell sx={{ fontWeight: 'bold', py: 2 }}> Event </TableCell>
												< TableCell sx={{ fontWeight: 'bold', py: 2 }}> Date & Time </TableCell>
												< TableCell sx={{ fontWeight: 'bold', py: 2 }}> Location </TableCell>
												< TableCell sx={{ fontWeight: 'bold', py: 2 }}> Status </TableCell>
												< TableCell sx={{ fontWeight: 'bold', py: 2, textAlign: 'right' }}> Actions </TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{
												sortedEvents.map((event) => (
													<TableRow
														key={event.id}
														hover
														sx={{
															'&:last-child td, &:last-child th': { border: 0 },
															transition: 'background-color 0.2s',
															cursor: 'pointer',
														}}
														onClick={() => handleView(event)}
													>
														<TableCell component="th" scope="row" sx={{ py: 2 }}>
															<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
																{
																	event.image ? (
																		<Avatar
																			src={event.image}
																			alt={event.title}
																			variant="rounded"
																			sx={{ width: 56, height: 56 }}
																		/>
																	) : (
																		<Avatar
																			variant="rounded"
																			sx={{
																				width: 56,
																				height: 56,
																				bgcolor: theme.palette.primary.light
																			}}
																		>
																			<EventNoteIcon />
																		</Avatar>
																	)}
																<Box>
																	<Typography fontWeight="medium" > {event.title} </Typography>
																	{
																		event.price ? (
																			<Typography variant="body2" color="text.secondary" >
																				${event.price}
																			</Typography>
																		) : (
																			<Typography variant="body2" color="success.main" >
																				Free
																			</Typography>
																		)
																	}
																</Box>
															</Box>
														</TableCell>
														< TableCell sx={{ py: 2 }}>
															<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
																<CalendarTodayIcon fontSize="small" color="action" />
																<Box>
																	<Typography variant="body2" >
																		{formatDate(event.startDate)}
																		{
																			event.startDate !== event.endDate &&
																			<Box component="span" sx={{ display: 'block' }
																			}>
																				to {formatDate(event.endDate)}
																			</Box>
																		}
																	</Typography>
																	{
																		getDisplayTime(event) && (
																			<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
																				<AccessAlarmIcon fontSize="small" color="action" />
																				<Typography variant="body2" color="text.secondary" >
																					{getDisplayTime(event)}
																				</Typography>
																			</Box>
																		)
																	}
																</Box>
															</Box>
														</TableCell>
														< TableCell sx={{ py: 2 }}>
															<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
																<LocationOnIcon fontSize="small" color="action" />
																<Typography variant="body2" > {event.location} </Typography>
															</Box>
														</TableCell>
														< TableCell sx={{ py: 2 }}>
															<Chip
																label={new Date(event.startDate) > new Date() ? "Upcoming" : "Past"}
																size="small"
																sx={{
																	bgcolor: new Date(event.startDate) > new Date()
																		? "rgba(46, 125, 50, 0.1)"
																		: "rgba(97, 97, 97, 0.1)",
																	color: new Date(event.startDate) > new Date()
																		? "#2e7d32"
																		: "#616161",
																	fontWeight: 500,
																}}
															/>
														</TableCell>
														< TableCell align="right" sx={{ py: 2 }}>
															<Box
																sx={
																	{
																		display: 'flex',
																		gap: 1,
																		justifyContent: 'flex-end',
																		onClick: (e) => {
																			if (e && typeof e.stopPropagation === 'function') {
																				e.stopPropagation();
																			}
																		}
																	}
																}
															>
																<Tooltip title="View Details" >
																	<IconButton
																		size="small"
																		onClick={() => handleView(event)}
																		sx={{
																			bgcolor: theme.palette.action.hover,
																			'&:hover': { bgcolor: theme.palette.action.selected }
																		}}
																	>
																		<VisibilityIcon fontSize="small" />
																	</IconButton>
																</Tooltip>

																{
																	user?.role === 'organiser' && (
																		<>
																			<Tooltip title="Edit Event" >
																				<IconButton
																					size="small"
																					onClick={() => handleEdit(event)
																					}
																					color="primary"
																					sx={{
																						bgcolor: theme.palette.primary.lighter,
																						'&:hover': { bgcolor: theme.palette.primary.light }
																					}}
																				>
																					<EditIcon fontSize="small" />
																				</IconButton>
																			</Tooltip>
																			<Tooltip title="Delete Event">
																				<IconButton
																					size="small"
																					onClick={() => handleDelete(event)}
																					color="error"
																					sx={{
																						bgcolor: theme.palette.error.lighter,
																						'&:hover': { bgcolor: theme.palette.error.light }
																					}}
																				>
																					<DeleteIcon fontSize="small" />
																				</IconButton>
																			</Tooltip>
																		</>
																	)}
															</Box>
														</TableCell>
													</TableRow>
												))}
										</TableBody>
									</Table>
								</TableContainer>
							)}
					</Container>

					{/* Add Event Fab Button (for organiser) */}
					{user?.role === 'organiser' && (
						<Fab
							color="primary"
							aria-label="add event"
							sx={{
								position: 'fixed',
								bottom: 24,
								right: 24,
								boxShadow: '0 8px 16px rgba(25, 118, 210, 0.3)',
							}}
							onClick={() => {
								setCurrentEvent({
									title: "",
									description: "",
									startDate: null,
									endDate: null,
									time: "",
									location: "",
									price: "",
									banner: null,
									image: null,
								});
								setEventModalOpen(true);
							}}
						>
							<AddIcon />
						</Fab>
					)}
				</Box>
			</Box>

			{/* Filters Drawer (mobile) */}
			<Drawer
				anchor="right"
				open={filterDrawerOpen}
				onClose={() => setFilterDrawerOpen(false)}
				sx={{
					'& .MuiDrawer-paper': {
						width: '80%',
						maxWidth: 360,
						p: 2,
						boxSizing: 'border-box'
					}
				}}
			>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
					<Typography variant="h6">Filters & Sort</Typography>
					<IconButton onClick={() => setFilterDrawerOpen(false)}>
						<CloseIcon />
					</IconButton>
				</Box>

				<Typography variant="subtitle2" gutterBottom>Sort By</Typography>
				<FormControl fullWidth sx={{ mb: 3 }}>
					<Select
						value={sortBy}
						onChange={handleSortChange}
						displayEmpty
						size="small"
					>
						<MenuItem value="date">Date (Ascending)</MenuItem>
						<MenuItem value="dateDesc">Date (Descending)</MenuItem>
						<MenuItem value="title">Title (A-Z)</MenuItem>
						<MenuItem value="titleDesc">Title (Z-A)</MenuItem>
					</Select>
				</FormControl>

				<Typography variant="subtitle2" gutterBottom>Date</Typography>
				<TextField
					type="date"
					fullWidth
					size="small"
					value={selectedDate}
					onChange={handleDateChange}
					sx={{ mb: 3 }}
				/>

				<Typography variant="subtitle2" gutterBottom>View Mode</Typography>
				<FormControl component="fieldset" sx={{ mb: 3 }}>
					<Box sx={{ display: 'flex', gap: 2 }}>
						<Button
							variant={viewMode === 'grid' ? 'contained' : 'outlined'}
							startIcon={<GridViewIcon />}
							onClick={() => handleViewModeChange('grid')}
							size="small"
						>
							Grid
						</Button>
						<Button
							variant={viewMode === 'list' ? 'contained' : 'outlined'}
							startIcon={<ViewListIcon />}
							onClick={() => handleViewModeChange('list')}
							size="small"
						>
							List
						</Button>
					</Box>
				</FormControl>

				<Box sx={{ mt: 'auto', pt: 2 }}>
					<Button
						variant="outlined"
						fullWidth
						startIcon={<CloseIcon />}
						onClick={() => {
							setSearchTerm("");
							setSelectedDate("");
							setSortBy("date");
							setFilterDrawerOpen(false);
						}}
					>
						Clear Filters
					</Button>
				</Box>
			</Drawer>

			{/* Event View Modal */}
			<Dialog
				open={viewModalOpen}
				onClose={() => setViewModalOpen(false)}
				maxWidth="md"
				fullWidth
				PaperProps={{
					sx: {
						borderRadius: 2,
						boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
					}
				}}
			>
				{selectedEvent && (
					<>
						<DialogContent sx={{ p: 0 }}>
							<Box sx={{ position: 'relative' }}>
								<CardMedia
									component="img"
									height={300}
									image={selectedEvent.image || "/api/placeholder/800/300"}
									alt={selectedEvent.title}
								/>
								<IconButton
									sx={{
										position: 'absolute',
										top: 16,
										left: 16,
										bgcolor: 'rgba(0, 0, 0, 0.5)',
										color: 'white',
										'&:hover': {
											bgcolor: 'rgba(0, 0, 0, 0.7)',
										}
									}}
									onClick={() => setViewModalOpen(false)}
								>
									<ArrowBackIcon />
								</IconButton>

								<Box
									sx={{
										position: 'absolute',
										top: 16,
										right: 16,
										display: 'flex',
										gap: 1
									}}
								>
									<Chip
										label={new Date(selectedEvent.startDate) > new Date() ? "Upcoming" : "Past"}
										size="small"
										sx={{
											bgcolor: new Date(selectedEvent.startDate) > new Date()
												? "rgba(46, 125, 50, 0.9)"
												: "rgba(97, 97, 97, 0.9)",
											color: "#fff",
											fontWeight: 500,
											backdropFilter: 'blur(4px)',
										}}
									/>
								</Box>
							</Box>

							<Box sx={{ p: 3 }}>
								<Typography variant="h4" component="h2" gutterBottom>
									{selectedEvent.title}
								</Typography>

								<Grid container spacing={3} sx={{ mb: 3 }}>
									<Grid item xs={12} sm={6}>
										<Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
											<CalendarTodayIcon color="primary" />
											<Box>
												<Typography variant="body2" color="text.secondary">Date</Typography>
												<Typography>
													{formatDate(selectedEvent.startDate)}
													{selectedEvent.startDate !== selectedEvent.endDate &&
														<Box component="span" sx={{ display: 'block' }}>
															to {formatDate(selectedEvent.endDate)}
														</Box>
													}
												</Typography>
											</Box>
										</Box>

										{getDisplayTime(selectedEvent) && (
											<Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
												<AccessAlarmIcon color="primary" />
												<Box>
													<Typography variant="body2" color="text.secondary">Time</Typography>
													<Typography>{getDisplayTime(selectedEvent)}</Typography>
												</Box>
											</Box>
										)}
									</Grid>

									<Grid item xs={12} sm={6}>
										<Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
											<LocationOnIcon color="primary" />
											<Box>
												<Typography variant="body2" color="text.secondary">Location</Typography>
												<Typography>{selectedEvent.location}</Typography>
											</Box>
										</Box>

										{selectedEvent.price && (
											<Box sx={{ display: 'flex', gap: 2 }}>
												<LocalOfferIcon color="primary" />
												<Box>
													<Typography variant="body2" color="text.secondary">Price</Typography>
													<Typography>${selectedEvent.price}</Typography>
												</Box>
											</Box>
										)}
									</Grid>
								</Grid>

								<Typography variant="h6" gutterBottom>Description</Typography>
								<Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 3 }}>
									{selectedEvent.description || "No description provided."}
								</Typography>
							</Box>
						</DialogContent>
						<DialogActions sx={{ px: 3, pb: 3 }}>
							<Button
								onClick={() => setViewModalOpen(false)}
								variant="outlined"
							>
								Close
							</Button>

							{user?.role === 'organiser' && (
								<>
									<Button
										startIcon={<EditIcon />}
										variant="outlined"
										color="primary"
										onClick={() => {
											setViewModalOpen(false);
											handleEdit(selectedEvent);
										}}
									>
										Edit
									</Button>
									<Button
										startIcon={<DeleteIcon />}
										variant="contained"
										color="error"
										onClick={() => {
											setViewModalOpen(false);
											handleDelete(selectedEvent);
										}}
									>
										Delete
									</Button>
								</>
							)}

							{user?.role === 'attendee' && (
								<>
									<Button
										startIcon={<ShareIcon />}
										variant="outlined"
										color="primary"
										onClick={() => {
											// Share functionality
											navigator.clipboard.writeText(window.location.origin + "/events/" + selectedEvent.id);
											// Show snackbar or notification
										}}
									>
										Share
									</Button>
									<Button
										startIcon={<DownloadIcon />}
										variant="contained"
										color="primary"
										onClick={() => {
											// Download ticket functionality
											// Implementation would depend on your backend
										}}
									>
										Download Ticket
									</Button>
								</>
							)}
						</DialogActions>
					</>
				)}
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<Dialog
				open={deleteModalOpen}
				onClose={() => setDeleteModalOpen(false)}
				aria-labelledby="delete-dialog-title"
				aria-describedby="delete-dialog-description"
				PaperProps={{
					sx: {
						borderRadius: 2,
					}
				}}
			>
				<DialogTitle id="delete-dialog-title">
					{"Delete Event"}
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="delete-dialog-description">
						Are you sure you want to delete "{selectedEvent?.title}"? This action cannot be undone.
					</DialogContentText>
				</DialogContent>
				<DialogActions sx={{ p: 2 }}>
					<Button onClick={() => setDeleteModalOpen(false)} color="primary">
						Cancel
					</Button>
					<Button onClick={handleDeleteConfirm} color="error" variant="contained" autoFocus>
						Delete
					</Button>
				</DialogActions>
			</Dialog>

			{/* Event Create/Edit Modal */}
			<EventModal
				open={eventModalOpen}
				onClose={() => setEventModalOpen(false)}
				onSave={handleSaveEvent}
				event={currentEvent}
				onChange={handleEventChange}
				isEdit={!!currentEvent.id}
			/>
		</Box >
	);
};

export default MyBookingsTickets;






































// import { useEffect, useState } from "react";
// import eventService from "../../services/eventService";
// import useAuth from "../../hooks/useAuth";
// import CircularProgress from "@mui/material/CircularProgress";
// import Alert from "@mui/material/Alert";
// import {
// 	Box,
// 	Typography,
// 	Button,
// 	Chip,
// 	Table,
// 	TableBody,
// 	TableCell,
// 	TableContainer,
// 	TableHead,
// 	TableRow,
// 	Paper,
// 	Dialog,
// 	DialogTitle,
// 	DialogContent,
// 	DialogActions,
// 	DialogContentText,
// 	Fab,
// 	TextField,
// 	FormControl,
// 	Select,
// 	MenuItem,
// 	InputAdornment,
// 	IconButton,
// } from "@mui/material";

// import SearchIcon from '@mui/icons-material/Search';
// import CloseIcon from '@mui/icons-material/Close';
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
// import LocalOfferIcon from '@mui/icons-material/LocalOffer';
// import Divider from '@mui/material/Divider';

// import {
// 	Visibility as VisibilityIcon,
// 	Edit as EditIcon,
// 	Delete as DeleteIcon,
// 	Add as AddIcon,
// } from "@mui/icons-material";
// import Header from "./Header";
// import Sidebar from "./Sidebar";
// import EventModal from "./EventModal";

// const formatDate = (dateString) => {
// 	if (!dateString) return '';
// 	const date = new Date(dateString);
// 	return date.toLocaleDateString('en-US', {
// 		year: 'numeric',
// 		month: 'short',
// 		day: 'numeric'
// 	});
// };

// const formatTime = (timeString) => {
// 	if (!timeString) return null;
// 	if (typeof timeString === 'string' && timeString.includes(' ')) {
// 		const timePart = timeString.split(' ')[1];
// 		return timePart.substring(0, 5);
// 	}
// 	if (typeof timeString === 'string' && timeString.includes(':')) {
// 		return timeString.substring(0, 5);
// 	}
// 	return null;
// };

// const MyBookingsTickets = () => {
// 	const { user } = useAuth();
// 	const [sidebarOpen, setSidebarOpen] = useState(true);
// 	const [status, setStatus] = useState("All Status");
// 	const [selectedDate, setSelectedDate] = useState("");
// 	const [events, setEvents] = useState([]);
// 	const [loading, setLoading] = useState(true);
// 	const [error, setError] = useState(null);
// 	const [searchTerm, setSearchTerm] = useState("");

// 	// Modal states
// 	const [viewModalOpen, setViewModalOpen] = useState(false);
// 	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
// 	const [selectedEvent, setSelectedEvent] = useState(null);

// 	// EventModal states
// 	const [eventModalOpen, setEventModalOpen] = useState(false);
// 	const [currentEvent, setCurrentEvent] = useState({
// 		title: "",
// 		description: "",
// 		startDate: null,
// 		endDate: null,
// 		time: "",
// 		location: "",
// 		price: "",
// 		banner: null,
// 		image: null,
// 	});

// 	useEffect(() => {
// 		const fetchEvents = async () => {
// 			try {
// 				const events = user?.role === 'organiser'
// 					? await eventService.getEventsByOrganiser(user.email)
// 					: await eventService.getRegisteredEvents();
// 				setEvents(events);
// 				setError(null);
// 			} catch (err) {
// 				setError("Failed to load events");
// 				console.error("Error fetching events:", err);
// 			} finally {
// 				setLoading(false);
// 			}
// 		};

// 		fetchEvents();
// 	}, [user]);

// 	const toggleSidebar = () => {
// 		setSidebarOpen(!sidebarOpen);
// 	};

// 	const handleStatusChange = (event) => {
// 		setStatus(event.target.value);
// 	};

// 	const handleDateChange = (event) => {
// 		setSelectedDate(event.target.value);
// 	};

// 	const handleView = (event) => {
// 		setSelectedEvent(event);
// 		setViewModalOpen(true);
// 	};

// 	const handleDelete = (event) => {
// 		setSelectedEvent(event);
// 		setDeleteModalOpen(true);
// 	};

// 	const handleDeleteConfirm = async () => {
// 		try {
// 			await eventService.deleteEvent(selectedEvent.id);
// 			setEvents(events.filter(event => event.id !== selectedEvent.id));
// 			setDeleteModalOpen(false);
// 		} catch (error) {
// 			console.error("Error deleting event:", error);
// 			setError("Failed to delete event");
// 		}
// 	};

// 	const handleEventChange = (field, value) => {
// 		setCurrentEvent(prev => ({
// 			...prev,
// 			[field]: value
// 		}));
// 	};

// 	const handleSaveEvent = async (formData, onUploadProgress) => {
// 		try {
// 			let savedEvent;
// 			if (currentEvent.id) {
// 				savedEvent = await eventService.updateEvent(currentEvent.id, formData);
// 				setEvents(events.map(event =>
// 					event.id === currentEvent.id ? savedEvent : event
// 				));
// 			} else {
// 				savedEvent = await eventService.createEvent(formData);
// 				setEvents([...events, savedEvent]);
// 			}
// 			setEventModalOpen(false);
// 			setCurrentEvent({
// 				title: "",
// 				description: "",
// 				startDate: null,
// 				endDate: null,
// 				time: "",
// 				location: "",
// 				price: "",
// 				banner: null,
// 				image: null,
// 			});
// 		} catch (error) {
// 			console.error("Error saving event:", error);
// 			setError(error.message || "Failed to save event");
// 			throw error;
// 		}
// 	};

// 	const handleEdit = (event) => {
// 		setCurrentEvent({
// 			id: event.id,
// 			title: event.title,
// 			description: event.description,
// 			startDate: new Date(event.startDate),
// 			endDate: new Date(event.endDate),
// 			time: event.time || "",
// 			location: event.location,
// 			price: event.price || "",
// 			image: event.image || null
// 		});
// 		setEventModalOpen(true);
// 	};

// 	const filteredEvents = events.filter((event) => {
// 		const matchesSearch =
// 			event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
// 			event.description.toLowerCase().includes(searchTerm.toLowerCase());

// 		const matchesDate = !selectedDate ||
// 			new Date(event.startDate).toISOString().split('T')[0] === selectedDate;

// 		const matchesStatus =
// 			status === "All Status" ||
// 			(status === "Upcoming" && new Date(event.startDate) > new Date()) ||
// 			(status === "Past" && new Date(event.startDate) <= new Date());

// 		return matchesSearch && matchesStatus && matchesDate;
// 	});

// 	const getDisplayTime = (event) => {
// 		if (event.time) return formatTime(event.time);
// 		if (event.endDate) return formatTime(event.endDate);
// 		return null;
// 	};

// 	return (
// 		<Box sx={{
// 			display: "flex",
// 			flexDirection: "column",
// 			height: "100vh",
// 			width: "100vw",
// 			overflow: "hidden",
// 			position: "fixed",
// 			top: 0,
// 			left: 0,
// 			bgcolor: "#f9fafb",
// 		}}>
// 			<Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

// 			<Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
// 				<Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

// 				<Box component="main" sx={{ flexGrow: 1, p: 3, overflow: "auto" }}>
// 					<Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 3 }}>
// 						{user?.role === 'organiser' ? 'My Events' : 'My Bookings'}
// 					</Typography>

// 					{/* Search and Filter */}
// 					<Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
// 						<TextField
// 							placeholder="Search events..."
// 							variant="outlined"
// 							value={searchTerm}
// 							onChange={(e) => setSearchTerm(e.target.value)}
// 							sx={{ flexGrow: 1 }}
// 							InputProps={{
// 								startAdornment: (
// 									<InputAdornment position="start">
// 										<SearchIcon sx={{ color: "text.secondary" }} />
// 									</InputAdornment>
// 								),
// 							}}
// 						/>
// 						<FormControl sx={{ minWidth: 150 }}>
// 							<Select
// 								value={status}
// 								onChange={handleStatusChange}
// 								displayEmpty
// 							>
// 								<MenuItem value="All Status">All Status</MenuItem>
// 								<MenuItem value="Upcoming">Upcoming</MenuItem>
// 								<MenuItem value="Past">Past</MenuItem>
// 							</Select>
// 						</FormControl>
// 						<TextField
// 							type="date"
// 							value={selectedDate}
// 							onChange={handleDateChange}
// 							sx={{ width: 160 }}
// 						/>
// 					</Box>

// 					{loading ? (
// 						<Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
// 							<CircularProgress />
// 						</Box>
// 					) : error ? (
// 						<Alert severity="error" sx={{ mb: 3 }}>
// 							{error}
// 						</Alert>
// 					) : filteredEvents.length === 0 ? (
// 						<Typography variant="body1" sx={{ p: 3 }}>
// 							No events found matching your criteria
// 						</Typography>
// 					) : (
// 						<TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)' }}>
// 							<Table sx={{ minWidth: 650 }} aria-label="events table">
// 								<TableHead>
// 									<TableRow sx={{ bgcolor: '#f5f5f5' }}>
// 										<TableCell sx={{ fontWeight: 'bold' }}>Event</TableCell>
// 										<TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
// 										<TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
// 										<TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
// 										<TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Actions</TableCell>
// 									</TableRow>
// 								</TableHead>
// 								<TableBody>
// 									{filteredEvents.map((event) => (
// 										<TableRow key={event.id}>
// 											<TableCell component="th" scope="row">
// 												<Typography fontWeight="medium">{event.title}</Typography>
// 											</TableCell>
// 											<TableCell>
// 												<Typography>
// 													{formatDate(event.startDate)}
// 													{event.startDate !== event.endDate && ` - ${formatDate(event.endDate)}`}
// 												</Typography>
// 												{getDisplayTime(event) && (
// 													<Typography color="text.secondary">
// 														{getDisplayTime(event)}
// 													</Typography>
// 												)}
// 											</TableCell>
// 											<TableCell>{event.location}</TableCell>
// 											<TableCell>
// 												<Chip
// 													label={new Date(event.startDate) > new Date() ? "Upcoming" : "Past"}
// 													size="small"
// 													sx={{
// 														bgcolor: new Date(event.startDate) > new Date()
// 															? "rgba(46, 125, 50, 0.1)"
// 															: "rgba(158, 158, 158, 0.1)",
// 														color: new Date(event.startDate) > new Date()
// 															? "#2e7d32"
// 															: "#9e9e9e",
// 													}}
// 												/>
// 											</TableCell>
// 											<TableCell align="right">
// 												<Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
// 													<Button
// 														onClick={() => handleView(event)}
// 														startIcon={<VisibilityIcon />}
// 														variant="outlined"
// 														size="small"
// 													>
// 														View
// 													</Button>
// 													{user?.role === 'organiser' && (
// 														<>
// 															<Button
// 																onClick={() => handleEdit(event)}
// 																startIcon={<EditIcon />}
// 																variant="outlined"
// 																size="small"
// 																color="secondary"
// 															>
// 																Edit
// 															</Button>
// 															<Button
// 																onClick={() => handleDelete(event)}
// 																startIcon={<DeleteIcon />}
// 																variant="outlined"
// 																size="small"
// 																color="error"
// 															>
// 																Delete
// 															</Button>
// 														</>
// 													)}
// 												</Box>
// 											</TableCell>
// 										</TableRow>
// 									))}
// 								</TableBody>
// 							</Table>
// 						</TableContainer>
// 					)}
// 				</Box>
// 			</Box>

// 			{user?.role === 'organiser' && (
// 				<Fab
// 					color="primary"
// 					aria-label="add"
// 					sx={{ position: 'fixed', bottom: 32, right: 32 }}
// 					onClick={() => setEventModalOpen(true)}
// 				>
// 					<AddIcon />
// 				</Fab>
// 			)}

// 			{/* View Modal */}
// 			<Dialog
// 				open={viewModalOpen}
// 				onClose={() => setViewModalOpen(false)}
// 				maxWidth="md"
// 				fullWidth
// 			>
// 				{selectedEvent && (
// 					<>
// 						<DialogTitle>
// 							<Box display="flex" justifyContent="space-between" alignItems="center">
// 								{selectedEvent.title}
// 								<IconButton onClick={() => setViewModalOpen(false)}>
// 									<CloseIcon />
// 								</IconButton>
// 							</Box>
// 						</DialogTitle>
// 						<DialogContent>
// 							{selectedEvent.image && (
// 								<Box sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
// 									<img
// 										src={selectedEvent.image}
// 										alt={selectedEvent.title}
// 										style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
// 									/>
// 								</Box>
// 							)}
// 							<Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
// 								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
// 									<CalendarTodayIcon sx={{ color: 'primary.main' }} />
// 									<Typography>
// 										{formatDate(selectedEvent.startDate)}
// 										{selectedEvent.startDate !== selectedEvent.endDate && ` - ${formatDate(selectedEvent.endDate)}`}
// 									</Typography>
// 								</Box>
// 								{getDisplayTime(selectedEvent) && (
// 									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
// 										<AccessAlarmIcon sx={{ color: 'primary.main' }} />
// 										<Typography>{getDisplayTime(selectedEvent)}</Typography>
// 									</Box>
// 								)}
// 								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
// 									<LocationOnIcon sx={{ color: 'primary.main' }} />
// 									<Typography>{selectedEvent.location}</Typography>
// 								</Box>
// 								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
// 									<LocalOfferIcon sx={{ color: 'primary.main' }} />
// 									<Typography>{selectedEvent.price ? `$${selectedEvent.price}` : "Free"}</Typography>
// 								</Box>
// 							</Box>
// 							<Divider sx={{ mb: 3 }} />
// 							<Typography>{selectedEvent.description}</Typography>
// 						</DialogContent>
// 						<DialogActions>
// 							<Button onClick={() => setViewModalOpen(false)}>Close</Button>
// 						</DialogActions>
// 					</>
// 				)}
// 			</Dialog>

// 			{/* Delete Confirmation Modal */}
// 			<Dialog
// 				open={deleteModalOpen}
// 				onClose={() => setDeleteModalOpen(false)}
// 				maxWidth="sm"
// 			>
// 				<DialogTitle>
// 					<Box display="flex" justifyContent="space-between" alignItems="center">
// 						Confirm Deletion
// 						<IconButton onClick={() => setDeleteModalOpen(false)}>
// 							<CloseIcon />
// 						</IconButton>
// 					</Box>
// 				</DialogTitle>
// 				<DialogContent>
// 					<DialogContentText>
// 						Are you sure you want to delete the event "{selectedEvent?.title}"? This action cannot be undone.
// 					</DialogContentText>
// 				</DialogContent>
// 				<DialogActions>
// 					<Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
// 					<Button
// 						onClick={handleDeleteConfirm}
// 						variant="contained"
// 						color="error"
// 					>
// 						Delete
// 					</Button>
// 				</DialogActions>
// 			</Dialog>

// 			<EventModal
// 				open={eventModalOpen}
// 				onClose={() => setEventModalOpen(false)}
// 				onSave={handleSaveEvent}
// 				event={currentEvent}
// 				onChange={handleEventChange}
// 				isEdit={!!currentEvent.id}
// 			/>
// 		</Box>
// 	);
// };

// export default MyBookingsTickets;