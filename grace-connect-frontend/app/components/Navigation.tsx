import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, NavbarMenuToggle} from "@heroui/react";
import Image from "next/image";
import { useState } from "react";


export default function Navigation() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
     
  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} className="bg-gray-800 text-white">
      <NavbarBrand>
        <Image src="/GMC logo3.jpeg" alt="App Logo" width="55" height="55" style={{ borderRadius: "16px" }}/>
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
