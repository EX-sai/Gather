import { useState, useEffect } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import BlockIcon from '@mui/icons-material/Block';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import { motion } from 'framer-motion';

const Unauthorized = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [userRole, setUserRole] = useState('');
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		// Detect user role from localStorage, JWT token, or context
		const detectUserRole = () => {
			// Example implementation:
			const role = localStorage.getItem('userRole') || 'customer'; // Default to customer
			setUserRole(role);
		};

		detectUserRole();

		// Animation timing
		setTimeout(() => setVisible(true), 100);
	}, []);

	const handleGoBack = () => {
		navigate(-2); // Navigate to previous page
	};

	const handleGoHome = () => {
		// Redirect based on user role
		switch (userRole) {
			case 'admin':
				navigate('/dashboard/home');
				break;
			case 'organiser':
				navigate('/o/dashboard/home');
				break;
			case 'customer':
			default:
				navigate('/c/dashboard/home');
				break;
		}
	};

	// Animation variants for Framer Motion
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				duration: 0.8,
				staggerChildren: 0.15
			}
		}
	};

	const itemVariants = {
		hidden: { y: 30, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: { duration: 0.6, ease: "easeOut" }
		}
	};

	const iconVariants = {
		hidden: { scale: 0.5, opacity: 0 },
		visible: {
			scale: 1,
			opacity: 1,
			transition: {
				type: "spring",
				stiffness: 100,
				damping: 15
			}
		}
	};

	// Background animation for decoration
	const circleVariants = {
		hidden: { scale: 0, opacity: 0 },
		visible: (custom) => ({
			scale: 1,
			opacity: 0.07,
			transition: {
				delay: custom * 0.3,
				duration: 1.2,
				ease: "easeOut"
			}
		})
	};

	return (
		<Box
			sx={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				height: '100vh',
				width: '100vw',
				background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				overflow: 'hidden',
				zIndex: 9999
			}}
		>
			{/* Decorative background elements */}
			<motion.div
				initial="hidden"
				animate={visible ? "visible" : "hidden"}
				custom={0}
				variants={circleVariants}
				style={{
					position: 'absolute',
					top: '15%',
					left: '10%',
					width: '50vh',
					height: '50vh',
					borderRadius: '50%',
					background: 'linear-gradient(45deg, #FF416C 0%, #FF4B2B 100%)',
					zIndex: -1
				}}
			/>
			<motion.div
				initial="hidden"
				animate={visible ? "visible" : "hidden"}
				custom={1}
				variants={circleVariants}
				style={{
					position: 'absolute',
					bottom: '10%',
					right: '10%',
					width: '60vh',
					height: '60vh',
					borderRadius: '50%',
					background: 'linear-gradient(45deg, #0061ff 0%, #60efff 100%)',
					zIndex: -1
				}}
			/>

			<motion.div
				initial="hidden"
				animate={visible ? "visible" : "hidden"}
				variants={containerVariants}
				style={{
					maxWidth: '550px',
					width: '100%',
					padding: '3rem',
					borderRadius: '16px',
					boxShadow: '0 20px 80px rgba(0,0,0,0.12)',
					background: 'rgba(255, 255, 255, 0.95)',
					backdropFilter: 'blur(20px)',
					position: 'relative',
					overflow: 'hidden',
					margin: '0 20px'
				}}
			>
				{/* Horizontal accent bar */}
				<Box
					sx={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						height: '6px',
						background: 'linear-gradient(90deg, #FF416C, #FF4B2B)',
						borderTopLeftRadius: '16px',
						borderTopRightRadius: '16px'
					}}
				/>

				<motion.div variants={iconVariants}>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							width: '110px',
							height: '110px',
							borderRadius: '50%',
							background: 'rgba(255, 77, 77, 0.1)',
							margin: '0 auto 2rem',
							position: 'relative',
							border: '2px solid rgba(255, 77, 77, 0.3)'
						}}
					>
						<BlockIcon
							sx={{
								fontSize: 50,
								color: '#FF4D4D',
								animation: 'pulse 2.5s infinite',
								'@keyframes pulse': {
									'0%': { opacity: 0.8, transform: 'scale(1)' },
									'50%': { opacity: 1, transform: 'scale(1.1)' },
									'100%': { opacity: 0.8, transform: 'scale(1)' }
								}
							}}
						/>
					</Box>
				</motion.div>

				<motion.div variants={itemVariants}>
					<Typography
						variant="h3"
						component="h1"
						sx={{
							fontWeight: 800,
							mb: 1.5,
							fontSize: { xs: '2.2rem', sm: '2.5rem' },
							background: 'linear-gradient(45deg, #FF416C 30%, #FF4B2B 90%)',
							backgroundClip: 'text',
							textFillColor: 'transparent',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							textAlign: 'center'
						}}
					>
						Access Denied
					</Typography>
				</motion.div>

				<motion.div variants={itemVariants}>
					<Typography
						variant="h6"
						sx={{
							mb: 2,
							color: '#1E293B',
							textAlign: 'center',
							fontWeight: 500,
							fontSize: { xs: '1.1rem', sm: '1.25rem' },
						}}
					>
						You don't have permission to view this page
					</Typography>
				</motion.div>

				<motion.div variants={itemVariants}>
					<Typography
						variant="body1"
						sx={{
							mb: 4,
							color: '#64748B',
							textAlign: 'center',
							maxWidth: '420px',
							mx: 'auto',
							lineHeight: 1.6
						}}
					>
						Please contact your administrator if you believe this is an error or if you need additional access rights.
					</Typography>
				</motion.div>

				<motion.div variants={itemVariants}>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							gap: 2.5,
							flexDirection: { xs: 'column', sm: 'row' },
							mt: 2
						}}
					>
						<Button
							variant="outlined"
							size="large"
							startIcon={<ArrowBackIcon />}
							onClick={handleGoBack}
							sx={{
								minWidth: 150,
								borderRadius: '12px',
								borderColor: '#CBD5E1',
								color: '#475569',
								py: 1.2,
								fontWeight: 600,
								transition: 'all 0.3s ease',
								'&:hover': {
									borderColor: '#94A3B8',
									background: 'rgba(226, 232, 240, 0.6)',
									transform: 'translateY(-3px)',
									boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)'
								}
							}}
						>
							Go Back
						</Button>

						<Button
							variant="contained"
							size="large"
							startIcon={<HomeIcon />}
							onClick={handleGoHome}
							sx={{
								minWidth: 150,
								borderRadius: '12px',
								background: 'linear-gradient(45deg, #0061ff 30%, #60efff 90%)',
								py: 1.2,
								fontWeight: 600,
								transition: 'all 0.3s ease',
								boxShadow: '0 4px 14px rgba(0, 97, 255, 0.39)',
								'&:hover': {
									transform: 'translateY(-3px)',
									boxShadow: '0 8px 25px rgba(0, 97, 255, 0.5)',
									background: 'linear-gradient(45deg, #0052d6 30%, #4dcfff 90%)'
								}
							}}
						>
							Return Home
						</Button>
					</Box>
				</motion.div>
			</motion.div>
		</Box>
	);
};

