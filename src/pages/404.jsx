import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import notFound from '../images/notFound.svg';

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>404 | ShareGram</title>
      </Helmet>
      <div className='flex my-7 md:my-10 items-center flex-col h-screen'>
        <img src={notFound} alt='not found' height={600} width={600} />
        <div className='my-10'>
          <Link to='/'>
            <a className='btn'>Home</a>
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
