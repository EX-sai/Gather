import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
	const { user, loading } = useAuth();

	if (loading) {
		return (
			<div style={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: 'rgba(243, 244, 246, 0.9)',
				zIndex: 50
			}}>
				<div style={{ textAlign: 'center' }}>
					<div style={{
						position: 'relative',
						width: '80px',
						height: '80px',
						margin: '0 auto 16px'
					}}>
						{/* Outer spinner ring */}
						<div style={{
							position: 'absolute',
							inset: 0,
							borderRadius: '50%',
							border: '4px solid transparent',
							borderTopColor: '#3b82f6',
							borderBottomColor: '#93c5fd',
							animation: 'spin1 1.5s linear infinite'
						}}></div>

						{/* Middle spinner ring */}
						<div style={{
							position: 'absolute',
							inset: '8px',
							borderRadius: '50%',
							border: '4px solid transparent',
							borderRightColor: '#60a5fa',
							borderLeftColor: '#60a5fa',
							animation: 'spin2 2.5s linear infinite'
						}}></div>

						{/* Inner spinner ring */}
						<div style={{
							position: 'absolute',
							inset: '16px',
							borderRadius: '50%',
							border: '4px solid transparent',
							borderTopColor: '#93c5fd',
							borderBottomColor: '#3b82f6',
							animation: 'spin3 2s linear infinite reverse'
						}}></div>
					</div>
					<p style={{
						marginTop: '8px',
						fontSize: '1.125rem',
						fontWeight: 500,
						color: '#374151'
					}}>Authenticating...</p>
					<p style={{
						fontSize: '0.875rem',
						color: '#6b7280'
					}}>Please wait while we verify your credentials</p>
				</div>

				{/* Add animations via style tag */}
				<style>{`
					@keyframes spin1 {
						from { transform: rotate(0deg); }
						to { transform: rotate(360deg); }
					}
					@keyframes spin2 {
						from { transform: rotate(0deg); }
						to { transform: rotate(360deg); }
					}
					@keyframes spin3 {
						from { transform: rotate(360deg); }
						to { transform: rotate(0deg); }
					}
				`}</style>
			</div>
		);
	}


	if (!user) return <Navigate to="/signin" />;
	if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" />;
	return children;
};

export default ProtectedRoute;