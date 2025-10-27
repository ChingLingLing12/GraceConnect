import { Youth } from "./YouthCard";

export interface Household {
  firstName: string;
  lastName: string;
  youth: Youth[];
  email: string;
  phone: string
}
