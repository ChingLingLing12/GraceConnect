"use client";

import { useState, useEffect } from 'react';
import { Input } from "@heroui/react";
import { Youth } from "./components/YouthCard";
import YouthCard from "./components/YouthCard";

const sampleYouth: Youth[] = [
  {
    firstName: "Alice",
    lastName: "Smith",
    signedIn: false,
    lastSignedIn: "2025-10-26T08:00:00",
    lastSignedOut: "2025-10-26T12:00:00",
  },
  {
    firstName: "Bob",
    lastName: "Johnson",
    signedIn: true,
    lastSignedIn: "2025-10-26T13:00:00",
    lastSignedOut: "2025-10-26T09:00:00",
  },
  {
    firstName: "Charlie",
    lastName: "Lee",
    signedIn: false,
    lastSignedIn: "2025-10-26T07:00:00",
    lastSignedOut: "2025-10-26T14:00:00",
  },
   {
    firstName: "Joseph",
    lastName: "Smith",
    signedIn: false,
    lastSignedIn: "2025-10-26T08:00:00",
    lastSignedOut: "2025-10-26T12:00:00",
  },
  {
    firstName: "Jess",
    lastName: "Johnson",
    signedIn: true,
    lastSignedIn: "2025-10-26T13:00:00",
    lastSignedOut: "2025-10-26T09:00:00",
  },
  {
    firstName: "Catherine",
    lastName: "Lee",
    signedIn: false,
    lastSignedIn: "2025-10-26T07:00:00",
    lastSignedOut: "2025-10-26T14:00:00",
  },
];


export default function Home() {

  const [searchTerm, setSearchTerm] = useState("");
  const [youths, setYouths] = useState(sampleYouth);
  const [filterMode, setFilterMode] = useState<"default" | "signedIn" | "signedOut">("default");


   const items = [
    "Next.js",
    "Tailwind CSS",
    "TypeScript",
    "React",
    "Vercel",
    "Node.js",
    "Express",
    "MongoDB",
  ];

  // State for current date and time to avoid hydration mismatch
  const [currentDateTime, setCurrentDateTime] = useState({ dateString: '', timeString: '' });

  useEffect(() => {
    const updateDateTime = () => {
      const currentDate = new Date();
      setCurrentDateTime({
        dateString: currentDate.toLocaleDateString(),
        timeString: currentDate.toLocaleTimeString()
      });
    };
    updateDateTime();
  }, []);

const handleSignIn = (youth: Youth) => {
    setYouths((prev) =>
      prev.map((y) =>
        y === youth
          ? { ...y, signedIn: true, lastSignedIn: new Date().toISOString() }
          : y
      )
    );
  };

  const handleSignOut = (youth: Youth) => {
    setYouths((prev) =>
      prev.map((y) =>
        y === youth
          ? { ...y, signedIn: false, lastSignedOut: new Date().toISOString() }
          : y
      )
    );
  };

  const filteredYouths = youths.filter((youth) => {
  // Search filter
    const matchesSearch = `${youth.firstName} ${youth.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // 3-part switch filter
    const matchesSwitch =
      filterMode === "default"
        ? true
        : filterMode === "signedIn"
        ? youth.signedIn
        : !youth.signedIn; // signedOut

    return matchesSearch && matchesSwitch;
});

  return (
     <main className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-12">
    <div className="w-full max-w-md">
      <h3 className="text-2xl font-semibold mb-6 text-center">
        Grace Connect Check-In System
      </h3>
      <h3 className="mb-8 text-center text-gray-600">
        {currentDateTime.dateString} | {currentDateTime.timeString}
      </h3>
     {/* Search Bar */}
      <Input
        placeholder="Search youth..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
        isClearable
        onClear={() => setSearchTerm("")}
      />

      {/* 3-part filter switch */}
      <div className="flex border border-gray-300 rounded overflow-hidden mb-4">
        {["default", "signedIn", "signedOut"].map(mode => (
          <button
            key={mode}
            className={`flex-1 py-2 text-center font-medium
              ${filterMode === mode ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"}
              hover:bg-blue-500 hover:text-white transition-colors`}
            onClick={() => setFilterMode(mode as "default" | "signedIn" | "signedOut")}
          >
            {mode === "default" ? "All" : mode === "signedIn" ? "Sign Out Mode" : "Sign In Mode"}
          </button>
        ))}
      </div>

       <div className="space-y-4">
        {filteredYouths.map((youth) => (
          <YouthCard
            key={`${youth.firstName}-${youth.lastName}`}
            youth={youth}
            onSignIn={handleSignIn}
            onSignOut={handleSignOut}
          />
        ))}
      </div>
    </div>
    </main>
  
  )
}

