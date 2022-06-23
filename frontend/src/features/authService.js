import axios from 'axios';

const API_URL = '/api/users';

const register = makeRequest('register');
const login = makeRequest('login');

const logout = async () => {
  try {
    await axios.post(`${API_URL}/logout`);
  } catch (error) {
    return error.response;
  }
};

/**
 * @desc Helper function to send post requestes
 *       for blocking / unblocking users
 */
function makeRequest(endpoint) {
  return async userData => {
    try {
      return await axios.post(`${API_URL}/${endpoint}`, userData);
    } catch (error) {
      return error.response;
    }
  };
}

const authService = {
  login,
  logout,
  register,
};

export default authService;
