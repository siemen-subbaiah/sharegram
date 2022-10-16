import React, { useContext, useEffect, useState } from 'react';
import { MdAccountCircle, MdOutlineCancel } from 'react-icons/md';
import { BiEdit } from 'react-icons/bi';
import { RiDeleteBinLine } from 'react-icons/ri';
import { Link, useParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { API_URL } from '../config';
import { AuthContext } from '../context/AuthState';
import Post from './Post';
import { Helmet } from 'react-helmet';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import Confirm from './Confirm';

const DetailedPost = () => {
  const [comment, setComment] = useState('');
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(0);

  const [deleteId, setDeleteId] = useState('');

  const { id } = useParams();

  const {
    user: token,
    modalValue,
    openModal,
    closeModal,
    handleConfirmNo,
    confirmValue,
  } = useContext(AuthContext);

  const data = useFetch(['posts', id], `${API_URL}/posts/${id}`, token);
  const data2 = useFetch('user', `${API_URL}/users/me`, token);

  const arrData = data?.data || [];

  const commentFunc = async (theData) => {
    try {
      const res = await axios.post(`${API_URL}/comments`, theData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return err;
    }
  };

  const editCommentFunc = async (theData) => {
    try {
      const res = await axios.put(`${API_URL}/comments/${editId}`, theData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return err;
    }
  };

  const deleteCommentFunc = async (editDId) => {
    try {
      const res = await axios.delete(`${API_URL}/comments/${editDId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return err;
    }
  };

  const queryClient = useQueryClient();

  const { mutate: commentNow, isLoading } = useMutation(commentFunc, {
    onSuccess: () => queryClient.invalidateQueries(['posts', id]),
  });

  const { mutate: editComment, isLoading: editLoading } = useMutation(
    editCommentFunc,
    {
      onSuccess: () => queryClient.invalidateQueries(['posts', id]),
    }
  );

  const { mutate: deleteComment } = useMutation(deleteCommentFunc, {
    onSuccess: () => queryClient.invalidateQueries(['posts', id]),
  });

  const handleCommenting = (e) => {
    e.preventDefault();
    editing
      ? editComment({
          comment,
          username: data2.data?.username,
          user: {
            id: data2.data?.id,
          },
          post: {
            id: arrData[0]?.id,
          },
        })
      : commentNow({
          comment,
          username: data2.data?.username,
          user: {
            id: data2.data?.id,
          },
          post: {
            id: arrData[0]?.id,
          },
        });
    setComment('');
    setEditing(false);
    setEditId(false);
  };

  const handleEditing = (selectedComment, selectedId) => {
    setEditing(true);
    setComment(selectedComment);
    setEditId(selectedId);
  };

  const handleDeleting = () => {
    openModal();
    setEditing(false);
    setComment('');
    setEditId('');
  };

  useEffect(() => {
    if (confirmValue) {
      deleteComment(deleteId);
      handleConfirmNo();
      closeModal();
    }
  }, [confirmValue]);

  return (
    <>
      <Helmet>
        <title>
          {`${arrData[0]?.user?.username} - ${arrData[0]?.caption}`}
        </title>
        <meta name='description' content={arrData[0]?.caption} />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://share-gram.netlify.app/' />
        <meta property='og:title' content='Sharegram' />
        <meta property='og:description' content={`${arrData[0]?.caption}`} />
        <meta property='og:image' content={arrData[0]?.photo?.url} />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:creator' content='@sharegram' />
        <meta name='twitter:title' content='Sharegram' />
        <meta name='twitter:description' content={`${arrData[0]?.caption}`} />
        <meta name='twitter:image' content={arrData[0]?.photo?.url} />
      </Helmet>
      <div className='grid md:grid-cols-2 grid-cols-1 gap-10 md:justify-items-center md:items-start md:mb-20'>
        <Post
          item={arrData[0]}
          userId={data2.data?.id}
          username={data2.data?.username}
          loading={data.isLoading}
          saveds={data2.data?.saveds}
          showComments={false}
        />

        <div className='md:my-10 md:border-l-2 md:pl-5 mb-20 md:mb-0 md:w-3/4'>
          <h1 className='text-xl'>Comments</h1>
          {arrData[0]?.comments.length === 0 ? (
            <p className='my-2'>No comments found!</p>
          ) : (
            arrData[0]?.comments?.map((item) => {
              return (
                <div className='my-5' key={item?.id}>
                  <div className='flex items-center gap-3'>
                    <Link
                      to={`/${item?.user?.username}`}
                      className='flex items-center gap-3 w-max'
                    >
                      {item?.user?.picture ? (
                        <div>
                          <img
                            src={item?.user?.picture?.url}
                            alt='profile-pic'
                            height={30}
                            width={30}
                            className='rounded-2xl'
                          />
                        </div>
                      ) : (
                        <div>
                          <MdAccountCircle className='h-10 w-10' />
                        </div>
                      )}
                      <h1 className='md:text-md font-semibold'>
                        {item?.user?.username}
                      </h1>
                    </Link>

                    <>
                      {data2.data?.id === item?.user?.id && (
                        <div className='flex items-center gap-1 cursor-pointer'>
                          {editing === false ? (
                            <BiEdit
                              fontSize='1.1rem'
                              onClick={() => {
                                handleEditing(item?.comment, item?.id);
                              }}
                            />
                          ) : (
                            <MdOutlineCancel
                              fontSize='1.1rem'
                              className='cursor-pointer'
                              onClick={() => {
                                setEditing(false);
                                setComment('');
                              }}
                            />
                          )}
                          <RiDeleteBinLine
                            fontSize='1.1rem'
                            onClick={() => {
                              handleDeleting();
                              setDeleteId(item?.id);
                            }}
                          />
                        </div>
                      )}
                    </>
                  </div>
                  <p className='my-3 text-md'>{item?.comment}</p>
                </div>
              );
            })
          )}
          <div className='flex my-5' id='comment'>
            <form onSubmit={handleCommenting}>
              <input
                type='text'
                name='comment'
                placeholder='Add a comment'
                className='p-2 shadow-2xl outline-none rounded-l-md text-black'
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              {comment.length >= 1 ? (
                isLoading === true || editLoading === true ? (
                  <button
                    className='opacity-50 bg-primary p-2 px-4 rounded-r-md text-white'
                    disabled
                  >
                    Loading...
                  </button>
                ) : (
                  <button className='bg-primary p-2 px-4 rounded-r-md text-white'>
                    {editing ? 'Edit' : ' Post'}
                  </button>
                )
              ) : (
                <button
                  className='opacity-50 bg-primary p-2 px-4 rounded-r-md text-white'
                  disabled
                >
                  Post
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
      {modalValue && <Confirm />}
    </>
  );
};

export default DetailedPost;
