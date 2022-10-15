import React, { useContext, useState, useEffect } from 'react';
import Post from '../components/Post';
import { API_URL } from '../config';
import { AuthContext } from '../context/AuthState';
import { useFetch } from '../hooks/useFetch';
import noPost from '../images/noPost.svg';
import Spinner from './Spinner';
import FollowOthers from './FollowOthers';

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
    setRandomUsers(
      usersList?.data?.sort(() => 0.5 - Math.random()).slice(0, 5)
    );
  }, [usersList?.isLoading === false]);

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
            {randomUsers?.map((user) => (
              <FollowOthers user={user} space key={user.id} />
            ))}
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
            showComments
          />
        ))}
      </div>
    </>
  );
};

export default Posts;
