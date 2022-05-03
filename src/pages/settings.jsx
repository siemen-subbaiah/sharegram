import React, { useState, useContext, useEffect } from 'react';
import BottomBar from '../components/BottomBar';
import SideBar from '../components/SideBar';
import { MdAccountCircle } from 'react-icons/md';
import { FiEdit } from 'react-icons/fi';
import { useFetch } from '../hooks/useFetch';
import { AuthContext } from '../context/AuthState';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import Spinner from '../components/Spinner';
import Helmet from 'react-helmet';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const SettingsPage = () => {
  const [active, setActive] = useState(0);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const types = ['image/png', 'image/jpg', 'image/jpeg'];

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);

  const navigate = useNavigate();

  const { user: token, logout } = useContext(AuthContext);

  const data = useFetch('user', `${API_URL}/users/me`, token);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    setUsername(data?.data?.username);
    setEmail(data?.data?.email);
    setBio(data?.data?.bio || '');
    setLink(data?.data?.link || '');
    setImage(data?.data?.picture || null);
  }, []);

  const updateFunc = async (theData) => {
    try {
      const res = await axios.put(
        `${API_URL}/users/${data?.data?.id}`,
        theData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.statusText) {
        alert('Profile updated successfully!');
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

  const changePasswordFunc = async (theData) => {
    try {
      const res = await axios.post(
        `${API_URL}/custom/change-password`,
        theData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.statusText) {
        alert('Please log back in with the new password!');
        logout();
        navigate('/');
      }
      return res.data;
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  const queryClient = useQueryClient();

  const { mutate: updateProile, isLoading } = useMutation(updateFunc, {
    onSuccess: () => queryClient.invalidateQueries('user'),
  });

  const { mutate: uploadImg, isLoading: isLoadingImg } = useMutation(
    uploadImgFunc,
    {
      onSuccess: () => queryClient.invalidateQueries('image'),
    }
  );

  const { mutate: changePassword, isLoading: isLoadingChangePassword } =
    useMutation(changePasswordFunc, {
      onSuccess: () => queryClient.invalidateQueries('user'),
    });

  const handleProfileEdit = (e) => {
    e.preventDefault();
    updateProile({ picture: image, username, email, bio, link });
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && types.includes(selected.type)) {
      setImagePreview(selected);
      const formData = new FormData();
      formData.append('files', selected);
      formData.append('ref', 'images');
      formData.append('field', 'image');
      uploadImg(formData);
    } else {
      alert('PLEASE SELECT (jpg,png or jpeg)');
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword === confirmNewPassword) {
      changePassword({ currentPassword, newPassword, confirmNewPassword });
    } else {
      alert('password doesnt match');
    }
  };

  return (
    <>
      <Helmet>
        <title>Settings | ShareGram</title>
      </Helmet>
      <div className='grid md:grid-cols-12 grid-cols-1'>
        <section className='hidden md:block md:col-span-2'>
          <SideBar />
        </section>
        <section className='md:col-span-10 md:h-screen md:overflow-y-auto'>
          <div className='my-5'>
            <div className='flex justify-center'>
              <button
                className={`${
                  active === 0 ? 'bg-primary text-white' : 'bg-white'
                } p-3 w-2/5`}
                onClick={() => setActive(0)}
              >
                Edit Profile
              </button>
              <button
                className={`${
                  active === 1 ? 'bg-primary text-white' : 'bg-white'
                } p-3 w-2/5`}
                onClick={() => setActive(1)}
              >
                Change Pasword
              </button>
            </div>

            <div className='my-20 px-4 md:px-40 container mx-auto'>
              {active === 0 ? (
                <form onSubmit={handleProfileEdit}>
                  <div className='grid md:grid-cols-2 grid-cols-1 gap-5 items-center my-10'>
                    <p className='md:text-xl'>Profile pic</p>

                    {isLoadingImg === true ? (
                      <Spinner />
                    ) : imagePreview ? (
                      <label htmlFor='file-input' className='cursor-pointer'>
                        <img
                          src={URL.createObjectURL(imagePreview)}
                          alt='profile-pic'
                          height={170}
                          width={170}
                          className='rounded-2xl'
                        />
                        <FiEdit className='my-2' fontSize='1.2rem' />
                      </label>
                    ) : data?.data?.picture ? (
                      <label htmlFor='file-input' className='cursor-pointer'>
                        <img
                          src={data?.data?.picture?.url}
                          alt='profile-pic'
                          height={170}
                          width={170}
                          className='rounded-2xl'
                        />
                        <FiEdit className='my-2' fontSize='1.2rem' />
                      </label>
                    ) : (
                      <label htmlFor='file-input' className='cursor-pointer'>
                        <MdAccountCircle className='md:h-44 md:w-44 h-20 w-20' />
                        <FiEdit className='my-2' fontSize='1.2rem' />
                      </label>
                    )}
                    <input
                      id='file-input'
                      type='file'
                      className='hidden'
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className='grid md:grid-cols-2 grid-cols-1 gap-5 items-center my-10'>
                    <p className='md:text-xl'>Username</p>
                    <input
                      type='text'
                      name='name'
                      className='bg-[#FAFAFA] p-1 outline-none border-2'
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className='grid md:grid-cols-2 grid-cols-1 gap-5 items-center my-10'>
                    <p className='md:text-xl'>Email</p>
                    <input
                      type='email'
                      name='email'
                      className='bg-[#FAFAFA] p-1 outline-none border-2'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className='grid md:grid-cols-2 grid-cols-1 gap-5 items-center my-10'>
                    <p className='md:text-xl'>Bio</p>
                    <textarea
                      type='text'
                      name='name'
                      className='bg-[#FAFAFA] p-1 outline-none border-2 h-32'
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>
                  <div className='grid md:grid-cols-2 grid-cols-1 gap-5 items-center my-10'>
                    <p className='md:text-xl'>Link</p>
                    <input
                      type='text'
                      name='url'
                      className='bg-[#FAFAFA] p-1 outline-none border-2'
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                    />
                  </div>
                  <div className='flex justify-end'>
                    {isLoading === true ? (
                      <button
                        disabled
                        className='bg-primary opacity-50 text-white p-1 rounded-md md:w-2/4 w-full'
                      >
                        loading...
                      </button>
                    ) : (
                      <button className='bg-primary text-white p-1 rounded-md md:w-2/4 w-full'>
                        Update
                      </button>
                    )}
                  </div>
                  <div className='flex justify-end my-10'>
                    <button
                      className='bg-red-500 text-white p-1 rounded-md w-full'
                      onClick={() => {
                        logout();
                        navigate('/');
                      }}
                    >
                      Log out
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handlePasswordChange}>
                  <div className='grid md:grid-cols-2 grid-cols-1 gap-5 items-center my-10'>
                    <p className='md:text-xl'>Current Password</p>
                    <input
                      type={showPassword1 ? 'text' : 'password'}
                      name='name'
                      className='bg-[#FAFAFA] p-1 outline-none border-2'
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    {currentPassword.length >= 1 ? (
                      !showPassword1 ? (
                        <AiFillEye
                          className='absolute md:right-44 right-8 bottom-[20.3rem] no-bottom cursor-pointer'
                          fontSize='1.2rem'
                          onClick={() => setShowPassword1(!showPassword1)}
                        />
                      ) : (
                        <AiFillEyeInvisible
                          className='absolute md:right-44 right-8 bottom-[20.3rem] no-bottom cursor-pointer'
                          fontSize='1.2rem'
                          onClick={() => setShowPassword1(!showPassword1)}
                        />
                      )
                    ) : (
                      ''
                    )}
                  </div>
                  <div className='grid md:grid-cols-2 grid-cols-1 gap-5 items-center my-10'>
                    <p className='md:text-xl'>New Password</p>
                    <input
                      type={showPassword2 ? 'text' : 'password'}
                      name='email'
                      className='bg-[#FAFAFA] p-1 outline-none border-2'
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    {newPassword.length >= 1 ? (
                      !showPassword2 ? (
                        <AiFillEye
                          className='absolute md:right-44 right-8 bottom-[12.8rem] no-bottom cursor-pointer'
                          fontSize='1.2rem'
                          onClick={() => setShowPassword2(!showPassword2)}
                        />
                      ) : (
                        <AiFillEyeInvisible
                          className='absolute md:right-44 right-8 bottom-[12.8rem] no-bottom cursor-pointer'
                          fontSize='1.2rem'
                          onClick={() => setShowPassword2(!showPassword2)}
                        />
                      )
                    ) : (
                      ''
                    )}
                  </div>
                  <div className='grid md:grid-cols-2 grid-cols-1 gap-5 items-center my-10'>
                    <p className='md:text-xl'>Confirm Password</p>
                    <input
                      type={showPassword3 ? 'text' : 'password'}
                      name='email'
                      className='bg-[#FAFAFA] p-1 outline-none border-2'
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                    {confirmNewPassword.length >= 1 ? (
                      !showPassword3 ? (
                        <AiFillEye
                          className='absolute md:right-44 right-8 bottom-[5.3rem] no-bottom cursor-pointer'
                          fontSize='1.2rem'
                          onClick={() => setShowPassword3(!showPassword3)}
                        />
                      ) : (
                        <AiFillEyeInvisible
                          className='absolute md:right-44 right-8 bottom-[5.3rem] no-bottom cursor-pointer'
                          fontSize='1.2rem'
                          onClick={() => setShowPassword3(!showPassword3)}
                        />
                      )
                    ) : (
                      ''
                    )}
                  </div>
                  <div className='flex justify-end'>
                    {isLoadingChangePassword === true ? (
                      <button
                        disabled
                        className='bg-primary opacity-50 text-white p-1 rounded-md md:w-2/4 w-full'
                      >
                        loading...
                      </button>
                    ) : (
                      <button className='bg-primary text-white p-1 rounded-md md:w-2/4 w-full outline-none'>
                        Update
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
        <div className='md:hidden'>
          <BottomBar />
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
