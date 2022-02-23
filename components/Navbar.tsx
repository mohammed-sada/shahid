import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import Loading from './Loading';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const [toggeDropDown, setToggeDropDown] = useState<Boolean>(false);

  const { username } = useContext(AuthContext);

  const handleOnLogout = async () => {
    try {
      await fetch('/api/logout');
      router.replace('/login');
    } catch (err) {
      console.log('error while loging out ', err);
      router.replace('/login');
    }
  };

  return (
    <div className='bg-bg flex items-center h-24 text-lg font-semibold sticky top-0 z-50'>
      <div className='flex items-center w-1/2 '>
        <div className='w-1/2'>
          <Link href='/'>
            <a>
              <h1 className='text-4xl text-left font-bold text-transparent bg-clip-text  p-4 bg-gradient-to-tl from-primary to-secondary'>
                Shahid
              </h1>
            </a>
          </Link>
        </div>
        <ul className='w-1/2 flex items-center justify-center'>
          <li className='mr-10'>
            <Link href='/'>
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link href='/my-list'>
              <a>My List</a>
            </Link>
          </li>
        </ul>
      </div>

      <nav
        className={`w-1/2 h-full flex justify-end mr-10 ${
          !toggeDropDown && 'items-center'
        }`}
      >
        <div className='relative mt-2'>
          <p
            className='flex items-center justify-center cursor-pointer'
            onClick={() => setToggeDropDown((prev) => !prev)}
          >
            {username ? username : <Loading />}
            {username && toggeDropDown ? (
              <IoMdArrowDropup />
            ) : (
              <IoMdArrowDropdown />
            )}
          </p>
          {toggeDropDown && (
            <div className='text-base absolute top-8 right-0 bg-primary px-4 py-2 rounded-2xl cursor-pointer'>
              <Link href='#'>
                <a onClick={handleOnLogout}>Sign out</a>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
