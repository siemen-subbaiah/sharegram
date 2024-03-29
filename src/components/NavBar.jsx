import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import NewPostModal from './NewPostModal';
import { AuthContext } from '../context/AuthState';

import { MdDarkMode, MdLightMode } from 'react-icons/md';

const NavBar = ({ changeTheme, theme }) => {
  const [modalIsOpen, setIsOpen] = React.useState(false);

  const { user, profilePic } = useContext(AuthContext);

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <nav className='bg-primary text-white p-3 md:p-4 flex flex-col md:flex-row items-center justify-between md:static sticky top-0'>
        <Link to='/'>
          <h1 className='md:px-5 md:text-3xl text-[1.6rem]'>ShareGram</h1>
        </Link>
        <div className='flex items-center gap-3'>
          <Link to='/profile'>
            {profilePic && (
              <img
                src={profilePic}
                alt='picture'
                height='30px'
                width='30px'
                className='rounded-2xl hidden lg:block'
              />
            )}
          </Link>
          {theme === 'dark' ? (
            <MdLightMode
              onClick={changeTheme}
              fontSize='2rem'
              className='cursor-pointer relative md:static top-1'
            />
          ) : (
            <MdDarkMode
              onClick={changeTheme}
              fontSize='2rem'
              className='cursor-pointer relative md:static top-1'
            />
          )}
          <div>
            {user && (
              <div className='pr-5 mt-2 md:mt-0'>
                <button
                  className='bg-white py-1 px-5 rounded-2xl text-black flex items-center gap-2'
                  onClick={() => setIsOpen(true)}
                >
                  <AiOutlinePlusCircle fontSize='1.2rem' />
                  <span>New Post</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <NewPostModal modalIsOpen={modalIsOpen} closeModal={closeModal} />
    </>
  );
};

export default NavBar;
