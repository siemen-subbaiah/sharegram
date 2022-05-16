import React from 'react';
import SideBar from '../components/SideBar';
import BottomBar from '../components/BottomBar';
import SearchComp from '../components/SearchComp';
import Helmet from 'react-helmet';

const SearchPage = () => {
  return (
    <>
      <Helmet>
        <title>Search | ShareGram</title>
      </Helmet>
      <div className='grid md:grid-cols-12 grid-cols-1'>
        <section className='hidden md:block md:col-span-2'>
          <SideBar />
        </section>
        <section className='md:col-span-10 h-screen overflow-y-auto px-4'>
          <SearchComp />
        </section>
        <div className='md:hidden'>
          <BottomBar />
        </div>
      </div>
    </>
  );
};

export default SearchPage;
