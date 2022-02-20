import '../styles/globals.css';
import type { AppProps } from 'next/app';
import ContextProvider from '../context/AuthContext';

export async function getServerSideProps(context: any) {
  const { token } = context.req.cookies;
  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
      props: {},
    };
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ContextProvider>
      <Component {...pageProps} />
    </ContextProvider>
  );
}

export default MyApp;
