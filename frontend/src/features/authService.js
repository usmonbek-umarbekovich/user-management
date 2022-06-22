import axios from 'axios';

const API_URL = '/api/users';

const register = makeRequest('register');
const login = makeRequest('login');

const logout = async () => {
  await axios.post(`${API_URL}/logout`);
};

/**
 * @desc Helper function to send post requestes
 *       for blocking / unblocking users
 */
function makeRequest(endpoint) {
  return async userData => {
    try {
      const response = await axios.post(`${API_URL}/${endpoint}`, userData);
      return {
        user: response.data,
        error: '',
      };
    } catch (error) {
      const errorMessage = error?.response?.data?.message;
      const message = errorMessage || error.message || error.toString();
      return {
        user: null,
        error: message,
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
