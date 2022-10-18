import axios from 'axios';
import { API_URL } from '../config';

const addCommentService = async (data) => {
  try {
    const res = await axios.post(`${API_URL}/comments`, data.data, {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    });
    return res.data;
  } catch (err) {
    return err;
  }
};

const editCommentService = async (data) => {
  try {
    const res = await axios.put(`${API_URL}/comments/${data.id}`, data.data, {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    });
    return res.data;
  } catch (err) {
    return err;
  }
};

const deleteCommentService = async (data) => {
  try {
    const res = await axios.delete(`${API_URL}/comments/${data.id}`, {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    });
    return res.data;
  } catch (err) {
    return err;
  }
};

export { addCommentService, editCommentService, deleteCommentService };
