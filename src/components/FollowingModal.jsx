import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { MdAccountCircle } from 'react-icons/md';
import { Link } from 'react-router-dom';

const FollowingModal = ({ closeModal, modalIsOpen, following }) => {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.screen.width);
  }, []);

  const themeColor = localStorage.getItem('theme')
    ? localStorage.getItem('theme')
    : '#1F2937';

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: `${windowWidth <= 500 ? '90%' : '20%'}`,
      backgroundColor: themeColor === 'dark' ? '#1F2937' : 'white',
      color: themeColor === 'dark' ? 'white' : 'black',
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,.80)',
    },
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      ariaHideApp={false}
      contentLabel='following Modal'
    >
      <h1 className='text-center text-xl mb-5 font-semibold'>Following</h1>
      {/* <hr /> */}
      {following?.length === 0 && (
        <p className='text-xl text-center'>No following</p>
      )}
      {following?.map((item) => {
        return (
          <Link
            to={`/${item?.username}`}
            key={item?.id}
            onClick={closeModal}
            className='flex items-center gap-3 my-5'
          >
            <>
              {item?.picture ? (
                <div>
                  <img
                    src={item?.picture?.url}
                    alt='profile-pic'
                    height={30}
                    width={30}
                    className='rounded-2xl'
                  />
                </div>
              ) : (
                <div>
                  <MdAccountCircle className='h-10 w-10' />
                </div>
              )}
            </>
            <p>{item?.username}</p>
          </Link>
        );
      })}
    </Modal>
  );
};

export default FollowingModal;
