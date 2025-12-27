"use client";
import React, { useState } from "react";
import { Input, Button, Select, SelectItem, Switch } from "@heroui/react";
import { create } from "domain";
import {Cell, HouseHold, Youth } from '../models'


export default function RegisterForm() {

  
  const [isTemporary, setIsTemporary] = useState(false);

  const [houseHold, setHouseHold] = useState<HouseHold>(
    { id: String(Date.now()), guardianFirstName: "", guardianLastName: "", email: "", phone: "", children: [] }  //THERE IS EROR BUT DONT TOUCh
  );
  const [youths, setYouths] = useState<Youth[]>([
    { _id: String(Date.now()), firstName: "", lastName: "", age: 0, signedIn: false, oneTime: isTemporary },
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
      { _id: String(Date.now()) + Math.random(), firstName: "", lastName: "", age: 0, signedIn: false, oneTime: isTemporary },
    ]);
  };

  const removeYouth = (index: number) => {
    setYouths(prev => prev.filter((_, i) => i !== index));
  };

  //API calls to backend
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';
  const YOUTH_URL = `${API_URL}/api/youth`;
  const HOUSEHOLD_URL = `${API_URL}/api/household`;
  const LOG_URL = `${API_URL}/api/log`;

  const createHouseHold = async (houseHold: HouseHold, childIDs: string[]) => {
    try {
      console.log("Creating household with children IDs:", childIDs);
      const response = await fetch(HOUSEHOLD_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...houseHold, children: childIDs }),
      });
      if (!response.ok) {
        throw new Error("Failed to create household");
      }
    } catch (error) {
      console.error("Error creating household:", error);
    }
  };

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
  const createYouth = async (youth: Youth): Promise<string> => {
    try {
      let payload;
      if(youth.signedIn){
        console.log("Creating youth with sign-in log");
        payload = {
          ...youth,
          oneTime: isTemporary, // 🔥 always correct
          records: [await createLog({message: 'signIn', timestamp: new Date().toISOString()})]
        };
      } 
      else {
        payload = {
          ...youth,
          oneTime: isTemporary, // 🔥 always correct
        };
      }
      const response = await fetch(YOUTH_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const childIDs: string[] = [];
      for (const youth of youths) {
        const childToSend = {
          ...youth,
          oneTime: isTemporary,
          signedIn: isTemporary ? true : youth.signedIn, // <--- FORCE true
        };
        const childId = await createYouth(childToSend);
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
      <form onSubmit={handleSubmit} className="w-full max-w-3xl space-y-8 heroui-label-override">
        {/* Main registration info (centered) */}
        <div className="flex flex-col items-center space-y-4">
          <Input
            isRequired
            label="Guardian First Name"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Enter your first name"
            value={houseHold.guardianFirstName}
            onChange={e => updateHouseHold("guardianFirstName", e.target.value)}
          />
          <Input
            isRequired
            label="Guardian Last Name"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Enter your last name"
            value={houseHold.guardianLastName}
            onChange={e => updateHouseHold("guardianLastName", e.target.value)}
          />
          <Input
            isRequired
            type="email"
            label="Guardian Email"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Enter your email"
            value={houseHold.email}
            onChange={e => updateHouseHold("email", e.target.value)}
          />
          <Input
            isRequired
            type="tel"
            label="Guardian Phone Number"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Enter your phone number"
            value={houseHold.phone}
            onChange={e => updateHouseHold("phone", e.target.value)}
          />
          <Switch isSelected={isTemporary} onValueChange={setIsTemporary}>
            Temporary Registration {isTemporary ? "(Yes)" : "(No)"}
          </Switch>
        </div>

        {/* Youth cards below */}
        <div className="flex flex-wrap gap-4 justify-center">
          {youths.map((youth, i) => (
            <div key={youth._id} className="border p-4 rounded-2xl space-y-3 flex-none w-[280px]">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-white">Youth {i + 1}</h3>
                {youths.length > 1 && (
                  <Button size="sm" variant="flat" color="danger" onPress={() => removeYouth(i)}>
                    Remove
                  </Button>
                )}
              </div>

              <Input
                isRequired
                label="First Name"
                variant="bordered"
                labelPlacement="outside"
                placeholder="Enter first name"
                value={youth.firstName}
                onChange={e => updateYouth(i, "firstName", e.target.value)}
              />

              <Input
                isRequired
                label="Last Name"
                variant="bordered"
                labelPlacement="outside"
                placeholder="Enter last name"
                value={youth.lastName}
                onChange={e => updateYouth(i, "lastName", e.target.value)}
              />

              <Input
                isRequired
                label="Age"
                variant="bordered"
                labelPlacement="outside"
                placeholder="Enter age"
                value={String(youth.age)}
                onChange={e => updateYouth(i, "age", Number(e.target.value))}
              />

              <Select
                label="Cell Group"
                placeholder="Select a cell group" variant="bordered"
                selectedKeys={youth.cell ? new Set([youth.cell]) : new Set()}
                onSelectionChange={keys => {
                  const selected = Array.from(keys)[0] as Cell | undefined;
                  updateYouth(i, "cell", selected);
                }}
              >
                {Object.values(Cell).map(val => (
                  <SelectItem key={val}>{val}</SelectItem>
                ))}
              </Select>

              <Switch
                isSelected={isTemporary ? true : youth.signedIn}
                isDisabled={isTemporary}
                onValueChange={v => {
                  if (!isTemporary) {
                    updateYouth(i, "signedIn", v);
                  }
                }}
              >
                Signed In
              </Switch>
            </div>
          ))}
        </div>

        {/* Add Youth & Submit buttons */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-4">
          <Button type="button" variant="bordered" onPress={addYouth}>
            + Add Another Youth
          </Button>
          <Button type="submit" color="primary">
            Submit
          </Button>
        </div>
      </form>
    </main>
  );
}
