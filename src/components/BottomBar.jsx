import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
  MdOutlineHome,
  MdOutlineExplore,
  MdOutlineAccountCircle,
  MdOutlineSettings,
} from 'react-icons/md';

const BottomBar = () => {
  const { pathname } = useLocation();

  return (
    <footer className='bg-primary fixed w-full bottom-0 p-3 text-white'>
      <ul className='flex items-center justify-center gap-10'>
        <li>
          <Link to='/' className={`flex flex-col items-center text-xs`}>
            <MdOutlineHome fontSize='1.5rem' />
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link to='/explore' className={`flex flex-col items-center text-xs`}>
            <MdOutlineExplore fontSize='1.4rem' />
            <span>Explore</span>
          </Link>
        </li>
        <li>
          <Link to='/profile' className={`flex flex-col items-center text-xs`}>
            <MdOutlineAccountCircle fontSize='1.4rem' />
            <span>Profile</span>
          </Link>
        </li>
        <li>
          <Link
            to='/account/settings'
            className={`flex flex-col items-center text-xs`}
          >
            <MdOutlineSettings fontSize='1.4rem' />
            <span>Settings</span>
          </Link>
        </li>
      </ul>
    </footer>
  );
};

export default BottomBar;
