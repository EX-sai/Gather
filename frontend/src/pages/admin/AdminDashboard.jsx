import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, Typography, useTheme, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
	People as UsersIcon,
	Event as EventIcon,
	TrendingUp as TrendingUpIcon,
	Receipt as TransactionsIcon
} from '@mui/icons-material';
import axios from 'axios';
import AdminHeader from './Header';
import Sidebar from './Sidebar';
import StatCard from './StatCard'; // New component (see below)
import RecentActivity from './RecentActivity'; // New component (see below)
import {
	ResponsiveContainer,
	LineChart,
	Line,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip
} from 'recharts';



// Animation variants
const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1
		}
	}
};

const itemVariants = {
	hidden: { y: 20, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
		transition: {
			type: "spring",
			stiffness: 100
		}
	}
};

const AdminDashboard = () => {
	const theme = useTheme();
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [loading, setLoading] = useState(true);
	const [dashboardData, setDashboardData] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				const token = localStorage.getItem('token');
				const response = await axios.get('http://localhost:3000/api/admin/dashboard', {
					headers: { Authorization: `Bearer ${token}` }
				});
				setDashboardData(response.data);
			} catch (err) {
				setError(err.response?.data?.message || 'Failed to load dashboard data');
			} finally {
				setLoading(false);
			}
		};

		fetchDashboardData();
	}, []);

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	if (loading) {
		return (
			<Box
				sx={{
					position: 'fixed',
					top: 0,
					left: 0,
					width: '100vw',
					height: '100vh',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					bgcolor: 'rgba(245,247,250,0.85)',
					zIndex: 2000
				}}
			>
				<CircularProgress size={60} />
			</Box>
		);
	}

	if (error) {
		return (
			<Box sx={{ p: 3 }}>
				<Typography color="error">{error}</Typography>
			</Box>
		);
	}

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
					<motion.div
						initial="hidden"
						animate="visible"
						variants={containerVariants}
					>
						<Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
							Dashboard Overview
						</Typography>

						{/* Stats Grid */}
						<Grid container spacing={3} sx={{ mb: 4 }}>
							<Grid item xs={12} sm={6} md={3}>
								<motion.div variants={itemVariants}>
									<StatCard
										title="Total Users"
										value={dashboardData?.totalUsers || 0}
										icon={<UsersIcon />}
										trend="up"
										change={dashboardData?.userGrowthPercentage || 0}
										color="primary"
									/>
								</motion.div>
							</Grid>
							<Grid item xs={12} sm={6} md={3}>
								<motion.div variants={itemVariants}>
									<StatCard
										title="Active Events"
										value={dashboardData?.activeEvents || 0}
										icon={<EventIcon />}
										trend={dashboardData?.eventTrend || 'neutral'}
										change={dashboardData?.eventChangePercentage || 0}
										color="secondary"
									/>
								</motion.div>
							</Grid>
							<Grid item xs={12} sm={6} md={3}>
								<motion.div variants={itemVariants}>
									<StatCard
										title="Revenue"
										value={`$${(dashboardData?.revenue || 0).toLocaleString()}`}
										icon={<TrendingUpIcon />}
										trend={dashboardData?.revenueTrend || 'neutral'}
										change={dashboardData?.revenueGrowthPercentage || 0}
										color="success"
									/>
								</motion.div>
							</Grid>
							<Grid item xs={12} sm={6} md={3}>
								<motion.div variants={itemVariants}>
									<StatCard
										title="Transactions"
										value={dashboardData?.transactions || 0}
										icon={<TransactionsIcon />}
										trend={dashboardData?.transactionTrend || 'neutral'}
										change={dashboardData?.transactionGrowthPercentage || 0}
										color="warning"
									/>
								</motion.div>
							</Grid>
						</Grid>

						{/* Recent Activity Section */}
						<motion.div variants={itemVariants}>
							<Card
								component={motion.div}
								whileHover={{ y: -2 }}
								sx={{
									borderRadius: 4,
									boxShadow: theme.shadows[3],
									mb: 4
								}}
							>
								<RecentActivity activities={dashboardData?.recentActivities || []} />
							</Card>
						</motion.div>

						{/* Additional Sections */}
						<Grid container spacing={3}>
							<Grid item xs={12} md={6}>
								<motion.div variants={itemVariants}>
									<Card
										component={motion.div}
										whileHover={{ y: -2 }}
										sx={{
											borderRadius: 4,
											boxShadow: theme.shadows[3],
											p: 3,
											height: '100%'
										}}
									>
										<Grid item xs={12} md={6}>
											<motion.div variants={itemVariants}>
												<Card
													component={motion.div}
													whileHover={{ y: -2 }}
													sx={{
														borderRadius: 4,
														boxShadow: theme.shadows[3],
														p: 3,
														height: '100%'
													}}
												>
													<Typography variant="h6" sx={{ mb: 2 }}>User Growth (Last 7 Days)</Typography>
													<ResponsiveContainer width="100%" height={200}>
														<LineChart data={dashboardData.userGrowthData}>
															<XAxis dataKey="date" />
															<YAxis />
															<Tooltip />
															<Line type="monotone" dataKey="count" stroke="#8884d8" />
														</LineChart>
													</ResponsiveContainer>
												</Card>
											</motion.div>
										</Grid>
									</Card>
								</motion.div>
							</Grid>
							<Grid item xs={12} md={6}>
								<motion.div variants={itemVariants}>
									<Card
										component={motion.div}
										whileHover={{ y: -2 }}
										sx={{
											borderRadius: 4,
											boxShadow: theme.shadows[3],
											p: 3,
											height: '100%'
										}}
									>
										<Grid item xs={12} md={6}>
											<motion.div variants={itemVariants}>
												<Card
													component={motion.div}
													whileHover={{ y: -2 }}
													sx={{
														borderRadius: 4,
														boxShadow: theme.shadows[3],
														p: 3,
														height: '100%'
													}}
												>
													<Typography variant="h6" sx={{ mb: 2 }}>Top 5 Events by Registration</Typography>
													<ResponsiveContainer width="100%" height={200}>
														<BarChart data={dashboardData.eventPopularityData}>
															<XAxis dataKey="title" />
															<YAxis />
															<Tooltip />
															<Bar dataKey="count" />
														</BarChart>
													</ResponsiveContainer>
												</Card>
											</motion.div>
										</Grid>
									</Card>
								</motion.div>
							</Grid>
						</Grid>
					</motion.div>
				</Box>
			</Box>
		</Box>
	);
};

export default AdminDashboard;