"use client";

import { useState, useEffect } from 'react';
import { Input, Button, Card, CardBody, CardHeader } from "@heroui/react";
import { Youth } from "../components/YouthCard";
import YouthCard from "../components/YouthCard";

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


export default function Dashboard() {

  const [searchTerm, setSearchTerm] = useState("");
  const [youths, setYouths] = useState(sampleYouth);
  const [filterMode, setFilterMode] = useState<"default" | "signedIn" | "signedOut">("default");
  const [viewMode, setViewMode] = useState<"default" | "cell">("default");


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

const groupedByCell = Object.values(Cell).map((cellName) => ({
    cell: cellName,
    youths: filteredYouths.filter((y) => y.cell === cellName),
  }));

  return (
     <main className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-12 ">
    <div className="w-full max-w-6xl mx-auto px-4">
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

       {/* 👁 VIEWING MODE */}
      <div className="flex justify-center gap-2">
        <Button
          variant={viewMode === "default" ? "solid" : "flat"}
          onPress={() => setViewMode("default")}
        >
          Default View
        </Button>
        <Button
          variant={viewMode === "cell" ? "solid" : "flat"}
          onPress={() => setViewMode("cell")}
        >
          Cell View
        </Button>
      </div>

      {/* 3-part filter switch */}
      <div className="flex border border-gray-900 rounded overflow-hidden mb-4">
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

      {/* 🧾 DISPLAY */}
      {viewMode === "default" ? (
        <div className="grid gap-2">
          {filteredYouths.length > 0 ? (
            filteredYouths.map((y, i) => (
              <YouthCard
                key={i}
                youth={y}
                onSignIn={handleSignIn}
                onSignOut={handleSignOut}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">No matching youth found.</p>
          )}
        </div>
      ) : (
         // 🟩 4-CELL GRID VIEW
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {groupedByCell.map(({ cell, youths }) => (
            <Card
              key={cell}
              className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-md"
            >
              <CardHeader className="text-lg font-semibold text-white border-b border-zinc-700 px-4 py-3">
                {cell}
              </CardHeader>
              <CardBody className="max-h-[500px] overflow-y-auto px-4 py-4 space-y-4">
                {youths.length > 0 ? (
                  youths.map((y, i) => (
                    <div key={i} className="rounded-xl overflow-hidden">
                      <YouthCard youth={y} onSignIn={handleSignIn} onSignOut={handleSignOut} />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic text-center py-6">
                    No youths in this cell.
                  </p>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
    </main>  
  )
}

