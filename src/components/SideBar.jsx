import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  MdOutlineHome,
  MdOutlineExplore,
  MdOutlineAccountCircle,
  MdOutlineSettings,
} from 'react-icons/md';

import { RiLogoutCircleLine } from 'react-icons/ri';
import { AuthContext } from '../context/AuthState';

const SideBar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { logout } = useContext(AuthContext);

  return (
    <aside className='px-10 py-3 relative bg-white h-[90%] shadow-md'>
      <ul>
        <li className='my-16'>
          <Link
            to='/'
            className={`${
              pathname === '/' && 'btn'
            } flex items-center w-[7.5rem] gap-2`}
          >
            <MdOutlineHome fontSize='1.5rem' />
            <span>Home</span>
          </Link>
        </li>
        <li className='my-16'>
          <Link
            to='/explore'
            className={`${
              pathname === '/explore' && 'btn'
            } flex items-center w-[7.5rem] gap-2`}
          >
            <MdOutlineExplore fontSize='1.5rem' />
            <span>Explore</span>
          </Link>
        </li>
        <li className='my-16'>
          <Link
            to='/profile'
            className={`${
              pathname === '/profile' && 'btn'
            } flex items-center w-[7.5rem] gap-2`}
          >
            <MdOutlineAccountCircle fontSize='1.5rem' />
            <span>Profile</span>
          </Link>
        </li>
        <li className='my-16'>
          <Link
            to='/account/settings'
            className={`${
              pathname === '/account/settings' && 'btn'
            } flex items-center w-[7.5rem] gap-2`}
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
