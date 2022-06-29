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

let controller;
/**
 * @desc Helper function for login and signup
 */
function makeRequest(endpoint) {
  return async userData => {
    try {
      if (controller) controller.abort();

      controller = new AbortController();
      return await axios.post(`${API_URL}/${endpoint}`, userData, {
        signal: controller.signal,
      });
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
