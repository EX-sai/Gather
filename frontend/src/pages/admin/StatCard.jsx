import React from 'react';
import { Card, CardContent, Box, Typography, alpha, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, trend, change, color }) => {
	const theme = useTheme();

	const trendColors = {
		up: theme.palette.success.main,
		down: theme.palette.error.main,
		neutral: theme.palette.text.secondary
	};

	return (
		<Card
			component={motion.div}
			whileHover={{ y: -5, boxShadow: theme.shadows[6] }}
			sx={{
				borderRadius: 4,
				boxShadow: theme.shadows[3],
				height: '100%',
				background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.1)} 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`
			}}
		>
			<CardContent>
				<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
					<Box>
						<Typography variant="subtitle2" color="text.secondary">
							{title}
						</Typography>
						<Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
							{value}
						</Typography>
					</Box>
					<Box
						sx={{
							width: 48,
							height: 48,
							borderRadius: '50%',
							backgroundColor: alpha(theme.palette[color].main, 0.2),
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							color: theme.palette[color].main
						}}
					>
						{icon}
					</Box>
				</Box>
				<Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
					<Typography
						variant="body2"
						sx={{
							color: trendColors[trend],
							display: 'flex',
							alignItems: 'center'
						}}
					>
						{trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {change}%
						<Typography component="span" variant="caption" sx={{ ml: 1 }}>
							vs last period
						</Typography>
					</Typography>
				</Box>
			</CardContent>
		</Card>
	);
};

export default StatCard;