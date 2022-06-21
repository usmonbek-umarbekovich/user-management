import axios from 'axios';

const API_URL = '/api/users';

const register = makeRequest('register');
const login = makeRequest('login');

const logout = async () => {
  await axios.post(`${API_URL}/logout`);
};

function makeRequest(endpoint) {
  return async userData => {
    try {
      const response = await axios.post(`${API_URL}/${endpoint}`, userData);
      return {
        user: response.data,
        isError: false,
        message: '',
      };
    } catch (error) {
      const errorMessage = error?.response?.data?.message;
      const message = errorMessage || error.message || error.toString();
      return {
        user: null,
        isError: true,
        message,
      };
    }
  };
}

const authService = {
  login,
  logout,
  register,
};

export default authService;
