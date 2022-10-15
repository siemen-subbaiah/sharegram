import React from 'react';
import SideBar from '../components/SideBar';
import BottomBar from '../components/BottomBar';
import DetailedPost from '../components/DetailedPost';

const DetailedPage = () => {
  return (
    <div className='grid md:grid-cols-12 grid-cols-1 relative'>
      <section className='hidden md:block md:col-span-2'>
        <SideBar />
      </section>
      <section className='md:col-span-10 md:h-screen md:overflow-y-auto px-4'>
        <DetailedPost />
      </section>
      <div className='md:hidden'>
        <BottomBar />
      </div>
    </div>
  );
};

export default DetailedPage;
