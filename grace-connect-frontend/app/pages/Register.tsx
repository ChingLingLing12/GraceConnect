"use client";
import React, { useState } from "react";
import { Input, Button, Select, SelectItem, Switch } from "@heroui/react";
import { Cell, HouseHold, Youth } from "../models";

type Props = {
  ministry: "youth" | "sundayschool" | null;
};

export default function RegisterForm({ ministry }: Props) {
  if (!ministry) return null;

  const [isTemporary, setIsTemporary] = useState(false);

  // Remove _id from initial state for creation
  const [houseHold, setHouseHold] = useState<Omit<HouseHold, "_id">>({
    guardianFirstName: "",
    guardianLastName: "",
    email: "",
    phone: "",
    children: [],
  });

  const [youths, setYouths] = useState<Omit<Youth, "_id">[]>([
    { firstName: "", lastName: "", age: 0, signedIn: false, oneTime: isTemporary },
  ]);

  const updateHouseHold = <K extends keyof HouseHold>(field: K, value: HouseHold[K]) => {
    setHouseHold(prev => ({ ...prev, [field]: value }));
  };

  const updateYouth = <K extends keyof Youth>(index: number, field: K, value: Youth[K]) => {
    setYouths(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addYouth = () => {
    setYouths(prev => [
      ...prev,
      { firstName: "", lastName: "", age: 0, signedIn: false, oneTime: isTemporary },
    ]);
  };

  const removeYouth = (index: number) => {
    setYouths(prev => prev.filter((_, i) => i !== index));
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000";
  const BASE_MINISTRY_URL = `${API_URL}/api/${ministry}`;
  const YOUTH_URL = BASE_MINISTRY_URL;
  const HOUSEHOLD_URL = `${BASE_MINISTRY_URL}/household`;
  const LOG_URL = `${API_URL}/api/log`;

  // Reset forms when ministry changes
  React.useEffect(() => {
    setHouseHold({ guardianFirstName: "", guardianLastName: "", email: "", phone: "", children: [] });
    setYouths([{ firstName: "", lastName: "", age: 0, signedIn: false, oneTime: false }]);
    setIsTemporary(false);
  }, [ministry]);

  // -------------------
  // Backend API calls
  // -------------------
  const createLog = async (logEntry: { message: "signIn" | "signOut"; timestamp: string }) => {
    try {
      const res = await fetch(LOG_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logEntry),
      });
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      console.log("Log created:", data);
      return data.log._id;
    } catch (error) {
      console.error("Error creating log:", error);
    }
  };

  const createYouth = async (youth: Omit<Youth, "_id">): Promise<string> => {
    try {
      let payload: any = { ...youth, oneTime: isTemporary, ministry };

      if (youth.signedIn) {
        console.log("Creating youth with sign-in log");
        payload.records = [await createLog({ message: "signIn", timestamp: new Date().toISOString() })];
      }

      const response = await fetch(YOUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to create youth");

      const data = await response.json();
      console.log("Youth created:", data);
      return data.child._id; // Return MongoDB _id
    } catch (error) {
      console.error("Error creating youth:", error);
      throw error;
    }
  };

  const createHouseHold = async (houseHold: Omit<HouseHold, "_id">, childIDs: string[]) => {
    try {
      console.log("Creating household with children IDs:", childIDs);
      const response = await fetch(HOUSEHOLD_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...houseHold, ministry, children: childIDs }), // no _id sent!
      });
      if (!response.ok) throw new Error("Failed to create household");
      const data = await response.json();
      console.log("Household created:", data);
    } catch (error) {
      console.error("Error creating household:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const childIDs: string[] = [];
      for (const youth of youths) {
        const childId = await createYouth({ ...youth, signedIn: isTemporary ? true : youth.signedIn });
        childIDs.push(childId);
      }
      await createHouseHold(houseHold, childIDs);
      alert("Registration completed successfully!");
    } catch (error) {
      console.error(error);
      alert("Registration failed");
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 flex flex-col items-center p-12">
      <form onSubmit={handleSubmit} className="w-full max-w-3xl space-y-8 heroui-dark">
        {/* Guardian Info */}
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-2xl font-bold text-white text-center">
            {ministry === "youth" ? "Youth Registration" : "Sunday School Registration"}
          </h2>
          <Input label="Guardian First Name" value={houseHold.guardianFirstName} onChange={e => updateHouseHold("guardianFirstName", e.target.value)} isRequired />
          <Input label="Guardian Last Name" value={houseHold.guardianLastName} onChange={e => updateHouseHold("guardianLastName", e.target.value)} isRequired />
          <Input label="Guardian Email" type="email" value={houseHold.email} onChange={e => updateHouseHold("email", e.target.value)} isRequired />
          <Input label="Guardian Phone" type="tel" value={houseHold.phone} onChange={e => updateHouseHold("phone", e.target.value)} isRequired />
          <Switch isSelected={isTemporary} onValueChange={setIsTemporary}>
            Temporary Registration {isTemporary ? "(Yes)" : "(No)"}
          </Switch>
        </div>

        {/* Youth Info */}
        <div className="flex flex-wrap gap-4 justify-center">
          {youths.map((youth, i) => (
            <div key={i} className="border p-4 rounded-2xl space-y-3 flex-none w-[280px]">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-white">Youth {i + 1}</h3>
                {youths.length > 1 && <Button size="sm" color="danger" onPress={() => removeYouth(i)}>Remove</Button>}
              </div>
              <Input label="First Name" value={youth.firstName} onChange={e => updateYouth(i, "firstName", e.target.value)} isRequired />
              <Input label="Last Name" value={youth.lastName} onChange={e => updateYouth(i, "lastName", e.target.value)} isRequired />
              <Input label="Age" type="number" value={String(youth.age)} onChange={e => updateYouth(i, "age", Number(e.target.value))} isRequired />
              <Select label="Cell Group" selectedKeys={youth.cell ? new Set([youth.cell]) : new Set()} onSelectionChange={keys => updateYouth(i, "cell", Array.from(keys)[0] as Cell | undefined)}>
                {Object.values(Cell).map(val => <SelectItem key={val}>{val}</SelectItem>)}
              </Select>
              <Switch isSelected={isTemporary ? true : youth.signedIn} isDisabled={isTemporary} onValueChange={v => { if (!isTemporary) updateYouth(i, "signedIn", v); }}>
                Signed In
              </Switch>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4 mt-4">
          <Button type="button" onPress={addYouth}>+ Add Another Youth</Button>
          <Button type="submit" color="primary">Submit</Button>
        </div>
      </form>
    </main>
  );
}
