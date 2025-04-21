import React, { useState, useEffect } from 'react';
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
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	Snackbar,
	Alert,
	Tooltip,
	Card,
	Avatar,
	Divider,
	useTheme,
	alpha
} from '@mui/material';
import {
	Search as SearchIcon,
	Edit as EditIcon,
	Delete as DeleteIcon,
	Add as AddIcon,
	Refresh as RefreshIcon,
	FilterList as FilterIcon,
	Close as CloseIcon,
	MoreVert as MoreVertIcon,
	Visibility as VisibilityIcon,
	VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
import Sidebar from './Sidebar';
import AdminHeader from './Header';

const UserManagement = () => {
	const theme = useTheme();
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [users, setUsers] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [roleFilter, setRoleFilter] = useState('all');
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [userToDelete, setUserToDelete] = useState(null);
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: '',
		severity: 'success'
	});
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [currentUser, setCurrentUser] = useState(null);
	const [refreshing, setRefreshing] = useState(false);
	const [addDialogOpen, setAddDialogOpen] = useState(false);
	const [newUser, setNewUser] = useState({
		name: '',
		email: '',
		password: '',
		role: 'customer',
		profile_visibility: 'public'
	});
	const [showFilters, setShowFilters] = useState(false);

	const fetchUsers = async () => {
		try {
			setLoading(true);
			const token = localStorage.getItem('token');
			const response = await axios.get('http://localhost:3000/api/auth/admin/users', {
				headers: { Authorization: `Bearer ${token}` }
			});
			setUsers(response.data);
			setFilteredUsers(response.data);
			setError(null);
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to fetch users');
			setSnackbar({
				open: true,
				message: err.response?.data?.message || 'Failed to fetch users',
				severity: 'error'
			});
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const handleRefresh = () => {
		setRefreshing(true);
		fetchUsers();
	};

	useEffect(() => {
		let result = users;

		if (roleFilter !== 'all') {
			result = result.filter(user => user.role === roleFilter);
		}

		if (searchTerm) {
			const term = searchTerm.toLowerCase();
			result = result.filter(user =>
				user.name.toLowerCase().includes(term) ||
				user.email.toLowerCase().includes(term)
			);
		}

		setFilteredUsers(result);
	}, [searchTerm, roleFilter, users]);

	const handleDeleteClick = (user) => {
		setUserToDelete(user);
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		try {
			const token = localStorage.getItem('token');
			await axios.delete(`http://localhost:3000/api/auth/admin/users/${userToDelete.email}`, {
				headers: { Authorization: `Bearer ${token}` }
			});

			await fetchUsers();

			setSnackbar({
				open: true,
				message: 'User deleted successfully',
				severity: 'success'
			});
		} catch (err) {
			setSnackbar({
				open: true,
				message: err.response?.data?.message || 'Failed to delete user',
				severity: 'error'
			});
		} finally {
			setDeleteDialogOpen(false);
			setUserToDelete(null);
		}
	};

	const handleEditClick = (user) => {
		setCurrentUser(user);
		setEditDialogOpen(true);
	};

	const handleEditSave = async () => {
		try {
			const token = localStorage.getItem('token');
			await axios.put(
				`http://localhost:3000/api/auth/admin/users/${currentUser.email}`,
				currentUser,
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			await fetchUsers();

			setSnackbar({
				open: true,
				message: 'User updated successfully',
				severity: 'success'
			});
			setEditDialogOpen(false);
		} catch (err) {
			setSnackbar({
				open: true,
				message: err.response?.data?.message || 'Failed to update user',
				severity: 'error'
			});
		}
	};

	const handleAddClick = () => {
		setNewUser({
			name: '',
			email: '',
			password: '',
			role: 'customer',
			profile_visibility: 'public'
		});
		setAddDialogOpen(true);
	};

	const handleAddSave = async () => {
		try {
			const token = localStorage.getItem('token');
			await axios.post(
				'http://localhost:3000/api/auth/admin/users',
				newUser,
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			await fetchUsers();

			setSnackbar({
				open: true,
				message: 'User created successfully',
				severity: 'success'
			});
			setAddDialogOpen(false);
		} catch (err) {
			setSnackbar({
				open: true,
				message: err.response?.data?.message || 'Failed to create user',
				severity: 'error'
			});
		}
	};

	const handleNewUserChange = (e) => {
		const { name, value } = e.target;
		setNewUser({
			...newUser,
			[name]: value
		});
	};

	const handleRoleChange = (e) => {
		setCurrentUser({
			...currentUser,
			role: e.target.value
		});
	};

	const handleVisibilityChange = (e) => {
		setCurrentUser({
			...currentUser,
			profile_visibility: e.target.value
		});
	};

	const handleSnackbarClose = () => {
		setSnackbar({ ...snackbar, open: false });
	};

	const toggleFilters = () => {
		setShowFilters(!showFilters);
	};

	const getRoleColor = (role) => {
		switch (role) {
			case 'admin': return theme.palette.primary.main;
			case 'organiser': return theme.palette.secondary.main;
			case 'customer': return theme.palette.info.main;
			default: return theme.palette.text.secondary;
		}
	};

	const getRoleBgColor = (role) => {
		switch (role) {
			case 'admin': return alpha(theme.palette.primary.main, 0.12);
			case 'organiser': return alpha(theme.palette.secondary.main, 0.12);
			case 'customer': return alpha(theme.palette.info.main, 0.12);
			default: return alpha(theme.palette.text.secondary, 0.12);
		}
	};

	const getVisibilityColor = (visibility) => {
		return visibility === 'public' ? theme.palette.success.main : theme.palette.text.secondary;
	};

	const getVisibilityBgColor = (visibility) => {
		return visibility === 'public'
			? alpha(theme.palette.success.main, 0.12)
			: alpha(theme.palette.text.secondary, 0.12);
	};

	const getInitials = (name) => {
		return name
			.split(' ')
			.map(part => part[0])
			.join('')
			.toUpperCase()
			.substring(0, 2);
	};

	const getAvatarColor = (name) => {
		const colors = [
			theme.palette.primary.main,
			theme.palette.secondary.main,
			theme.palette.success.main,
			theme.palette.info.main,
			theme.palette.warning.main
		];

		// Generate a consistent but pseudo-random index using the name
		const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
		return colors[hash % colors.length];
	};

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				height: "100vh",
				width: "100vw",
				overflow: "hidden",
				position: "fixed",
				top: 0,
				left: 0,
				bgcolor: "#f5f7fa",
			}
			}
		>
			<AdminHeader toggleSidebar={toggleSidebar} />
			< Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
				<Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
				<Box
					component="main"
					sx={{
						flexGrow: 1,
						p: { xs: 2, md: 4 },
						overflow: "auto",
						transition: "all 0.25s ease-in-out",
						ml: 0,
					}}
				>
					<Card
						elevation={0}
						sx={{
							mb: 4,
							p: 3,
							borderRadius: 2,
							bgcolor: theme.palette.background.paper,
							boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
						}}
					>
						<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
							<Typography variant="h5" fontWeight="600" color="primary.main" >
								User Management
							</Typography>
							< Box sx={{ display: 'flex', gap: 1 }}>
								<Tooltip title="Refresh data" >
									<IconButton
										onClick={handleRefresh}
										disabled={refreshing}
										color="primary"
										sx={{
											bgcolor: alpha(theme.palette.primary.main, 0.08),
											'&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.15) }
										}}
									>
										<RefreshIcon />
									</IconButton>
								</Tooltip>
								< Tooltip title="Filter users" >
									<IconButton
										onClick={toggleFilters}
										color="primary"
										sx={{
											bgcolor: showFilters ? alpha(theme.palette.primary.main, 0.15) : alpha(theme.palette.primary.main, 0.08),
											'&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.15) }
										}}
									>
										<FilterIcon />
									</IconButton>
								</Tooltip>
								< Button
									variant="contained"
									startIcon={< AddIcon />}
									onClick={handleAddClick}
									sx={{
										ml: 1,
										px: 3,
										py: 1,
										boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
										borderRadius: '8px',
										textTransform: 'none',
										fontWeight: 600
									}}
								>
									Add User
								</Button>
							</Box>
						</Box>

						< Box
							sx={{
								mb: 3,
								display: 'flex',
								flexWrap: 'wrap',
								gap: 2,
								maxHeight: showFilters ? '100px' : '0px',
								overflow: 'hidden',
								transition: 'all 0.3s ease-in-out',
								opacity: showFilters ? 1 : 0
							}}
						>
							<TextField
								variant="outlined"
								size="small"
								placeholder="Search users..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start" >
											<SearchIcon fontSize="small" color="action" />
										</InputAdornment>
									),
									sx: {
										borderRadius: 2,
										bgcolor: alpha(theme.palette.common.white, 0.8)
									}
								}}
								sx={{ minWidth: 250, flex: 1 }}
							/>
							< FormControl sx={{ minWidth: 180 }} size="small" >
								<InputLabel>Role </InputLabel>
								< Select
									value={roleFilter}
									onChange={(e) => setRoleFilter(e.target.value)}
									label="Role"
									sx={{ borderRadius: 2 }}
								>
									<MenuItem value="all" > All Roles </MenuItem>
									< MenuItem value="admin" > Admin </MenuItem>
									< MenuItem value="organiser" > Organiser </MenuItem>
									< MenuItem value="customer" > Customer </MenuItem>
								</Select>
							</FormControl>
						</Box>

						{
							loading ? (
								<Box sx={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									height: '50vh'
								}
								}>
									<CircularProgress size={50} thickness={4} />
								</Box>
							) : error ? (
								<Alert
									severity="error"
									sx={{
										mb: 3,
										borderRadius: 2,
										'& .MuiAlert-message': { overflow: 'hidden' }
									}}
									variant="filled"
									action={
										< Button
											color="inherit"
											size="small"
											onClick={fetchUsers}
										>
											Retry
										</Button>
									}
								>
									{error}
								</Alert>
							) : (
								<TableContainer
									component={Paper}
									elevation={0}
									sx={{
										borderRadius: 2,
										overflow: 'hidden',
										boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
										border: `1px solid ${alpha(theme.palette.divider, 0.3)}`
									}}
								>
									<Table>
										<TableHead sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.02) }}>
											<TableRow>
												<TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary, py: 2 }}> User </TableCell>
												< TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}> Role </TableCell>
												< TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}> Joined </TableCell>
												< TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}> Visibility </TableCell>
												< TableCell align="right" sx={{ fontWeight: 600, color: theme.palette.text.primary }}> Actions </TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{
												filteredUsers.length > 0 ? (
													filteredUsers.map((user) => (
														<TableRow
															key={user.email}
															hover
															sx={{
																'&:last-child td, &:last-child th': { border: 0 }
															}}
														>
															<TableCell sx={{ py: 2 }}>
																<Box sx={{ display: 'flex', alignItems: 'center' }}>
																	<Avatar
																		sx={
																			{
																				mr: 2,
																				bgcolor: getAvatarColor(user.name),
																				fontWeight: 600,
																				fontSize: '0.9rem'
																			}
																		}
																	>
																		{getInitials(user.name)}
																	</Avatar>
																	< Box >
																		<Typography variant="body1" fontWeight={500} > {user.name} </Typography>
																		< Typography variant="body2" color="text.secondary" > {user.email} </Typography>
																	</Box>
																</Box>
															</TableCell>
															< TableCell >
																<Chip
																	label={user.role}
																	size="small"
																	sx={{
																		borderRadius: '6px',
																		color: getRoleColor(user.role),
																		bgcolor: getRoleBgColor(user.role),
																		fontWeight: 500,
																		px: 0.5
																	}}
																/>
															</TableCell>
															< TableCell >
																<Typography variant="body2" >
																	{dayjs(user.creation_date).format('DD MMM YYYY')}
																</Typography>
															</TableCell>
															< TableCell >
																<Box sx={{ display: 'flex', alignItems: 'center' }}>
																	{
																		user.profile_visibility === 'public' ? (
																			<VisibilityIcon fontSize="small" sx={{ mr: 1, color: getVisibilityColor(user.profile_visibility) }} />
																		) : (
																			<VisibilityOffIcon fontSize="small" sx={{ mr: 1, color: getVisibilityColor(user.profile_visibility) }} />
																		)}
																	<Typography
																		variant="body2"
																		sx={{
																			color: getVisibilityColor(user.profile_visibility),
																			fontWeight: 500
																		}}
																	>
																		{user.profile_visibility === 'public' ? 'Public' : 'Private'}
																	</Typography>
																</Box>
															</TableCell>
															< TableCell align="right" >
																<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
																	<Tooltip title="Edit user" >
																		<IconButton
																			onClick={() => handleEditClick(user)}
																			size="small"
																			sx={{
																				bgcolor: alpha(theme.palette.primary.main, 0.05),
																				color: theme.palette.primary.main,
																				mr: 1,
																				'&:hover': {
																					bgcolor: alpha(theme.palette.primary.main, 0.12),
																				}
																			}}
																		>
																			<EditIcon fontSize="small" />
																		</IconButton>
																	</Tooltip>
																	< Tooltip title="Delete user" >
																		<IconButton
																			onClick={() => handleDeleteClick(user)}
																			size="small"
																			sx={{
																				bgcolor: alpha(theme.palette.error.main, 0.05),
																				color: theme.palette.error.main,
																				'&:hover': {
																					bgcolor: alpha(theme.palette.error.main, 0.12),
																				}
																			}}
																		>
																			<DeleteIcon fontSize="small" />
																		</IconButton>
																	</Tooltip>
																</Box>
															</TableCell>
														</TableRow>
													))
												) : (
													<TableRow>
														<TableCell colSpan={6} align="center" sx={{ py: 4 }}>
															<Box sx={{ textAlign: 'center', py: 3 }}>
																<Typography variant="body1" fontWeight={500} color="text.secondary" >
																	No users found
																</Typography>
																< Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
																	Try changing your filters or search query
																</Typography>
															</Box>
														</TableCell>
													</TableRow>
												)}
										</TableBody>
									</Table>
								</TableContainer>
							)}

						{/* Delete Confirmation Dialog */}
						<Dialog
							open={deleteDialogOpen}
							onClose={() => setDeleteDialogOpen(false)}
							PaperProps={{
								sx: { borderRadius: 2, maxWidth: '450px' }
							}}
						>
							<DialogTitle sx={
								{
									px: 3,
									pt: 3,
									pb: 2,
									display: 'flex',
									alignItems: 'center',
									color: theme.palette.error.main
								}
							}>
								<Box
									sx={
										{
											mr: 2,
											p: 1,
											borderRadius: '50%',
											bgcolor: alpha(theme.palette.error.main, 0.1)
										}
									}
								>
									<DeleteIcon color="error" />
								</Box>
								< Typography variant="h6" fontWeight={600} > Confirm Delete </Typography>
							</DialogTitle>
							< DialogContent sx={{ p: 3 }}>
								<Typography variant="body1" >
									Are you sure you want to delete user: <strong>{userToDelete?.email} </strong>?
								</Typography>
								< Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
									This action cannot be undone and will permanently remove the user from the system.
								</Typography>
							</DialogContent>
							< DialogActions sx={{ px: 3, pb: 3 }}>
								<Button
									onClick={() => setDeleteDialogOpen(false)}
									variant="outlined"
									sx={{
										borderRadius: 2,
										textTransform: 'none',
										fontWeight: 500
									}}
								>
									Cancel
								</Button>
								< Button
									onClick={handleDeleteConfirm}
									color="error"
									variant="contained"
									sx={{
										borderRadius: 2,
										textTransform: 'none',
										fontWeight: 500,
										boxShadow: '0 4px 8px rgba(211, 47, 47, 0.2)'
									}}
								>
									Delete User
								</Button>
							</DialogActions>
						</Dialog>

						{/* Edit User Dialog */}
						<Dialog
							open={editDialogOpen}
							onClose={() => setEditDialogOpen(false)}
							maxWidth="sm"
							fullWidth
							PaperProps={{
								sx: { borderRadius: 2 }
							}}
						>
							<DialogTitle sx={
								{
									px: 3,
									pt: 3,
									pb: 1,
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center'
								}
							}>
								<Box sx={{ display: 'flex', alignItems: 'center' }}>
									<Typography variant="h6" fontWeight={600} > Edit User </Typography>
								</Box>
								< IconButton onClick={() => setEditDialogOpen(false)} size="small" >
									<CloseIcon fontSize="small" />
								</IconButton>
							</DialogTitle>

							< Divider />

							<DialogContent sx={{ p: 3 }}>
								{currentUser && (
									<Box>
										<Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
											<Avatar
												sx={
													{
														width: 80,
														height: 80,
														bgcolor: getAvatarColor(currentUser.name),
														fontSize: '1.5rem',
														fontWeight: 600
													}
												}
											>
												{getInitials(currentUser.name)}
											</Avatar>
										</Box>
										< TextField
											label="Name"
											fullWidth
											value={currentUser.name}
											onChange={(e) => setCurrentUser({
												...currentUser,
												name: e.target.value
											})}
											margin="normal"
											variant="outlined"
											InputProps={{
												sx: { borderRadius: 1.5 }
											}}
										/>
										< TextField
											label="Email"
											fullWidth
											value={currentUser.email}
											disabled
											margin="normal"
											variant="outlined"
											InputProps={{
												sx: { borderRadius: 1.5 }
											}}
										/>
										< FormControl fullWidth margin="normal" variant="outlined" >
											<InputLabel>Role </InputLabel>
											< Select
												value={currentUser.role}
												onChange={handleRoleChange}
												label="Role"
												sx={{ borderRadius: 1.5 }}
											>
												<MenuItem value="admin" > Admin </MenuItem>
												< MenuItem value="organiser" > Organiser </MenuItem>
												< MenuItem value="customer" > Customer </MenuItem>
											</Select>
										</FormControl>
										< FormControl fullWidth margin="normal" variant="outlined" >
											<InputLabel>Profile Visibility </InputLabel>
											< Select
												value={currentUser.profile_visibility}
												onChange={handleVisibilityChange}
												label="Profile Visibility"
												sx={{ borderRadius: 1.5 }}
											>
												<MenuItem value="public" > Public </MenuItem>
												< MenuItem value="private" > Private </MenuItem>
											</Select>
										</FormControl>
									</Box>
								)}
							</DialogContent>
							< DialogActions sx={{ p: 3, pt: 1 }}>
								<Button
									onClick={() => setEditDialogOpen(false)}
									variant="outlined"
									sx={{
										borderRadius: 2,
										textTransform: 'none',
										fontWeight: 500
									}}
								>
									Cancel
								</Button>
								< Button
									onClick={handleEditSave}
									variant="contained"
									color="primary"
									sx={{
										borderRadius: 2,
										textTransform: 'none',
										fontWeight: 500,
										boxShadow: '0 4px 8px rgba(25, 118, 210, 0.2)'
									}}
								>
									Save Changes
								</Button>
							</DialogActions>
						</Dialog>

						{/* Add User Dialog */}
						<Dialog
							open={addDialogOpen}
							onClose={() => setAddDialogOpen(false)}
							maxWidth="sm"
							fullWidth
							PaperProps={{
								sx: { borderRadius: 2 }
							}}
						>
							<DialogTitle sx={
								{
									px: 3,
									pt: 3,
									pb: 1,
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center'
								}
							}>
								<Box sx={{ display: 'flex', alignItems: 'center' }}>
									<Box
										sx={
											{
												mr: 2,
												p: 1,
												borderRadius: '50%',
												bgcolor: alpha(theme.palette.primary.main, 0.1)
											}
										}
									>
										<AddIcon color="primary" />
									</Box>
									< Typography variant="h6" fontWeight={600} > Add New User </Typography>
								</Box>
								< IconButton onClick={() => setAddDialogOpen(false)} size="small" >
									<CloseIcon fontSize="small" />
								</IconButton>
							</DialogTitle>

							< Divider />

							<DialogContent sx={{ p: 3 }}>
								<Box>
									<TextField
										label="Name"
										fullWidth
										name="name"
										value={newUser.name}
										onChange={handleNewUserChange}
										margin="normal"
										variant="outlined"
										required
										InputProps={{
											sx: { borderRadius: 1.5 }
										}}
									/>
									< TextField
										label="Email"
										fullWidth
										name="email"
										type="email"
										value={newUser.email}
										onChange={handleNewUserChange}
										margin="normal"
										variant="outlined"
										required
										InputProps={{
											sx: { borderRadius: 1.5 }
										}}
									/>
									< TextField
										label="Password"
										fullWidth
										name="password"
										type="password"
										value={newUser.password}
										onChange={handleNewUserChange}
										margin="normal"
										variant="outlined"
										required
										InputProps={{
											sx: { borderRadius: 1.5 }
										}}
									/>
									< FormControl fullWidth margin="normal" variant="outlined" >
										<InputLabel>Role </InputLabel>
										< Select
											name="role"
											value={newUser.role}
											onChange={handleNewUserChange}
											label="Role"
											sx={{ borderRadius: 1.5 }}
										>
											<MenuItem value="admin" > Admin </MenuItem>
											< MenuItem value="organiser" > Organiser </MenuItem>
											< MenuItem value="customer" > Customer </MenuItem>
										</Select>
									</FormControl>
									< FormControl fullWidth margin="normal" variant="outlined" >
										<InputLabel>Profile Visibility </InputLabel>
										< Select
											name="profile_visibility"
											value={newUser.profile_visibility}
											onChange={handleNewUserChange}
											label="Profile Visibility"
											sx={{ borderRadius: 1.5 }}
										>
											<MenuItem value="public" > Public </MenuItem>
											< MenuItem value="private" > Private </MenuItem>
										</Select>
									</FormControl>
								</Box>
							</DialogContent>
							< DialogActions sx={{ p: 3, pt: 1 }}>
								<Button
									onClick={() => setAddDialogOpen(false)}
									variant="outlined"
									sx={{
										borderRadius: 2,
										textTransform: 'none',
										fontWeight: 500
									}}
								>
									Cancel
								</Button>
								< Button
									onClick={handleAddSave}
									variant="contained"
									color="primary"
									sx={{
										borderRadius: 2,
										textTransform: 'none',
										fontWeight: 500,
										boxShadow: '0 4px 8px rgba(25, 118, 210, 0.2)'
									}}
								>
									Add User
								</Button>
							</DialogActions>
						</Dialog>

						{/* Snackbar for notifications */}
						<Snackbar
							open={snackbar.open}
							autoHideDuration={5000}
							onClose={handleSnackbarClose}
							anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
						>
							<Alert
								onClose={handleSnackbarClose}
								severity={snackbar.severity}
								variant="filled"
								sx={{
									width: '100%',
									borderRadius: 2,
									boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
								}}
							>
								{snackbar.message}
							</Alert>
						</Snackbar>
					</Card>

					{/* User Stats Cards */}
					<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
						<Card
							elevation={0}
							sx={{
								p: 3,
								borderRadius: 2,
								bgcolor: alpha(theme.palette.primary.main, 0.1),
								boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
								display: 'flex',
								flexDirection: 'column'
							}}
						>
							<Typography variant="subtitle2" color="text.secondary" fontWeight={500} >
								Total Users
							</Typography>
							< Typography variant="h4" fontWeight={600} color="primary.main" sx={{ my: 1 }}>
								{users.length}
							</Typography>
							< Box sx={{ display: 'flex', alignItems: 'center' }}>
								<Chip
									label={`${users.filter(u => u.role === 'customer').length} Customers`}
									size="small"
									sx={{
										borderRadius: '6px',
										bgcolor: alpha(theme.palette.info.main, 0.15),
										color: theme.palette.info.main,
										fontWeight: 500
									}}
								/>
							</Box>
						</Card>

						< Card
							elevation={0}
							sx={{
								p: 3,
								borderRadius: 2,
								bgcolor: alpha(theme.palette.secondary.main, 0.1),
								boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
								display: 'flex',
								flexDirection: 'column'
							}}
						>
							<Typography variant="subtitle2" color="text.secondary" fontWeight={500} >
								Organisers
							</Typography>
							< Typography variant="h4" fontWeight={600} color="secondary.main" sx={{ my: 1 }}>
								{users.filter(u => u.role === 'organiser').length}
							</Typography>
							< Box sx={{ display: 'flex', alignItems: 'center' }}>
								<Chip
									label={`${Math.round((users.filter(u => u.role === 'organiser').length / users.length) * 100)}% of users`}
									size="small"
									sx={{
										borderRadius: '6px',
										bgcolor: alpha(theme.palette.secondary.main, 0.15),
										color: theme.palette.secondary.main,
										fontWeight: 500
									}}
								/>
							</Box>
						</Card>

						< Card
							elevation={0}
							sx={{
								p: 3,
								borderRadius: 2,
								bgcolor: alpha(theme.palette.success.main, 0.1),
								boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
								display: 'flex',
								flexDirection: 'column'
							}}
						>
							<Typography variant="subtitle2" color="text.secondary" fontWeight={500} >
								Public Profiles
							</Typography>
							< Typography variant="h4" fontWeight={600} color="success.main" sx={{ my: 1 }}>
								{users.filter(u => u.profile_visibility === 'public').length}
							</Typography>
							< Box sx={{ display: 'flex', alignItems: 'center' }}>
								<Chip
									label={`${Math.round((users.filter(u => u.profile_visibility === 'public').length / users.length) * 100)}% of users`}
									size="small"
									sx={{
										borderRadius: '6px',
										bgcolor: alpha(theme.palette.success.main, 0.15),
										color: theme.palette.success.main,
										fontWeight: 500
									}}
								/>
							</Box>
						</Card>

						< Card
							elevation={0}
							sx={{
								p: 3,
								borderRadius: 2,
								bgcolor: alpha(theme.palette.warning.main, 0.1),
								boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
								display: 'flex',
								flexDirection: 'column'
							}}
						>
							<Typography variant="subtitle2" color="text.secondary" fontWeight={500} >
								Admins
							</Typography>
							< Typography variant="h4" fontWeight={600} color="warning.main" sx={{ my: 1 }}>
								{users.filter(u => u.role === 'admin').length}
							</Typography>
							< Box sx={{ display: 'flex', alignItems: 'center' }}>
								<Chip
									label="Privileged users"
									size="small"
									sx={{
										borderRadius: '6px',
										bgcolor: alpha(theme.palette.warning.main, 0.15),
										color: theme.palette.warning.main,
										fontWeight: 500
									}}
								/>
							</Box>
						</Card>
					</Box>

					{/* Recent Activity / Notes Section */}
					<Card
						elevation={0}
						sx={{
							p: 3,
							borderRadius: 2,
							bgcolor: theme.palette.background.paper,
							boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
						}}
					>
						<Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
							Recent Activity
						</Typography>

						< Box sx={{ maxHeight: 250, overflow: 'auto', pr: 1 }}>
							{
								users.length > 0 ? (
									users.slice(0, 5).map((user, index) => (
										<Box
											key={index}
											sx={{
												display: 'flex',
												alignItems: 'flex-start',
												py: 1.5,
												borderBottom: index !== 4 ? `1px solid ${alpha(theme.palette.divider, 0.3)}` : 'none'
											}}
										>
											<Avatar
												sx={
													{
														width: 40,
														height: 40,
														mr: 2,
														bgcolor: getAvatarColor(user.name),
														fontSize: '0.9rem',
														fontWeight: 600
													}
												}
											>
												{getInitials(user.name)}
											</Avatar>
											< Box sx={{ flexGrow: 1 }}>
												<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
													<Typography variant="body1" fontWeight={500} >
														{user.name}
														< Box component="span" sx={{ ml: 1 }}>
															<Chip
																label={user.role}
																size="small"
																sx={{
																	borderRadius: '6px',
																	color: getRoleColor(user.role),
																	bgcolor: getRoleBgColor(user.role),
																	fontWeight: 500,
																	height: 20,
																	'& .MuiChip-label': { px: 1, py: 0 }
																}}
															/>
														</Box>
													</Typography>
													< Typography variant="caption" color="text.secondary" >
														{dayjs(user.creation_date).fromNow()}
													</Typography>
												</Box>
												< Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
													{index % 2 === 0 ? 'User account created' : 'Profile updated'}
												</Typography>
											</Box>
										</Box>
									))
								) : (
									<Box sx={{ textAlign: 'center', py: 3 }}>
										<Typography variant="body1" color="text.secondary" >
											No recent activity found
										</Typography>
									</Box>
								)}
						</Box>

						< Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
							<Button
								color="primary"
								sx={{
									textTransform: 'none',
									fontWeight: 500
								}}
							>
								View All Activity
							</Button>
						</Box>
					</Card>

					< Box sx={{ textAlign: 'center', mt: 4, color: alpha(theme.palette.text.secondary, 0.7) }}>
						<Typography variant="caption" >
							Admin User Management • Last updated {dayjs().format('DD MMM YYYY')}
						</Typography>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default UserManagement;

















