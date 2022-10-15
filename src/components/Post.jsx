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
import {
  addLikeService,
  savePostService,
  unLikeService,
  unSavePostService,
} from '../services/postService';

const Post = ({ item, userId, username, loading, saveds, showComments }) => {
  const [modalIsOpen, setIsModalIsOpen] = useState(false);
  const [shareModalIsOpen, setShareIsModalIsOpen] = useState(false);
  const [moreModalIsOpen, setMoreModalIsOpen] = useState(false);

  const closeModal = () => setIsModalIsOpen(false);
  const closeShareModal = () => setShareIsModalIsOpen(false);
  const closeMoreModal = () => setMoreModalIsOpen(false);

  const [caption, setCaption] = useState('');
  const [captionEdit, setCaptionEdit] = useState(false);

  const checkLiked = item?.likes.find((item) => item?.user?.id === userId);
  const checkSaved = saveds?.find((fi) => fi?.post?.id === item?.id);

  const { user: token } = useContext(AuthContext);

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

  const { mutate: likePost } = useMutation(addLikeService, {
    onSuccess: () => queryClient.invalidateQueries('posts'),
  });

  const { mutate: unLikePost } = useMutation(unLikeService, {
    onSuccess: () => queryClient.invalidateQueries('posts'),
  });

  const { mutate: savePost } = useMutation(savePostService, {
    onSuccess: () => queryClient.invalidateQueries('user'),
  });

  const { mutate: unSavePost } = useMutation(unSavePostService, {
    onSuccess: () => queryClient.invalidateQueries('user'),
  });

  const { mutate: editCaptionFinal, isLoading } = useMutation(
    captionEdittFunc,
    {
      onSuccess: () => queryClient.invalidateQueries('posts'),
    }
  );

  const handleLiking = (postId) => {
    const data = {
      likes: 1,
      username,
      user: {
        id: userId,
      },
      post: {
        id: postId,
      },
    };

    likePost({ data, token });
  };

  const handleUnLiking = () => {
    unLikePost({ checkLiked: checkLiked?.id, token });
  };

  const handleSaving = (post) => {
    const data = {
      user: {
        id: userId,
      },
      post,
    };
    savePost({ data, token });
  };

  const handleUnSaving = () => {
    unSavePost({ checkSaved: checkSaved?.id, token });
  };

  const handleCaptionEdit = (e) => {
    e.preventDefault();
    if (caption) {
      editCaptionFinal({ caption, user: { id: item?.user?.id } });
    }
  };

  return (
    <>
      <section className='bg-white shadow-2xl my-4 dark:bg-gray-800'>
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
            <img
              onDoubleClick={() => handleLiking(item?.id)}
              src={item?.photo?.url}
              alt='post'
              height={550}
              width={550}
              loading='lazy'
            />
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
                onClick={() => handleSaving(item)}
              />
            )}
          </div>
        </div>
        <p
          className='px-3 cursor-pointer'
          onClick={() => setIsModalIsOpen(true)}
        >
          {item?.likes.length} likes
        </p>
        <div className='p-3'>
          <div className='flex items-center justify-between'>
            {captionEdit ? (
              <>
                <form onSubmit={handleCaptionEdit} className='w-full'>
                  <input
                    type='text'
                    name='caption'
                    className='p-2 shadow-2xl outline-none rounded-l-md text-black'
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
          <hr className='dark:border-gray-600 my-1' />
          {showComments ? (
            <>
              <Link to={`/post/${item?.id}`} className='text-gray-400 text-sm'>
                {item?.comments?.length > 2 &&
                  `view all ${item?.comments?.length} comments`}
              </Link>
              {item?.comments
                ?.sort(
                  (a, b) => new Date(b.published_at) - new Date(a.published_at)
                )
                .slice(0, 2)
                .map((comment) => {
                  return (
                    <div key={comment?.id} className='flex gap-1 my-2'>
                      <strong>{comment?.user?.username}:</strong>
                      <p>{comment?.comment}</p>
                    </div>
                  );
                })}
            </>
          ) : (
            <p>{item?.comments?.length} comments</p>
          )}
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
