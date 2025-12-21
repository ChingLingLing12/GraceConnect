"use client";

import { useState, useEffect, Children } from 'react';
import { Input, Button, Card, CardBody, CardHeader, Select, SelectItem, Switch } from "@heroui/react";
import {Cell, HouseHold, Youth, sampleYouth } from '../models'
import Allview from '../components/Views/AllView'
import Cellview from '../components/Views/CellView'
import HouseHoldView from '../components/Views/HouseHoldView'


export interface newYouth {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  signedIn: boolean;
  cell?: Cell;
}


export default function Dashboard() {

  const [searchTerm, setSearchTerm] = useState("");
  const [youths, setYouths] = useState(sampleYouth);
  const [filterMode, setFilterMode] = useState<"default" | "signedIn" | "signedOut">("default");
  const [viewMode, setViewMode] = useState<"default" | "cell" | "houseHold">("default");
  const [households, setHouseholds] = useState<any[]>([]);
  const [selectedHousehold, setSelectedHousehold] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  const [selected, setSelected] = useState<HouseHold | Youth | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';
  const YOUTH_URL = `${API_URL}/api/youth`;
  const LOG_URL = `${API_URL}/api/log`;
  const HOUSEHOLD_URL = `${API_URL}/api/household`;

  //add youth sections
    const addYouth = () => {
    setNewYouths(prev => [
      ...prev,
      { _id: String(Date.now()) + Math.random(), firstName: "", lastName: "", age: 0, signedIn: false },
    ]);
  };

  const [newYouths, setNewYouths] = useState<newYouth[]>([
    { _id: String(Date.now()), firstName: "", lastName: "", age: 0, signedIn: false },
  ]);

  const updateYouth = <K extends keyof newYouth>(index: number, field: K, value: newYouth[K]) => {
    setNewYouths(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const createYouth = async (youth: Youth): Promise<string> => {
    try {
      const response = await fetch(YOUTH_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(youth),
      });
      if (!response.ok) {
        throw new Error("Failed to create youth");
      }
      const data = await response.json();
      console.log("Youth created:", data);
      // Return the MongoDB _id from the created youth
      return data.child._id;
    } catch (error) {
      console.error("Error creating youth:", error);
      throw error;
    }
  };

  const removeYouth = async (youthId: string) => {
    try {
      const response = await fetch(`${YOUTH_URL}/${youthId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete youth. Status: ${response.status}`);
      }

      console.log("Youth deleted:", youthId);

      // Update local state to remove the card immediately
      setNewYouths(prev => prev.filter(y => y._id !== youthId));

    } catch (error) {
      console.error("Error deleting youth:", error);
    }
    fetchYouths()
  };


    const removeHouseHold = async (houseHoldId: string) => {
    try {
      const response = await fetch(`${HOUSEHOLD_URL}/${houseHoldId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete youth. Status: ${response.status}`);
      }

      console.log("Youth deleted:", houseHoldId);

    } catch (error) {
      console.error("Error deleting youth:", error);
    }
    fetchHouseholds()
  };



  const openEditCard = async (houseHoldId: string) => {
    if(houseHoldId == selectedHousehold){
      setSelectedHousehold(null)
    }
    else{
      setSelectedHousehold(houseHoldId);
      console.log("Selected Household ID:", houseHoldId);
    }

  };


  const handleEditEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selected && "guardianFirstName" in selected) {
      const updates = {
          guardianFirstName: selected.guardianFirstName,
          guardianLastName: selected.guardianLastName,
          email: selected.email,
          phone: selected.phone,
      };
      await editHousehold(selected._id, updates);
    }
    else if (selected && "firstName" in selected) {
      const updates = {
        firstName: selected.firstName,
        lastName: selected.lastName,
        age: selected.age,
        cell: selected.cell,
      };
      await editYouth(selected._id, updates);
    }
    setSelected(null)
    await fetchHouseholds();
    await fetchYouths();
  }
  const handleSelectedHouseHold = <K extends keyof HouseHold>(field: K, value: HouseHold[K]) => {
        setSelected(prev => prev ? { ...prev, [field]: value } : prev);
    };

  const handleSelectedYouth = <K extends keyof Youth>(field: K, value: Youth[K]) => {
      setSelected(prev => prev ? { ...prev, [field]: value } : prev);
  };





  //fetch households from backend functions
  const fetchHouseholds = async () => {
    try{
      const res = await fetch(`${HOUSEHOLD_URL}`);
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      console.log('Fetched households:', data);
      
      // Check if the response is an array directly or has households property
      if (Array.isArray(data)) {
        setHouseholds(data);
      } else if (data.households && Array.isArray(data.households)) {
        setHouseholds(data.households);
      } else {
        console.warn('Unexpected household API response format:', data);
        setHouseholds([]); // Set empty array if format is unexpected
      }
    } catch (error) {
      console.error('Error fetching households:', error);
      setHouseholds([]); // Set empty array on error
    }
  };

  const editHousehold = async (_id: string, updates: Partial<any>) => {
    try {
      const res = await fetch(`${HOUSEHOLD_URL}/${_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      console.log('Updated household:', data);
    } catch (error) {
      console.error('Error updating household:', error);
    }
  };

  const handleSubmit = async (houseHoldID: string, e: React.FormEvent<HTMLFormElement>) => {    
      e.preventDefault();
      console.log("@@@@@@@@", houseHoldID);
      try {
        const childIDs: string[] = [];
        for (const newYouth of newYouths) {
          const childId = await createYouth(newYouth);
          childIDs.push(childId);
        }
        await editHousehold(houseHoldID, {children: childIDs})
        alert("Registration completed successfully!");
      } catch (error) {
        console.error("Error during registration:", error);
        alert("Registration failed. Please try again.");
      }
      await fetchYouths();
      await fetchHouseholds();
      setNewYouths([{ _id: String(Date.now()), firstName: "", lastName: "", age: 0, signedIn: false }]);
      setSelectedHousehold(null);
    };


  //fetch youths from backend functions
  const fetchYouths = async () => {
    try{
      const res = await fetch(`${YOUTH_URL}`);
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      console.log('Fetched youths:', data);
      
      // Check if the response has the expected structure
      if (data.success && Array.isArray(data.children)) {
        setYouths(data.children);
      } else {
        console.warn('Unexpected API response format:', data);
        // Keep the sample data if API response is not in expected format
      }
    } catch (error) {
      console.error('Error fetching youths:', error);
      // Keep the sample data on error - no need to call setYouths since it's already initialized
    }
  }

  const createLog = async (logEntry: { message: 'signIn' | 'signOut'; timestamp: string; }) => {
    try {
      const res = await fetch(LOG_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logEntry),
      });

      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      console.log('Log created:', data);
      return data.log._id;
    } catch (error) {
      console.error('Error creating log:', error);
    }
  };

  const editYouth = async (_id: string, updates: Partial<Youth>) => {
    try {
      const res = await fetch(`${YOUTH_URL}/${_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      console.log('Updated youth:', data);
    } catch (error) {
      console.error('Error updating youth:', error);
    }
  };


  

  useEffect(() => {
    fetchYouths();
    fetchHouseholds();
    console.log("Households fetched on mount:", households);
  }, []);

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

const handleSignIn = async (youth: Youth) => {
    try {
      const logId = await createLog({ message: 'signIn', timestamp: new Date().toISOString() });

      setYouths((prev: Youth[]) =>
        prev.map((y) =>
          y === youth
            ? { ...y, signedIn: true, lastSignedIn: new Date().toISOString() }
            : y
        ) 
      );
      // Pass the logId in records - backend will merge with existing records
      editYouth(youth._id!, { signedIn: true, records: logId });
    } catch (error) {
      console.error('Error signing in youth:', error);
    }
  };

  const handleSignOut = async (youth: Youth) => {
    try {
      const logId = await createLog({ message: 'signOut', timestamp: new Date().toISOString() });

      setYouths((prev: Youth[]) =>
        prev.map((y) =>
          y === youth
            ? { ...y, signedIn: false, lastSignedOut: new Date().toISOString() }
            : y
        )
      );
      // Pass the logId in records - backend will merge with existing records
      editYouth(youth._id!, { signedIn: false, records: logId });
    } catch (error) {
      console.error('Error signing out youth:', error);
    }
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

const groupedByHouseHold = households.map((houseHold) => ({
    houseHold: houseHold,
    youths: filteredYouths.filter((y) => {
      // houseHold.children contains populated objects with _id properties
      if (!houseHold.children || !Array.isArray(houseHold.children)) {
        return false;
      }
      // Extract IDs from populated children objects
      const childIds = houseHold.children.map((child: any) => child._id || child);
      return childIds.includes(y._id);
    }),
  }));

  console.log('Households:', households);
  console.log('Grouped by household:', groupedByHouseHold);

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
          <Button
            variant={viewMode === "houseHold" ? "solid" : "flat"}
            onPress={() => setViewMode("houseHold")}
          >
            Household View
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

        {editMode ? (
          <button
            className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-red-700 transition"
            onClick={() => {setEditMode(!editMode)
            }
            }
          >
            Edit
          </button>
        ):(
          <button
            className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-700 transition"
            onClick={() => {setEditMode(!editMode)
            }
            }
          >
            Edit
          </button>
        )}



        {/* 🧾 DISPLAY */}
        {viewMode === "default" ? (
          <Allview
            filteredYouths= {filteredYouths}
            handleSignIn={handleSignIn}
            handleSignOut={handleSignOut}
            editMode = {editMode}
            setSelected = {setSelected}
            removeYouth={removeYouth}
          />
        ) : viewMode === "cell" ? (
          // 🟩 4-CELL GRID VIEW
          <Cellview
            groupedByCell={groupedByCell}
            handleSignIn={handleSignIn}
            handleSignOut={handleSignOut}
            editMode = {editMode}
            setSelected = {setSelected}
            removeYouth={removeYouth}
          />
        ) : viewMode === "houseHold" ? (
          // 🏠 HOUSEHOLD VIEW
          <HouseHoldView
            groupedByHouseHold={groupedByHouseHold}
            handleSignIn={handleSignIn}
            handleSignOut={handleSignOut}
            selectedHousehold={selectedHousehold}
            newYouths={newYouths}
            updateYouth={updateYouth}
            openEditCard={openEditCard}
            handleSubmit={handleSubmit}
            addYouth={addYouth}
            editMode = {editMode}
            setSelected = {setSelected}
            removeYouth={removeYouth}
            removeHouseHold={removeHouseHold}
          />
        ) : null}

        {
          selected === null ? null
            : "guardianFirstName" in selected &&
            "guardianLastName" in selected &&
            "email" in selected &&
            "phone" in selected ? (
            <div className="fixed right-4 top-100 -translate-y-1/2 z-50">
              {/* Household editor card */}
              <Card className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-md flex flex-col max-h-[600px]">
                <CardHeader className="text-lg font-semibold text-white border-b border-zinc-700 px-4 py-3 flex-none">
                  Editing household {selected.guardianLastName}
                </CardHeader>
                <CardBody className="px-4 py-4 overflow-y-auto flex-1 space-y-4">
                  <form onSubmit={handleEditEntry}>
                    <div className="space-y-4">
                      <p> {selected._id} </p>
                      <Input className="pb-3" label="First Name" variant="bordered" labelPlacement="outside" placeholder="Enter first name" value={selected.guardianFirstName} onChange={(e) => handleSelectedHouseHold("guardianFirstName", e.target.value)} />
                      <Input className="pb-3" label="Last Name" variant="bordered" labelPlacement="outside" placeholder="Enter last name" value={selected.guardianLastName} onChange={(e) => handleSelectedHouseHold("guardianLastName", e.target.value)} />
                      <Input className="pb-3" label="Email" variant="bordered" labelPlacement="outside" placeholder="Enter Email" value={selected.email} onChange={(e) => handleSelectedHouseHold("email", e.target.value)} />
                      <Input className="pb-3" label="Phone" variant="bordered" labelPlacement="outside" placeholder="Enter Phone Number" value={selected.phone} onChange={(e) => handleSelectedHouseHold("phone", e.target.value)} />
                      <Button type="submit" color="primary"> Edit </Button>
                    </div>
                  </form>
                </CardBody>
              </Card>
            </div>
          ) : "firstName" in selected &&
            "lastName" in selected &&
            "age" in selected &&
            "cell" in selected ? (
              <div className="fixed right-4 top-100 -translate-y-1/2 z-50">
                <Card className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-md flex flex-col max-h-[600px]">
                  <CardHeader className="text-lg font-semibold text-white border-b border-zinc-700 px-4 py-3 flex items-center justify-between">
                    <span>
                      Editing Child {selected.firstName} {selected.lastName}
                    </span>

                    <Button
                      onClick={() => setSelected(null)}
                      className="text-sm p-0 m-0 w-6 h-6 min-w-0"
                    >
                      X
                    </Button>
                  </CardHeader>

                  <CardBody className="px-4 py-4 overflow-y-auto flex-1 space-y-4">
                    <form onSubmit={handleEditEntry}>
                      <div className="space-y-4">
                        <p> {selected._id} </p>
                        <Input className="pb-3" label="First Name" variant="bordered" labelPlacement="outside" placeholder="Enter first name" value={selected.firstName} onChange={(e) => handleSelectedYouth("firstName", e.target.value)} />
                        <Input className="pb-3" label="Last Name" variant="bordered" labelPlacement="outside" placeholder="Enter last name" value={selected.lastName} onChange={(e) => handleSelectedYouth("lastName", e.target.value)} />
                        <Input className="pb-3" label="Email" variant="bordered" labelPlacement="outside" placeholder="Enter Email" value={selected.age.toString()} onChange={(e) => handleSelectedYouth("age", Number(e.target.value))} />

                        <Select
                          className="pb-3"
                          label="Cell Group"
                          variant="bordered"
                          labelPlacement="outside"
                          placeholder="Select a cell group"
                          selectedKeys={selected.cell ? new Set([selected.cell]) : new Set()}
                          onSelectionChange={(keys) => {
                            const value = Array.from(keys)[0] as Cell | undefined;
                            handleSelectedYouth("cell", value);
                          }}
                        >
                          {Object.values(Cell).map((val) => (
                            <SelectItem key={val}>{val}</SelectItem>
                          ))}
                        </Select>

                        <Button type="submit" color="primary"> Edit </Button>
                      </div>
                    </form>
                  </CardBody>
                </Card>
              </div>
            ) : null
          }
        
      </div>
      
    </main>
  );
}

