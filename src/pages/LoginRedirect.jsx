import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthState';
import axios from 'axios';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const LoginRedirect = () => {
  const { dispatch, isError } = useContext(AuthContext);

  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  let from = location.state?.from?.pathname || '/';

  useEffect(() => {
    const redirectTest = async () => {
      dispatch({ type: 'LOADING' });
      try {
        const res = await axios(
          `${API_URL}/auth/${params.providerName}/callback${location.search}`
        );
        const data = await res.data;
        dispatch({ type: 'LOGIN', payload: data.jwt });
        localStorage.setItem('user', JSON.stringify(data.jwt));
        localStorage.setItem('user_name', JSON.stringify(data.user.username));
        setTimeout(() => navigate(from, { replace: true }), 1000);
      } catch (error) {
        dispatch({
          type: 'ERROR',
          payload: error.response.data.message[0].messages[0].message,
        });
      }
    };
    redirectTest();
  }, [history, location.search]);

  return (
    <div>
      <p className='text-center h-screen'>
        {isError ? 'error occure' : 'redirecting...'}
      </p>
    </div>
  );
};

export default LoginRedirect;
