import React, { useState, useEffect, useCallback } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	Grid,
	Box,
	Typography,
	IconButton,
	CircularProgress,
	Alert,
	LinearProgress,
	Stack,
	Chip,
	Paper,
	Fade
} from '@mui/material';
import {
	Close as CloseIcon,
	LocationOn as LocationIcon,
	Upload as UploadIcon,
	Delete as DeleteIcon,
	CalendarMonth as CalendarIcon,
	AccessTime as TimeIcon
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import useAuth from '../../hooks/useAuth';

const EventModal = ({ open, onClose, onSave, event, onChange, isEdit }) => {
	const { user } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [previewImage, setPreviewImage] = useState(null);
	const [selectedFile, setSelectedFile] = useState(null);
	const [isDragActive, setIsDragActive] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [fieldErrors, setFieldErrors] = useState({
		title: false,
		description: false,
		startDate: false,
		endDate: false,
		location: false
	});

	// Initialize form when modal opens
	useEffect(() => {
		if (!open) return; // Prevent unnecessary execution when closed

		setError(null);
		setUploadProgress(0);

		// Set organiser ID if creating new event
		if (!isEdit && user) {
			onChange('organiserId', user.email);
		}

		// Set preview image if editing existing event
		if (event.image) {
			setPreviewImage(event.image);
		} else {
			setPreviewImage(null);
		}

		// Safe initialization of dates using optional chaining to prevent infinite loops
		if (event.date && !event.startDate && !event.endDate) {
			const date = new Date(event.date);
			const endDate = new Date(date.getTime() + 2 * 60 * 60 * 1000); // 2 hours later

			// Use a stable callback to prevent multiple renders
			requestAnimationFrame(() => {
				onChange('startDate', date);
				onChange('endDate', endDate);
			});
		}
	}, [open, isEdit, user, event.image]); // Removed dependencies that might change in the effect

	const handleDrag = useCallback((e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragActive(e.type === 'dragenter' || e.type === 'dragover');
	}, []);

	const handleDrop = useCallback((e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragActive(false);

		if (e.dataTransfer.files?.[0]) {
			handleFileUpload(e.dataTransfer.files[0]);
		}
	}, []);

	const handleFileChange = (e) => {
		if (e.target.files?.[0]) {
			handleFileUpload(e.target.files[0]);
		}
	};

	const handleFileUpload = (file) => {
		// Validate file type and size
		if (!file.type.startsWith('image/')) {
			setError('Only image files are allowed (JPEG, PNG)');
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			setError('File size must be less than 5MB');
			return;
		}

		setSelectedFile(file);
		setError(null);

		// Create preview
		const reader = new FileReader();
		reader.onloadend = () => setPreviewImage(reader.result);
		reader.readAsDataURL(file);
	};

	const handleRemoveImage = (e) => {
		e.stopPropagation();
		setPreviewImage(null);
		setSelectedFile(null);
		onChange('banner', null);
		onChange('image', null);
	};

	const validateFields = () => {
		const errors = {
			title: !event.title,
			description: !event.description,
			startDate: !event.startDate,
			endDate: !event.endDate,
			location: !event.location
		};
		setFieldErrors(errors);
		return Object.values(errors).some(Boolean);
	};

	const validateDates = () => {
		if (!event.startDate || !event.endDate) return false;
		if (new Date(event.startDate) >= new Date(event.endDate)) {
			setError('End date must be after start date');
			return false;
		}
		return true;
	};

	const handleSave = async () => {
		setError(null);

		// Validate required fields
		if (validateFields()) {
			setError('Please fill all required fields');
			return;
		}

		// Validate date logic
		if (!validateDates()) return;

		setIsLoading(true);

		try {
			// Prepare form data
			const formData = new FormData();
			formData.append('title', event.title);
			formData.append('description', event.description);
			formData.append('startDate', event.startDate.toISOString());
			formData.append('endDate', event.endDate.toISOString());
			formData.append('location', event.location);
			formData.append('price', event.price ? parseFloat(event.price) : 0);
			if (event.time) formData.append('time', event.time);

			// Include organiser ID from current user
			if (user) {
				formData.append('organiserId', user.email);
			}

			// Append file if selected
			if (selectedFile) {
				formData.append('banner', selectedFile);
			}

			// Call parent save handler
			await onSave(formData, (progressEvent) => {
				const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
				setUploadProgress(progress);
			});

			onClose();
		} catch (err) {
			console.error('Save error:', err);
			setError(err.response?.data?.message || err.message || 'Failed to save event');
		} finally {
			setIsLoading(false);
			setUploadProgress(0);
		}
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="md"
			fullWidth
			PaperProps={{
				elevation: 24,
				sx: { borderRadius: 2 }
			}}
			TransitionComponent={Fade}
			TransitionProps={{ timeout: 300 }}
		>
			<DialogTitle sx={{ px: 3, py: 2, bgcolor: 'background.subtle' }}>
				<Box display="flex" justifyContent="space-between" alignItems="center">
					<Typography variant="h5" fontWeight="500">
						{isEdit ? 'Edit Event' : 'Create New Event'}
					</Typography>
					{user && (
						<Chip
							label={`Organiser: ${user.name || user.email}`}
							size="small"
							color="primary"
							variant="outlined"
						/>
					)}
					<IconButton
						onClick={onClose}
						disabled={isLoading}
						sx={{
							bgcolor: 'background.paper',
							'&:hover': { bgcolor: 'action.hover' }
						}}
					>
						<CloseIcon />
					</IconButton>
				</Box>
			</DialogTitle>

			<DialogContent dividers sx={{ px: 3, py: 3 }}>
				{error && (
					<Alert
						severity="error"
						sx={{ mb: 3, borderRadius: 1 }}
						variant="filled"
					>
						{error}
					</Alert>
				)}

				<Grid container spacing={3}>
					<Grid item xs={12}>
						<TextField
							label="Event Title *"
							fullWidth
							value={event.title || ''}
							onChange={(e) => onChange('title', e.target.value)}
							error={fieldErrors.title}
							helperText={fieldErrors.title && 'This field is required'}
							variant="outlined"
						/>
					</Grid>

					<Grid item xs={12}>
						<TextField
							label="Event Description *"
							fullWidth
							multiline
							rows={4}
							value={event.description || ''}
							onChange={(e) => onChange('description', e.target.value)}
							error={fieldErrors.description}
							helperText={fieldErrors.description && 'This field is required'}
							variant="outlined"
						/>
					</Grid>

					<Grid item xs={12} md={6}>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DateTimePicker
								label="Start Date & Time *"
								value={event.startDate || null}
								onChange={(value) => onChange('startDate', value)}
								slotProps={{
									textField: {
										fullWidth: true,
										variant: "outlined",
										error: fieldErrors.startDate,
										helperText: fieldErrors.startDate && 'This field is required',
										InputProps: {
											startAdornment: <CalendarIcon color="action" sx={{ mr: 1 }} />
										}
									}
								}}
							/>
						</LocalizationProvider>
					</Grid>

					<Grid item xs={12} md={6}>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DateTimePicker
								label="End Date & Time *"
								value={event.endDate || null}
								onChange={(value) => onChange('endDate', value)}
								slotProps={{
									textField: {
										fullWidth: true,
										variant: "outlined",
										error: fieldErrors.endDate,
										helperText: fieldErrors.endDate && 'This field is required',
										InputProps: {
											startAdornment: <CalendarIcon color="action" sx={{ mr: 1 }} />
										}
									}
								}}
								minDateTime={event.startDate || undefined}
							/>
						</LocalizationProvider>
					</Grid>

					<Grid item xs={12}>
						<TextField
							label="Venue Location *"
							fullWidth
							value={event.location || ''}
							onChange={(e) => onChange('location', e.target.value)}
							error={fieldErrors.location}
							helperText={fieldErrors.location && 'This field is required'}
							InputProps={{
								startAdornment: <LocationIcon color="action" sx={{ mr: 1 }} />,
							}}
							variant="outlined"
						/>
					</Grid>

					<Grid item xs={12} md={6}>
						<TextField
							label="Price ($)"
							type="number"
							fullWidth
							value={event.price || ''}
							onChange={(e) => onChange('price', e.target.value)}
							InputProps={{
								inputProps: { min: 0, step: 0.01 }
							}}
							variant="outlined"
						/>
					</Grid>

					<Grid item xs={12} md={6}>
						<TextField
							label="Time Display"
							fullWidth
							value={event.time || ''}
							onChange={(e) => onChange('time', e.target.value)}
							helperText="This will be displayed to users (optional)"
							InputProps={{
								startAdornment: <TimeIcon color="action" sx={{ mr: 1 }} />,
							}}
							variant="outlined"
						/>
					</Grid>

					<Grid item xs={12}>
						<Stack spacing={1}>
							<Typography variant="subtitle1" fontWeight="500">Event Banner</Typography>
							<Paper
								elevation={0}
								sx={{
									border: `2px dashed ${isDragActive ? 'primary.main' : 'divider'}`,
									borderRadius: 2,
									p: 3,
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
									cursor: 'pointer',
									height: 220,
									position: 'relative',
									overflow: 'hidden',
									backgroundColor: previewImage ? 'transparent' : 'background.subtle',
									transition: 'all 0.2s ease-in-out',
									'&:hover': {
										borderColor: 'primary.main',
										backgroundColor: previewImage ? 'transparent' : 'action.hover'
									}
								}}
								onClick={() => !isLoading && document.getElementById('modal-banner-upload').click()}
								onDragEnter={handleDrag}
								onDragLeave={handleDrag}
								onDragOver={handleDrag}
								onDrop={handleDrop}
							>
								{previewImage ? (
									<>
										<Box
											component="img"
											src={previewImage}
											alt="Event banner preview"
											sx={{
												position: 'absolute',
												width: '100%',
												height: '100%',
												objectFit: 'cover'
											}}
										/>
										<Button
											variant="contained"
											color="error"
											size="medium"
											onClick={handleRemoveImage}
											startIcon={<DeleteIcon />}
											sx={{
												position: 'absolute',
												bottom: 16,
												right: 16,
												zIndex: 1,
												borderRadius: 8,
												px: 2
											}}
										>
											Remove
										</Button>
									</>
								) : (
									<Stack spacing={1} alignItems="center">
										<Box
											sx={{
												bgcolor: 'action.selected',
												borderRadius: '50%',
												p: 2,
												display: 'flex',
												mb: 1
											}}
										>
											<UploadIcon sx={{ fontSize: 36, color: 'primary.main' }} />
										</Box>
										<Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 500 }}>
											Drag and drop your image here, or click to select
										</Typography>
										<Typography variant="caption" sx={{ color: 'text.secondary' }}>
											(JPEG, PNG up to 5MB)
										</Typography>
									</Stack>
								)}
								<input
									id="modal-banner-upload"
									type="file"
									accept="image/*"
									hidden
									onChange={handleFileChange}
									disabled={isLoading}
								/>
							</Paper>
							{uploadProgress > 0 && uploadProgress < 100 && (
								<Box sx={{ width: '100%', mt: 1 }}>
									<LinearProgress
										variant="determinate"
										value={uploadProgress}
										sx={{ height: 8, borderRadius: 4 }}
									/>
									<Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
										Uploading: {uploadProgress}%
									</Typography>
								</Box>
							)}
						</Stack>
					</Grid>
				</Grid>
			</DialogContent>

			<DialogActions sx={{ px: 3, py: 2, bgcolor: 'background.subtle' }}>
				<Button
					onClick={onClose}
					disabled={isLoading}
					variant="outlined"
					sx={{ borderRadius: 2, px: 3 }}
				>
					Cancel
				</Button>
				<Button
					variant="contained"
					onClick={handleSave}
					disabled={isLoading || uploadProgress > 0}
					startIcon={isLoading ? <CircularProgress size={20} /> : null}
					sx={{
						borderRadius: 2,
						px: 3,
						boxShadow: 2,
						textTransform: 'none',
						fontWeight: 500
					}}
				>
					{isEdit ? 'Update Event' : 'Create Event'}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default EventModal;