// import React, { useState, useEffect } from 'react';
// import {
// 	Box,
// 	Typography,
// 	Table,
// 	TableHead,
// 	TableRow,
// 	TableCell,
// 	TableBody,
// 	Button,
// 	Paper,
// 	TableContainer,
// 	TextField,
// 	InputAdornment,
// 	IconButton,
// 	Chip,
// 	CircularProgress,
// 	Dialog,
// 	DialogTitle,
// 	DialogContent,
// 	DialogActions,
// 	MenuItem,
// 	Select,
// 	FormControl,
// 	InputLabel,
// 	Snackbar,
// 	Alert,
// 	Tooltip
// } from '@mui/material';
// import {
// 	Search as SearchIcon,
// 	Edit as EditIcon,
// 	Delete as DeleteIcon,
// 	Add as AddIcon,
// 	Refresh as RefreshIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import dayjs from 'dayjs';
// import Sidebar from './Sidebar';
// import AdminHeader from './Header';



// const UserManagement = () => {
// 	const [sidebarOpen, setSidebarOpen] = useState(true);
// 	const [users, setUsers] = useState([]);
// 	const [filteredUsers, setFilteredUsers] = useState([]);
// 	const [loading, setLoading] = useState(true);
// 	const [error, setError] = useState(null);
// 	const [searchTerm, setSearchTerm] = useState('');
// 	const [roleFilter, setRoleFilter] = useState('all');
// 	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
// 	const [userToDelete, setUserToDelete] = useState(null);
// 	const [snackbar, setSnackbar] = useState({
// 		open: false,
// 		message: '',
// 		severity: 'success'
// 	});
// 	const [editDialogOpen, setEditDialogOpen] = useState(false);
// 	const [currentUser, setCurrentUser] = useState(null);
// 	const [refreshing, setRefreshing] = useState(false);
// 	const [addDialogOpen, setAddDialogOpen] = useState(false);
// 	const [newUser, setNewUser] = useState({
// 		name: '',
// 		email: '',
// 		password: '',
// 		role: 'customer',
// 		profile_visibility: 'public'
// 	});

