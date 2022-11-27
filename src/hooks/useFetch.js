import axios from 'axios';
import { useQuery } from 'react-query';

export const useFetch = (key, url, token) => {
  const getData = async () => {
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return err;
    }
  };

  const { data, error, isLoading } = useQuery(key, getData, {
    refetchOnWindowFocus: false,
  });

  return { data, error, isLoading };
};
