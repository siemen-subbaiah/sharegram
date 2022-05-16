import React, { useContext } from 'react';
import SideBar from '../components/SideBar';
import BottomBar from '../components/BottomBar';
import Masonry from 'react-masonry-css';
import { useFetch } from '../hooks/useFetch';
import { API_URL } from '../config';
import { AuthContext } from '../context/AuthState';
import { Link } from 'react-router-dom';
import noPost from '../images/noPost.svg';
import Helmet from 'react-helmet';

const ExplorePage = () => {
  const { user: token } = useContext(AuthContext);

  const data = useFetch('posts', `${API_URL}/posts`, token);
  const data2 = useFetch('user', `${API_URL}/users/me`, token);

  // GET LIST OF FOLLOWERS!
  const following = data2.data?.following?.map((item) => item?.id) || [];

  // GET POSTS FROM NON-FOLLOWING ACCOUNT!
  const publicPosts = data?.data?.filter(
    (item) => ![...following, data2?.data?.id]?.includes(item?.user?.id)
  );

  const breakpointColumnsObj = {
    default: 4,
    1200: 3,
    1000: 2,
  };

  return (
    <>
      <Helmet>
        <title>ShareGram | Explore</title>
      </Helmet>
      <div className='grid md:grid-cols-12 grid-cols-1'>
        <section className='hidden md:block md:col-span-2'>
          <SideBar />
        </section>
        <section className='md:col-span-10 h-screen overflow-y-auto'>
          {publicPosts?.length === 0 ? (
            <div className='my-5 flex justify-center flex-col items-center'>
              <img src={noPost} alt='no-post' height={300} width={300} />
              <p className='my-8 text-2xl'>No posts to show</p>
            </div>
          ) : (
            <Masonry
              className='flex mb-20 gap-1'
              breakpointCols={breakpointColumnsObj}
            >
              {publicPosts?.map((image) => (
                <Link to={`/post/${image?.id}`} key={image?.id}>
                  <img
                    className='my-1'
                    src={image?.photo?.url}
                    alt={image?.caption}
                    height={300}
                    width={300}
                    loading='lazy'
                  />
                </Link>
              ))}
            </Masonry>
          )}
        </section>
        <div className='md:hidden'>
          <BottomBar />
        </div>
      </div>
    </>
  );
};

export default ExplorePage;
