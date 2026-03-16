export const YEAR_GROUPS_YOUTH = [
  "Year 7",
  "Year 8",
  "Year 10",
  "Year 11",
  "Year 12"];

export const YEAR_GROUPS_SUNDAY_SCHOOL = [
  "Little Light [Kindy to PP]",
  "Little Candle [Y1-Y2]", 
  "Lighthouse [Y3-Y4]",
  "Flame [Y5]",
  "Torch Bearer [Y6 above]" ]

export interface HouseHold {
  _id: string; // MongoDB ID from backend
  guardianFirstName: string;
  guardianLastName: string;
  email: string;
  phone: string;
  children?: Youth[];
  ministry?: "youth" | "sundayschool";
}

export interface Youth {
  _id: string; // MongoDB ID from backend
  firstName: string;
  lastName: string;
  signedIn: boolean;
  age: Number;
  cell?: string;
  lastSignedIn?: string;
  lastSignedOut?: string;
  family?: string;
  records?: RecordEntry[];
  oneTime?: boolean;
  ministry?: "youth" | "sundayschool";
}

export interface RecordEntry {
  _id: string;
  message: string;
  timestamp: string;
  __v: number;
}


export interface YouthCardProps {
  youth: Youth;
  onSignIn: (youth: Youth) => void;
  onSignOut: (youth: Youth) => void;
  editMode: boolean;
  setSelected: (Youth: Youth) => void;
  removeYouth: (id: string) => void;
}

export const sampleYouth: Youth[] = [
    {   _id: "222",
        firstName: "Jin",
        lastName: "Lee",
        signedIn: false,
        lastSignedIn: "2025-10-26T08:00:00",
        lastSignedOut: "2025-10-26T12:00:00",
        cell: "Year 7",
        age: 82
    },
];
