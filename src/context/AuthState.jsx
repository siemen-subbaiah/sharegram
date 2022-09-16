import axios from 'axios';
import React, { createContext, useEffect, useReducer, useState } from 'react';
import { API_URL } from '../config';
import { useFetch } from '../hooks/useFetch';
import { initialState, reducer } from './AuthReducer';

export const AuthContext = createContext();

const AuthState = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [profilePic, setProfilePic] = useState('');

  const { data } = useFetch('user', `${API_URL}/users/me`, state.user);

  useEffect(() => {
    setProfilePic(data?.picture?.url);
  }, [data?.picture?.url]);

  const login = async (loignData) => {
    dispatch({ type: 'LOADING' });
    try {
      const res = await axios.post(`${API_URL}/auth/local`, loignData);
      const data = res.data;
      dispatch({ type: 'LOGIN', payload: data.jwt });
      localStorage.setItem('user', JSON.stringify(data.jwt));
      localStorage.setItem('user_name', JSON.stringify(data.user.username));
    } catch (error) {
      dispatch({
        type: 'ERROR',
        payload: error.response.data.message[0].messages[0].message,
      });
    }
  };

  const register = async (registerData) => {
    dispatch({ type: 'LOADING' });
    try {
      const res = await axios.post(
        `${API_URL}/auth/local/register`,
        registerData
      );
      const data = res.data;
      dispatch({ type: 'LOGIN', payload: data.jwt });
      localStorage.setItem('user', JSON.stringify(data.jwt));
      localStorage.setItem('user_name', JSON.stringify(data.user.username));
    } catch (error) {
      dispatch({
        type: 'ERROR',
        payload: error.response.data.message[0].messages[0].message,
      });
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('user');
    localStorage.removeItem('user_name');
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        dispatch,
        logout,
        login,
        register,
        profilePic,
        setProfilePic,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;
