import axios from 'axios';
import { API_URL } from '../config';

const addLikeService = async (data) => {
  try {
    const res = await axios.post(`${API_URL}/likes`, data.data, {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    });
    return res.data;
  } catch (err) {
    return err;
  }
};

const unLikeService = async (data) => {
  try {
    const res = await axios.delete(`${API_URL}/likes/${data.checkLiked}`, {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    });
    return res.data;
  } catch (err) {
    return err;
  }
};

const savePostService = async (data) => {
  try {
    const res = await axios.post(`${API_URL}/saveds`, data.data, {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    });
    return res.data;
  } catch (err) {
    return err;
  }
};

const unSavePostService = async (data) => {
  try {
    const res = await axios.delete(`${API_URL}/saveds/${data.checkSaved}`, {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    });
    return res.data;
  } catch (err) {
    return err;
  }
};

export { addLikeService, unLikeService, savePostService, unSavePostService };
