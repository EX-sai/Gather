import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ForgotPasswordPage from "./components/ForgotPass";
import ResetPasswordPage from "./components/ResetPass";
import { ThemeProvider, CssBaseline } from "@mui/material";
import SignupPage from "./components/SignupPage";
import SignInPage from "./components/SignInPage";
import EventDashboard from "./components/EventDashboard/EventDashboard";
import CustomerDashboard from "./components/EventDashboard/CustomerDashboard";
// import EventManagement from "./components/EventDashboard/EventManagement";
import AllEvents from "./components/EventDashboard/Events";
import BookingsTickets from "./components/EventDashboard/MyBookingsTickets";
import LandingPage from "./components/landing";
import ProfileSettings from "./components/ProfileSettings";
import theme from "./theme";
import AuthProvider from './context/AuthProvider';
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersList from './pages/admin/UsersList';
import EventsList from './pages/admin/EventsList';
import Settings from './pages/admin/Settings';
import Unauthorized from "./pages/Unauthorized";



function App() {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<BrowserRouter>
				<AuthProvider>
					<Routes>
						<Route path="/"							element={<LandingPage />} />
						<Route path="/signup"					element={<SignupPage />} />
						<Route path="/signin"					element={<SignInPage />} />
						<Route path="/forgot-password"			element={<ForgotPasswordPage />} />
						<Route path="/reset-password"			element={<ResetPasswordPage />} />
						<Route path="/unauthorized"				element={<Unauthorized />} />
						<Route path="*"							element={<Navigate to="/" replace />} />


						{/* Protected routes */}
						<Route path="/c/dashboard/home"			element={<ProtectedRoute allowedRoles={['customer']}><CustomerDashboard /></ProtectedRoute>} />
						<Route path="/c/dashboard/events"		element={<ProtectedRoute allowedRoles={['customer']}><AllEvents /></ProtectedRoute>} />
						<Route path="/o/dashboard/home"			element={<ProtectedRoute allowedRoles={['organiser']}><EventDashboard /></ProtectedRoute>} />
						<Route path="/o/dashboard/bookings"		element={<ProtectedRoute allowedRoles={['organiser']}><BookingsTickets /></ProtectedRoute>} />
						<Route path="/profile"					element={<ProtectedRoute allowedRoles={['admin, customer, organiser']}><ProfileSettings /></ProtectedRoute>} />
						<Route path="/dashboard/home"			element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
						<Route path="/dashboard/home/users"		element={<ProtectedRoute allowedRoles={['admin']}><UsersList /></ProtectedRoute>} />
						<Route path="/dashboard/home/events"	element={<ProtectedRoute allowedRoles={['admin']}><EventsList /></ProtectedRoute>} />
						<Route path="/dashboard/home/settings"	element={<ProtectedRoute allowedRoles={['admin']}><Settings /></ProtectedRoute>} />

					</Routes>
				</AuthProvider>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;