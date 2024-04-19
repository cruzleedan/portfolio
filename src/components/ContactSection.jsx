import React from 'react';

import ContactForm from './ContactForm';
import Socials from './Socials';

const ContactSection = () => {
  return (
    <section
      id='contact'
      className='relative my-12 grid gap-4 py-24 md:my-12 md:grid-cols-2'
    >
      <div>
        <h2 className='mb-4 text-3xl font-bold'>Let's Connect</h2>
        <p className='mb-8 text-lg'>
          I'm open to new opportunities, so feel free to reach out. I'll get
          back to you as soon as possible.
        </p>
        <Socials />
      </div>
      <ContactForm />
    </section>
  );
};

export default ContactSection;
