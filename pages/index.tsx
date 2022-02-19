import Head from 'next/head';
import { Banner, Navbar, CardSection } from '../components';

import {
  getVideos,
  getPopularVideos,
  getUserWatchedVideos,
} from '../lib/videos';
import { decodeToken } from '../lib/utils';

export async function getServerSideProps(context: any) {
  const { token } = context.req.cookies;
  const { issuer } = decodeToken(token);
  const watchedVideos = await getUserWatchedVideos(token, { userId: issuer });

  const sciFiVideos = await getVideos('sci fi movies');
  // const actionVideos = await getVideos('action movies');
  // const popularVideos = await getPopularVideos();
  return {
    props: {
      sciFiVideos,
      watchedVideos,
    },
  };
}

const Home = ({
  sciFiVideos,
  actionVideos,
  popularVideos,
  watchedVideos,
}: any) => {
  return (
    <div>
      <Head>
        <title>Shahid</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Navbar />
      <Banner
        id='lyy7y0QOK-0'
        title='Space Sweepers'
        subTitle='Sci-fi/Space opera'
        imgUrl='/static/space-sweepers.jpg'
      />

      <CardSection
        header='Watched Videos'
        size='small'
        videos={watchedVideos}
      />
      <CardSection header='Sci-Fi' size='large' videos={sciFiVideos} />
      {/* <CardSection header='Action' size='medium' videos={actionVideos} /> */}
      {/* <CardSection header='Popular' size='small' videos={popularVideos} />  */}
    </div>
  );
};

export default Home;