export default Unauthorized;























// import { useState, useEffect } from 'react';
// import { Box, Typography, Button, Container, Paper, Fade } from '@mui/material';
// import { useNavigate, useLocation } from 'react-router-dom';
// import BlockIcon from '@mui/icons-material/Block';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import HomeIcon from '@mui/icons-material/Home';
// import { motion } from 'framer-motion';

// const Unauthorized = () => {
// 	const navigate = useNavigate();
// 	const location = useLocation();
// 	const [userRole, setUserRole] = useState('');
// 	const [visible, setVisible] = useState(false);

// 	useEffect(() => {
// 		// Detect user role from localStorage, JWT token, or context
// 		// This is a placeholder - implement according to your auth system
// 		const detectUserRole = () => {
// 			// Example implementation:
// 			// Check localStorage, JWT token or context API for user role
// 			const role = localStorage.getItem('userRole') || 'customer'; // Default to customer
// 			setUserRole(role);
// 		};

// 		detectUserRole();

// 		// Animation timing
// 		setTimeout(() => setVisible(true), 100);
// 	}, []);

// 	const handleGoBack = () => {
// 		navigate(-2); // Navigate to previous page
// 	};

// 	const handleGoHome = () => {
// 		// Redirect based on user role
// 		switch (userRole) {
// 			case 'admin':
// 				navigate('/dashboard/home');
// 				break;
// 			case 'organiser':
// 				navigate('/o/dashboard/home');
// 				break;
// 			case 'customer':
// 			default:
// 				navigate('/c/dashboard/home');
// 				break;
// 		}
// 	};

