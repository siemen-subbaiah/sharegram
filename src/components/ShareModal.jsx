import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

const ShareModal = ({ closeModal, modalIsOpen, link, caption }) => {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.screen.width);
  }, []);

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: `${windowWidth <= 500 ? '90%' : '20%'}`,
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
      <h1 className='text-center'>Share</h1>
      <hr />
      <ul className='text-center'>
        <li
          onClick={() => {
            navigator.clipboard.writeText(link);
            alert('copied!');
          }}
          className='cursor-pointer'
        >
          Copy link
        </li>
        <li className='my-4'>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite?url=${link}`}
            target='_blank'
          >
            Linkedin
          </a>
        </li>
        <li className='my-4'>
          <a
            href={`https://twitter.com/intent/tweet?url=${link}&text=${caption}`}
            target='_blank'
          >
            Twitter
          </a>
        </li>
        <li className='my-4'>
          {windowWidth <= 500 ? (
            <a
              href={`/whatsapp://send?text=${link}`}
              data-action='share/whatsapp/share'
              target='_blank'
            >
              WhatsApp
            </a>
          ) : (
            <a
              href={`https://web.whatsapp.com/send?text=${link}`}
              data-action='share/whatsapp/share'
              target='_blank'
            >
              WhatsApp
            </a>
          )}
        </li>
        <li className='my-4'>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${link}&quote=${caption}`}
            target='_blank'
          >
            Facebook
          </a>
        </li>
      </ul>
    </Modal>
  );
};

export default ShareModal;
