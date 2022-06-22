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
    const data = await authService.login(userData);
    parseData(data);
  };

  const registerUser = async userData => {
    const data = await authService.register(userData);
    parseData(data);
  };

  function parseData(data) {
    if (data.user) setUser(data.user);
    else setError(data.error);
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
