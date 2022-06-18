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
  const [response, setResponse] = useState({
    isError: false,
    message: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (response.isError) toast.error(response.message);
    if (user) navigate('/');
  }, [response, user, navigate]);

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
    else {
      const { isError, message } = data;
      setResponse({ isError, message });
    }
  }

  const value = {
    user,
    loginUser,
    registerUser,
  };

  return (
    <UserInfoContext.Provider value={value}>
      {children}
    </UserInfoContext.Provider>
  );
}
