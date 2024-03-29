import React, { useState, useContext, useEffect } from 'react';
import loginImg from '../images/login.svg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthState';
import googleIcon from '../images/google.png';
import githubIcon from '../images/github.png';
import { IoMdAlert } from 'react-icons/io';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [guestLogin, setGuestLogin] = useState(false);

  let from = location.state?.from?.pathname || '/';

  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const { user, login, loading, isError, errorData } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!guestLogin) {
      login({ identifier: email, password });
    }
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
    <div className='container px-4 md:px-20 mx-auto h-screen'>
      <div className='grid grid-cols-1 md:grid-cols-2 items-center my-10'>
        <img
          src={loginImg}
          alt='login'
          height={470}
          width={470}
          className='hidden md:block'
        />
        <div className='bg-white shadow-2xl rounded-lg p-5 dark:bg-gray-800'>
          <h1 className='text-2xl md:text-3xl text-center'>LOGIN</h1>
          <form onSubmit={handleLogin}>
            <div className='my-5'>
              <label htmlFor='email'>Email or Username</label>
              <input
                type='text'
                name='email'
                className='w-full py-3 border-2 outline-none pl-2 text-black rounded-md'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='my-5'>
              <label htmlFor='email'>Password</label>
              <input
                type='password'
                name='password'
                className='w-full py-3 border-2 outline-none pl-2 text-black rounded-md'
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
              {loading ? 'Loading...' : 'Login'}
            </button>
            <button
              disabled={loading}
              onClick={() => {
                setGuestLogin(true);
                login({
                  identifier: 'johndoe@gmail.com',
                  password: 'johndoe123',
                });
              }}
              className={`${
                loading && 'opacity-60'
              } bg-[#ac6be7] py-2 px-5 w-full rounded-md text-white mt-4`}
            >
              {loading ? 'Loading...' : 'Login as guest'}
            </button>
            <div className='md:flex justify-around gap-5'>
              <div className='my-5 flex w-full border'>
                <a
                  href='https://sharegram-backend-production.up.railway.app/connect/github'
                  className='text-center py-2 px-5 w-full rounded-md flex items-center gap-5 justify-center'
                >
                  <img
                    src={githubIcon}
                    alt='github-login'
                    height={23}
                    width={23}
                  />
                  Login with Github
                </a>
              </div>
              <div className='my-5 flex w-full border'>
                <a
                  href='https://sharegram-backend-production.up.railway.app/connect/google'
                  className='text-center py-2 px-5 w-full rounded-md flex items-center gap-5 justify-center'
                >
                  <img
                    src={googleIcon}
                    alt='google-login'
                    height={19}
                    width={19}
                  />
                  Login with Google
                </a>
              </div>
            </div>
          </form>
          <span className='md:text-center flex items-center gap-2 justify-center my-1'>
            <IoMdAlert fontSize='1.1rem' className='hidden md:block' />
            <p>The initial request may take some time</p>
          </span>
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
