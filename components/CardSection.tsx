import Link from 'next/link';
import React from 'react';
import { Card } from '.';

import { Videos } from '../types';

type PropsType = {
  header: string;
  size: string;
  videos: typeof Videos;
  shouldWrap?: boolean;
};

export default function CardSection({
  header,
  size,
  videos,
  shouldWrap = false,
}: PropsType) {
  if (videos && videos.length === 0) {
    return null;
  }
  return (
    <div className='p-12'>
      <h1 className='text-3xl font-semibold mx-2 mb-10'>{header}</h1>
      <div
        className={
          'flex overflow-x-scroll overflow-y-hidden pt-10 ' +
          (shouldWrap && ' flex-wrap justify-center items-center')
        }
      >
        {videos.map((video, idx) => {
          return (
            <Link key={video.id} href={`/video/${video.id}`}>
              <a>
                <Card order={idx} imgUrl={video.imgUrl} imgSize={size} />
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
