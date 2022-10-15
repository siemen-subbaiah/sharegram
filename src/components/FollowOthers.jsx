import React from 'react';
import { Link } from 'react-router-dom';
import { MdOutlineAccountCircle } from 'react-icons/md';

const FollowOthers = ({ user, space }) => {
  return (
    <div>
      <Link
        to={`/${user?.username}`}
        key={user?.id}
        className={`flex items-center justify-between gap-4 ${
          space && 'my-10'
        } dark:bg-gray-800 bg-white p-2 rounded-md shadow-2xl`}
      >
        <div>
          <p>{user?.username}</p>
          <p className='text-sm text-gray-400 my-2'>{user?.bio}</p>
        </div>
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
    </div>
  );
};

export default FollowOthers;
