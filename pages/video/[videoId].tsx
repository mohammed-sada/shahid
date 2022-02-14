import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Modal from 'react-modal';

import { getVideoById } from '../../lib/videos';
import { Videos } from '../../types';
import { Navbar } from '../../components';

export async function getStaticProps({ params }: any) {
  const video = await getVideoById(params.id);
  console.log(video);
  return {
    props: {
      video: video.length > 0 ? video[0] : {},
    },
    revalidate: 10, // In seconds
  };
}

export function getStaticPaths() {
  const videoIds = ['UdL56lNGUns', 'lyy7y0QOK-0', 'AZGcmvrTX9M'];
  const paths = videoIds.map((videoId) => ({
    params: { videoId },
  }));

  return { paths, fallback: 'blocking' };
}

export default function Video({ video }: { video: typeof Videos[0] }) {
  Modal.setAppElement('#__next');

  const router = useRouter();
  const { videoId } = router.query;

  return (
    <>
      <Head>
        <title>video title</title>
        <meta name='description' content='video desc' />
      </Head>
      <Navbar />
      <Modal
        isOpen={true}
        onRequestClose={() => router.push('/')}
        contentLabel='Watch Video'
        overlayClassName='absolute top-24 w-screen min-h-screen flex justify-center items-center'
        className='w-3/4 min-h-screen shadow-2xl'
      >
        <iframe
          id='ytplayer'
          width='100%'
          height='360'
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&modestbranding=1&rel=0&theme=light&color=white&origin=http://example.com`}
          frameBorder='0'
          allowFullScreen
        />

        <div className='p-10 mt-4 flex'>
          <div className='pr-4 w-2/3 text-xl font-semibold'>
            <p className='text-secondary mb-4'>{video.publishedAt}</p>
            <p>{video.title}</p>
            <p className='mt-8 text-lg'>{video.description}</p>
          </div>

          <div className='w-1/3 text-gray-500 font-semibold'>
            <p>
              Cast: <span className='text-white'>{video.channelTitle}</span>
            </p>
            <p className='mt-4'>
              View Count: <span className='text-white'>{video.viewCount}</span>
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
