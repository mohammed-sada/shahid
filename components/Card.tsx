import Image from 'next/image';
import React, { useState } from 'react';

import { motion } from 'framer-motion';
import cls from 'classnames';
import styles from '../styles/card.module.css';

type PropTypes = {
  order: number;
  imgUrl: string;
  imgSize: string;
};

export default function Card({
  order,
  imgUrl = '/static/space-sweeper.jpg',
  imgSize = 'medium',
}: PropTypes) {
  const [img, setImage] = useState(imgUrl);
  const scale = order === 0 ? { scaleY: 1.1 } : { scale: 1.1 };

  const classMap: { [key: string]: string } = {
    large: styles.lgItem,
    medium: styles.mdItem,
    small: styles.smItem,
  };

  const handleOnError = (e: object) => {
    // console.log('image error =>', e);
    setImage('/static/space-sweeper.jpg');
  };
  return (
    <div className='mr-1 cursor-pointer'>
      <motion.div
        className={cls('inline-block hover:z-50', classMap[imgSize])}
        whileHover={scale}
      >
        <Image
          src={img}
          layout='fill'
          alt={`image`}
          className='t-0 rounded-md object-cover object-center block max-w-full'
          onError={handleOnError}
        />
      </motion.div>
    </div>
  );
}
