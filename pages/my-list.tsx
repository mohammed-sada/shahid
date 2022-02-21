import Head from 'next/head';
import React from 'react';

import { CardSection, Navbar } from '../components';
import { formatVideos } from '../lib/videos';
import { decodeToken } from '../lib/utils';

export async function getServerSideProps(context: any) {
  const { token } = context.req.cookies;
  const { issuer } = decodeToken(token);

  const videos = await formatVideos(token, { userId: issuer }, 'mylist');
  return {
    props: {
      videos,
    },
  };
}

export default function MyList({ videos }: any) {
  return (
    <div>
      <Head>
        <title>My List</title>
        <meta name='description' content="User's list of favourite vidoes" />
      </Head>

      <Navbar />
      <main className='mt-10'>
        {videos.length > 0 ? (
          <CardSection
            header='My List'
            size='small'
            videos={videos}
            shouldWrap
          />
        ) : (
          <h1 className='text-transparent bg-clip-text p-4 bg-gradient-to-tl from-primary to-secondary text-4xl font-semibold text-center'>
            You have not hearted any videos yet!
          </h1>
        )}
      </main>
    </div>
  );
}
