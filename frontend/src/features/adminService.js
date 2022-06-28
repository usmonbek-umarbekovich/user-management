import axios from 'axios';

const API_URL = '/api/users';

let controller;

const getUsers = async () => {
  try {
    if (controller) controller.abort();

    controller = new AbortController();
    return await axios.get(`${API_URL}`, {
      signal: controller.signal,
    });
  } catch (error) {
    return error.response;
  }
};

const changeStatus = async (status, selectedUsers) => {
  try {
    const endpoint = status === 'blocked' ? 'block' : 'unblock';
    return await axios.put(`${API_URL}/${endpoint}`, {
      selectedUsers,
    });
  } catch (error) {
    return error.response;
  }
};

const deleteUsers = async selectedUsers => {
  try {
    return await axios.delete(`${API_URL}/delete`, {
      data: { selectedUsers },
    });
  } catch (error) {
    return error.response;
  }
};

const adminService = {
  getUsers,
  changeStatus,
  deleteUsers,
};

export default adminService;
