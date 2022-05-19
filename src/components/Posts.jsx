import React, { useContext, useState, useEffect } from 'react';
import Post from '../components/Post';
import { API_URL } from '../config';
import { AuthContext } from '../context/AuthState';
import { useFetch } from '../hooks/useFetch';
import noPost from '../images/noPost.svg';
import { MdOutlineAccountCircle } from 'react-icons/md';
import { Link } from 'react-router-dom';
import Spinner from './Spinner';

const Posts = () => {
  const [randomUsers, setRandomUsers] = useState([]);

  const { user: token } = useContext(AuthContext);

  const data = useFetch(
    'posts',
    `${API_URL}/posts?_sort=created_at:DESC`,
    token
  );
  const data2 = useFetch('user', `${API_URL}/users/me`, token);

  const usersList = useFetch('user-list', `${API_URL}/users`, token);

  useEffect(() => {
    setRandomUsers(usersList.data?.sort(() => 0.5 - Math.random()).slice(0, 5));
  }, []);

  // GET LIST OF FOLLOWERS!
  const following = data2.data?.following?.map((item) => item?.id);

  // GET POSTS FROM FOLLOWING ACCOUNT!
  const posts = data?.data?.filter((item) =>
    following?.includes(item?.user?.id)
  );

  return (
    <>
      {data.isLoading && (
        <div className='flex items-center h-screen'>
          <Spinner />
        </div>
      )}
      <div className='flex justify-center mb-20 md:mt-10 flex-col items-center'>
        {following?.length >= 1 && posts?.length === 0 && (
          <div className='mt-5 flex justify-center flex-col items-center'>
            <img src={noPost} alt='no-post' height={300} width={300} />
            <p className='my-8 text-2xl'>No posts to show</p>
          </div>
        )}

        {following?.length === 0 && (
          <div className='my-1'>
            <p className='my-8 text-2xl text-center'>
              Here are some accounts to follow
            </p>
            {randomUsers?.map((user) => {
              return (
                <Link
                  to={`/${user?.username}`}
                  key={user?.id}
                  className='flex items-center justify-between gap-4 my-10 dark:bg-gray-800 bg-white p-2 rounded-md shadow-2xl'
                >
                  <p>{user?.username}</p>
                  {user?.picture ? (
                    <img
                      src={user?.picture?.url}
                      alt='profile-pic'
                      height={40}
                      width={40}
                      className='rounded-3xl'
                    />
                  ) : (
                    <MdOutlineAccountCircle
                      fontSize='2.5rem'
                      className='cursor-pointer'
                    />
                  )}
                </Link>
              );
            })}
          </div>
        )}
        {posts?.map((item) => (
          <Post
            key={item?.id}
            item={item}
            userId={data2.data?.id}
            username={data2.data?.username}
            loading={data.isLoading}
            saveds={data2?.data.saveds}
          />
        ))}
      </div>
    </>
  );
};

export default Posts;
