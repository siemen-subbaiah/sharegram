import React, { useState, useContext, useEffect } from 'react';
import loginImg from '../images/login.svg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthState';
import googleIcon from '../images/google.png';
import githubIcon from '../images/github.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  let from = location.state?.from?.pathname || '/';

  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const { user, login, loading, isError, errorData } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();
    login({ identifier: email, password });
  };

  useEffect(() => {
    if (isError) {
      alert(errorData);
    }
    if (user) {
      navigate(from, { replace: true });
    }
  }, [isError, errorData]);

  return (
    <div className='container px-4 md:px-20 mx-auto'>
      <div className='grid grid-cols-1 md:grid-cols-2 items-center my-10'>
        <img
          src={loginImg}
          alt='login'
          height={470}
          width={470}
          className='hidden md:block'
        />
        <div className='bg-white shadow-2xl rounded-lg p-5'>
          <h1 className='text-2xl md:text-3xl text-center'>LOGIN</h1>
          <form onSubmit={handleLogin}>
            <div className='my-5'>
              <label htmlFor='email'>Email or Username</label>
              <input
                type='text'
                name='email'
                className='w-full py-3 border-2 outline-none pl-2'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='my-5'>
              <label htmlFor='email'>Password</label>
              <input
                type='password'
                name='password'
                className='w-full py-3 border-2 outline-none pl-2'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              disabled={loading}
              className={`${
                loading && 'opacity-60'
              } bg-primary py-2 px-5 w-full rounded-md text-white`}
            >
              {loading ? 'Loading...' : 'LOGIN'}
            </button>
            <div className='flex justify-around gap-5'>
              <div className='my-5 flex w-full border'>
                <a
                  href='https://sharegram-backend.herokuapp.com/connect/github'
                  className='text-center py-2 px-5 w-full rounded-md flex items-center gap-5 justify-center'
                >
                  <img
                    src={githubIcon}
                    alt='github-login'
                    height={23}
                    width={23}
                  />
                  LOGIN with GITHUB
                </a>
              </div>
              <div className='my-5 flex w-full border'>
                <a
                  href='https://sharegram-backend.herokuapp.com/connect/google'
                  className='text-center py-2 px-5 w-full rounded-md flex items-center gap-5 justify-center'
                >
                  <img
                    src={googleIcon}
                    alt='google-login'
                    height={20}
                    width={20}
                  />
                  LOGIN with GOOGLE
                </a>
              </div>
            </div>
          </form>
          <p className='my-5'>
            No account?{' '}
            <Link to='/account/register' className='underline'>
              Regsiter
            </Link>{' '}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
