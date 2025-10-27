"use client";
import React, { useState } from "react";
import { Input, Button, Select, SelectItem, Switch } from "@heroui/react";

export enum Cell {
  Year12 = "Year 12",
  Year89 = "Year 8/9 Cell",
  Year1011 = "Year 10/11 Cell",
  Year7 = "Year 7 Cell",
}

export interface Youth {
  id: string;
  firstName: string;
  lastName: string;
  signedIn: boolean;
  cell?: Cell;
}

export default function RegisterForm() {
  const [youths, setYouths] = useState<Youth[]>([
    { id: String(Date.now()), firstName: "", lastName: "", signedIn: false },
  ]);

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
      { id: String(Date.now()) + Math.random(), firstName: "", lastName: "", signedIn: false },
    ]);
  };

  const removeYouth = (index: number) => {
    setYouths(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted:", youths);
    alert(JSON.stringify(youths, null, 2));
  };

  return (
    <main className="min-h-screen bg-gray-900 flex flex-col items-center p-12">
      <form onSubmit={handleSubmit} className="w-full max-w-3xl space-y-8 heroui-label-override">
        {/* Main registration info (centered) */}
        <div className="flex flex-col items-center space-y-4">
          <Input
            isRequired
            label="First Name"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Enter your first name"
          />
          <Input
            isRequired
            label="Last Name"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Enter your last name"
          />
          <Input
            isRequired
            type="email"
            label="Email"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Enter your email"
          />
          <Input
            isRequired
            type="tel"
            label="Phone Number"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Enter your phone number"
          />
        </div>

        {/* Youth cards below */}
        <div className="flex flex-wrap gap-4 justify-center">
          {youths.map((youth, i) => (
            <div key={youth.id} className="border p-4 rounded-2xl space-y-3 flex-none w-[280px]">
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
                isSelected={youth.signedIn}
                onValueChange={v => updateYouth(i, "signedIn", v)}
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
