import React, { useState, useContext } from 'react';
import { API_URL } from '../config';
import { AuthContext } from '../context/AuthState';
import { useQuery } from 'react-query';
import axios from 'axios';
import Spinner from './Spinner';
import { Link } from 'react-router-dom';
import { MdOutlineAccountCircle } from 'react-icons/md';
import noResult from '../images/noPost.svg';

const SearchComp = () => {
  const [search, setSearch] = useState('');

  const { user: token } = useContext(AuthContext);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users?_q=${search}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return err;
    }
  };

  const { data, isFetching, refetch } = useQuery('user-search', fetchUsers, {
    enabled: false,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (search) {
      refetch();
      setSearch('');
    } else {
      alert('Please enter the search term');
    }
  };

  return (
    <>
      <form className='mt-14 border-red-500' onSubmit={handleSearch}>
        <input
          type='text'
          name='search'
          placeholder='Search Users'
          className='p-1 mb-5 mt-3 border-2 rounded-l-md outline-none bg-white text-black md:w-1/4'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className='bg-primary text-white p-[0.36rem] rounded-r-md'>
          SEARCH
        </button>
      </form>

      {isFetching ? (
        <Spinner />
      ) : (
        <>
          {data?.length === 0 ? (
            <div className='mt-5 flex justify-center flex-col items-center'>
              <img src={noResult} alt='no-post' height={300} width={300} />
              <p className='my-8 text-2xl'>No user found</p>
            </div>
          ) : (
            <div className='grid md:grid-cols-2 grid-cols-1 gap-7 my-10'>
              {data?.map((user) => {
                return (
                  <Link
                    to={`/${user?.username}`}
                    key={user?.id}
                    className='flex items-center justify-between gap-4 dark:bg-gray-800 bg-white p-2 rounded-md shadow-2xl'
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
                );
              })}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default SearchComp;