// 	const fetchUsers = async () => {
// 		try {
// 			setLoading(true);
// 			const token = localStorage.getItem('token');
// 			const response = await axios.get('http://localhost:3000/api/auth/admin/users', {
// 				headers: { Authorization: `Bearer ${token}` }
// 			});
// 			setUsers(response.data);
// 			setFilteredUsers(response.data);
// 			setError(null);
// 		} catch (err) {
// 			setError(err.response?.data?.message || 'Failed to fetch users');
// 			setSnackbar({
// 				open: true,
// 				message: err.response?.data?.message || 'Failed to fetch users',
// 				severity: 'error'
// 			});
// 		} finally {
// 			setLoading(false);
// 			setRefreshing(false);
// 		}
// 	};

// 	useEffect(() => {
// 		fetchUsers();
// 	}, []);

// 	const handleRefresh = () => {
// 		setRefreshing(true);
// 		fetchUsers();
// 	};

// 	useEffect(() => {
// 		let result = users;

// 		if (roleFilter !== 'all') {
// 			result = result.filter(user => user.role === roleFilter);
// 		}

// 		if (searchTerm) {
// 			const term = searchTerm.toLowerCase();
// 			result = result.filter(user =>
// 				user.name.toLowerCase().includes(term) ||
// 				user.email.toLowerCase().includes(term)
// 			);
// 		}

