import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthState';

const Confirm = () => {
  const { handleConfirmYes, closeModal } = useContext(AuthContext);

  return (
    <div className='bg-backDrop absolute w-full h-full right-0 top-0 flex items-center justify-center'>
      <section className='dark:bg-gray-800 bg-white border md:w-1/4 w-2/3 text-center p-5 rounded-md'>
        <h1 className='md:text-xl'>Are you sure you to delete this?</h1>
        <div className='flex gap-5 mt-2 justify-center'>
          <button
            className='text-[#d32f2f] dark:text-[#d92e2e]'
            onClick={handleConfirmYes}
          >
            Yes
          </button>
          <button
            className='text-[#2e7d32] dark:text-green-500'
            onClick={closeModal}
          >
            No
          </button>
        </div>
      </section>
    </div>
  );
};

export default Confirm;
