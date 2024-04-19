import { Link } from 'react-router-dom';

import { getImageUrl } from '@/lib/utils/images';

import Navbar from './Navbar';
import { useTheme } from './ThemeProvider';
import { Button } from './ui';

const Header = () => {
  const { theme } = useTheme();
  const themeLogo = {
    light: 'logo.svg',
    dark: 'logo-white.svg',
  };
  return (
    <header className='sm:container sm:mx-auto'>
      <div className='flex max-w-screen-lg flex-col items-center py-6 sm:flex-row sm:items-center sm:justify-between xl:max-w-screen-xl'>
        <Button variant='ghost' asChild>
          <Link href='/'>
            <img src={getImageUrl(themeLogo[theme])} alt='Dan' />
            <span className='pl-2 text-2xl'>Dan</span>
          </Link>
        </Button>
        <Navbar />
      </div>
    </header>
  );
};

export default Header;
