import React, { useContext } from 'react';
import Post from '../components/Post';
import { API_URL } from '../config';
import { AuthContext } from '../context/AuthState';
import { useFetch } from '../hooks/useFetch';
import noPost from '../images/noPost.svg';
import { MdOutlineAccountCircle } from 'react-icons/md';

const Posts = () => {
  const { user: token } = useContext(AuthContext);

  const data = useFetch(
    'posts',
    `${API_URL}/posts?_sort=created_at:DESC`,
    token
  );
  const data2 = useFetch('user', `${API_URL}/users/me`, token);

  // GET LIST OF FOLLOWERS!
  const following = data2.data?.following?.map((item) => item?.id);

  // GET POSTS FROM NON-FOLLOWING ACCOUNT!
  const posts = data?.data?.filter((item) =>
    following?.includes(item?.user?.id)
  );

  return (
    <>
      <div className='flex justify-center mb-20 md:mt-10 flex-col items-center'>
        {posts?.length === 0 && (
          <div className='my-5 flex justify-center flex-col items-center'>
            <img src={noPost} alt='no-post' height={300} width={300} />
            <p className='my-8 text-2xl'>No posts to show</p>
          </div>
        )}
        {posts?.map((item) => (
          <>
            {data.isLoading === true ? (
              <section className='bg-white shadow-2xl my-4'>
                <div className='p-3'>
                  <MdOutlineAccountCircle
                    fontSize='1.5rem'
                    className='cursor-pointer'
                  />
                </div>
                <img
                  src='https://htmlcolorcodes.com/assets/images/colors/light-gray-color-solid-background-1920x1080.png'
                  alt='loading'
                  height={500}
                  width={500}
                />
              </section>
            ) : (
              <Post
                item={item}
                key={item?.id}
                userId={data2.data?.id}
                username={data2.data?.username}
                loading={data.isLoading}
                saveds={data2?.data.saveds}
              />
            )}
          </>
        ))}
      </div>
    </>
  );
};

export default Posts;
