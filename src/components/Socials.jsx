import { Github, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from './ui';

const Socials = () => {
  return (
    <div className='flex w-full flex-row items-center gap-2'>
      <Button variant='ghost' asChild>
        <Link to='https://linkedin.com/in/yourusername'>
          <Linkedin className='h-6 w-6' />
        </Link>
      </Button>
      <Button variant='ghost' asChild>
        <Link to='mailto:your.email@example.com'>
          <Github className='h-6 w-6' />
        </Link>
      </Button>
    </div>
  );
};

export default Socials;
