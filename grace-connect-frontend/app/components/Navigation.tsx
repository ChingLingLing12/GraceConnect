import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, NavbarMenuToggle} from "@heroui/react";
import Image from "next/image";
import { useState } from "react";


export default function Navigation() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
     
  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} className="bg-gray-800 text-white">
      <NavbarBrand>
        <Image src="/grace-connect-logo-test.png" alt="App Logo" width="160" height="120"/>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link className="text-white" href="#">
            Statistics
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link aria-current="page" href="#">
            Dashboard
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link className="text-white"href="#">
            Register
          </Link>
        </NavbarItem>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
      </NavbarContent>
      <NavbarContent justify="end">
      </NavbarContent>
    </Navbar>
  );
}
