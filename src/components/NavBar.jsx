import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { CgDarkMode } from 'react-icons/cg';
import NewPostModal from './NewPostModal';
import { AuthContext } from '../context/AuthState';

const NavBar = ({ changeTheme }) => {
  const [modalIsOpen, setIsOpen] = React.useState(false);

  const { user } = useContext(AuthContext);

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <nav className='bg-primary text-white p-3 md:p-4 flex items-center md:flex-row flex-col justify-between md:static sticky top-0'>
        <Link to='/'>
          <h1 className='md:px-5 md:text-3xl text-[1.6rem]'>ShareGram</h1>
        </Link>
        <div className='flex'>
          <CgDarkMode
            onClick={changeTheme}
            fontSize='2rem'
            className='cursor-pointer relative top-2 md:static'
          />
          <div>
            {user && (
              <div className='px-5 mt-2 md:mt-0'>
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
