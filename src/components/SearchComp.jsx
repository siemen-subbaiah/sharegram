import React, { useState, useContext, useEffect } from 'react';
import { API_URL } from '../config';
import { AuthContext } from '../context/AuthState';
import { useQuery } from 'react-query';
import axios from 'axios';
import Spinner from './Spinner';
import noResult from '../images/noPost.svg';
import FollowOthers from './FollowOthers';
import { useFetch } from '../hooks/useFetch';

const SearchComp = () => {
  const [search, setSearch] = useState('');
  const [randomUsers, setRandomUsers] = useState([]);

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

  const { data: users } = useFetch('user-list', `${API_URL}/users`, token);

  const myFollowingData = useFetch('user', `${API_URL}/users/me`, token);

  const following =
    myFollowingData.data?.following?.map((item) => item?.id) || [];

  const suggestions = users?.filter((user) => !following.includes(user?.id));

  useEffect(() => {
    setRandomUsers(suggestions?.sort(() => 0.5 - Math.random()).slice(0, 5));
  }, []);

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
    <div className='mb-20'>
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

      <div className='grid md:grid-cols-2 grid-cols-1 gap-7'>
        <>
          {isFetching ? (
            <Spinner />
          ) : data?.length === 0 ? (
            <div className='mt-5 flex justify-center flex-col items-center'>
              <img src={noResult} alt='no-post' height={300} width={300} />
              <p className='my-8 text-2xl'>No user found</p>
            </div>
          ) : (
            <section>
              {data?.map((user) => (
                <FollowOthers user={user} space key={user.id} />
              ))}
            </section>
          )}
        </>
        <section className='md:border-l-2 md:pl-5 mb-20 md:mb-0 md:w-3/4'>
          <h1 className='text-xl'>Suggestions for you</h1>
          {randomUsers?.map((user) => (
            <FollowOthers user={user} space key={user.id} />
          ))}
        </section>
      </div>
    </div>
  );
};

export default SearchComp;
