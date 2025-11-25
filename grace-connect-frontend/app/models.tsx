


export enum Cell {
  Year12 = "Year 12 Cell",
  Year89 = "Year 8/9 Cell",
  Year1011 = "Year 10/11 Cell",
  Year7 = "Year 7 Cell",
  SundaySchool="Sunday School"
}
export interface HouseHold {
  _id: string;
  guardianFirstName: string;
  guardianLastName: string;
  email: string;
  phone: string;
  children?: Youth[];
}

export interface Youth {
  _id?: string; // MongoDB ID from backend
  firstName: string;
  lastName: string;
  signedIn: boolean;
  age: Number;
  cell?: string;
  lastSignedIn?: string;
  lastSignedOut?: string;
  family?: string;
  records?: RecordEntry[];
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
  editMode: Boolean;
}