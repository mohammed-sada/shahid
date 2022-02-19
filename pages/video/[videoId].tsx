import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Modal from 'react-modal';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

import { getVideoById } from '../../lib/videos';
import { Videos } from '../../types';
import { Navbar } from '../../components';

export async function getStaticProps({ params }: any) {
  const video = await getVideoById(params.videoId);
  return {
    props: {
      video: video?.length > 0 ? video[0] : {},
    },
    revalidate: 10, // In seconds ISR
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

  const [toggleHeart, setToggleHeart] = useState(false);
  const [loadingHeart, setLoadingHeart] = useState(false);

  useEffect(() => {
    async function getCurrentVideoStats() {
      try {
        const res = await fetch(`/api/stats?videoId=${videoId}`, {
          method: 'GET',
        });
        const { data, error } = await res.json();
        if (error) {
          console.log(error);
          return;
        }
        setToggleHeart(data.favourited);
      } catch (error) {
        console.log(error);
      }
    }
    getCurrentVideoStats();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const heartVideo = async () => {
    try {
      setLoadingHeart(true);
      const res = await fetch('/api/stats', {
        method: 'POST',
        body: JSON.stringify({
          videoId,
          favourited: !toggleHeart,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();

      setToggleHeart((prev) => !prev);
      setLoadingHeart(false);
    } catch (error) {
      console.log(error);
      setLoadingHeart(false);
    }
  };

  const { title, channelTitle, description, publishedAt, viewCount } = video;
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='description' content={description} />
      </Head>

      <Navbar />
      <Modal
        isOpen={true}
        onRequestClose={() => router.push('/')}
        contentLabel='Watch Video'
        overlayClassName='absolute top-24 w-screen min-h-screen flex justify-center items-center'
        className='w-3/4 min-h-screen shadow-2xl'
      >
        <div className='relative group'>
          <iframe
            id='ytplayer'
            width='100%'
            height='360'
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&modestbranding=1&rel=0&theme=light&color=white&origin=http://example.com`}
            frameBorder='0'
            allowFullScreen
          />
          <button
            className='absolute top-[40%] left-6 text-bg outline-none scale-0 hover:scale-110 transition-all disabled:opacity-50 group-hover:scale-100'
            disabled={loadingHeart}
            onClick={heartVideo}
          >
            {toggleHeart ? (
              <AiFillHeart size={80} />
            ) : (
              <AiOutlineHeart size={80} />
            )}
          </button>
        </div>

        <div className='p-10 mt-4 flex'>
          <div className='pr-4 w-2/3 text-xl font-semibold'>
            <p className='text-secondary mb-4'>{publishedAt}</p>
            <p className='mb-4'>{title}</p>
            <p className='mt-8 text-lg text-gray-400'>{description}</p>
          </div>

          <div className='w-1/3 text-gray-500 font-semibold'>
            {channelTitle && (
              <p>
                Cast: <span className='text-white'>{channelTitle}</span>
              </p>
            )}
            {viewCount && (
              <p className='mt-4'>
                View Count: <span className='text-white'>{viewCount}</span>
              </p>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