// 		setFilteredUsers(result);
// 	}, [searchTerm, roleFilter, users]);

// 	const handleDeleteClick = (user) => {
// 		setUserToDelete(user);
// 		setDeleteDialogOpen(true);
// 	};

// 	const handleDeleteConfirm = async () => {
// 		try {
// 			const token = localStorage.getItem('token');
// 			await axios.delete(`http://localhost:3000/api/auth/admin/users/${userToDelete.email}`, {
// 				headers: { Authorization: `Bearer ${token}` }
// 			});

// 			await fetchUsers();

// 			setSnackbar({
// 				open: true,
// 				message: 'User deleted successfully',
// 				severity: 'success'
// 			});
// 		} catch (err) {
// 			setSnackbar({
// 				open: true,
// 				message: err.response?.data?.message || 'Failed to delete user',
// 				severity: 'error'
// 			});
// 		} finally {
// 			setDeleteDialogOpen(false);
// 			setUserToDelete(null);
// 		}
// 	};

// 	const handleEditClick = (user) => {
// 		setCurrentUser(user);
// 		setEditDialogOpen(true);
// 	};

// 	const handleEditSave = async () => {
// 		try {
// 			const token = localStorage.getItem('token');
// 			await axios.put(
// 				`http://localhost:3000/api/auth/admin/users/${currentUser.email}`,
// 				currentUser,
// 				{ headers: { Authorization: `Bearer ${token}` } }
// 			);

