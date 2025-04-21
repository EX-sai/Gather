// authService.js
const getToken = () => {
	return localStorage.getItem('token'); // or your token storage method
};

export default {
	getToken,
};