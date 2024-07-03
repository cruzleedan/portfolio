import React from 'react';
import { Link } from 'react-router-dom';

import { getImageUrl } from '@/lib/utils/images';

const HeroSection = () => {
  return (
    <section
      id='home'
      className='mt-12 flex flex-col items-center sm:flex-row sm:justify-between md:mt-2'
    >
      <div className='w-full text-left md:w-1/3'>
        <h1 className='font-general-semibold text-ternary-dark dark:text-primary-light text-center text-2xl uppercase sm:text-left lg:text-3xl xl:text-4xl'>
          Hi, I'm Dan
        </h1>
        <p className='font-general-medium mt-4 text-center text-lg leading-normal text-gray-500 dark:text-gray-200 sm:text-left md:text-xl lg:text-2xl xl:text-3xl'>
          A Frontend Developer &amp; Design Enthusiast
        </p>
        <div>
          <Link
            href='/#contact'
            className='to-secondary-500 mr-4 inline-block w-full rounded-full bg-gradient-to-br from-primary-500 px-6 py-3 text-white hover:bg-slate-200 sm:w-fit'
          >
            Hire Me
          </Link>
          <Link
            href='/'
            className='to-secondary-500 mt-3 inline-block w-full rounded-full bg-gradient-to-br from-primary-500 px-1 py-1 text-white hover:bg-slate-800 sm:w-fit'
          >
            <span className='block rounded-full bg-[#121212] px-5 py-2 hover:bg-slate-800'>
              Download CV
            </span>
          </Link>
        </div>
      </div>
      <div className='float-right mt-8 w-full text-right sm:mt-0 sm:w-2/3'>
        <img src={getImageUrl('developer.svg')} alt='Developer' />
      </div>
    </section>
  );
};

export default HeroSection;
