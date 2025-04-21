import React, { useState, useEffect, useCallback } from 'react';
import {
	Box,
	Typography,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Button,
	Paper,
	TableContainer,
	TextField,
	InputAdornment,
	IconButton,
	Chip,
	CircularProgress,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Snackbar,
	Alert,
	Tooltip,
	Card,
	CardMedia,
	CardContent,
	CardActions,
	Grid,
	Pagination,
	Avatar,
	Divider,
	List,
	ListItem,
	ListItemText,
	ListItemAvatar,
	LinearProgress,
	styled,
	FormControl,
	Select,
	MenuItem,
	InputLabel
} from '@mui/material';
import {
	Search as SearchIcon,
	Edit as EditIcon,
	Delete as DeleteIcon,
	Add as AddIcon,
	Refresh as RefreshIcon,
	CalendarToday as CalendarIcon,
	LocationOn as LocationIcon,
	AttachMoney as PriceIcon,
	Visibility as VisibilityIcon,
	Close as CloseIcon,
	CloudUpload as UploadIcon,
	Image as ImageIcon
} from '@mui/icons-material';
import axios from 'axios';
import dayjs from 'dayjs';
import { CssBaseline } from '@mui/material';
import Sidebar from './Sidebar';
import AdminHeader from './Header';
import { deleteEvent } from '../../services/eventService';

// Styled component for drop zone
const DropZone = styled('div')(({ theme, isdragactive }) => ({
	border: `2px dashed ${isdragactive ? theme.palette.primary.main : theme.palette.divider}`,
	borderRadius: theme.shape.borderRadius,
	padding: theme.spacing(3),
	textAlign: 'center',
	backgroundColor: isdragactive ? theme.palette.action.hover : theme.palette.background.paper,
	cursor: 'pointer',
	transition: 'all 0.3s ease',
	marginBottom: theme.spacing(2),
}));

