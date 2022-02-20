import { useRouter } from 'next/router';
import React from 'react';
import { BsPlayFill } from 'react-icons/bs';

type PropsType = {
  id: string;
  title: string;
  subTitle: string;
  imgUrl: string;
};

export default function Banner({ id, title, subTitle, imgUrl }: PropsType) {
  const router = useRouter();

  const handleOnPlay = () => {
    router.push(`/video/${id}`);
  };
  return (
    <div className='banner' style={{ backgroundImage: `url(${imgUrl})` }}>
      <div className='ml-20'>
        <h3 className='text-6xl font-bold mb-2'>{title}</h3>
        <h3 className='text-3xl mb-4'>{subTitle}</h3>
        <button
          className='button flex items-center justify-around'
          onClick={handleOnPlay}
        >
          <BsPlayFill className='mr-2' /> Play
        </button>
      </div>
    </div>
  );
}
