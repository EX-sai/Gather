// components/EventDashboard/Header.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
	Box,
	Typography,
	IconButton,
	Tooltip,
	Button,
	Avatar,
	useTheme,
	useMediaQuery,
	Badge,
	Menu,
	MenuItem,
	Fade,
	Divider,
	ListItemIcon,
	ListItemText
} from "@mui/material";
import {
	CalendarMonth as CalendarIcon,
	Person as PersonIcon,
	Menu as MenuIcon,
	Logout as LogoutIcon,
	NotificationsOutlined as NotificationIcon,
	Settings as SettingsIcon,
	DarkMode as DarkModeIcon,
	LightMode as LightModeIcon,
	Help as HelpIcon,
	AccountCircle as AccountIcon
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Cookies from "js-cookie";

const MotionBox = motion.create(Box);
const MotionIconButton = motion.create(IconButton);
const MotionAvatar = motion.create(Avatar);
const MotionBadge = motion.create(Badge);

const Header = ({ sidebarOpen, toggleSidebar, toggleTheme, darkMode }) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const [scrolled, setScrolled] = useState(false);
	const [notificationAnchor, setNotificationAnchor] = useState(null);
	const [profileAnchor, setProfileAnchor] = useState(null);

	// Track scroll position for header effects
	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 10);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

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

	// Handle notification menu
	const handleNotificationClick = (event) => {
		setNotificationAnchor(event.currentTarget);
	};

	const handleNotificationClose = () => {
		setNotificationAnchor(null);
	};

	// Handle profile menu
	const handleProfileClick = (event) => {
		setProfileAnchor(event.currentTarget);
	};

	const handleProfileClose = () => {
		setProfileAnchor(null);
	};

	// Animation variants
	const headerVariants = {
		normal: {
			boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
			backdropFilter: 'blur(8px)',
			height: '70px'
		},
		scrolled: {
			boxShadow: '0 6px 25px rgba(0, 0, 0, 0.12)',
			backdropFilter: 'blur(12px)',
			height: '60px'
		}
	};

	const buttonVariants = {
		hover: { scale: 1.05, y: -2 },
		tap: { scale: 0.98 }
	};

	return (
		<MotionBox
			initial="normal"
			animate={scrolled ? "scrolled" : "normal"}
			variants={headerVariants}
			transition={{ type: "spring", stiffness: 300, damping: 30 }}
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				px: { xs: 2, md: 3 },
				py: 1.5,
				borderBottom: "1px solid",
				borderColor: theme => theme.palette.mode === 'dark'
					? 'rgba(255, 255, 255, 0.08)'
					: 'rgba(0, 0, 0, 0.04)',
				bgcolor: theme => theme.palette.mode === 'dark'
					? 'rgba(18, 18, 20, 0.85)'
					: 'rgba(255, 255, 255, 0.85)',
				backdropFilter: "blur(12px)",
				zIndex: 1100,
				position: "sticky",
				top: 0,
				transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
			}}
		>
			<Box sx={{ display: "flex", alignItems: "center" }}>
				<MotionIconButton
					onClick={toggleSidebar}
					whileHover={buttonVariants.hover}
					whileTap={buttonVariants.tap}
					transition={{ type: "spring", stiffness: 400, damping: 17 }}
					sx={{
						mr: 2,
						color: "primary.main",
						borderRadius: "12px",
						background: theme => theme.palette.mode === 'dark'
							? 'rgba(144, 202, 249, 0.08)'
							: 'rgba(25, 118, 210, 0.04)',
						"&:hover": {
							background: theme => theme.palette.mode === 'dark'
								? 'rgba(144, 202, 249, 0.15)'
								: 'rgba(25, 118, 210, 0.1)',
						}
					}}
					aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
				>
					<MenuIcon />
				</MotionIconButton>

				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.1, duration: 0.5 }}
				>
					<Typography
						variant="h5"
						component="h1"
						fontWeight="700"
						sx={{
							fontSize: { xs: '1.2rem', sm: '1.5rem' },
							background: theme => theme.palette.mode === 'dark'
								? "linear-gradient(90deg, #90CAF9, #42A5F5)"
								: "linear-gradient(90deg, #1976d2, #42A5F5)",
							backgroundSize: "200% 200%",
							animation: "gradient 8s ease infinite",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
							letterSpacing: "-0.5px",
							"@keyframes gradient": {
								"0%": { backgroundPosition: "0% 50%" },
								"50%": { backgroundPosition: "100% 50%" },
								"100%": { backgroundPosition: "0% 50%" }
							}
						}}
					>
						Gather
					</Typography>
				</motion.div>
			</Box>

			<Box sx={{ display: "flex", gap: { xs: 1.5, sm: 2 }, alignItems: "center" }}>
				{/* <MotionIconButton
					aria-label="notifications"
					aria-controls="notification-menu"
					aria-haspopup="true"
					onClick={handleNotificationClick}
					whileHover={buttonVariants.hover}
					whileTap={buttonVariants.tap}
					transition={{ type: "spring", stiffness: 400, damping: 17 }}
					sx={{
						bgcolor: theme => theme.palette.mode === 'dark'
							? 'rgba(144, 202, 249, 0.08)'
							: 'rgba(25, 118, 210, 0.04)',
						color: "primary.main",
						borderRadius: "14px",
						width: 40,
						height: 40,
						display: { xs: 'none', sm: 'flex' },
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					<Tooltip title="Notifications" arrow>
						<MotionBadge
							badgeContent={3}
							color="error"
							initial={{ scale: 0.8 }}
							animate={{ scale: 1 }}
							transition={{ type: "spring", stiffness: 400, damping: 10 }}
						>
							<NotificationIcon fontSize="small" />
						</MotionBadge>
					</Tooltip>
				</MotionIconButton>

				<Menu
					id="notification-menu"
					anchorEl={notificationAnchor}
					keepMounted
					open={Boolean(notificationAnchor)}
					onClose={handleNotificationClose}
					TransitionComponent={Fade}
					PaperProps={{
						elevation: 3,
						sx: {
							mt: 1.5,
							borderRadius: '16px',
							minWidth: '320px',
							overflow: 'visible',
							filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.12))',
							bgcolor: theme => theme.palette.mode === 'dark' ? '#1E1E24' : '#fff',
							'&:before': {
								content: '""',
								display: 'block',
								position: 'absolute',
								top: 0,
								right: 14,
								width: 10,
								height: 10,
								bgcolor: theme => theme.palette.mode === 'dark' ? '#1E1E24' : '#fff',
								transform: 'translateY(-50%) rotate(45deg)',
								zIndex: 0,
							},
						},
					}}
					transformOrigin={{ horizontal: 'right', vertical: 'top' }}
					anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
				>
					<Typography sx={{ p: 2, fontWeight: 600 }}>Notifications</Typography>
					<Divider />
					<MenuItem onClick={handleNotificationClose} sx={{ py: 1.5 }}>
						<ListItemText
							primary="New event registration"
							secondary="3 minutes ago"
							primaryTypographyProps={{ fontWeight: 500 }}
							secondaryTypographyProps={{ fontSize: '0.75rem' }}
						/>
					</MenuItem>
					<MenuItem onClick={handleNotificationClose} sx={{ py: 1.5 }}>
						<ListItemText
							primary="Payment confirmed"
							secondary="2 hours ago"
							primaryTypographyProps={{ fontWeight: 500 }}
							secondaryTypographyProps={{ fontSize: '0.75rem' }}
						/>
					</MenuItem>
					<MenuItem onClick={handleNotificationClose} sx={{ py: 1.5 }}>
						<ListItemText
							primary="Event capacity reached"
							secondary="1 day ago"
							primaryTypographyProps={{ fontWeight: 500 }}
							secondaryTypographyProps={{ fontSize: '0.75rem' }}
						/>
					</MenuItem>
					<Divider />
					<MenuItem sx={{ justifyContent: 'center', color: 'primary.main', py: 1.5 }}>
						View all notifications
					</MenuItem>
				</Menu> */}

				<MotionAvatar
					onClick={handleProfileClick}
					whileHover={buttonVariants.hover}
					whileTap={buttonVariants.tap}
					transition={{ type: "spring", stiffness: 400, damping: 17 }}
					sx={{
						width: 40,
						height: 40,
						bgcolor: "primary.main",
						cursor: 'pointer',
						boxShadow: "0 4px 12px rgba(25, 118, 210, 0.25)",
						border: '2px solid',
						borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.2)' : '#fff',
					}}
				>
					<Tooltip title="Profile" arrow>
						<PersonIcon fontSize="small" />
					</Tooltip>
				</MotionAvatar>

				<Menu
					id="profile-menu"
					anchorEl={profileAnchor}
					keepMounted
					open={Boolean(profileAnchor)}
					onClose={handleProfileClose}
					TransitionComponent={Fade}
					PaperProps={{
						elevation: 3,
						sx: {
							mt: 1.5,
							borderRadius: '16px',
							minWidth: '200px',
							overflow: 'visible',
							filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.12))',
							bgcolor: theme => theme.palette.mode === 'dark' ? '#1E1E24' : '#fff',
							'&:before': {
								content: '""',
								display: 'block',
								position: 'absolute',
								top: 0,
								right: 14,
								width: 10,
								height: 10,
								bgcolor: theme => theme.palette.mode === 'dark' ? '#1E1E24' : '#fff',
								transform: 'translateY(-50%) rotate(45deg)',
								zIndex: 0,
							},
						},
					}}
					transformOrigin={{ horizontal: 'right', vertical: 'top' }}
					anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
				>
					{/* <MenuItem onClick={() => { handleProfileClose(); window.location.href = "/profile"; }}>
						<ListItemIcon>
							<AccountIcon fontSize="small" color="primary" />
						</ListItemIcon>
						<ListItemText primary="My Profile" />
					</MenuItem> */}
					{/* <MenuItem onClick={handleProfileClose}>
						<ListItemIcon>
							<SettingsIcon fontSize="small" color="primary" />
						</ListItemIcon>
						<ListItemText primary="Settings" />
					</MenuItem> */}
					{/* <Divider /> */}
					<MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
						<ListItemIcon>
							<LogoutIcon fontSize="small" color="error" />
						</ListItemIcon>
						<ListItemText primary="Logout" />
					</MenuItem>
				</Menu>

			</Box>
		</MotionBox>
	);
};

export default Header;