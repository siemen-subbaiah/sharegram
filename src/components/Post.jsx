import { useContext, useState } from 'react';
import {
  MdOutlineAccountCircle,
  MdOutlineMoreHoriz,
  MdOutlineCancel,
} from 'react-icons/md';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { BiShareAlt, BiEdit } from 'react-icons/bi';
import { BsFillBookmarkFill, BsBookmark } from 'react-icons/bs';
import { FaRegComment } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthState';
import { API_URL } from '../config';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import LikeModal from './LikeModal';
import ShareModal from './ShareModal';
import MoreModal from './MoreModal';

const Post = ({ item, userId, username, loading, saveds }) => {
  const [modalIsOpen, setIsModalIsOpen] = useState(false);
  const [shareModalIsOpen, setShareIsModalIsOpen] = useState(false);
  const [moreModalIsOpen, setMoreModalIsOpen] = useState(false);

  const closeModal = () => setIsModalIsOpen(false);
  const closeShareModal = () => setShareIsModalIsOpen(false);
  const closeMoreModal = () => setMoreModalIsOpen(false);

  const [caption, setCaption] = useState('');
  const [captionEdit, setCaptionEdit] = useState(false);

  const checkLiked = item?.likes.find((item) => item?.user?.id === userId);
  const checkSaved = saveds?.find((fi) => fi?.postId === item?.id);

  const { user: token } = useContext(AuthContext);

  const likePostFunc = async (theData) => {
    try {
      const res = await axios.post(`${API_URL}/likes`, theData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return err;
    }
  };

  const unLikePostFunc = async () => {
    try {
      const res = await axios.delete(`${API_URL}/likes/${checkLiked?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return err;
    }
  };

  const savePostFunc = async (theData) => {
    try {
      const res = await axios.post(`${API_URL}/saveds`, theData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return err;
    }
  };

  const unSavePostFunc = async () => {
    try {
      const res = await axios.delete(`${API_URL}/saveds/${checkSaved?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return err;
    }
  };

  const captionEdittFunc = async (theData) => {
    try {
      const res = await axios.put(`${API_URL}/posts/${item?.id}`, theData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.statusText) {
        setCaption('');
        setCaptionEdit(false);
      }
      return res.data;
    } catch (err) {
      return err;
    }
  };

  const queryClient = useQueryClient();

  const { mutate: likePost } = useMutation(likePostFunc, {
    onSuccess: () => queryClient.invalidateQueries('posts'),
  });

  const { mutate: unLikePost } = useMutation(unLikePostFunc, {
    onSuccess: () => queryClient.invalidateQueries('posts'),
  });

  const { mutate: savePost } = useMutation(savePostFunc, {
    onSuccess: () => queryClient.invalidateQueries('user'),
  });

  const { mutate: unSavePost } = useMutation(unSavePostFunc, {
    onSuccess: () => queryClient.invalidateQueries('user'),
  });

  const { mutate: editCaptionFinal, isLoading } = useMutation(
    captionEdittFunc,
    {
      onSuccess: () => queryClient.invalidateQueries('posts'),
    }
  );

  const handleLiking = (postId) => {
    likePost({
      likes: 1,
      username,
      user: {
        id: userId,
      },
      post: {
        id: postId,
      },
    });
  };

  const handleUnLiking = () => {
    unLikePost();
  };

  const handleSaving = (url, postId) => {
    savePost({
      image: url,
      username: username,
      user: {
        id: userId,
      },
      postId,
    });
  };

  const handleUnSaving = () => {
    unSavePost();
  };

  const handleCaptionEdit = (e) => {
    e.preventDefault();
    if (caption) {
      editCaptionFinal({ caption, user: { id: item?.user?.id } });
    }
  };

  return (
    <>
      <section className='bg-white shadow-2xl my-4'>
        <div className='flex items-center justify-between p-3'>
          <Link
            to={`/${item?.user?.username}`}
            className='flex items-center gap-3'
          >
            {item?.user?.picture ? (
              <img
                src={item?.user?.picture?.url}
                alt='profile-pic'
                height={40}
                width={40}
                className='rounded-3xl'
              />
            ) : (
              <MdOutlineAccountCircle
                fontSize='1.5rem'
                className='cursor-pointer'
              />
            )}
            <h1 className='md:text-xl text-sm'>{item?.user?.username}</h1>
          </Link>
          {item?.user?.id === userId && (
            <MdOutlineMoreHoriz
              fontSize='1.2rem'
              className='cursor-pointer'
              onClick={() => setMoreModalIsOpen(true)}
            />
          )}
        </div>
        <Link to={`/post/${item?.id}`}>
          {loading === true ? (
            <img
              src='https://htmlcolorcodes.com/assets/images/colors/light-gray-color-solid-background-1920x1080.png'
              alt='loading'
              height={500}
              width={500}
            />
          ) : (
            <img src={item?.photo?.url} alt='post' height={500} width={500} />
          )}
        </Link>
        <div className='mt-3 p-3'>
          <div className='flex justify-between'>
            <div className='flex gap-4'>
              {checkLiked ? (
                <AiFillHeart
                  onClick={() => handleUnLiking(item?.id)}
                  fontSize='1.5rem'
                  className='cursor-pointer'
                />
              ) : (
                <AiOutlineHeart
                  onClick={() => handleLiking(item?.id)}
                  fontSize='1.5rem'
                  className='cursor-pointer'
                />
              )}
              <Link to={`/post/${item?.id}`}>
                <FaRegComment fontSize='1.5rem' className='cursor-pointer' />
              </Link>

              <BiShareAlt
                fontSize='1.5rem'
                className='cursor-pointer'
                onClick={() => setShareIsModalIsOpen(true)}
              />
            </div>

            {checkSaved ? (
              <BsFillBookmarkFill
                fontSize='1.5rem'
                className='cursor-pointer'
                onClick={handleUnSaving}
              />
            ) : (
              <BsBookmark
                fontSize='1.5rem'
                className='cursor-pointer'
                onClick={() => handleSaving(item?.photo?.url, item.id)}
              />
            )}
          </div>
        </div>
        <p
          className='px-3 mb-2 cursor-pointer'
          onClick={() => setIsModalIsOpen(true)}
        >
          {item?.likes.length} likes
        </p>
        <hr />
        <div className='p-3'>
          <div className='flex items-center justify-between'>
            {captionEdit ? (
              <>
                <form onSubmit={handleCaptionEdit} className='w-full'>
                  <input
                    type='text'
                    name='caption'
                    className='p-2 shadow-2xl outline-none rounded-l-md'
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                  />
                  {caption.length >= 1 ? (
                    isLoading === true ? (
                      <button
                        className='opacity-50 bg-primary p-2 px-4 rounded-r-md text-white'
                        disabled
                      >
                        Edit
                      </button>
                    ) : (
                      <button className='bg-primary p-2 px-4 rounded-r-md text-white'>
                        Edit
                      </button>
                    )
                  ) : (
                    <button
                      className='opacity-50 bg-primary p-2 px-4 rounded-r-md text-white'
                      disabled
                    >
                      Edit
                    </button>
                  )}
                </form>
              </>
            ) : (
              <p>{item?.caption}</p>
            )}
            {item?.user?.id === userId && (
              <>
                {captionEdit === false ? (
                  <BiEdit
                    fontSize='1.2rem'
                    className='cursor-pointer'
                    onClick={() => {
                      setCaptionEdit(true);
                      setCaption(item?.caption);
                    }}
                  />
                ) : (
                  <MdOutlineCancel
                    fontSize='1.5rem'
                    className='cursor-pointer'
                    onClick={() => {
                      setCaptionEdit(false);
                    }}
                  />
                )}
              </>
            )}
          </div>
          <p className='mt-3 text-gray-400 text-sm'>
            {item?.comments?.length} comments
          </p>
        </div>
      </section>
      <LikeModal
        closeModal={closeModal}
        modalIsOpen={modalIsOpen}
        likes={item?.likes}
      />
      <ShareModal
        closeModal={closeShareModal}
        modalIsOpen={shareModalIsOpen}
        link={`https://share-gram.netlify.app/post/${item?.id}`}
        caption={item?.caption}
      />
      <MoreModal
        closeModal={closeMoreModal}
        modalIsOpen={moreModalIsOpen}
        postId={item?.id}
        photoId={item?.photo?.id}
      />
    </>
  );
};

export default Post;
