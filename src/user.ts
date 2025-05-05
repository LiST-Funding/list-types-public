import { EhrType } from "./ehr";
import { ListPatientStatus } from "./patient";

export interface User {
  _id?: string;
  email: string;
  userName: string;
  password: string;
  role: UserRoleName;
  roleNumber: number;
  privateName: string;
  CompanyName: string;
  settings: UserSettings;
  ehrCredentials: Partial<Record<EhrType, UserEhrCredential>>;
}

export interface UserEhrCredential {
  username: string;
  password: string;
}

export interface UserSettings {
  allFacilities: boolean;
  respondToEhrEnabled?: boolean;
  receiveDoNotAcceptNotification: boolean;
  facilities: number[];
  patientsFilters: UserPatientFilters;
}

export interface UserPatientFilters {
  status: ListPatientStatus[];
}

export enum UserRoleName {
  SuperAdmin = 'Super Admin',
  Admin = 'Admin',
  Snfs = 'Snfs',
}