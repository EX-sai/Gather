import React, { useState } from 'react';
import Cookies from 'js-cookie';
import {
	Box,
	Typography,
	IconButton,
	Avatar,
	Divider,
	Menu,
	MenuItem,
	useTheme,
	alpha,
	Badge,
	Tooltip,
	ListItemIcon,
	ListItemText,
	Card,
} from '@mui/material';
import {
	CalendarMonth as CalendarIcon,
	Person as PersonIcon,
	Menu as MenuIcon,
	Logout as LogoutIcon,
	NotificationsOutlined as NotificationsIcon,
	Settings as SettingsIcon,
	DarkMode as DarkModeIcon,
	LightMode as LightModeIcon,
	Help as HelpIcon,
	AccountCircle as AccountIcon
} from "@mui/icons-material";
import { motion } from 'framer-motion';


const AdminHeader = ({ toggleSidebar }) => {
	const theme = useTheme();
	const [anchorEl, setAnchorEl] = useState(null);
	const [notifications] = useState([
		{ id: 1, text: 'New user registered', time: '2 hours ago' },
		{ id: 2, text: 'Event approval needed', time: '5 hours ago' }
	]);

	const handleMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = () => {
		// Remove authentication cookies with explicit options
		Cookies.remove("authToken", { path: "/", domain: window.location.hostname });

		// Clear all cookies
		document.cookie.split(";").forEach(cookie => {
			const [name] = cookie.split("=");
			document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
		});

		// Clear localStorage and sessionStorage
		localStorage.clear();
		sessionStorage.clear();

		// Force reload to ensure complete logout
		window.location.href = "/signin";
	};

	return (
		<Box
			sx={{
				height: 72,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				px: 3,
				backgroundColor: alpha(theme.palette.background.paper, 0.8),
				backdropFilter: 'blur(8px)',
				boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
				zIndex: 1200,
				position: 'sticky',
				top: 0
			}}
		>
			<Box sx={{ display: 'flex', alignItems: 'center' }}>
				<Tooltip title="Toggle sidebar">
					<IconButton
						onClick={toggleSidebar}
						sx={{
							mr: 2,
							color: theme.palette.text.primary,
							'&:hover': {
								backgroundColor: alpha(theme.palette.primary.main, 0.1)
							}
						}}
					>
						<MenuIcon />
					</IconButton>
				</Tooltip>
				<Typography variant="h6" fontWeight="bold" color="primary">
					Admin Panel
				</Typography>
			</Box>

			<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
				<Tooltip title="Notifications">
					<IconButton
						sx={{
							backgroundColor: alpha(theme.palette.primary.main, 0.05),
							color: theme.palette.primary.main,
							'&:hover': {
								backgroundColor: alpha(theme.palette.primary.main, 0.15)
							}
						}}
					>
						<Badge badgeContent={notifications.length} color="error">
							<NotificationsIcon />
						</Badge>
					</IconButton>
				</Tooltip>

				<Tooltip title="Account settings">
					<IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
						<motion.div whileHover={{ scale: 1.05 }}>
							<Avatar
								sx={{
									width: 40,
									height: 40,
									backgroundColor: theme.palette.primary.main,
									'&:hover': {
										boxShadow: `0 0 0 2px ${theme.palette.primary.light}`
									}
								}}
							>
								A
							</Avatar>
						</motion.div>
					</IconButton>
				</Tooltip>

				<Menu
					anchorEl={anchorEl}
					open={Boolean(anchorEl)}
					onClose={handleMenuClose}
					PaperProps={{
						elevation: 3,
						sx: {
							mt: 1.5,
							minWidth: 200,
							borderRadius: 2,
							boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
							'& .MuiMenuItem-root': {
								px: 2,
								py: 1,
								typography: 'body2',
								'&:hover': {
									backgroundColor: alpha(theme.palette.primary.main, 0.08)
								}
							}
						}
					}}
					transformOrigin={{ horizontal: 'right', vertical: 'top' }}
					anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
				>
					
					<MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
						<ListItemIcon>
							<LogoutIcon fontSize="small" color="error" />
						</ListItemIcon>
						<ListItemText primary="Logout" />
					</MenuItem>
				</Menu>
			</Box>
		</Box>
	);
};

export default AdminHeader;