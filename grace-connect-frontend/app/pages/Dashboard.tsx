"use client";

import { useState, useEffect } from "react";
import { Input, Button, Card, CardBody, CardHeader, Select, SelectItem, Switch } from "@heroui/react";
import { HouseHold, Youth, sampleYouth } from "../models";
import Allview from "../components/Views/AllView";
import Cellview from "../components/Views/CellView";
import HouseHoldView from "../components/Views/HouseHoldView";
import { apiFetch } from "../context/api";

type Props = {
  ministry: "youth" | "sundayschool" | null;
};

export default function Dashboard({ministry}: Props) {
    
  if (!ministry) return null;

  const BASE_MINISTRY_URL = `/api/${ministry}`;
  const YOUTH_URL = BASE_MINISTRY_URL;
  const HOUSEHOLD_URL = `${BASE_MINISTRY_URL}/household`;
  const LOG_URL = `/api/log`;

  const [searchTerm, setSearchTerm] = useState("");
  const [youths, setYouths] = useState<Youth[]>(sampleYouth);
  const [households, setHouseholds] = useState<HouseHold[]>([]);
  const [newYouths, setNewYouths] = useState<Omit<Youth, "_id">[]>([
    { firstName: "", lastName: "", age: 0, signedIn: false },
  ]);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<HouseHold | Youth | null>(null);
  const [selectedHousehold, setSelectedHousehold] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<"default" | "signedIn" | "signedOut">("default");
  const [viewMode, setViewMode] = useState<"default" | "cell" | "houseHold">("default");

  // -----------------------
  // Backend API Calls
  // -----------------------

  const createLog = async (logEntry: { message: "signIn" | "signOut"; timestamp: string }) => {
    try {
      const res = await apiFetch(LOG_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logEntry),
      });
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      return data.log._id;
    } catch (error) {
      console.error("Error creating log:", error);
    }
  };

  const createYouth = async (youth: Omit<Youth, "_id">): Promise<string> => {
    try {
      // Don't send _id for creation
      const response = await apiFetch(YOUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(youth),
      });
      if (!response.ok) throw new Error("Failed to create youth");
      const data = await response.json();
      return data.child._id;
    } catch (error) {
      console.error("Error creating youth:", error);
      throw error;
    }
  };

  const editYouth = async (_id: string, updates: Partial<Youth>) => {
    try {
      const res = await apiFetch(`${YOUTH_URL}/${_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Network response was not ok");
      return await res.json();
    } catch (error) {
      console.error("Error updating youth:", error);
    }
  };

  const fetchYouths = async () => {
  try {
    const data = await apiFetch(YOUTH_URL);
    console.log("API youth response:", data);
    let children: Youth[] = [];

    if (data.success && Array.isArray(data.children)) {
      // Filter by ministry
      children = data.children.filter((child: Youth) => {
        if (ministry === "youth") return child.ministry === "youth";
        if (ministry === "sundayschool") return child.ministry === "sundayschool";
        return false;
      });
    }

    setYouths(children);
  } catch (error) {
    console.error("Error fetching youths:", error);
    setYouths([]);
  }
};

  const fetchHouseholds = async () => {
  try {
    const data = await apiFetch(`${HOUSEHOLD_URL}?ministry=${ministry}`);
    console.log("API household response:", data);

    setHouseholds(Array.isArray(data) ? data : data.households || []);
  } catch (error) {
    console.error("Error fetching households:", error);
    setHouseholds([]);
  }
};
  const editHousehold = async (_id: string, updates: Partial<HouseHold>) => {
    try {
      const data = await apiFetch(`${HOUSEHOLD_URL}/${_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      return await data;
    } catch (error) {
      console.error("Error updating household:", error);
    }
  };

  // -----------------------
  // Form Handlers
  // -----------------------

  const addYouth = () => {
    setNewYouths(prev => [...prev, { firstName: "", lastName: "", age: 0, signedIn: false }]);
  };

  const updateYouth = <K extends keyof Omit<Youth, "_id">>(index: number, field: K, value: any) => {
    setNewYouths(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const removeYouth = async (youthId: string) => {
    try {
      const res = await apiFetch(`${YOUTH_URL}/${youthId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete youth");
      setNewYouths(prev => prev.filter(y => (y as any)._id !== youthId));
      await fetchYouths();
    } catch (error) {
      console.error(error);
    }
  };

const handleSubmit = async (houseHoldID: string, e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    const createdYouths: Youth[] = [];
    for (const youth of newYouths) {
      const childId = await createYouth(youth);
      // Fetch the created youth object by ID (implement fetchYouthById if needed)
      const res = await apiFetch(`${YOUTH_URL}/${childId}`);
      const data = await res.json();
      createdYouths.push(data.child);
    }
    await editHousehold(houseHoldID, { children: createdYouths });
    alert("Registration completed successfully!");
    setNewYouths([{ firstName: "", lastName: "", age: 0, signedIn: false }]);
    await fetchYouths();
    await fetchHouseholds();
    setSelectedHousehold(null);
  } catch (error) {
    console.error(error);
    alert("Registration failed.");
  }
};

  useEffect(() => {
    fetchYouths();
    fetchHouseholds();
    setSearchTerm("");
    setSelected(null);
    setSelectedHousehold(null);
  }, [ministry]);

  // -----------------------
  // Sign-In / Sign-Out
  // -----------------------
  const handleSignIn = async (youth: Youth) => {
    const logId = await createLog({ message: "signIn", timestamp: new Date().toISOString() });
    setYouths(prev =>
      prev.map(y => (y === youth ? { ...y, signedIn: true } : y))
    );
    await editYouth(youth._id!, { signedIn: true, records: logId });
  };

  const handleSignOut = async (youth: Youth) => {
    const logId = await createLog({ message: "signOut", timestamp: new Date().toISOString() });
    setYouths(prev =>
      prev.map(y => (y === youth ? { ...y, signedIn: false } : y))
    );
    await editYouth(youth._id!, { signedIn: false, records: logId });
  };

  // -----------------------
  // Filters & Groupings
  // -----------------------

  const filteredYouths = youths.filter(y => {
    const matchesSearch = `${y.firstName} ${y.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterMode === "default" ? true : filterMode === "signedIn" ? y.signedIn : !y.signedIn;
    return matchesSearch && matchesFilter;
  });

  const groupedByCell = Array.from(
    new Set(filteredYouths.map(y => y.cell))
  ).map(cellName => ({
    cell: cellName,
    youths: filteredYouths.filter(y => y.cell === cellName),
  }));

  const groupedByHouseHold = households.map(h => ({
    houseHold: h,
    youths: filteredYouths.filter(y => h.children?.map(c => c._id).includes(y._id)),
  }));

  // -----------------------
  // Render
  // -----------------------

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-12">
      <div className="w-full max-w-6xl mx-auto px-4">
        <h3 className="text-2xl font-semibold mb-6 text-center">
          Grace Connect {ministry === "youth" ? "Youth" : "Sunday School"} Check-In System
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

{/* View Mode Buttons */}
<div className="flex justify-center gap-2 mb-4">
  <Button variant={viewMode === "default" ? "solid" : "flat"} onPress={() => setViewMode("default")}>Default View</Button>
  <Button variant={viewMode === "cell" ? "solid" : "flat"} onPress={() => setViewMode("cell")}>Cell View</Button>
  <Button variant={viewMode === "houseHold" ? "solid" : "flat"} onPress={() => setViewMode("houseHold")}>Household View</Button>
</div>

{/* Filter Switch */}
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

{/* Render views based on viewMode */}
{viewMode === "default" ? (
  <Allview
    filteredYouths={filteredYouths}
    handleSignIn={handleSignIn}
    handleSignOut={handleSignOut}
    editMode={editMode}
    setSelected={setSelected}
    removeYouth={removeYouth}
  />
) : viewMode === "cell" ? (
  <Cellview
    groupedByCell={groupedByCell}
    handleSignIn={handleSignIn}
    handleSignOut={handleSignOut}
    editMode={editMode}
    setSelected={setSelected}
    removeYouth={removeYouth}
  />
) : viewMode === "houseHold" ? (
  <HouseHoldView
    groupedByHouseHold={groupedByHouseHold}
    handleSignIn={handleSignIn}
    handleSignOut={handleSignOut}
    selectedHousehold={selectedHousehold}
    newYouths={newYouths}
    updateYouth={updateYouth}
    openEditCard={(id: string) => setSelectedHousehold(selectedHousehold === id ? null : id)}
    handleSubmit={handleSubmit}
    addYouth={addYouth}
    editMode={editMode}
    setSelected={setSelected}
    removeYouth={removeYouth}
    removeHouseHold={async (id: string) => {
      await fetch(`${HOUSEHOLD_URL}/${id}`, { method: "DELETE" });
      await fetchHouseholds();
    }}
  />
) : null}

      </div>
    </main>
  );
}