// 			await fetchUsers();

// 			setSnackbar({
// 				open: true,
// 				message: 'User updated successfully',
// 				severity: 'success'
// 			});
// 			setEditDialogOpen(false);
// 		} catch (err) {
// 			setSnackbar({
// 				open: true,
// 				message: err.response?.data?.message || 'Failed to update user',
// 				severity: 'error'
// 			});
// 		}
// 	};

// 	const handleAddClick = () => {
// 		setNewUser({
// 			name: '',
// 			email: '',
// 			password: '',
// 			role: 'customer',
// 			profile_visibility: 'public'
// 		});
// 		setAddDialogOpen(true);
// 	};

// 	const handleAddSave = async () => {
// 		try {
// 			const token = localStorage.getItem('token');
// 			await axios.post(
// 				'http://localhost:3000/api/auth/admin/users',
// 				newUser,
// 				{ headers: { Authorization: `Bearer ${token}` } }
// 			);

// 			await fetchUsers();

// 			setSnackbar({
// 				open: true,
// 				message: 'User created successfully',
// 				severity: 'success'
// 			});
// 			setAddDialogOpen(false);
// 		} catch (err) {
// 			setSnackbar({
// 				open: true,
// 				message: err.response?.data?.message || 'Failed to create user',
// 				severity: 'error'
// 			});
// 		}
// 	};

