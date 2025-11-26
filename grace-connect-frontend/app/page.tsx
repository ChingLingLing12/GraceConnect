"use client";

import { useState, useEffect } from 'react';
import { Link, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@heroui/react";
import Image from "next/image";

import Dashboard from "./pages/Dashboard";
import Statistics from "./pages/Statistics";
import Register from "./pages/Register";
import { Cell, sampleYouth, Youth } from './models';

export default function Home() {

  const [youths, setYouths] = useState(sampleYouth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<"dashboard" | "statistics" | "Edit Database" | "register">("dashboard");

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
            <Image onClick={() => handleSelect("dashboard")} src="/GMC logo3.jpeg" alt="App Logo" width="55" height="55" style={{ borderRadius: "15px" }}/>
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

            <NavbarItem>
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

