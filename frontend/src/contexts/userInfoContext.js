import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useLocalStorage from '../hooks/useLocalStorage';
import authService from '../features/authService';

const UserInfoContext = React.createContext();

export function useUserInfo() {
  return useContext(UserInfoContext);
}

export default function UserInfoProvider({ children }) {
  const [user, setUser] = useLocalStorage('user', null);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (error) toast.error(error);
    if (user) navigate('/');

    return () => {
      setError('');
    };
  }, [user, navigate, error]);

  const logoutUser = () => {
    authService.logout();
    setUser(null);
  };

  const loginUser = async userData => {
    const response = await authService.login(userData);
    parseData(response);
  };

  const registerUser = async userData => {
    const response = await authService.register(userData);
    parseData(response);
  };

  function parseData(response) {
    if (response.statusText === 'OK') setUser(response.data);
    else setError(response.data.message);
  }

  const value = {
    user,
    loginUser,
    registerUser,
    logoutUser,
  };

  return (
    <UserInfoContext.Provider value={value}>
      {children}
    </UserInfoContext.Provider>
  );
}
