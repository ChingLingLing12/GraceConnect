"use client";

import { useState, useEffect } from 'react';
import { Link, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@heroui/react";
import { Youth } from "./components/YouthCard";
import Image from "next/image";

import Dashboard from "./pages/Dashboard";
import Statistics from "./pages/Statistics";
import Register from "./pages/Register";

export enum Cell {
  Year12="Year 12",
  Year89="Year 8/9 Cell",
  Year1011="Year 10/11 Cell",
  Year7="Year 7 Cell",
}

const sampleYouth: Youth[] = [
  {
    firstName: "Alice",
    lastName: "Smith",
    signedIn: false,
    lastSignedIn: "2025-10-26T08:00:00",
    lastSignedOut: "2025-10-26T12:00:00",
    cell: Cell.Year1011
  },
  {
    firstName: "Bob",
    lastName: "Johnson",
    signedIn: true,
    lastSignedIn: "2025-10-26T13:00:00",
    lastSignedOut: "2025-10-26T09:00:00",
    cell: Cell.Year12
  },
  {
    firstName: "Charlie",
    lastName: "Lee",
    signedIn: false,
    lastSignedIn: "2025-10-26T07:00:00",
    lastSignedOut: "2025-10-26T14:00:00",
    cell: Cell.Year89
  },
   {
    firstName: "Joseph",
    lastName: "Smith",
    signedIn: false,
    lastSignedIn: "2025-10-26T08:00:00",
    lastSignedOut: "2025-10-26T12:00:00",
    cell: Cell.Year7
  },
  {
    firstName: "Jess",
    lastName: "Johnson",
    signedIn: true,
    lastSignedIn: "2025-10-26T13:00:00",
    lastSignedOut: "2025-10-26T09:00:00",
    cell: Cell.Year12
  },
  {
    firstName: "Catherine",
    lastName: "Lee",
    signedIn: false,
    lastSignedIn: "2025-10-26T07:00:00",
    lastSignedOut: "2025-10-26T14:00:00",
    cell: Cell.Year1011
  },
];


export default function Home() {

  const [youths, setYouths] = useState(sampleYouth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<"dashboard" | "statistics" | "register">("dashboard");

  const handleSelect = (section: typeof activeSection) => {
    // 👇 First close the menu, then update the section
    setIsMenuOpen(false);
    setTimeout(() => setActiveSection(section), 100); // delay to allow animation to finish
  };


  const renderSection = () => {
    switch (activeSection) {
      case "statistics":
        return <Statistics />;
      case "register":
        return <Register />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div>
        <Navbar onMenuOpenChange={setIsMenuOpen} isMenuOpen={isMenuOpen} className="bg-gray-800 text-white">
          <NavbarBrand>
            <Image onClick={() => handleSelect("dashboard")} src="/grace-connect-logo-test.png" alt="App Logo" width="160" height="120"/>
          </NavbarBrand>
          <NavbarContent className="hidden sm:flex gap-6" justify="center">
            <NavbarItem>
               <button
                  onClick={() => handleSelect("dashboard")}
                  className={`hover:text-gray-300 transition ${
                    activeSection === "dashboard" ? "text-blue-400" : "text-white"
                  }`}
                >
                  Dashboard
            </button>
            </NavbarItem>
            <NavbarItem isActive>
               <button
              onClick={() => handleSelect("statistics")}
              className={`hover:text-gray-300 transition ${
                activeSection === "statistics" ? "text-blue-400" : "text-white"
              }`}
            >
              Statistics
            </button>
            </NavbarItem>
            <NavbarItem>
             <button
              onClick={() => handleSelect("register")}
              className={`hover:text-gray-300 transition ${
                activeSection === "register" ? "text-blue-400" : "text-white"
              }`}
            >
              Register
            </button>
            </NavbarItem>
          </NavbarContent>

          {/* Right side (mobile toggle) */}
        <NavbarContent justify="end">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
        </NavbarContent>

          {/* Mobile Menu */}
        <NavbarMenu className="bg-gray-900 text-white">
          <NavbarMenuItem>
            <button
              onClick={() => {
                handleSelect("dashboard");
                setIsMenuOpen(false);
              }}
              className="w-full text-left hover:text-gray-300"
            >
              Dashboard
            </button>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <button
              onClick={() => {
                handleSelect("statistics");
                setIsMenuOpen(false);
              }}
              className="w-full text-left hover:text-gray-300"
            >
              Statistics
            </button>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <button
              onClick={() => {
                handleSelect("register");
                setIsMenuOpen(false);
              }}
              className="w-full text-left hover:text-gray-300"
            >
              Register
            </button>
          </NavbarMenuItem>
        </NavbarMenu>
        </Navbar>

        
        <div>{renderSection()}</div>
     
    </div>
  
  )
}

