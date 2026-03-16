import mongoose from "mongoose";
import "dotenv/config";

import childSchema from "../models/childModel";
import houseHoldSchema from "../models/houseHoldModel";
import logSchema from "../models/logModel";

const Child =
  mongoose.models.Child || mongoose.model("Child", childSchema);
const HouseHold =
  mongoose.models.HouseHold || mongoose.model("HouseHold", houseHoldSchema);
const Log =
  mongoose.models.Log || mongoose.model("Log", logSchema);

const YOUTH_CELLS = [
  "Year 12",
  "Year 11",
  "Year 10",
  "Year 9",
  "Year 8",
  "Year 7",
] as const;

const SUNDAY_SCHOOL_CELLS = [
  "Little Light [Kindy to PP]",
  "Little Candle [Y1-Y2]",
  "Lighthouse [Y3-Y4]",
  "Flame [Y5]",
  "Torch Bearer [Y6 above]",
] as const;

const FIRST_NAMES = [
  "Ethan",
  "Mia",
  "Noah",
  "Ava",
  "Liam",
  "Chloe",
  "Lucas",
  "Ella",
  "Isaac",
  "Sophie",
  "Caleb",
  "Zoe",
  "Nathan",
  "Ruby",
  "Levi",
  "Grace",
];

const LAST_NAMES = [
  "Tan",
  "Lim",
  "Ng",
  "Lee",
  "Wong",
  "Chan",
  "Goh",
  "Ling",
  "Chua",
  "Teo",
];

type Ministry = "youth" | "sundayschool";

function rand<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chance(percent: number) {
  return Math.random() * 100 < percent;
}

function format(d: Date) {
  return d.toLocaleString();
}

function getAllowedCells(ministry: Ministry) {
  return ministry === "youth" ? YOUTH_CELLS : SUNDAY_SCHOOL_CELLS;
}

function getAgeForCell(ministry: Ministry, cell: string) {
  if (ministry === "youth") {
    switch (cell) {
      case "Year 7":
        return randInt(12, 13);
      case "Year 8":
        return randInt(13, 14);
      case "Year 9":
        return randInt(14, 15);
      case "Year 10":
        return randInt(15, 16);
      case "Year 11":
        return randInt(16, 17);
      case "Year 12":
        return randInt(17, 18);
      default:
        return randInt(12, 18);
    }
  }

  switch (cell) {
    case "Little Light [Kindy to PP]":
      return randInt(4, 6);
    case "Little Candle [Y1-Y2]":
      return randInt(6, 8);
    case "Lighthouse [Y3-Y4]":
      return randInt(8, 10);
    case "Flame [Y5]":
      return randInt(10, 11);
    case "Torch Bearer [Y6 above]":
      return randInt(11, 12);
    default:
      return randInt(4, 12);
  }
}

function youthWeeks() {
  const weeks: { start: Date; friday: Date }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 3; i++) {
    const friday = new Date(today);
    const day = friday.getDay();
    let diff = 5 - day;

    if (day === 6) diff = 6;
    if (day === 0) diff = 5;

    friday.setDate(friday.getDate() + diff - i * 7);

    const start = new Date(friday);
    start.setDate(friday.getDate() - 6);

    weeks.push({ start, friday });
  }

  return weeks;
}

function sundayWeeks() {
  const weeks: { start: Date; sunday: Date }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 3; i++) {
    const sunday = new Date(today);
    const day = sunday.getDay();
    const diff = day === 0 ? 0 : 7 - day;

    sunday.setDate(sunday.getDate() + diff - i * 7);

    const start = new Date(sunday);
    start.setDate(sunday.getDate() - 6);

    weeks.push({ start, sunday });
  }

  return weeks;
}

async function createLogs(child: any, ministry: "youth" | "sundayschool") {
  const logIds: any[] = [];

  if (ministry === "youth") {
    const weeks = youthWeeks();

    for (const week of weeks) {
      if (!chance(70)) continue;

      const signIn = new Date(week.friday);
      signIn.setHours(randInt(18, 19), randInt(0, 50), 0, 0);

      const signOut = chance(15)
        ? null
        : new Date(signIn.getTime() + randInt(90, 140) * 60000);

      const log = await Log.create({
        child: child._id,
        signInTime: signIn,
        signOutTime: signOut,
      });

      logIds.push(log._id);
    }
  } else {
    const weeks = sundayWeeks();

    for (const week of weeks) {
      if (!chance(70)) continue;

      const signIn = new Date(week.sunday);
      signIn.setHours(randInt(8, 9), randInt(0, 40), 0, 0);

      const signOut = chance(15)
        ? null
        : new Date(signIn.getTime() + randInt(60, 120) * 60000);

      const log = await Log.create({
        child: child._id,
        signInTime: signIn,
        signOutTime: signOut,
      });

      logIds.push(log._id);
    }
  }

  const latest = await Log.findOne({ child: child._id }).sort({ signInTime: -1 });

  await Child.findByIdAndUpdate(child._id, {
    records: logIds,
    signedIn: latest ? latest.signOutTime == null : false,
    lastSignedIn: latest?.signInTime ? latest.signInTime.toLocaleString() : null,
    lastSignedOut: latest?.signOutTime ? latest.signOutTime.toLocaleString() : null,
  });
}

async function seedMinistry(ministry: Ministry, householdCount: number) {
  const allowedCells = getAllowedCells(ministry);

  for (let i = 0; i < householdCount; i++) {
    const guardianLastName = rand(LAST_NAMES);
    const children: any[] = [];
    const childCount = randInt(2, 4);

    for (let j = 0; j < childCount; j++) {
      const cell = rand(allowedCells);
      const age = getAgeForCell(ministry, cell);

      const child = await Child.create({
        firstName: rand(FIRST_NAMES),
        lastName: guardianLastName,
        age,
        cell,
        signedIn: false,
        oneTime: chance(10),
        ministry,
        records: [],
      });

      children.push(child);
      await createLogs(child, ministry);
    }

    await HouseHold.create({
      guardianFirstName: rand(FIRST_NAMES),
      guardianLastName,
      email: `family-${ministry}-${i}@example.com`,
      phone: `04${randInt(10000000, 99999999)}`,
      children: children.map((c) => c._id),
      ministry,
    });
  }
}

async function run() {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/graceconnect"
    );

    console.log("Connected to MongoDB");

    await Log.deleteMany({});
    await Child.deleteMany({});
    await HouseHold.deleteMany({});

    console.log("Seeding youth...");
    await seedMinistry("youth", 8);

    console.log("Seeding sunday school...");
    await seedMinistry("sundayschool", 6);

    const counts = {
      children: await Child.countDocuments(),
      households: await HouseHold.countDocuments(),
      logs: await Log.countDocuments(),
    };

    console.log("Done");
    console.log(counts);
  } catch (error) {
    console.error("Seed script failed:", error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

run();