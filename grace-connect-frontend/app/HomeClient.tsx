"use client";

import { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import Dashboard from "./pages/Dashboard";
import Statistics from "./pages/Statistics";
import Register from "./pages/Register";
import ProtectedLayout from "./components/ProtectedLayout";

type Props = {
  ministry: "youth" | "sundayschool" | null;
};

export default function HomeClient({ ministry }: Props) {
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "dashboard" | "statistics" | "register"
  >("dashboard");

  const handleSelect = (section: typeof activeSection) => {
    setIsMenuOpen(false);
    setTimeout(() => setActiveSection(section), 100);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "statistics":
        return (
          <ProtectedLayout>
            <Statistics ministry={ministry} />
          </ProtectedLayout>
        );
      case "register":
        return <Register ministry={ministry} />;
      default:
        return (
          <ProtectedLayout>
            <Dashboard ministry={ministry}/>
          </ProtectedLayout>
        );
    }
  };

  // =========================
  // MINISTRY SELECT SCREEN
  // =========================
  if (!ministry) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-6 bg-gray-900 text-white">
        <Image src="/GMC logo3.jpeg" alt="Logo" width={100} height={100} />
        <h1 className="text-2xl font-bold">Select Ministry</h1>

        <div className="flex gap-6">
          <button
            onClick={() => router.push("/login?ministry=youth")}
            className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Youth
          </button>

          <button
            onClick={() => router.push("/login?ministry=sundayschool")}
            className="px-6 py-3 bg-green-600 rounded-lg hover:bg-green-700"
          >
            Sunday School
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // MAIN NAVBAR
  // =========================
  return (
    <div>
      <Navbar
        onMenuOpenChange={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
        className="bg-gray-800 text-white"
      >
        <NavbarBrand>
          <Image
            onClick={() => handleSelect("dashboard")}
            src="/GMC logo3.jpeg"
            alt="App Logo"
            width={55}
            height={55}
            style={{ borderRadius: "15px" }}
          />
        </NavbarBrand>

        <NavbarContent className="hidden sm:flex gap-6" justify="center">
          <NavbarItem>
            <button
              onClick={() => handleSelect("dashboard")}
              className={`hover:text-gray-300 transition ${
                activeSection === "dashboard"
                  ? "text-blue-400"
                  : "text-white"
              }`}
            >
              Dashboard
            </button>
          </NavbarItem>

          <NavbarItem>
            <button
              onClick={() => handleSelect("statistics")}
              className={`hover:text-gray-300 transition ${
                activeSection === "statistics"
                  ? "text-blue-400"
                  : "text-white"
              }`}
            >
              Statistics
            </button>
          </NavbarItem>

          <NavbarItem>
            <button
              onClick={() => handleSelect("register")}
              className={`hover:text-gray-300 transition ${
                activeSection === "register"
                  ? "text-blue-400"
                  : "text-white"
              }`}
            >
              Register
            </button>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
        </NavbarContent>

        <NavbarMenu className="bg-gray-900 text-white">
          <NavbarMenuItem>
            <button
              onClick={() => handleSelect("dashboard")}
              className="w-full text-left hover:text-gray-300"
            >
              Dashboard
            </button>
          </NavbarMenuItem>

          <NavbarMenuItem>
            <button
              onClick={() => handleSelect("statistics")}
              className="w-full text-left hover:text-gray-300"
            >
              Statistics
            </button>
          </NavbarMenuItem>

          <NavbarMenuItem>
            <button
              onClick={() => handleSelect("register")}
              className="w-full text-left hover:text-gray-300"
            >
              Register
            </button>
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>

      <div>{renderSection()}</div>
    </div>
  );
}