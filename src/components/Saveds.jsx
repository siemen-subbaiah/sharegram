import { Link } from 'react-router-dom';
import emptyImg from '../images/empty.svg';

const Saved = ({ pics }) => {
  console.log(pics);

  return (
    <div className='mb-20'>
      {pics.length === 0 ? (
        <div className='my-5 flex justify-center flex-col items-center'>
          <img src={emptyImg} alt='no-post' height={300} width={300} />
          <p className='my-8 text-2xl'>No saved posts</p>
        </div>
      ) : (
        <section className='grid grid-cols-3 md:my-3 place-items-center md:gap-y-5'>
          {pics?.map((item, i) => {
            return (
              <Link to={`/post/${item?.post?.id}`} className='bg-white' key={i}>
                {item?.post?.photo && (
                  <img src={item?.post?.photo?.url} height={300} width={300} />
                )}
              </Link>
            );
          })}
        </section>
      )}
    </div>
  );
};

export default Saved;