// 	// Animation variants for Framer Motion
// 	const containerVariants = {
// 		hidden: { opacity: 0, scale: 0.9 },
// 		visible: {
// 			opacity: 1,
// 			scale: 1,
// 			transition: {
// 				duration: 0.5,
// 				staggerChildren: 0.1
// 			}
// 		}
// 	};

// 	const itemVariants = {
// 		hidden: { y: 20, opacity: 0 },
// 		visible: {
// 			y: 0,
// 			opacity: 1,
// 			transition: { duration: 0.5 }
// 		}
// 	};

// 	return (
// 		<Container maxWidth="md" sx={{ height: '100%', width: "100%", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
// 			<Fade in={visible} timeout={800}>
// 				<Paper
// 					elevation={6}
// 					component={motion.div}
// 					initial="hidden"
// 					animate="visible"
// 					variants={containerVariants}
// 					sx={{
// 						borderRadius: 4,
// 						p: { xs: 4, md: 6 },
// 						width: '100%',
// 						backgroundColor: 'rgba(255, 255, 255, 0.95)',
// 						backdropFilter: 'blur(10px)',
// 						textAlign: 'center',
// 						position: 'relative',
// 						overflow: 'hidden',
// 						'&::after': {
// 							content: '""',
// 							position: 'absolute',
// 							top: 0,
// 							left: 0,
// 							right: 0,
// 							height: '4px',
// 							background: 'linear-gradient(90deg, #f44336, #ff9800)'
// 						}
// 					}}
// 				>
// 					<motion.div variants={itemVariants}>
// 						<BlockIcon
// 							sx={{
// 								fontSize: 80,
// 								color: 'error.main',
// 								animation: 'pulse 2s infinite',
// 								'@keyframes pulse': {
// 									'0%': { opacity: 0.7, transform: 'scale(1)' },
// 									'50%': { opacity: 1, transform: 'scale(1.05)' },
// 									'100%': { opacity: 0.7, transform: 'scale(1)' }
// 								}
// 							}}
// 						/>
// 					</motion.div>

// 					<motion.div variants={itemVariants}>
// 						<Typography
// 							variant="h3"
// 							component="h1"
// 							sx={{
// 								fontWeight: 700,
// 								mt: 2,
// 								mb: 1,
// 								background: 'linear-gradient(45deg, #f44336 30%, #ff9800 90%)',
// 								WebkitBackgroundClip: 'text',
// 								WebkitTextFillColor: 'transparent'
// 							}}
// 						>
// 							Access Denied
// 						</Typography>
// 					</motion.div>

// 					<motion.div variants={itemVariants}>
// 						<Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
// 							You don't have permission to view this page
// 						</Typography>
// 					</motion.div>

// 					<motion.div variants={itemVariants}>
// 						<Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
// 							Please contact your administrator if you believe this is an error.
// 						</Typography>
// 					</motion.div>

// 					<Box
// 						sx={{
// 							display: 'flex',
// 							justifyContent: 'center',
// 							gap: 2,
// 							flexDirection: { xs: 'column', sm: 'row' }
// 						}}
// 					>
// 						<motion.div variants={itemVariants}>
// 							<Button
// 								variant="outlined"
// 								size="large"
// 								startIcon={<ArrowBackIcon />}
// 								onClick={handleGoBack}
// 								sx={{
// 									minWidth: 150,
// 									borderRadius: 2,
// 									transition: 'all 0.3s ease',
// 									'&:hover': {
// 										transform: 'translateY(-3px)',
// 										boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
// 									}
// 								}}
// 							>
// 								Go Back
// 							</Button>
// 						</motion.div>

// 						<motion.div variants={itemVariants}>
// 							<Button
// 								variant="contained"
// 								size="large"
// 								startIcon={<HomeIcon />}
// 								onClick={handleGoHome}
// 								sx={{
// 									minWidth: 150,
// 									borderRadius: 2,
// 									background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
// 									transition: 'all 0.3s ease',
// 									'&:hover': {
// 										transform: 'translateY(-3px)',
// 										boxShadow: '0 6px 12px rgba(33,150,243,0.3)',
// 										background: 'linear-gradient(45deg, #1976D2 30%, #00B0FF 90%)'
// 									}
// 								}}
// 							>
// 								Return Home
// 							</Button>
// 						</motion.div>
// 					</Box>
// 				</Paper>
// 			</Fade>
// 		</Container>
// 	);
// };

// export default Unauthorized;