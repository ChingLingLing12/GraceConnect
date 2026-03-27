"use client";

import React, { useEffect, useState } from "react";
import { Input, Button, Select, SelectItem, Switch } from "@heroui/react";
import { HouseHold, Youth } from "../models";
import { apiFetch } from "../context/api";

type Props = {
  ministry: "youth" | "sundayschool" | null;
};

export default function RegisterForm({ ministry }: Props) {
  if (!ministry) return null;

  const [signAllInNow, setSignAllInNow] = useState(false);

  const [houseHold, setHouseHold] = useState<Omit<HouseHold, "_id">>({
    guardianFirstName: "",
    guardianLastName: "",
    email: "",
    phone: "",
    secondaryGuardianFirstName: "",
    secondaryGuardianLastName: "",
    secondaryGuardianPhone: "",
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

  const updateHouseHold = <K extends keyof Omit<HouseHold, "_id">>(
    field: K,
    value: Omit<HouseHold, "_id">[K]
  ) => {
    setHouseHold((prev) => ({ ...prev, [field]: value }));
  };

  const updateYouth = <K extends keyof Omit<Youth, "_id">>(
    index: number,
    field: K,
    value: Omit<Youth, "_id">[K]
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

  const resetForm = () => {
    setHouseHold({
      guardianFirstName: "",
      guardianLastName: "",
      email: "",
      phone: "",
      secondaryGuardianFirstName: "",
      secondaryGuardianLastName: "",
      secondaryGuardianPhone: "",
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

    setSignAllInNow(false);
  };

  useEffect(() => {
    resetForm();
  }, [ministry]);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  for (const youth of youths) {
    if (!youth.firstName.trim() || !youth.lastName.trim()) {
      alert("Please enter first and last name for all youths.");
      return;
    }

    if (!youth.cell) {
      alert("Please select a Year Group for all youths.");
      return;
    }
  }

  if (
    !houseHold.guardianFirstName.trim() ||
    !houseHold.guardianLastName.trim() ||
    !houseHold.email.trim() ||
    !houseHold.phone.trim()
  ) {
    alert("Please fill in all guardian details.");
    return;
  }

  try {
    const childIDs: string[] = [];

    for (const youth of youths) {
      const createData = await apiFetch(`/api/${ministry}`, {
        method: "POST",
        body: JSON.stringify({
          firstName: youth.firstName,
          lastName: youth.lastName,
          age: youth.age,
          cell: youth.cell,
          ministry,
          oneTime: false,
          signedIn: false,
        }),
      });

      if (!createData?.child?._id) {
        throw new Error(
          createData?.error ||
            createData?.message ||
            "Failed to create youth"
        );
      }

      const childId = createData.child._id;
      childIDs.push(childId);

      const shouldSignInThisYouth = signAllInNow || youth.signedIn;

      if (shouldSignInThisYouth) {
        const signInData = await apiFetch("/api/log/signin", {
          method: "POST",
          body: JSON.stringify({ childId }),
        });

        if (signInData?.success === false) {
          throw new Error(
            signInData?.error ||
              signInData?.message ||
              "Failed to sign in youth"
          );
        }
      }
    }

    const householdData = await apiFetch(`/api/${ministry}/household`, {
      method: "POST",
      body: JSON.stringify({
        guardianFirstName: houseHold.guardianFirstName,
        guardianLastName: houseHold.guardianLastName,
        email: houseHold.email,
        phone: houseHold.phone,
        secondaryGuardianFirstName: houseHold.secondaryGuardianFirstName,
        secondaryGuardianLastName: houseHold.secondaryGuardianLastName,
        secondaryGuardianPhone: houseHold.secondaryGuardianPhone,
        ministry,
        children: childIDs,
      }),
    });
    
    const householdCreated =
      householdData?.success === true ||
      !!householdData?.household?._id ||
      !!householdData?._id ||
      !!householdData?.message;

    if (!householdCreated) {
      throw new Error(
        householdData?.error ||
          householdData?.message ||
          "Failed to create household"
      );
    }

    alert("Registration completed successfully!");
    resetForm();
  } catch (err: any) {
    console.error("Registration error:", err);
    alert(err?.message || "Registration failed");
  }
};

  return (
    <main className="min-h-screen bg-gray-900 flex flex-col items-center p-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl space-y-8 heroui-dark"
      >
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
          
          <Input
            label="Secondary Guardian First Name"
            value={houseHold.secondaryGuardianFirstName || ""}
            onChange={(e) =>
              updateHouseHold("secondaryGuardianFirstName", e.target.value)
            }
          />

          <Input
            label="Secondary Guardian Last Name"
            value={houseHold.secondaryGuardianLastName || ""}
            onChange={(e) =>
              updateHouseHold("secondaryGuardianLastName", e.target.value)
            }
          />

          <Input
            label="Secondary Guardian Phone"
            type="tel"
            value={houseHold.secondaryGuardianPhone || ""}
            onChange={(e) =>
              updateHouseHold("secondaryGuardianPhone", e.target.value)
            }
          />

          <div className="flex items-center gap-2">
            <Switch isSelected={signAllInNow} onValueChange={setSignAllInNow} />
            <span className="text-white text-sm">Sign all in now</span>
          </div>
        </div>

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
                    type="button"
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
                onChange={(e) => updateYouth(i, "firstName", e.target.value)}
                isRequired
              />

              <Input
                label="Last Name"
                value={youth.lastName}
                onChange={(e) => updateYouth(i, "lastName", e.target.value)}
                isRequired
              />

              <Input
                label="Age"
                type="number"
                value={String(youth.age)}
                onChange={(e) => updateYouth(i, "age", Number(e.target.value))}
                isRequired
              />

              <Select
                label="Year Group"
                selectedKeys={youth.cell ? [youth.cell] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  updateYouth(i, "cell", selected);
                }}
                isRequired
              >
                {YEAR_GROUP_OPTIONS.map((option) => (
                  <SelectItem key={option}>{option}</SelectItem>
                ))}
              </Select>

              <div className="flex items-center gap-2">
                <Switch
                  isSelected={signAllInNow ? true : youth.signedIn}
                  isDisabled={signAllInNow}
                  onValueChange={(value) => {
                    if (!signAllInNow) updateYouth(i, "signedIn", value);
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