// 	const handleNewUserChange = (e) => {
// 		const { name, value } = e.target;
// 		setNewUser({
// 			...newUser,
// 			[name]: value
// 		});
// 	};

// 	const handleRoleChange = (e) => {
// 		setCurrentUser({
// 			...currentUser,
// 			role: e.target.value
// 		});
// 	};

// 	const handleVisibilityChange = (e) => {
// 		setCurrentUser({
// 			...currentUser,
// 			profile_visibility: e.target.value
// 		});
// 	};

// 	const handleSnackbarClose = () => {
// 		setSnackbar({ ...snackbar, open: false });
// 	};

// 	const getRoleColor = (role) => {
// 		switch (role) {
// 			case 'admin': return 'primary';
// 			case 'organiser': return 'secondary';
// 			default: return 'default';
// 		}
// 	};
// 	const toggleSidebar = () => {
// 		setSidebarOpen(!sidebarOpen);
// 	};

// 	return (
// 		<Box
// 			sx={{
// 				display: "flex",
// 				flexDirection: "column",
// 				height: "100vh",
// 				width: "100vw",
// 				overflow: "hidden",
// 				position: "fixed",
// 				top: 0,
// 				left: 0,
// 				bgcolor: "#f9fafb",
// 			}}
// 		>
// 			<AdminHeader toggleSidebar={toggleSidebar} />
// 			<Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
// 				<Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
// 				<Box
// 					component="main"
// 					sx={{
// 						flexGrow: 1,
// 						p: 3,
// 						overflow: "auto",
// 						transition: "all 0.25s ease-in-out",
// 						ml: 0,
// 					}}
// 				>
// 					<Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
// 						User Management
// 					</Typography>

