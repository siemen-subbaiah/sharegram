import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import Modal from 'react-modal';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import { AuthContext } from '../context/AuthState';
import { RiDeleteBinLine } from 'react-icons/ri';

const MoreModal = ({ closeModal, modalIsOpen, postId, photoId }) => {
  const navigate = useNavigate();

  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.screen.width);
  }, []);

  const { user: token } = useContext(AuthContext);

  const deleteImgFunc = async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/upload/files/${photoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setImage(null);
      return res.data;
    } catch (err) {
      return err;
    }
  };

  const deletePostFunc = async () => {
    try {
      const res = await axios.delete(`${API_URL}/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res);
      if (res.data) {
        closeModal();
        navigate('/profile');
      }
      return res.data;
    } catch (err) {
      return err;
    }
  };

  const queryClient = useQueryClient();
  const { mutate: deletePost } = useMutation(deletePostFunc, {
    onSuccess: () => queryClient.invalidateQueries('posts'),
  });
  const { mutate: deleteImg } = useMutation(deleteImgFunc, {
    onSuccess: () => queryClient.invalidateQueries('user'),
  });

  const handleDeletePost = () => {
    const prompt = window.confirm('Are you sure you want to delete this post?');

    if (prompt) {
      deletePost();
      deleteImg();
    }
  };

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
      contentLabel='More Modal'
    >
      <h1 className='text-center text-xl mb-5 font-semibold'>More</h1>
      {/* <hr /> */}
      <ul className='text-center'>
        <li
          className='cursor-pointer flex items-center justify-center gap-2'
          onClick={handleDeletePost}
        >
          <RiDeleteBinLine />
          <span>Delete Post</span>
        </li>
      </ul>
    </Modal>
  );
};

export default MoreModal;
