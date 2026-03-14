"use client";
import React, { useState, useEffect } from "react";
import { Input, Button, Select, SelectItem, Switch } from "@heroui/react";
import { HouseHold, Youth } from "../models";
import { useSearchParams } from "next/navigation";

type Props = {
  ministry: "youth" | "sundayschool" | null;
};

export default function RegisterForm({ ministry }: Props) {

  if (!ministry) return null;

  const [isTemporary, setIsTemporary] = useState(false);

  const [houseHold, setHouseHold] = useState<Omit<HouseHold, "_id">>({
    guardianFirstName: "",
    guardianLastName: "",
    email: "",
    phone: "",
    children: [],
  });

  const [youths, setYouths] = useState<Omit<Youth, "_id">[]>([
    {
      firstName: "",
      lastName: "",
      age: 0,
      signedIn: false,
      oneTime: false,
      cell: "",
      ministry,
    },
  ]);

  // ==========================
  // BACKEND ENUM VALUES (MATCH EXACTLY)
  // ==========================
  const YEAR_GROUP_OPTIONS =
    ministry === "youth"
      ? [
          "Year 7",
          "Year 8",
          "Year 9",
          "Year 10",
          "Year 11",
          "Year 12",
        ]
      : [
          "Little Light [Kindy to PP]",
          "Little Candle [Y1-Y2]",
          "Lighthouse [Y3-Y4]",
          "Flame [Y5]",
          "Torch Bearer [Y6 above]",
        ];

  // ==========================
  // STATE HELPERS
  // ==========================
  const updateHouseHold = <K extends keyof HouseHold>(
    field: K,
    value: HouseHold[K]
  ) => {
    setHouseHold((prev) => ({ ...prev, [field]: value }));
  };

  const updateYouth = <K extends keyof Youth>(
    index: number,
    field: K,
    value: Youth[K]
  ) => {
    setYouths((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addYouth = () => {
    setYouths((prev) => [
      ...prev,
      {
        firstName: "",
        lastName: "",
        age: 0,
        signedIn: false,
        oneTime: false,
        cell: "",
        ministry,
      },
    ]);
  };

  const removeYouth = (index: number) => {
    setYouths((prev) => prev.filter((_, i) => i !== index));
  };

  // Reset when ministry changes
  useEffect(() => {
    setHouseHold({
      guardianFirstName: "",
      guardianLastName: "",
      email: "",
      phone: "",
      children: [],
    });

    setYouths([
      {
        firstName: "",
        lastName: "",
        age: 0,
        signedIn: false,
        oneTime: false,
        cell: "",
        ministry,
      },
    ]);

    setIsTemporary(false);
  }, [ministry]);

  // ==========================
  // API CONFIG
  // ==========================
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000";
  const BASE_MINISTRY_URL = `${API_URL}/api/${ministry}`;
  const YOUTH_URL = BASE_MINISTRY_URL;
  const HOUSEHOLD_URL = `${BASE_MINISTRY_URL}/household`;

  // ==========================
  // SUBMIT
  // ==========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required Year Group
    for (const youth of youths) {
      if (!youth.cell) {
        alert("Please select a Year Group for all youths.");
        return;
      }
    }

    try {
      const childIDs: string[] = [];

      for (const youth of youths) {
        const response = await fetch(YOUTH_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...youth,
            ministry,
            oneTime: isTemporary,
            signedIn: isTemporary ? true : youth.signedIn,
          }),
        });

        if (!response.ok) throw new Error("Failed to create youth");

        const data = await response.json();
        childIDs.push(data.child._id);
      }

      await fetch(HOUSEHOLD_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...houseHold,
          ministry,
          children: childIDs,
        }),
      });

      alert("Registration completed successfully!");

      resetForm();
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  const resetForm = () => {
  setHouseHold({
    guardianFirstName: "",
    guardianLastName: "",
    email: "",
    phone: "",
    children: [],
  });

  setYouths([
    {
      firstName: "",
      lastName: "",
      age: 0,
      signedIn: false,
      oneTime: false,
      cell: "",
      ministry,
    },
  ]);

  setIsTemporary(false);
};

  // ==========================
  // UI
  // ==========================
  return (
    <main className="min-h-screen bg-gray-900 flex flex-col items-center p-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl space-y-8 heroui-dark"
      >
        {/* Guardian Info */}
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-2xl font-bold text-white text-center">
            {ministry === "youth"
              ? "Youth Registration"
              : "Sunday School Registration"}
          </h2>

          <Input
            label="Guardian First Name"
            value={houseHold.guardianFirstName}
            onChange={(e) =>
              updateHouseHold("guardianFirstName", e.target.value)
            }
            isRequired
          />

          <Input
            label="Guardian Last Name"
            value={houseHold.guardianLastName}
            onChange={(e) =>
              updateHouseHold("guardianLastName", e.target.value)
            }
            isRequired
          />

          <Input
            label="Guardian Email"
            type="email"
            value={houseHold.email}
            onChange={(e) => updateHouseHold("email", e.target.value)}
            isRequired
          />

          <Input
            label="Guardian Phone"
            type="tel"
            value={houseHold.phone}
            onChange={(e) => updateHouseHold("phone", e.target.value)}
            isRequired
          />

          <div className="flex items-center gap-2">
            <Switch
              isSelected={isTemporary}
              onValueChange={setIsTemporary}
            />
            <span className="text-white text-sm">Sign all in now</span>
          </div>
        </div>

        {/* Youth Cards */}
        <div className="flex flex-wrap gap-4 justify-center">
          {youths.map((youth, i) => (
            <div
              key={i}
              className="border p-4 rounded-2xl space-y-3 flex-none w-[280px]"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-white">
                  Youth {i + 1}
                </h3>
                {youths.length > 1 && (
                  <Button
                    size="sm"
                    color="danger"
                    onPress={() => removeYouth(i)}
                  >
                    Remove
                  </Button>
                )}
              </div>

              <Input
                label="First Name"
                value={youth.firstName}
                onChange={(e) =>
                  updateYouth(i, "firstName", e.target.value)
                }
                isRequired
              />

              <Input
                label="Last Name"
                value={youth.lastName}
                onChange={(e) =>
                  updateYouth(i, "lastName", e.target.value)
                }
                isRequired
              />

              <Input
                label="Age"
                type="number"
                value={String(youth.age)}
                onChange={(e) =>
                  updateYouth(i, "age", Number(e.target.value))
                }
                isRequired
              />

              {/* RENAMED TO YEAR GROUP (but still uses `cell`) */}
              <Select
                label="Year Group"
                selectedKeys={youth.cell ? new Set([youth.cell]) : new Set()}
                onSelectionChange={(keys) =>
                  updateYouth(i, "cell", Array.from(keys)[0] as string)
                }
                isRequired
              >
                {YEAR_GROUP_OPTIONS.map((option) => (
                  <SelectItem key={option}>{option}</SelectItem>
                ))}
              </Select>

              <div className="flex items-center gap-2">
              <Switch
                isSelected={isTemporary ? true : youth.signedIn}
                isDisabled={isTemporary}
                onValueChange={(v) => {
                  if (!isTemporary) updateYouth(i, "signedIn", v);
                }}
              />
              <span className="text-white text-sm">Sign in now</span>
            </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4 mt-4">
          <Button type="button" onPress={addYouth}>
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