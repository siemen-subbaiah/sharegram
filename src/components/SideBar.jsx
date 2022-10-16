import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  MdOutlineHome,
  MdOutlineExplore,
  MdOutlineAccountCircle,
  MdOutlineSettings,
  MdSearch,
} from 'react-icons/md';

import { RiLogoutCircleLine } from 'react-icons/ri';
import { AuthContext } from '../context/AuthState';

const SideBar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { logout, setProfilePic } = useContext(AuthContext);

  return (
    <aside className='px-10 py-3 relative bg-white h-[90%] shadow-md dark:bg-gray-800'>
      <ul>
        <li className='my-14'>
          <Link
            to='/'
            className={`${
              pathname === '/' && 'bg-primary rounded-2xl'
            } flex items-center w-[6.5rem] justify-center gap-2 py-1 px-2`}
          >
            <MdOutlineHome fontSize='1.5rem' />
            <span>Home</span>
          </Link>
        </li>
        <li className='my-14'>
          <Link
            to='/explore'
            className={`${
              pathname === '/explore' && 'bg-primary rounded-2xl'
            } flex items-center w-[6.5rem] justify-center gap-2 py-1 px-2`}
          >
            <MdOutlineExplore fontSize='1.5rem' />
            <span>Explore</span>
          </Link>
        </li>
        <li className='my-14'>
          <Link
            to='/search'
            className={`${
              pathname === '/search' && 'bg-primary rounded-2xl'
            } flex items-center w-[6.5rem] justify-center gap-2 py-1 px-2`}
          >
            <MdSearch fontSize='1.5rem' />
            <span>Search</span>
          </Link>
        </li>
        <li className='my-14'>
          <Link
            to='/profile'
            className={`${
              pathname === '/profile' && 'bg-primary rounded-2xl'
            } flex items-center w-[6.5rem] justify-center gap-2 py-1 px-2`}
          >
            <MdOutlineAccountCircle
              fontSize='1.5rem'
              className='relative right-1'
            />

            <span>Profile</span>
          </Link>
        </li>
        <li className='my-14'>
          <Link
            to='/account/settings'
            className={`${
              pathname === '/account/settings' && 'bg-primary rounded-2xl'
            } flex items-center w-[7rem] gap-2 py-1 px-2`}
          >
            <MdOutlineSettings fontSize='1.5rem' />
            <span>Settings</span>
          </Link>
        </li>
      </ul>
      <ul className='absolute bottom-5'>
        <li
          className='flex items-center w-[7.5rem] gap-2 cursor-pointer'
          onClick={() => {
            logout();
            navigate('/');
            setProfilePic('');
          }}
        >
          <RiLogoutCircleLine fontSize='1.5rem' />
          <span>Log out</span>
        </li>
      </ul>
    </aside>
  );
};

export default SideBar;
