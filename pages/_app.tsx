import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { m } from '../lib/magic-links';

import Loading from '../components/Loading';
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<Boolean>(true);

  useEffect(() => {
    async function isLoggedIn() {
      const result = await m!.user.isLoggedIn().catch((err) => {
        console.log(err);
        setLoading(false);
      });
      console.log(result);

      if (result) router.replace('/');
      else router.replace('/login');
    }
    isLoggedIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleComplete = () => {
      setLoading(false);
    };
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <div>
      {loading ? (
        <div className='flex justify-center items-center h-screen'>
          <Loading size={70} /> {/* px */}
        </div>
      ) : (
        <Component {...pageProps} />
      )}
    </div>
  );
}

export default MyApp;
