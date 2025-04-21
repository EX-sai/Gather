import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './authContext';

const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const verifyAuth = async () => {
			try {
				const token = localStorage.getItem("token");
				const storedUser = localStorage.getItem("user");

				if (token && storedUser) {
					const userData = JSON.parse(storedUser);

					// Verify token with backend
					const response = await axios.get("http://localhost:3000/api/auth/verify", {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});

					if (response.data.valid) {
						setUser({ token, ...userData });
					} else {
						clearAuth();
					}
				}
			} catch (error) {
				console.error("Auth verification failed:", error);
				clearAuth();
			} finally {
				setLoading(false);
			}
		};

		verifyAuth();
	}, []);




	const clearAuth = () => {
		localStorage.removeItem('token');
		setUser(null);
	};

	const login = (token, userData) => {
		localStorage.setItem("token", token);
		localStorage.setItem("user", JSON.stringify(userData)); // Store full user data

		setUser({ token, ...userData });

		// Redirect based on role
		if (userData.role === "admin") {
			navigate("/dashboard/home");
		} else if (userData.role === "customer") {
			navigate("/c/dashboard/home");
		} else if (userData.role === "organiser") {
			navigate("/o/dashboard/home");
		} else {
			navigate("/dashboard/home"); // Fallback
		}
	};




	const logout = async () => {
		try {
			await axios.post('http://localhost:3000/api/auth/logout');
		} catch (error) {
			console.error("Logout error:", error);
		}
		clearAuth();
		navigate('/signin');
	};

	return (
		<AuthContext.Provider value={{ user, loading, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;