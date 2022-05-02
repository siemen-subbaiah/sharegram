import { Link } from 'react-router-dom';
import emptyImg from '../images/empty.svg';

const Photos = ({ pics }) => {
  const createdPics = pics.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  return (
    <div className='mb-20'>
      {createdPics.length === 0 ? (
        <div className='my-5 flex justify-center flex-col items-center'>
          <img src={emptyImg} alt='no-post' height={300} width={300} />
          <p className='my-8 text-2xl'>No posts</p>
        </div>
      ) : (
        <section className='grid grid-cols-3 md:my-3 place-items-center md:gap-y-5'>
          {createdPics?.map((item, i) => {
            return (
              <Link to={`/post/${item?.id}`} className='bg-white' key={i}>
                <img
                  src={item?.photo?.url}
                  alt={item?.caption}
                  height={300}
                  width={300}
                />
              </Link>
            );
          })}
        </section>
      )}
    </div>
  );
};

export default Photos;
