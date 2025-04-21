// components/EventDashboard/AnalyticsChart.jsx
import React, { useState } from 'react';
import {
	Box,
	Typography,
	Card,
	FormControl,
	Select,
	MenuItem,
	useTheme,
	alpha,
	Button,
	Chip,
	Stack,
	Divider,
	IconButton,
} from "@mui/material";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip as RechartsTooltip,
	Legend,
	ResponsiveContainer,
	Area,
	ComposedChart,
} from "recharts";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DownloadIcon from '@mui/icons-material/Download';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
	if (active && payload && payload.length) {
		return (
			<Card
				sx={{
					boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
					border: 'none',
					borderRadius: 2,
					p: 2,
					backgroundColor: 'rgba(255, 255, 255, 0.98)',
					backdropFilter: 'blur(10px)',
					minWidth: 180,
				}}
			>
				<Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
					{label}
				</Typography>
				<Divider sx={{ my: 1 }} />
				{payload.map((entry, index) => {
					// Fix redundant labels - just use the dataKey directly
					const metricName = entry.dataKey.charAt(0).toUpperCase() + entry.dataKey.slice(1);

					return (
						<Box key={`tooltip-${index}`} sx={{ display: 'flex', justifyContent: 'space-between', my: 0.5, alignItems: 'center' }}>
							<Box sx={{ display: 'flex', alignItems: 'center' }}>
								<Box
									sx={{
										width: 10,
										height: 10,
										borderRadius: '50%',
										backgroundColor: entry.color,
										mr: 1,
									}}
								/>
								<Typography variant="body2" sx={{ color: 'text.secondary' }}>
									{metricName}:
								</Typography>
							</Box>
							<Typography variant="body2" sx={{ fontWeight: 600, ml: 2 }}>
								{entry.dataKey === 'revenue' ? `${entry.value.toLocaleString()}` : entry.value.toLocaleString()}
							</Typography>
						</Box>
					);
				})}
			</Card>
		);
	}
	return null;
};

// Custom legend component
const CustomLegend = ({ payload }) => {
	return (
		<Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: 'center' }}>
			{payload.map((entry, index) => (
				<Box key={`legend-${index}`} sx={{ display: 'flex', alignItems: 'center' }}>
					<Box
						sx={{
							width: 12,
							height: 12,
							borderRadius: '50%',
							backgroundColor: entry.color,
							mr: 1,
						}}
					/>
					<Typography variant="body2" sx={{ fontWeight: 500 }}>
						{entry.value}
					</Typography>
				</Box>
			))}
		</Stack>
	);
};

