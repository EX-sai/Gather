import React from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { alpha } from '@mui/material/styles';

const RecentActivity = ({ activities }) => {
	const theme = useTheme();

	return (
		<List sx={{ p: 0 }}>
			{activities.map((activity, index) => (
				<ListItem
					key={index}
					component={motion.div}
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: index * 0.05 }}
					sx={{
						px: 3,
						py: 2,
						'&:hover': {
							backgroundColor: alpha(theme.palette.primary.main, 0.05)
						}
					}}
				>
					<ListItemAvatar>
						<Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.2) }}>
							{activity.icon}
						</Avatar>
					</ListItemAvatar>
					<ListItemText
						primary={
							<Typography fontWeight={500}>
								{activity.title}
							</Typography>
						}
						secondary={
							<Typography variant="body2" color="text.secondary">
								{activity.description} • {activity.time}
							</Typography>
						}
					/>
				</ListItem>
			))}
		</List>
	);
};

export default RecentActivity;