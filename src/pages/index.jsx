import React from 'react';
import Helmet from 'react-helmet';
import BottomBar from '../components/BottomBar';
import Posts from '../components/Posts';
import SideBar from '../components/SideBar';

const IndexPage = () => {
  return (
    <>
      <Helmet>
        <title>ShareGram</title>
      </Helmet>
      <div className='grid md:grid-cols-12 grid-cols-1'>
        <section className='hidden md:block md:col-span-2'>
          <SideBar />
        </section>
        <section className='md:col-span-10 h-screen overflow-y-auto px-4'>
          <Posts />
        </section>
        <div className='md:hidden'>
          <BottomBar />
        </div>
      </div>
    </>
  );
};

export default IndexPage;
