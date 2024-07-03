import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';

import ThemeDropdown from './ThemeDropdown';
const Navbar = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList className='flex space-x-4'>
        <NavigationMenuItem>
          <NavigationMenuLink href='#projects'>Projects</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href='#skills'>Skills</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href='#experience'>Experience</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href='#contact'>Contact</NavigationMenuLink>
        </NavigationMenuItem>
        <ThemeDropdown />
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navbar;
