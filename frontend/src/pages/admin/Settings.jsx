import React, { useState } from 'react';
import {
	Box,
	Typography,
	Tabs,
	Tab,
	Card,
	CardContent,
	TextField,
	Button,
	Divider,
	FormControlLabel,
	Switch
} from '@mui/material';

const Settings = () => {
	const [tabValue, setTabValue] = useState(0);
	const [settings, setSettings] = useState({
		notifications: true,
		darkMode: false,
		email: 'admin@example.com',
		timezone: 'UTC'
	});

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setSettings(prev => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Save settings to API
		console.log('Settings saved:', settings);
		alert('Settings saved successfully!');
	};

	return (
		<Box>
			<Typography variant="h4" gutterBottom>
				Admin Settings
			</Typography>

			<Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
				<Tab label="General" />
				<Tab label="Notifications" />
				<Tab label="Security" />
			</Tabs>

			<Card>
				<CardContent>
					{tabValue === 0 && (
						<form onSubmit={handleSubmit}>
							<TextField
								fullWidth
								label="Admin Email"
								name="email"
								value={settings.email}
								onChange={handleChange}
								margin="normal"
								variant="outlined"
							/>
							<TextField
								fullWidth
								label="Timezone"
								name="timezone"
								value={settings.timezone}
								onChange={handleChange}
								margin="normal"
								variant="outlined"
								select
								SelectProps={{ native: true }}
							>
								<option value="UTC">UTC</option>
								<option value="EST">Eastern Time (EST)</option>
								<option value="PST">Pacific Time (PST)</option>
							</TextField>
							<FormControlLabel
								control={
									<Switch
										checked={settings.darkMode}
										onChange={handleChange}
										name="darkMode"
										color="primary"
									/>
								}
								label="Dark Mode"
								sx={{ mt: 2, display: 'block' }}
							/>
							<Divider sx={{ my: 3 }} />
							<Button type="submit" variant="contained" color="primary">
								Save General Settings
							</Button>
						</form>
					)}

					{tabValue === 1 && (
						<Box>
							<Typography variant="h6" gutterBottom>
								Notification Preferences
							</Typography>
							<FormControlLabel
								control={
									<Switch
										checked={settings.notifications}
										onChange={handleChange}
										name="notifications"
										color="primary"
									/>
								}
								label="Enable Email Notifications"
							/>
							<Divider sx={{ my: 3 }} />
							<Button variant="contained" color="primary">
								Save Notification Settings
							</Button>
						</Box>
					)}

					{tabValue === 2 && (
						<Box>
							<Typography variant="h6" gutterBottom>
								Security Settings
							</Typography>
							<Button variant="contained" color="primary" sx={{ mr: 2 }}>
								Change Password
							</Button>
							<Button variant="outlined" color="error">
								Logout All Devices
							</Button>
						</Box>
					)}
				</CardContent>
			</Card>
		</Box>
	);
};

export default Settings;