const EventList = () => {
	// State for events data and UI
	const [events, setEvents] = useState([]);
	const [filteredEvents, setFilteredEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [refreshing, setRefreshing] = useState(false);
	const [view, setView] = useState('grid'); // 'grid' or 'table'
	const [page, setPage] = useState(1);
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const eventsPerPage = 6;

	// Modal states
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [eventToDelete, setEventToDelete] = useState(null);
	const [viewDialogOpen, setViewDialogOpen] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [addDialogOpen, setAddDialogOpen] = useState(false);
	const [currentEvent, setCurrentEvent] = useState({
		title: '',
		description: '',
		startDate: '',
		endDate: '',
		time: '',
		location: '',
		price: 0,
		image: null
	});

	// Image upload states
	const [isDragActive, setIsDragActive] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [previewImage, setPreviewImage] = useState(null);
	const [selectedFile, setSelectedFile] = useState(null);
	const [uploading, setUploading] = useState(false);

	// Snackbar state
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: '',
		severity: 'success'
	});

	// Fetch events from API
	const fetchEvents = async () => {
		try {
			setLoading(true);
			const token = localStorage.getItem('token');
			const response = await axios.get('http://localhost:3000/api/events', {
				headers: { Authorization: `Bearer ${token}` }
			});

			// Handle different response formats
			let eventsData = [];
			if (Array.isArray(response.data)) {
				eventsData = response.data;
			} else if (response.data?.events && Array.isArray(response.data.events)) {
				eventsData = response.data.events;
			} else if (response.data?.data && Array.isArray(response.data.data)) {
				eventsData = response.data.data;
			}

			setEvents(eventsData);
			setFilteredEvents(eventsData);
			setError(null);
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to fetch events');
			setSnackbar({
				open: true,
				message: err.response?.data?.message || 'Failed to fetch events',
				severity: 'error'
			});
			setEvents([]);
			setFilteredEvents([]);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	useEffect(() => {
		fetchEvents();
	}, []);

	// Handle refresh
	const handleRefresh = () => {
		setRefreshing(true);
		fetchEvents();
	};

	// Filter events based on search term
	useEffect(() => {
		const filtered = events.filter(event => {
			const term = searchTerm.toLowerCase();
			return (
				event.title.toLowerCase().includes(term) ||
				event.description.toLowerCase().includes(term) ||
				event.location.toLowerCase().includes(term)
			);
		});
		setFilteredEvents(filtered);
		setPage(1);
	}, [searchTerm, events]);

	// Delete event handlers
	const handleDeleteClick = (event) => {
		setEventToDelete(event);
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		try {
			const result = await deleteEvent(eventToDelete.id);

			// Optimistic UI update
			setEvents(prev => prev.filter(event => event.id !== eventToDelete.id));
			setFilteredEvents(prev => prev.filter(event => event.id !== eventToDelete.id));

			setSnackbar({
				open: true,
				message: result.message || 'Event deleted successfully',
				severity: 'success'
			});
		} catch (err) {
			setSnackbar({
				open: true,
				message: err.message || 'Failed to delete event',
				severity: 'error'
			});
			// Refresh the list to ensure consistency
			fetchEvents();
		} finally {
			setDeleteDialogOpen(false);
			setEventToDelete(null);
		}
	};

	// View event handler
	const handleViewClick = (event) => {
		setSelectedEvent(event);
		setViewDialogOpen(true);
	};

	// Edit event handlers
	const handleEditClick = (event) => {
		setCurrentEvent({
			...event,
			startDate: dayjs(event.startDate).format('YYYY-MM-DD'),
			endDate: dayjs(event.endDate).format('YYYY-MM-DD')
		});
		setPreviewImage(event.image || null);
		setEditDialogOpen(true);
	};

	const handleEditSave = async () => {
		try {
			setUploading(true);
			const token = localStorage.getItem('token');
			const formData = new FormData();

			formData.append('title', currentEvent.title);
			formData.append('description', currentEvent.description);
			formData.append('startDate', currentEvent.startDate);
			formData.append('endDate', currentEvent.endDate);
			formData.append('time', currentEvent.time);
			formData.append('location', currentEvent.location);
			formData.append('price', currentEvent.price);

			if (selectedFile) {
				formData.append('banner', selectedFile);
			}

			await axios.put(
				`http://localhost:3000/api/events/${currentEvent.id}`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'multipart/form-data'
					},
					onUploadProgress: (progressEvent) => {
						const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
						setUploadProgress(progress);
					}
				}
			);

			await fetchEvents();
			setSnackbar({
				open: true,
				message: 'Event updated successfully',
				severity: 'success'
			});
			setEditDialogOpen(false);
			setSelectedFile(null);
			setPreviewImage(null);
		} catch (err) {
			setSnackbar({
				open: true,
				message: err.response?.data?.message || 'Failed to update event',
				severity: 'error'
			});
		} finally {
			setUploadProgress(0);
			setUploading(false);
		}
	};

	// Add event handlers
	const handleAddClick = () => {
		setCurrentEvent({
			title: '',
			description: '',
			startDate: '',
			endDate: '',
			time: '',
			location: '',
			price: 0,
			image: null
		});
		setPreviewImage(null);
		setSelectedFile(null);
		setAddDialogOpen(true);
	};

	const handleAddSave = async () => {
		try {
			setUploading(true);
			const token = localStorage.getItem('token');
			const formData = new FormData();

			formData.append('title', currentEvent.title);
			formData.append('description', currentEvent.description);
			formData.append('startDate', currentEvent.startDate);
			formData.append('endDate', currentEvent.endDate);
			formData.append('time', currentEvent.time);
			formData.append('location', currentEvent.location);
			formData.append('price', currentEvent.price);

			if (selectedFile) {
				formData.append('banner', selectedFile);
			}

			await axios.post(
				'http://localhost:3000/api/events',
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'multipart/form-data'
					},
					onUploadProgress: (progressEvent) => {
						const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
						setUploadProgress(progress);
					}
				}
			);

			await fetchEvents();
			setSnackbar({
				open: true,
				message: 'Event created successfully',
				severity: 'success'
			});
			setAddDialogOpen(false);
			setSelectedFile(null);
			setPreviewImage(null);
		} catch (err) {
			setSnackbar({
				open: true,
				message: err.response?.data?.message || 'Failed to create event',
				severity: 'error'
			});
		} finally {
			setUploadProgress(0);
			setUploading(false);
		}
	};

	// Common handlers
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setCurrentEvent(prev => ({
			...prev,
			[name]: value
		}));
	};

	// File upload handlers
	const handleDrop = useCallback((e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragActive(false);

		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			const file = e.dataTransfer.files[0];
			handleFileUpload(file);
		}
	}, []);

	const handleDrag = useCallback((e) => {
		e.preventDefault();
		e.stopPropagation();

		if (e.type === 'dragenter' || e.type === 'dragover') {
			setIsDragActive(true);
		} else if (e.type === 'dragleave') {
			setIsDragActive(false);
		}
	}, []);

	const handleFileSelect = (e) => {
		if (e.target.files && e.target.files[0]) {
			handleFileUpload(e.target.files[0]);
		}
	};

	const handleFileUpload = (file) => {
		// Check file type
		if (!file.type.startsWith('image/')) {
			setSnackbar({
				open: true,
				message: 'Only image files are allowed',
				severity: 'error'
			});
			return;
		}

		// Check file size (5MB limit)
		if (file.size > 5 * 1024 * 1024) {
			setSnackbar({
				open: true,
				message: 'File size exceeds 5MB limit',
				severity: 'error'
			});
			return;
		}

		setSelectedFile(file);

		// Create preview
		const reader = new FileReader();
		reader.onload = (e) => {
			setPreviewImage(e.target.result);
		};
		reader.readAsDataURL(file);
	};

	const handleRemoveImage = () => {
		setPreviewImage(null);
		setSelectedFile(null);
	};

	const handleSnackbarClose = () => {
		setSnackbar({ ...snackbar, open: false });
	};

	const handlePageChange = (event, value) => {
		setPage(value);
	};

	// Helper functions
	const getStatusColor = (startDate, endDate) => {
		const now = dayjs();
		const start = dayjs(startDate);
		const end = dayjs(endDate);

		if (now.isBefore(start)) return 'primary';
		if (now.isAfter(start) && now.isBefore(end)) return 'secondary';
		return 'default';
	};

	const getStatusText = (startDate, endDate) => {
		const now = dayjs();
		const start = dayjs(startDate);
		const end = dayjs(endDate);

		if (now.isBefore(start)) return 'Upcoming';
		if (now.isAfter(start) && now.isBefore(end)) return 'Ongoing';
		return 'Past';
	};

	// Pagination logic
	const count = Math.ceil(filteredEvents.length / eventsPerPage);
	const paginatedEvents = filteredEvents.slice(
		(page - 1) * eventsPerPage,
		page * eventsPerPage
	);

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	// Image upload section component
	const renderImageUploadSection = (dialogType) => (
		<>
			<DropZone
				isdragactive={isDragActive}
				onDragEnter={handleDrag}
				onDragLeave={handleDrag}
				onDragOver={handleDrag}
				onDrop={handleDrop}
				onClick={() => document.getElementById(`${dialogType}-file-input`).click()}
			>
				{previewImage || currentEvent.image ? (
					<>
						<img
							src={previewImage || currentEvent.image}
							alt="Preview"
							style={{
								maxWidth: '100%',
								maxHeight: '200px',
								borderRadius: '4px',
								marginBottom: '16px'
							}}
						/>
						<Button
							variant="outlined"
							color="error"
							onClick={(e) => {
								e.stopPropagation();
								handleRemoveImage();
							}}
							startIcon={<DeleteIcon />}
						>
							Remove Image
						</Button>
					</>
				) : (
					<>
						<UploadIcon fontSize="large" color="action" />
						<Typography variant="body1" gutterBottom>
							Drag & drop an image here, or click to select
						</Typography>
						<Typography variant="caption" color="textSecondary">
							(Supports JPG, PNG up to 5MB)
						</Typography>
					</>
				)}
				<input
					id={`${dialogType}-file-input`}
					type="file"
					accept="image/*"
					style={{ display: 'none' }}
					onChange={handleFileSelect}
				/>
			</DropZone>
			{uploadProgress > 0 && uploadProgress < 100 && (
				<Box sx={{ width: '100%', mt: 2 }}>
					<LinearProgress variant="determinate" value={uploadProgress} />
					<Typography variant="caption">{uploadProgress}%</Typography>
				</Box>
			)}
		</>
	);

	// Form fields component
	const renderFormFields = () => (
		<>
			<TextField
				label="Title"
				fullWidth
				name="title"
				value={currentEvent.title}
				onChange={handleInputChange}
				margin="normal"
				variant="outlined"
				required
			/>
			<TextField
				label="Description"
				fullWidth
				name="description"
				value={currentEvent.description}
				onChange={handleInputChange}
				margin="normal"
				variant="outlined"
				multiline
				rows={4}
				required
			/>
			<Grid container spacing={2}>
				<Grid item xs={12} sm={6}>
					<TextField
						label="Start Date"
						fullWidth
						name="startDate"
						type="date"
						value={currentEvent.startDate}
						onChange={handleInputChange}
						margin="normal"
						variant="outlined"
						InputLabelProps={{ shrink: true }}
						required
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						label="End Date"
						fullWidth
						name="endDate"
						type="date"
						value={currentEvent.endDate}
						onChange={handleInputChange}
						margin="normal"
						variant="outlined"
						InputLabelProps={{ shrink: true }}
						required
					/>
				</Grid>
			</Grid>
			<TextField
				label="Time"
				fullWidth
				name="time"
				value={currentEvent.time}
				onChange={handleInputChange}
				margin="normal"
				variant="outlined"
			/>
			<TextField
				label="Location"
				fullWidth
				name="location"
				value={currentEvent.location}
				onChange={handleInputChange}
				margin="normal"
				variant="outlined"
				required
			/>
			<TextField
				label="Price"
				fullWidth
				name="price"
				type="number"
				value={currentEvent.price}
				onChange={handleInputChange}
				margin="normal"
				variant="outlined"
				InputProps={{
					startAdornment: <InputAdornment position="start">$</InputAdornment>,
				}}
			/>
		</>
	);

	return (
		<Box sx={{ display: "flex", flexDirection: "column", height: "100vh", width: "100vw", overflow: "hidden" }}>
			<AdminHeader toggleSidebar={toggleSidebar} />
			<Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
				<Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
				<Box sx={{ p: 3, flexGrow: 1, overflow: "auto" }}>
					<CssBaseline />
					<Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
						Event Management
					</Typography>

					{/* Action Bar */}
					<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
						<Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
							<TextField
								variant="outlined"
								size="small"
								placeholder="Search events..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<SearchIcon />
										</InputAdornment>
									),
								}}
								sx={{ minWidth: 250 }}
							/>
							<Tooltip title="Refresh data">
								<IconButton onClick={handleRefresh} disabled={refreshing}>
									<RefreshIcon />
								</IconButton>
							</Tooltip>
							<Button
								variant="outlined"
								onClick={() => setView(view === 'grid' ? 'table' : 'grid')}
							>
								{view === 'grid' ? 'Table View' : 'Grid View'}
							</Button>
						</Box>
						<Button
							variant="contained"
							startIcon={<AddIcon />}
							onClick={handleAddClick}
						>
							Add New Event
						</Button>
					</Box>

					{/* Loading State */}
					{loading ? (
						<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
							<CircularProgress size={60} />
						</Box>
					) : error ? (
						<Alert severity="error" sx={{ mb: 3 }}>
							{error}
						</Alert>
					) : view === 'grid' ? (
						<>
							{/* Grid View */}
							<Grid container spacing={3}>
								{paginatedEvents.map((event) => (
									<Grid item xs={12} sm={6} md={4} key={event.id}>
										<Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
											{event.image && (
												<CardMedia
													component="img"
													height="140"
													image={event.image}
													alt={event.title}
												/>
											)}
											<CardContent sx={{ flexGrow: 1 }}>
												<Typography gutterBottom variant="h5" component="div">
													{event.title}
												</Typography>
												<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
													{event.description.length > 100
														? `${event.description.substring(0, 100)}...`
														: event.description}
												</Typography>
												<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
													<CalendarIcon color="action" sx={{ mr: 1 }} />
													<Typography variant="body2">
														{dayjs(event.startDate).format('MMM D, YYYY')} - {dayjs(event.endDate).format('MMM D, YYYY')}
													</Typography>
												</Box>
												<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
													<LocationIcon color="action" sx={{ mr: 1 }} />
													<Typography variant="body2">{event.location}</Typography>
												</Box>
												<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
													<PriceIcon color="action" sx={{ mr: 1 }} />
													<Typography variant="body2">
														{event.price > 0 ? `$${event.price.toFixed(2)}` : 'Free'}
													</Typography>
												</Box>
												<Chip
													label={getStatusText(event.startDate, event.endDate)}
													color={getStatusColor(event.startDate, event.endDate)}
													size="small"
													sx={{ mt: 1 }}
												/>
											</CardContent>
											<CardActions>
												<Button size="small" onClick={() => handleViewClick(event)}>
													View
												</Button>
												<Button
													size="small"
													onClick={() => handleEditClick(event)}
													startIcon={<EditIcon />}
												>
													Edit
												</Button>
												<Button
													size="small"
													color="error"
													onClick={() => handleDeleteClick(event)}
													startIcon={<DeleteIcon />}
												>
													Delete
												</Button>
											</CardActions>
										</Card>
									</Grid>
								))}
							</Grid>
							{count > 1 && (
								<Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
									<Pagination
										count={count}
										page={page}
										onChange={handlePageChange}
										color="primary"
									/>
								</Box>
							)}
						</>
					) : (
						/* Table View */
						<TableContainer component={Paper}>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Title</TableCell>
										<TableCell>Dates</TableCell>
										<TableCell>Location</TableCell>
										<TableCell>Price</TableCell>
										<TableCell>Status</TableCell>
										<TableCell align="right">Actions</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{filteredEvents.length > 0 ? (
										filteredEvents.map((event) => (
											<TableRow key={event.id}>
												<TableCell>
													<Typography fontWeight="bold">{event.title}</Typography>
													<Typography variant="body2" color="text.secondary">
														{event.description.length > 50
															? `${event.description.substring(0, 50)}...`
															: event.description}
													</Typography>
												</TableCell>
												<TableCell>
													{dayjs(event.startDate).format('MMM D')} - {dayjs(event.endDate).format('MMM D, YYYY')}
												</TableCell>
												<TableCell>{event.location}</TableCell>
												<TableCell>
													{event.price > 0 ? `$${event.price.toFixed(2)}` : 'Free'}
												</TableCell>
												<TableCell>
													<Chip
														label={getStatusText(event.startDate, event.endDate)}
														color={getStatusColor(event.startDate, event.endDate)}
														size="small"
													/>
												</TableCell>
												<TableCell align="right">
													<Tooltip title="View">
														<IconButton
															color="info"
															onClick={() => handleViewClick(event)}
														>
															<VisibilityIcon />
														</IconButton>
													</Tooltip>
													<Tooltip title="Edit">
														<IconButton
															color="primary"
															onClick={() => handleEditClick(event)}
														>
															<EditIcon />
														</IconButton>
													</Tooltip>
													<Tooltip title="Delete">
														<IconButton
															color="error"
															onClick={() => handleDeleteClick(event)}
														>
															<DeleteIcon />
														</IconButton>
													</Tooltip>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={6} align="center" sx={{ py: 4 }}>
												<Typography variant="body1" color="textSecondary">
													No events found matching your criteria
												</Typography>
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</TableContainer>
					)}

					{/* View Event Dialog */}
					<Dialog
						open={viewDialogOpen}
						onClose={() => setViewDialogOpen(false)}
						maxWidth="md"
						fullWidth
					>
						<DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							Event Details
							<IconButton onClick={() => setViewDialogOpen(false)}>
								<CloseIcon />
							</IconButton>
						</DialogTitle>
						<DialogContent>
							{selectedEvent && (
								<Grid container spacing={3} sx={{ mt: 1 }}>
									{selectedEvent.image && (
										<Grid item xs={12} md={6}>
											<CardMedia
												component="img"
												height="300"
												image={selectedEvent.image}
												alt={selectedEvent.title}
												sx={{ borderRadius: 1 }}
											/>
										</Grid>
									)}
									<Grid item xs={12} md={selectedEvent.image ? 6 : 12}>
										<Typography variant="h4" gutterBottom>
											{selectedEvent.title}
										</Typography>
										<Typography variant="body1" paragraph>
											{selectedEvent.description}
										</Typography>
										<Divider sx={{ my: 2 }} />
										<List>
											<ListItem>
												<ListItemAvatar>
													<Avatar sx={{ bgcolor: 'primary.main' }}>
														<CalendarIcon />
													</Avatar>
												</ListItemAvatar>
												<ListItemText
													primary="Event Dates"
													secondary={`${dayjs(selectedEvent.startDate).format('MMM D, YYYY')} - ${dayjs(selectedEvent.endDate).format('MMM D, YYYY')}`}
												/>
											</ListItem>
											<ListItem>
												<ListItemAvatar>
													<Avatar sx={{ bgcolor: 'primary.main' }}>
														<LocationIcon />
													</Avatar>
												</ListItemAvatar>
												<ListItemText
													primary="Location"
													secondary={selectedEvent.location}
												/>
											</ListItem>
											<ListItem>
												<ListItemAvatar>
													<Avatar sx={{ bgcolor: 'primary.main' }}>
														<PriceIcon />
													</Avatar>
												</ListItemAvatar>
												<ListItemText
													primary="Price"
													secondary={selectedEvent.price > 0 ? `$${selectedEvent.price.toFixed(2)}` : 'Free'}
												/>
											</ListItem>
											<ListItem>
												<ListItemAvatar>
													<Avatar sx={{ bgcolor: getStatusColor(selectedEvent.startDate, selectedEvent.endDate) }}>
														{getStatusText(selectedEvent.startDate, selectedEvent.endDate).charAt(0)}
													</Avatar>
												</ListItemAvatar>
												<ListItemText
													primary="Status"
													secondary={getStatusText(selectedEvent.startDate, selectedEvent.endDate)}
												/>
											</ListItem>
										</List>
									</Grid>
								</Grid>
							)}
						</DialogContent>
						<DialogActions>
							<Button onClick={() => setViewDialogOpen(false)}>Close</Button>
						</DialogActions>
					</Dialog>

					{/* Edit Event Dialog */}
					<Dialog
						open={editDialogOpen}
						onClose={() => setEditDialogOpen(false)}
						maxWidth="sm"
						fullWidth
					>
						<DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							Edit Event
							<IconButton onClick={() => setEditDialogOpen(false)}>
								<CloseIcon />
							</IconButton>
						</DialogTitle>
						<DialogContent>
							<Box sx={{ mt: 2 }}>
								{renderImageUploadSection('edit')}
								{renderFormFields()}
							</Box>
						</DialogContent>
						<DialogActions>
							<Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
							<Button
								onClick={handleEditSave}
								variant="contained"
								disabled={uploading || !currentEvent.title || !currentEvent.description || !currentEvent.location}
							>
								{uploading ? 'Saving...' : 'Save Changes'}
							</Button>
						</DialogActions>
					</Dialog>

					{/* Add Event Dialog */}
					<Dialog
						open={addDialogOpen}
						onClose={() => setAddDialogOpen(false)}
						maxWidth="sm"
						fullWidth
					>
						<DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							Add New Event
							<IconButton onClick={() => setAddDialogOpen(false)}>
								<CloseIcon />
							</IconButton>
						</DialogTitle>
						<DialogContent>
							<Box sx={{ mt: 2 }}>
								{renderImageUploadSection('add')}
								{renderFormFields()}
							</Box>
						</DialogContent>
						<DialogActions>
							<Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
							<Button
								onClick={handleAddSave}
								variant="contained"
								disabled={uploading || !currentEvent.title || !currentEvent.description || !currentEvent.location}
							>
								{uploading ? 'Creating...' : 'Create Event'}
							</Button>
						</DialogActions>
					</Dialog>

					{/* Delete Confirmation Dialog */}
					<Dialog
						open={deleteDialogOpen}
						onClose={() => setDeleteDialogOpen(false)}
					>
						<DialogTitle>Confirm Delete</DialogTitle>
						<DialogContent>
							<Typography>
								Are you sure you want to delete event: <strong>{eventToDelete?.title}</strong>?
								<br />
								This action cannot be undone.
							</Typography>
						</DialogContent>
						<DialogActions>
							<Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
							<Button onClick={handleDeleteConfirm} color="error">
								Delete
							</Button>
						</DialogActions>
					</Dialog>

					{/* Snackbar for notifications */}
					<Snackbar
						open={snackbar.open}
						autoHideDuration={6000}
						onClose={handleSnackbarClose}
						anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
					>
						<Alert
							onClose={handleSnackbarClose}
							severity={snackbar.severity}
							sx={{ width: '100%' }}
						>
							{snackbar.message}
						</Alert>
					</Snackbar>
				</Box>
			</Box>
		</Box>
	);
};

export default EventList;