// 					<Box sx={{
// 						display: 'flex',
// 						justifyContent: 'space-between',
// 						mb: 3,
// 						alignItems: 'center',
// 						gap: 2,
// 						flexWrap: 'wrap'
// 					}}>
// 						<Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
// 							<TextField
// 								variant="outlined"
// 								size="small"
// 								placeholder="Search users..."
// 								value={searchTerm}
// 								onChange={(e) => setSearchTerm(e.target.value)}
// 								InputProps={{
// 									startAdornment: (
// 										<InputAdornment position="start">
// 											<SearchIcon />
// 										</InputAdornment>
// 									),
// 								}}
// 								sx={{ minWidth: 250 }}
// 							/>
// 							<FormControl sx={{ minWidth: 160 }} size="small">
// 								<InputLabel>Filter by Role</InputLabel>
// 								<Select
// 									value={roleFilter}
// 									onChange={(e) => setRoleFilter(e.target.value)}
// 									label="Filter by Role"
// 								>
// 									<MenuItem value="all">All Roles</MenuItem>
// 									<MenuItem value="admin">Admin</MenuItem>
// 									<MenuItem value="organiser">Organiser</MenuItem>
// 									<MenuItem value="customer">Customer</MenuItem>
// 								</Select>
// 							</FormControl>
// 							<Tooltip title="Refresh data">
// 								<IconButton
// 									onClick={handleRefresh}
// 									color="primary"
// 									disabled={refreshing}
// 								>
// 									<RefreshIcon />
// 								</IconButton>
// 							</Tooltip>
// 						</Box>
// 						<Button
// 							variant="contained"
// 							startIcon={<AddIcon />}
// 							onClick={handleAddClick}
// 							sx={{
// 								backgroundColor: 'success.main',
// 								'&:hover': { backgroundColor: 'success.dark' }
// 							}}
// 						>
// 							Add New User
// 						</Button>
// 					</Box>

// 					{loading ? (
// 						<Box sx={{
// 							display: 'flex',
// 							justifyContent: 'center',
// 							alignItems: 'center',
// 							height: '50vh'
// 						}}>
// 							<CircularProgress size={60} />
// 						</Box>
// 					) : error ? (
// 						<Alert
// 							severity="error"
// 							sx={{
// 								mb: 3,
// 								'& .MuiAlert-message': { overflow: 'hidden' }
// 							}}
// 							action={
// 								<Button
// 									color="inherit"
// 									size="small"
// 									onClick={fetchUsers}
// 								>
// 									Retry
// 								</Button>
// 							}
// 						>
// 							{error}
// 						</Alert>
// 					) : (
// 						<TableContainer
// 							component={Paper}
// 							sx={{
// 								borderRadius: 2,
// 								boxShadow: 3,
// 								overflow: 'hidden'
// 							}}
// 						>
// 							<Table>
// 								<TableHead sx={{ backgroundColor: 'primary.light' }}>
// 									<TableRow>
// 										<TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
// 										<TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
// 										<TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Role</TableCell>
// 										<TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Joined</TableCell>
// 										<TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Visibility</TableCell>
// 										<TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
// 									</TableRow>
// 								</TableHead>
// 								<TableBody>
// 									{filteredUsers.length > 0 ? (
// 										filteredUsers.map((user) => (
// 											<TableRow
// 												key={user.email}
// 												hover
// 												sx={{
// 													'&:nth-of-type(even)': { backgroundColor: 'action.hover' },
// 													'&:last-child td, &:last-child th': { border: 0 }
// 												}}
// 											>
// 												<TableCell>{user.name}</TableCell>
// 												<TableCell>{user.email}</TableCell>
// 												<TableCell>
// 													<Chip
// 														label={user.role}
// 														color={getRoleColor(user.role)}
// 														size="small"
// 														variant="outlined"
// 													/>
// 												</TableCell>
// 												<TableCell>
// 													{dayjs(user.creation_date).format('DD MMM YYYY')}
// 												</TableCell>
// 												<TableCell>
// 													{user.profile_visibility === 'public' ? (
// 														<Chip label="Public" color="success" size="small" variant="outlined" />
// 													) : (
// 														<Chip label="Private" color="default" size="small" variant="outlined" />
// 													)}
// 												</TableCell>
// 												<TableCell align="right">
// 													<Tooltip title="Edit user">
// 														<IconButton
// 															color="primary"
// 															onClick={() => handleEditClick(user)}
// 															sx={{ '&:hover': { backgroundColor: 'primary.light', color: 'white' } }}
// 														>
// 															<EditIcon />
// 														</IconButton>
// 													</Tooltip>
// 													<Tooltip title="Delete user">
// 														<IconButton
// 															color="error"
// 															onClick={() => handleDeleteClick(user)}
// 															sx={{ '&:hover': { backgroundColor: 'error.light', color: 'white' } }}
// 														>
// 															<DeleteIcon />
// 														</IconButton>
// 													</Tooltip>
// 												</TableCell>
// 											</TableRow>
// 										))
// 									) : (
// 										<TableRow>
// 											<TableCell colSpan={6} align="center" sx={{ py: 4 }}>
// 												<Typography variant="body1" color="textSecondary">
// 													No users found matching your criteria
// 												</Typography>
// 											</TableCell>
// 										</TableRow>
// 									)}
// 								</TableBody>
// 							</Table>
// 						</TableContainer>
// 					)}

// 					{/* Delete Confirmation Dialog */}
// 					<Dialog
// 						open={deleteDialogOpen}
// 						onClose={() => setDeleteDialogOpen(false)}
// 						PaperProps={{
// 							sx: { borderRadius: 2 }
// 						}}
// 					>
// 						<DialogTitle sx={{ backgroundColor: 'error.light', color: 'white' }}>
// 							Confirm Delete
// 						</DialogTitle>
// 						<DialogContent sx={{ p: 3 }}>
// 							<Typography>
// 								Are you sure you want to delete user: <strong>{userToDelete?.email}</strong>?
// 								<br />
// 								This action cannot be undone.
// 							</Typography>
// 						</DialogContent>
// 						<DialogActions sx={{ p: 2 }}>
// 							<Button
// 								onClick={() => setDeleteDialogOpen(false)}
// 								variant="outlined"
// 								sx={{ mr: 1 }}
// 							>
// 								Cancel
// 							</Button>
// 							<Button
// 								onClick={handleDeleteConfirm}
// 								color="error"
// 								variant="contained"
// 								sx={{ boxShadow: 'none' }}
// 							>
// 								Delete
// 							</Button>
// 						</DialogActions>
// 					</Dialog>

