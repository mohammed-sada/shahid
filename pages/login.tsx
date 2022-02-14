import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import validator from 'validator';

import { m } from '../lib/magic-links';
import Loading from '../components/Loading';

export default function Login() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState('');

  // keep loading till the user gets routed to home page
  useEffect(() => {
    router.events.on('routeChangeComplete', () => setLoading(false));
    router.events.on('routeChangeError', () => setLoading(false));

    return () => {
      router.events.off('routeChangeComplete', () => setLoading(false));
      router.events.off('routeChangeError', () => setLoading(false));
    };
  }, [router]);

  const handleOnSumbit = async (e: any) => {
    e.preventDefault();

    if (!email) return setFormError('This field is required.');
    if (!validator.isEmail(email))
      return setFormError('Email format is not valid.');

    try {
      setFormError('');
      setLoading(true);
      const d = await m!.auth.loginWithMagicLink({ email });
      console.log(d);
      return router.push('/');
    } catch (err) {
      console.error('error logging in', err);
      setFormError('Error logging in');
      setLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Shahid Signin</title>
        <meta name='discription' content='shahid login page' />
      </Head>

      <main>
        <div className='w-1/2'>
          <Link href=''>
            <a>
              <h1 className='text-4xl text-left font-bold text-transparent bg-clip-text p-4 bg-gradient-to-tl from-primary to-secondary'>
                Shahid
              </h1>
            </a>
          </Link>
        </div>

        <div
          className='min-h-screen flex items-start justify-center'
          style={{
            backgroundImage: 'url("/static/login-bg.jpg")',
          }}
        >
          <form
            className='mt-20 bg-bg w-3/4 md:w-1/2 lg:w-1/3 p-8 bg-opacity-90'
            onSubmit={handleOnSumbit}
            noValidate
          >
            <p className='text-base text-white text-center'>
              Enter your email address to proceed
            </p>
            <div className='mt-8'>
              <input
                type='email'
                placeholder='Email'
                className='text-black outline-none rounded-full w-full p-4'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {formError && (
                <p className='ml-4 mt-3 font-semibold text-xs text-red-600'>
                  {formError}
                </p>
              )}
            </div>
            <button
              type='submit'
              className='flex justify-center bg-gray-700 text-center text-white rounded-full w-full mt-8 p-4'
              disabled={loading}
            >
              {loading ? <Loading /> : 'Continue'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
