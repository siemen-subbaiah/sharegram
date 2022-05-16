import React, { useState, useContext } from 'react';
import BottomBar from '../components/BottomBar';
import SideBar from '../components/SideBar';
import { MdAccountCircle, MdOutlineMoreHoriz } from 'react-icons/md';
import Photos from '../components/Photos';
import { AuthContext } from '../context/AuthState';
import { useFetch } from '../hooks/useFetch';
import { Link, useParams } from 'react-router-dom';
import { API_URL } from '../config';
import FollowingModal from '../components/FollowingModal';
import FollowersModal from '../components/FollowersModal';
import Saved from '../components/Saveds';
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { RiUserFollowLine, RiUserUnfollowLine } from 'react-icons/ri';
import Helmet from 'react-helmet';

const ProfilePage = () => {
  const [toggle, setToggle] = useState(false);

  const [savedToggle, setSavedToggle] = useState(1);
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);

  const closeModal = () => setFollowersOpen(false);
  const closeModal2 = () => setFollowingOpen(false);

  const { username } = useParams();

  const { user: token } = useContext(AuthContext);

  const localName = localStorage.getItem('user_name')
    ? JSON.parse(localStorage.getItem('user_name'))
    : null;

  const data = useFetch(
    ['user', username === 'profile' ? localName : username],
    username === 'profile'
      ? `${API_URL}/users?username=${localName}`
      : `${API_URL}/users?username=${username}`,
    token
  );
  const data2 = useFetch('user', `${API_URL}/users/me`, token);

  const arrData = data?.data || [];

  // GET LIST OF FOLLOWING!
  const following = data2.data?.following?.map((item) => item?.id);

  const unfollow = following?.filter((item) => item !== arrData[0]?.id);

  const followFunc = async (theData) => {
    const res = await axios.put(`${API_URL}/users/${data2.data.id}`, theData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  };

  const queryClient = useQueryClient();
  const { mutate: followAnyone } = useMutation(followFunc, {
    onSuccess: () => queryClient.invalidateQueries('user'),
  });

  const handleFollow = () => {
    followAnyone({
      following: [...following, arrData[0]?.id],
    });
  };

  const handleUnFollow = () => {
    followAnyone({
      following: unfollow,
    });
  };

  return (
    <>
      <Helmet>
        <title>{`${arrData[0]?.username}`} | ShareGram</title>
      </Helmet>
      <div className='grid md:grid-cols-12 grid-cols-1'>
        <section className='hidden md:block md:col-span-2'>
          <SideBar />
        </section>
        <section className='md:col-span-10 h-screen overflow-y-auto md:px-4'>
          {data.isLoading === true ? (
            <div className='mt-5'>
              <div className='flex gap-4 md:gap-32 md:items-center justify-center'>
                <div>
                  <MdAccountCircle className='md:h-44 md:w-44 h-20 w-20' />
                </div>
                <div>
                  <div className='flex md:items-center md:gap-10 gap-2 flex-col md:flex-row'>
                    <h1 className='md:text-2xl text-xl'>loading</h1>
                  </div>
                  <div className='md:flex md:my-4 my-2 md:gap-14 gap-4 hidden'>
                    <p className='my-2 md:0'>loading</p>
                    <p
                      className='my-2 md:0 cursor-pointer'
                      onClick={() => setFollowersOpen(true)}
                    >
                      loading
                    </p>
                    <p
                      className='my-2 md:0 cursor-pointer'
                      onClick={() => setFollowingOpen(true)}
                    >
                      loading
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className='mt-5'>
              <div className='flex gap-4 md:gap-32 md:items-center justify-center px-2'>
                {arrData[0]?.picture ? (
                  <div>
                    <img
                      src={arrData[0]?.picture?.url}
                      alt='profile-pic'
                      height={150}
                      width={150}
                      className='rounded-[50%]'
                    />
                  </div>
                ) : (
                  <div>
                    <MdAccountCircle className='md:h-44 md:w-44 h-20 w-20' />
                  </div>
                )}
                <div>
                  <div className='flex md:items-center md:gap-10 gap-2 flex-col md:flex-row'>
                    <h1 className='md:text-2xl text-xl'>
                      {arrData[0]?.username}
                    </h1>
                    <div className='flex items-center gap-5'>
                      {arrData[0]?.username?.includes(localName) ? (
                        <Link
                          to='/account/settings'
                          className='md:py-1 px-3 w-28 rounded-2xl border border-black dark:border-white'
                        >
                          Edit profile
                        </Link>
                      ) : following?.includes(arrData[0]?.id) &&
                        arrData?.length >= 1 ? (
                        <span
                          className='btn flex items-center gap-1 cursor-pointer'
                          onClick={handleUnFollow}
                        >
                          <RiUserUnfollowLine />
                          Unfollow
                        </span>
                      ) : (
                        arrData.length >= 1 && (
                          <span
                            className='btn flex items-center gap-1 cursor-pointer'
                            onClick={handleFollow}
                          >
                            <RiUserFollowLine />
                            Follow
                          </span>
                        )
                      )}
                      <MdOutlineMoreHoriz
                        className='md:hidden'
                        fontSize='1.5rem'
                        onClick={() => setToggle(!toggle)}
                      />
                    </div>
                  </div>
                  <div
                    className={`md:flex md:my-4 my-2 md:gap-14 gap-4 ${
                      !toggle && 'hidden'
                    }`}
                  >
                    <p className='my-2 md:0'>
                      {arrData[0]?.posts?.length} posts
                    </p>
                    <p
                      className='my-2 md:0 cursor-pointer'
                      onClick={() => setFollowersOpen(true)}
                    >
                      {arrData[0]?.followers?.length} followers
                    </p>
                    <p
                      className='my-2 md:0 cursor-pointer'
                      onClick={() => setFollowingOpen(true)}
                    >
                      {arrData[0]?.following?.length} following
                    </p>
                  </div>
                  <div className='text-gray-600 dark:text-gray-300'>
                    <p className='my-2 md:text-md'>{arrData[0]?.bio}</p>
                    <a href={arrData[0]?.link}>
                      {arrData[0]?.link?.replace(/^https?\:\/\//i, '')}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
          <hr className='my-3 dark:border-gray-600' />
          {arrData[0]?.username?.includes(localName) && (
            <>
              <div className='flex md:gap-24 gap-10 my-4 justify-center'>
                <button
                  onClick={() => setSavedToggle(1)}
                  className={`${savedToggle === 1 ? 'btn' : ''}`}
                >
                  Posts
                </button>
                <button
                  className={`${savedToggle === 0 ? 'btn' : ''}`}
                  onClick={() => setSavedToggle(0)}
                >
                  Saved
                </button>
              </div>
              <hr className='dark:border-gray-600' />
            </>
          )}
          <div className='hidden md:block'>
            {savedToggle === 0 ? (
              <Saved pics={data2.data?.saveds} />
            ) : (
              <Photos pics={arrData[0]?.posts} />
            )}
          </div>
          <div className='block md:hidden'>
            {savedToggle === 0 ? (
              <Saved pics={data2.data?.saveds} />
            ) : (
              <Photos pics={arrData[0]?.posts} />
            )}
          </div>
        </section>
        <div className='md:hidden'>
          <BottomBar />
        </div>
      </div>
      <FollowingModal
        closeModal={closeModal2}
        modalIsOpen={followingOpen}
        following={arrData[0]?.following}
      />
      <FollowersModal
        closeModal={closeModal}
        modalIsOpen={followersOpen}
        followers={arrData[0]?.followers}
      />
    </>
  );
};

export default ProfilePage;
