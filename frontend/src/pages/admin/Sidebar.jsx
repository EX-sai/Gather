import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
	Box, Divider, List, ListItem, ListItemButton,
	ListItemIcon, ListItemText, useTheme, alpha, Typography, 
} from '@mui/material';
import {
	Dashboard as DashboardIcon,
	People as UsersIcon,
	Event as EventsIcon,
	Settings as SettingsIcon,
	ChevronRight
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Sidebar = ({ sidebarOpen }) => {
	const theme = useTheme();
	const { pathname } = useLocation();

	const menuItems = [
		{ path: '/dashboard/home', name: 'Dashboard', icon: <DashboardIcon /> },
		{ path: '/dashboard/home/users', name: 'Users', icon: <UsersIcon /> },
		{ path: '/dashboard/home/events', name: 'Events', icon: <EventsIcon /> },
		{ path: '/dashboard/home/settings', name: 'Settings', icon: <SettingsIcon /> }
	];

	return (
		<Box
			component={motion.div}
			initial={{ width: 72 }}
			animate={{ width: sidebarOpen ? 240 : 72 }}
			transition={{ type: 'spring', stiffness: 400, damping: 35 }}
			sx={{
				height: '100vh',
				backgroundColor: theme.palette.background.paper,
				borderRight: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
				position: 'sticky',
				top: 0,
				flexShrink: 0,
				overflow: 'hidden',
				zIndex: 100
			}}
		>
			{/* Removed redundant title */}

			<List sx={{ p: 1 }}>
				{menuItems.map((item) => {
					const isActive = pathname === item.path;
					return (
						<ListItem key={item.path} disablePadding>
							<NavLink
								to={item.path}
								style={{
									width: '100%',
									textDecoration: 'none',
									color: isActive
										? theme.palette.primary.main
										: theme.palette.text.secondary
								}}
							>
								<ListItemButton
									component={motion.div}
									whileHover={{
										backgroundColor: alpha(theme.palette.primary.main, 0.08)
									}}
									sx={{
										borderRadius: 2,
										mb: 0.5,
										backgroundColor: isActive
											? alpha(theme.palette.primary.main, 0.1)
											: 'transparent',
										minHeight: 48,
										justifyContent: sidebarOpen ? 'initial' : 'center',
										px: 2.5
									}}
								>
									<ListItemIcon
										sx={{
											minWidth: 0,
											mr: sidebarOpen ? 2 : 'auto',
											color: 'inherit',
											justifyContent: 'center'
										}}
									>
										{item.icon}
									</ListItemIcon>
									{sidebarOpen && (
										<>
											<ListItemText
												primary={item.name}
												primaryTypographyProps={{
													fontWeight: isActive ? 600 : 400,
													fontSize: '0.875rem'
												}}
											/>
											{isActive && (
												<ChevronRight
													sx={{
														ml: 1,
														color: 'inherit',
														opacity: 0.8
													}}
												/>
											)}
										</>
									)}
								</ListItemButton>
							</NavLink>
						</ListItem>
					);
				})}
			</List>

			<Divider sx={{ borderColor: alpha(theme.palette.divider, 0.08) }} />

			{/* Profile Section - Only visible when expanded */}
			{sidebarOpen && (
				<Box
					component={motion.div}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					sx={{
						p: 2,
						display: 'flex',
						alignItems: 'center',
						position: 'absolute',
						bottom: 0,
						width: '100%'
					}}
				>
					<Box
						sx={{
							width: 36,
							height: 36,
							borderRadius: '50%',
							bgcolor: alpha(theme.palette.primary.main, 0.1),
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							mr: 2,
							color: theme.palette.primary.main
						}}
					>
						A
					</Box>
					<Box>
						<Typography variant="subtitle2" fontSize="0.8rem">
							Admin User
						</Typography>
						<Typography variant="caption" color="text.secondary">
							admin@example.com
						</Typography>
					</Box>
				</Box>
			)}
		</Box>
	);
};

export default Sidebar;