// 					{/* Edit User Dialog */}
// 					<Dialog
// 						open={editDialogOpen}
// 						onClose={() => setEditDialogOpen(false)}
// 						maxWidth="sm"
// 						fullWidth
// 						PaperProps={{
// 							sx: { borderRadius: 2 }
// 						}}
// 					>
// 						<DialogTitle sx={{
// 							backgroundColor: 'primary.main',
// 							color: 'white',
// 							fontWeight: 'bold'
// 						}}>
// 							Edit User
// 						</DialogTitle>
// 						<DialogContent sx={{ p: 3 }}>
// 							{currentUser && (
// 								<Box sx={{ mt: 2 }}>
// 									<TextField
// 										label="Name"
// 										fullWidth
// 										value={currentUser.name}
// 										onChange={(e) => setCurrentUser({
// 											...currentUser,
// 											name: e.target.value
// 										})}
// 										margin="normal"
// 										variant="outlined"
// 									/>
// 									<TextField
// 										label="Email"
// 										fullWidth
// 										value={currentUser.email}
// 										disabled
// 										margin="normal"
// 										variant="outlined"
// 									/>
// 									<FormControl fullWidth margin="normal" variant="outlined">
// 										<InputLabel>Role</InputLabel>
// 										<Select
// 											value={currentUser.role}
// 											onChange={handleRoleChange}
// 											label="Role"
// 										>
// 											<MenuItem value="admin">Admin</MenuItem>
// 											<MenuItem value="organiser">Organiser</MenuItem>
// 											<MenuItem value="customer">Customer</MenuItem>
// 										</Select>
// 									</FormControl>
// 									<FormControl fullWidth margin="normal" variant="outlined">
// 										<InputLabel>Profile Visibility</InputLabel>
// 										<Select
// 											value={currentUser.profile_visibility}
// 											onChange={handleVisibilityChange}
// 											label="Profile Visibility"
// 										>
// 											<MenuItem value="public">Public</MenuItem>
// 											<MenuItem value="private">Private</MenuItem>
// 										</Select>
// 									</FormControl>
// 								</Box>
// 							)}
// 						</DialogContent>
// 						<DialogActions sx={{ p: 2 }}>
// 							<Button
// 								onClick={() => setEditDialogOpen(false)}
// 								variant="outlined"
// 								sx={{ mr: 1 }}
// 							>
// 								Cancel
// 							</Button>
// 							<Button
// 								onClick={handleEditSave}
// 								variant="contained"
// 								color="primary"
// 								sx={{ boxShadow: 'none' }}
// 							>
// 								Save Changes
// 							</Button>
// 						</DialogActions>
// 					</Dialog>

// 					{/* Add User Dialog */}
// 					<Dialog
// 						open={addDialogOpen}
// 						onClose={() => setAddDialogOpen(false)}
// 						maxWidth="sm"
// 						fullWidth
// 						PaperProps={{
// 							sx: { borderRadius: 2 }
// 						}}
// 					>
// 						<DialogTitle sx={{
// 							backgroundColor: 'success.main',
// 							color: 'white',
// 							fontWeight: 'bold'
// 						}}>
// 							Add New User
// 						</DialogTitle>
// 						<DialogContent sx={{ p: 3 }}>
// 							<Box sx={{ mt: 2 }}>
// 								<TextField
// 									label="Name"
// 									fullWidth
// 									name="name"
// 									value={newUser.name}
// 									onChange={handleNewUserChange}
// 									margin="normal"
// 									variant="outlined"
// 									required
// 								/>
// 								<TextField
// 									label="Email"
// 									fullWidth
// 									name="email"
// 									type="email"
// 									value={newUser.email}
// 									onChange={handleNewUserChange}
// 									margin="normal"
// 									variant="outlined"
// 									required
// 								/>
// 								<TextField
// 									label="Password"
// 									fullWidth
// 									name="password"
// 									type="password"
// 									value={newUser.password}
// 									onChange={handleNewUserChange}
// 									margin="normal"
// 									variant="outlined"
// 									required
// 								/>
// 								<FormControl fullWidth margin="normal" variant="outlined">
// 									<InputLabel>Role</InputLabel>
// 									<Select
// 										name="role"
// 										value={newUser.role}
// 										onChange={handleNewUserChange}
// 										label="Role"
// 									>
// 										<MenuItem value="admin">Admin</MenuItem>
// 										<MenuItem value="organiser">Organiser</MenuItem>
// 										<MenuItem value="customer">Customer</MenuItem>
// 									</Select>
// 								</FormControl>
// 								<FormControl fullWidth margin="normal" variant="outlined">
// 									<InputLabel>Profile Visibility</InputLabel>
// 									<Select
// 										name="profile_visibility"
// 										value={newUser.profile_visibility}
// 										onChange={handleNewUserChange}
// 										label="Profile Visibility"
// 									>
// 										<MenuItem value="public">Public</MenuItem>
// 										<MenuItem value="private">Private</MenuItem>
// 									</Select>
// 								</FormControl>
// 							</Box>
// 						</DialogContent>
// 						<DialogActions sx={{ p: 2 }}>
// 							<Button
// 								onClick={() => setAddDialogOpen(false)}
// 								variant="outlined"
// 								sx={{ mr: 1 }}
// 							>
// 								Cancel
// 							</Button>
// 							<Button
// 								onClick={handleAddSave}
// 								variant="contained"
// 								color="success"
// 								sx={{ boxShadow: 'none' }}
// 								disabled={!newUser.name || !newUser.email || !newUser.password}
// 							>
// 								Create User
// 							</Button>
// 						</DialogActions>
// 					</Dialog>

// 					{/* Snackbar for notifications */}
// 					<Snackbar
// 						open={snackbar.open}
// 						autoHideDuration={6000}
// 						onClose={handleSnackbarClose}
// 						anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
// 					>
// 						<Alert
// 							onClose={handleSnackbarClose}
// 							severity={snackbar.severity}
// 							sx={{ width: '100%' }}
// 							variant="filled"
// 						>
// 							{snackbar.message}
// 						</Alert>
// 					</Snackbar>
// 				</Box>
// 			</Box>
// 		</Box>
// 	);
// };

// export default UserManagement;