const AnalyticsChart = ({ cardStyle, timeRange, handleTimeRangeChange, chartData }) => {
	const theme = useTheme();

	// Calculate dynamic stats from the chart data
	const calcStats = () => {
		if (!chartData || chartData.length === 0) return [
			{ label: 'Total Registrations', value: 0, change: 0, up: false },
			{ label: 'Total Revenue', value: '$0', change: 0, up: false },
		];

		// Calculate total registrations and revenue
		const totalRegistrations = chartData.reduce((sum, item) => sum + (item.registrations || 0), 0);
		const totalRevenue = chartData.reduce((sum, item) => sum + (item.revenue || 0), 0);

		// Calculate percent change (using last two data points)
		const lastIdx = chartData.length - 1;
		const prevIdx = Math.max(0, lastIdx - 1);

		const regChange = lastIdx > 0 ?
			((chartData[lastIdx].registrations - chartData[prevIdx].registrations) / chartData[prevIdx].registrations) * 100 : 0;
		const revChange = lastIdx > 0 ?
			((chartData[lastIdx].revenue - chartData[prevIdx].revenue) / chartData[prevIdx].revenue) * 100 : 0;

		return [
			{
				label: 'Total Registrations',
				value: totalRegistrations,
				change: Math.abs(regChange).toFixed(1),
				up: regChange >= 0
			},
			{
				label: 'Total Revenue',
				value: `${totalRevenue.toLocaleString()}`,
				change: Math.abs(revChange).toFixed(1),
				up: revChange >= 0
			},
		];
	};

	const stats = calcStats();

	return (
		<Card
			elevation={0}
			sx={{
				...cardStyle,
				borderRadius: 3,
				p: 3,
				background: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.8) : alpha(theme.palette.background.paper, 1),
				backdropFilter: 'blur(8px)',
				border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
			}}
		>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mb: 3,
				}}
			>
				<Box>
					<Typography
						variant="h5"
						component="h2"
						fontWeight={700}
						color="text.primary"
						sx={{ mb: 0.5 }}
					>
						Event Analytics
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Performance overview
					</Typography>
				</Box>

				<Box sx={{ display: 'flex', gap: 1 }}>
					<Button
						startIcon={<CalendarTodayOutlinedIcon />}
						variant="outlined"
						sx={{
							borderRadius: 2,
							textTransform: 'none',
							borderColor: alpha(theme.palette.primary.main, 0.2),
							'&:hover': {
								borderColor: theme.palette.primary.main,
								backgroundColor: alpha(theme.palette.primary.main, 0.04),
							},
						}}
						onClick={() => { }}
					>
						Export
					</Button>

					<FormControl size="small">
						<Select
							value={timeRange}
							onChange={handleTimeRangeChange}
							displayEmpty
							sx={{
								borderRadius: 2,
								minWidth: 150,
								backgroundColor: alpha(theme.palette.background.paper, 0.6),
								fontWeight: 500,
								"& .MuiOutlinedInput-notchedOutline": {
									borderColor: alpha(theme.palette.divider, 0.15),
								},
								"& .MuiSvgIcon-root": {
									color: theme.palette.text.secondary,
								},
							}}
						>
							<MenuItem value="7">Last 7 days</MenuItem>
							<MenuItem value="30">Last 30 days</MenuItem>
							<MenuItem value="90">Last 90 days</MenuItem>
							<MenuItem value="365">Last year</MenuItem>
						</Select>
					</FormControl>

					<IconButton size="small" sx={{ ml: 0.5 }}>
						<MoreHorizIcon />
					</IconButton>
				</Box>
			</Box>

			{/* Stats summary */}
			<Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
				{stats.map((stat, index) => (
					<Card
						key={`stat-${index}`}
						elevation={0}
						sx={{
							p: 2,
							flex: 1,
							borderRadius: 2,
							border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
							background: alpha(theme.palette.background.paper, 0.5),
						}}
					>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
							{stat.label}
						</Typography>
						<Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
							<Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
								{stat.value}
							</Typography>
							<Chip
								icon={stat.up ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
								label={`${stat.change}%`}
								size="small"
								color={stat.up ? "success" : "error"}
								sx={{
									fontWeight: 600,
									backgroundColor: stat.up ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
									color: stat.up ? theme.palette.success.main : theme.palette.error.main,
									'.MuiChip-icon': {
										color: 'inherit',
									}
								}}
							/>
						</Box>
					</Card>
				))}
			</Box>

			{/* Chart */}
			<Box sx={{ height: 360 }}>
				<ResponsiveContainer width="100%" height="100%">
					<ComposedChart
						data={chartData}
						margin={{
							top: 10,
							right: 30,
							left: 10,
							bottom: 10,
						}}
					>
						<defs>
							<linearGradient id="registrationsGradient" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.1} />
								<stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
							</linearGradient>
							<linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.1} />
								<stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0} />
							</linearGradient>
						</defs>
						<CartesianGrid
							strokeDasharray="3 3"
							vertical={false}
							stroke={alpha(theme.palette.divider, 0.08)}
						/>
						<XAxis
							dataKey="name"
							axisLine={false}
							tickLine={false}
							tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
							dy={10}
						/>
						<YAxis
							axisLine={false}
							tickLine={false}
							tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
							dx={-10}
						/>
						<RechartsTooltip content={<CustomTooltip />} />
						<Legend content={<CustomLegend />} />

						<Area
							type="monotone"
							dataKey="registrations"
							stroke={theme.palette.primary.main}
							fillOpacity={1}
							fill="url(#registrationsGradient)"
							strokeWidth={0}
						/>
						<Area
							type="monotone"
							dataKey="revenue"
							stroke={theme.palette.success.main}
							fillOpacity={1}
							fill="url(#revenueGradient)"
							strokeWidth={0}
						/>

						<Line
							type="monotone"
							dataKey="registrations"
							stroke={theme.palette.primary.main}
							strokeWidth={3}
							dot={{
								r: 0,
								strokeWidth: 0,
							}}
							activeDot={{
								r: 6,
								strokeWidth: 3,
								stroke: theme.palette.background.paper,
								fill: theme.palette.primary.main,
							}}
							name="Registrations"
						/>
						<Line
							type="monotone"
							dataKey="revenue"
							stroke={theme.palette.success.main}
							strokeWidth={3}
							dot={{
								r: 0,
								strokeWidth: 0,
							}}
							activeDot={{
								r: 6,
								strokeWidth: 3,
								stroke: theme.palette.background.paper,
								fill: theme.palette.success.main
							}}
							name="Revenue"
						/>
					</ComposedChart>
				</ResponsiveContainer>
			</Box>
		</Card>
	);
};

export default AnalyticsChart;