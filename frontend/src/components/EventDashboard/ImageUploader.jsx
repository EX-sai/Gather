// // components/EventDashboard/ImageUploader.jsx
// import { useState } from 'react';
// import {
// 	Box,
// 	Typography,
// 	IconButton,
// 	CircularProgress
// } from '@mui/material';
// import { Upload as UploadIcon } from '@mui/icons-material';

// const ImageUploader = ({
// 	previewImage,
// 	eventImage,
// 	onChange,
// 	isLoading,
// 	onFileChange
// }) => {
// 	return (
// 		<Box>
// 			<Typography variant="subtitle1">Event Banner</Typography>
// 			<Box
// 				sx={{
// 					border: '1px dashed #ccc',
// 					borderRadius: '4px',
// 					p: 3,
// 					mt: 1,
// 					display: 'flex',
// 					flexDirection: 'column',
// 					alignItems: 'center',
// 					justifyContent: 'center',
// 					cursor: 'pointer',
// 					height: '150px',
// 					position: 'relative',
// 					overflow: 'hidden',
// 					backgroundColor: previewImage || eventImage ? 'transparent' : 'action.hover'
// 				}}
// 				onClick={() => !isLoading && document.getElementById('modal-banner-upload').click()}
// 			>
// 				{(previewImage || eventImage) ? (
// 					<img
// 						src={previewImage || eventImage}
// 						alt="Event banner preview"
// 						style={{
// 							position: 'absolute',
// 							width: '100%',
// 							height: '100%',
// 							objectFit: 'cover'
// 						}}
// 					/>
// 				) : (
// 					<>
// 						<UploadIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
// 						<Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
// 							Drag and drop your image here, or click to select
// 						</Typography>
// 					</>
// 				)}
// 				<input
// 					id="modal-banner-upload"
// 					type="file"
// 					accept="image/*"
// 					hidden
// 					onChange={onFileChange}
// 					disabled={isLoading}
// 				/>
// 			</Box>
// 			<Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
// 				Max file size: 5MB (JPEG, PNG)
// 			</Typography>
// 		</Box>
// 	);
// };

// export default ImageUploader;