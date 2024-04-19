import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import ThemeDropdown from "./ThemeDropdown";
const Navbar = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex space-x-4">
        <NavigationMenuItem>
          <NavigationMenuLink href="#home">Home</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#about">About</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#projects">Projects</NavigationMenuLink>
        </NavigationMenuItem>
        <ThemeDropdown />
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navbar;
