"use client";

import { useState, useEffect } from "react";
import { Input, Button } from "@heroui/react";
import { HouseHold, Youth, sampleYouth } from "../models";
import Allview from "../components/Views/AllView";
import Cellview from "../components/Views/CellView";
import HouseHoldView from "../components/Views/HouseHoldView";
import { apiFetch } from "../context/api";

type Props = {
  ministry: "youth" | "sundayschool" | null;
};

export default function Dashboard({ ministry }: Props) {
  const BASE_MINISTRY_URL = ministry ? `/api/${ministry}` : "";
  const YOUTH_URL = BASE_MINISTRY_URL;
  const HOUSEHOLD_URL = `${BASE_MINISTRY_URL}/household`;

  const [searchTerm, setSearchTerm] = useState("");
  const [youths, setYouths] = useState<Youth[]>(sampleYouth);
  const [households, setHouseholds] = useState<HouseHold[]>([]);
  const [newYouths, setNewYouths] = useState<Omit<Youth, "_id">[]>([
    { firstName: "", lastName: "", age: 0, signedIn: false },
  ]);
  const [editMode, setEditMode] = useState(false);
  const [selectedHousehold, setSelectedHousehold] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"default" | "cell" | "houseHold">(
    "default"
  );
  const [filterMode, setFilterMode] = useState<
    "default" | "signedIn" | "signedOut"
  >("default");

  const fetchYouths = async () => {
    if (!ministry) {
      setYouths([]);
      return;
    }

    try {
      const data = await apiFetch(YOUTH_URL);

      const children: Youth[] =
        data.success && Array.isArray(data.children)
          ? data.children.filter((child: Youth) => child.ministry === ministry)
          : [];

      setYouths(children);
    } catch (error) {
      console.error("Error fetching youths:", error);
      setYouths([]);
    }
  };

  const fetchHouseholds = async () => {
    if (!ministry) {
      setHouseholds([]);
      return;
    }

    try {
      const data = await apiFetch(`${HOUSEHOLD_URL}?ministry=${ministry}`);
      setHouseholds(Array.isArray(data) ? data : data.households || []);
    } catch (error) {
      console.error("Error fetching households:", error);
      setHouseholds([]);
    }
  };

  const createYouth = async (youth: Omit<Youth, "_id">) => {
    const data = await apiFetch(YOUTH_URL, {
      method: "POST",
      body: JSON.stringify(youth),
    });

    if (!data.success) throw new Error("Failed to create youth");

    return data.child._id;
  };

  const editHousehold = async (_id: string, updates: Partial<HouseHold>) => {
    try {
      await apiFetch(`${HOUSEHOLD_URL}/${_id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      });
    } catch (error) {
      console.error("Error updating household:", error);
    }
  };

  const handleSignIn = async (youth: Youth) => {
    if (!youth._id) return;

    try {
      const data = await apiFetch("/api/log/signin", {
        method: "POST",
        body: JSON.stringify({ childId: youth._id }),
      });

      if (!data.success) throw new Error(data.error || "Failed to sign in");

      setYouths((prev) =>
        prev.map((y) =>
          y._id === youth._id ? { ...y, signedIn: true } : y
        )
      );

      await fetchYouths();
    } catch (error) {
      console.error("Error signing in:", error);
      alert("Failed to sign in");
    }
  };

  const handleSignOut = async (youth: Youth) => {
    if (!youth._id) return;

    try {
      const data = await apiFetch("/api/log/signout", {
        method: "PUT",
        body: JSON.stringify({ childId: youth._id }),
      });

      if (!data.success) throw new Error(data.error || "Failed to sign out");

      setYouths((prev) =>
        prev.map((y) =>
          y._id === youth._id ? { ...y, signedIn: false } : y
        )
      );

      await fetchYouths();
    } catch (error) {
      console.error("Error signing out:", error);
      alert(error instanceof Error ? error.message : "Failed to sign out");
    }
  };

  const handleSubmit = async (
    houseHoldID: string,
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      const createdYouths: Youth[] = [];

      for (const youth of newYouths) {
        const childId = await createYouth(youth);
        const data = await apiFetch(`${YOUTH_URL}/${childId}`);
        createdYouths.push(data.child);
      }

      await editHousehold(houseHoldID, { children: createdYouths });

      alert("Registration completed successfully!");
      setNewYouths([{ firstName: "", lastName: "", age: 0, signedIn: false }]);
      setSelectedHousehold(null);

      await fetchYouths();
      await fetchHouseholds();
    } catch (error) {
      console.error(error);
      alert("Registration failed.");
    }
  };

  const addYouth = () => {
    setNewYouths((prev) => [
      ...prev,
      { firstName: "", lastName: "", age: 0, signedIn: false },
    ]);
  };

  const updateYouth = <K extends keyof Omit<Youth, "_id">>(
    index: number,
    field: K,
    value: Omit<Youth, "_id">[K]
  ) => {
    setNewYouths((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const removeYouth = (indexOrId: number | string) => {
    setNewYouths((prev) =>
      prev.filter((y, i) =>
        typeof indexOrId === "number"
          ? i !== indexOrId
          : (y as Youth & { _id?: string })._id !== indexOrId
      )
    );
  };

  const openEditHousehold = (houseHold: HouseHold) => {
    setSelectedHousehold(houseHold._id || null);
    setEditMode(true);
    setNewYouths(
      houseHold.children?.map((c) => ({
        ...c,
        signedIn: c.signedIn || false,
      })) || []
    );
  };

  useEffect(() => {
    if (!ministry) return;

    fetchYouths();
    fetchHouseholds();
  }, [ministry]);

  const filteredYouths = youths.filter((y) => {
    const matchesSearch = `${y.firstName} ${y.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterMode === "default"
        ? true
        : filterMode === "signedIn"
        ? y.signedIn
        : !y.signedIn;

    return matchesSearch && matchesFilter && y.ministry === ministry;
  });

  const groupedByCell = Array.from(new Set(filteredYouths.map((y) => y.cell))).map(
    (cellName) => ({
      cell: cellName,
      youths: filteredYouths.filter((y) => y.cell === cellName),
    })
  );

  const groupedByHouseHold = households
    .filter((h) => h.ministry === ministry)
    .map((h) => ({
      houseHold: h,
      youths: filteredYouths.filter(
        (y) =>
          y.ministry === ministry &&
          h.children?.some((c) => c._id === y._id)
      ),
    }))
    .filter((group) => group.youths.length > 0);

  if (!ministry) return null;

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-12">
      <div className="w-full max-w-6xl mx-auto px-4">

        <h3 className="text-2xl font-semibold mb-6 text-center">
          Grace Connect {ministry === "youth" ? "Youth" : "Sunday School"} Dashboard
        </h3>

        <Input
          placeholder="Search youth..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
          isClearable
          onClear={() => setSearchTerm("")}
        />

        <div className="flex justify-center gap-2 mb-4">
          <Button variant={viewMode === "default" ? "solid" : "flat"} onPress={() => setViewMode("default")}>Default</Button>
          <Button variant={viewMode === "cell" ? "solid" : "flat"} onPress={() => setViewMode("cell")}>Cell</Button>
          <Button variant={viewMode === "houseHold" ? "solid" : "flat"} onPress={() => setViewMode("houseHold")}>Household</Button>
        </div>

        {viewMode === "default" && (
          <Allview
            filteredYouths={filteredYouths}
            handleSignIn={handleSignIn}
            handleSignOut={handleSignOut}
            editMode={editMode}
            setSelected={() => {}}
            removeYouth={removeYouth}
          />
        )}

        {viewMode === "cell" && (
          <Cellview
            groupedByCell={groupedByCell}
            handleSignIn={handleSignIn}
            handleSignOut={handleSignOut}
            editMode={editMode}
            setSelected={() => {}}
            removeYouth={removeYouth}
          />
        )}

        {viewMode === "houseHold" && (
          <HouseHoldView
            groupedByHouseHold={groupedByHouseHold}
            selectedHousehold={selectedHousehold}
            openHouseholdEditor={openEditHousehold}
            handleSubmit={handleSubmit}
            newYouths={newYouths}
            updateYouth={updateYouth}
            addYouth={addYouth}
            removeYouth={removeYouth}
            removeHouseHold={async (id: string) => {
              await apiFetch(`${HOUSEHOLD_URL}/${id}`, { method: "DELETE" });
              fetchHouseholds();
            }}
            editMode={editMode}
          />
        )}

      </div>
    </main>
  );
}