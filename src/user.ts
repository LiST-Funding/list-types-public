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
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  CompanyName: string;
  settings: UserSettings;
  ehrCredentials: Partial<Record<EhrType, UserEhrCredential>>;
  meta?: UserMeta;
  deleted?: boolean;
  regionId?: number;
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
  regionId?: number; 
}

export interface UserPatientFilters {
  status: ListPatientStatus[];
}

export enum UserRoleName {
  SuperAdmin = 'Super Admin',
  Admin = 'Admin',
  Snfs = 'Snfs',
}

export interface UserMeta {
  pcc: {
    PW: string;
    User: string;
  }
}