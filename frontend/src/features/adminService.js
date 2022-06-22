import axios from 'axios';

const API_URL = '/api/users';

const getUsers = async () => {
  const response = await axios.get(`${API_URL}`);
  return response.data;
};

const changeStatus = async (status, selectedUsers) => {
  const endpoint = status === 'blocked' ? 'block' : 'unblock';
  await axios.put(`${API_URL}/${endpoint}`, { selectedUsers });
};

const deleteUsers = async selectedUsers => {
  await axios.delete(`${API_URL}/delete`, { data: { selectedUsers } });
};

const adminService = {
  getUsers,
  changeStatus,
  deleteUsers,
};

export default adminService;
