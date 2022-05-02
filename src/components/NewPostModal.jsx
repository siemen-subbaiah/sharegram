import React, { useEffect, useState, useContext } from 'react';
import Modal from 'react-modal';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { AuthContext } from '../context/AuthState';
import { useMutation, useQueryClient } from 'react-query';
import { RiDeleteBinLine } from 'react-icons/ri';
import Spinner from './Spinner';
import axios from 'axios';
import { API_URL } from '../config';
import { useFetch } from '../hooks/useFetch';
import { useNavigate } from 'react-router-dom';

const NewPostModal = ({ closeModal, modalIsOpen }) => {
  const navigate = useNavigate();

  const [windowWidth, setWindowWidth] = useState(0);

  const [image, setImage] = useState();
  const [caption, setCaption] = useState('');

  useEffect(() => {
    setWindowWidth(window.screen.width);
  }, []);

  const { user: token } = useContext(AuthContext);
  const data2 = useFetch('user', `${API_URL}/users/me`, token);

  const uploadPostFunc = async (formData) => {
    try {
      const res = await axios.post(`${API_URL}/posts`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.statusText) {
        setImage(null);
        closeModal();
        navigate('/profile');
      }
      return res.data;
    } catch (err) {
      return err;
    }
  };

  const uploadImgFunc = async (formData) => {
    try {
      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setImage(res.data);
      return res.data;
    } catch (err) {
      return err;
    }
  };

  const deleteImgFunc = async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/upload/files/${id}`, {
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

  const queryClient = useQueryClient();
  const { mutate: uploadImg, isLoading: isLoadingImg } = useMutation(
    uploadImgFunc,
    {
      onSuccess: () => queryClient.invalidateQueries('post-image'),
    }
  );

  const { mutate: deleteImg, isLoading: isLoadingDeleteImg } = useMutation(
    deleteImgFunc,
    {
      onSuccess: () => queryClient.invalidateQueries('post-image'),
    }
  );

  const { mutate: uploadPost, isLoading } = useMutation(uploadPostFunc, {
    onSuccess: () => queryClient.invalidateQueries('posts'),
  });

  const handleFinalUpload = (e) => {
    e.preventDefault();
    if (caption && image) {
      uploadPost({ photo: image, caption, user: { id: data2.data?.id } });
    } else {
      alert('Please add both image and the caption');
    }
  };

  const handleFileChange = (e) => {
    const formData = new FormData();
    formData.append('files', e.target.files[0]);
    formData.append('ref', 'images');
    formData.append('field', 'image');
    uploadImg(formData);
  };

  const handleImgDelete = (id) => {
    const prompt = window.confirm('Are you sure you want to delete?');

    if (prompt) {
      deleteImg(id);
    }
  };

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: `${windowWidth <= 500 ? '90%' : '30%'}`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
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
      contentLabel='post Modal'
    >
      <h2 className='text-xl border-b-2 mb-3'>Create new post</h2>

      {isLoadingImg === true || isLoadingDeleteImg === true ? (
        <Spinner />
      ) : (
        <>
          {image ? (
            <>
              <div>
                <img
                  src={image[0]?.url}
                  alt='loading'
                  height={500}
                  width={500}
                />
                <button
                  className='bg-red-500 my-2 flex gap-2 items-center text-white p-1 rounded-md'
                  onClick={() => handleImgDelete(image[0]?.id)}
                >
                  <RiDeleteBinLine fontSize='1.1rem' />
                  <span>delete</span>
                </button>
              </div>
              <form onSubmit={handleFinalUpload} className='my-5'>
                <input
                  type='text'
                  name='caption'
                  placeholder='Enter the caption'
                  className='p-2 shadow-2xl outline-none rounded-l-md'
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
                {caption.length >= 1 ? (
                  isLoading === true ? (
                    <button
                      className='opacity-50 bg-primary p-2 px-4 rounded-r-md text-white'
                      disabled
                    >
                      Post
                    </button>
                  ) : (
                    <button className='bg-primary p-2 px-4 rounded-r-md text-white'>
                      Post
                    </button>
                  )
                ) : (
                  <button
                    className='opacity-50 bg-primary p-2 px-4 rounded-r-md text-white'
                    disabled
                  >
                    Post
                  </button>
                )}
              </form>
            </>
          ) : (
            <>
              <p className='text-md'>Drag photos here</p>
              <p>(or)</p>
              <label for='file-input' className='cursor-pointer my-2'>
                <AiOutlinePlusCircle fontSize='3rem' />
              </label>

              <input
                id='file-input'
                type='file'
                className='hidden'
                onChange={handleFileChange}
              />
            </>
          )}
        </>
      )}
    </Modal>
  );
};

export default NewPostModal;
