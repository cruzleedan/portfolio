// Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className='py-8'>
      <div className='container mx-auto text-center'>
        <p>&copy; 2024 Your Name. All rights reserved.</p>
        <ul className='mt-4 flex justify-center'>
          <li>
            <a href='#projects' className='mx-3 hover:text-gray-300'>
              Projects
            </a>
          </li>
          <li>
            <a href='#skills' className='mx-3 hover:text-gray-300'>
              Skills
            </a>
          </li>
          <li>
            <a href='#experience' className='mx-3 hover:text-gray-300'>
              Experience
            </a>
          </li>
          <li>
            <a href='#contact' className='mx-3 hover:text-gray-300'>
              Contact
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
