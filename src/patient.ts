export interface SnfPatientDetails {
  listFiles?: {}[];
  clientFiles: {}[];
  baseInfo?: any;
  patientInfo?: any;
  referalInfo?: any;
  sites?: Object[];
  files?: [],
  jobId?: string;
  lastTimeUpdate?: Date,
  referalId?: string,
  Hospital?: string;
  ReferralID?: string;
  admitionsInfo?: Object;
  srcType?: 'Navi' | 'AllScripts';
  financialInformation?: any;
  updates?: {
    files: [],
    sites: [],
    other: []
  };
  processStatus?: any,
  lastTimeUploadedFiles?: Date,
  lastTimeUploadedFilesList?: Date,
  lastTimeUpdateSite?: Date,
  lastTimeUpdateSiteList?: Date,
  userLastTimeView?: Date,

  readStatus?: ReadStatus
  facilitiesNames?: { name: any; status: any; }[];
  secondApprovalId?: string;
  secondApproval?: ISecondApprovalPatient;
}


export enum ReadStatus {
  NEVER_READ = "NEVER_READ", READ_BEFORE_UPDATES = "READ_BEFORE_UPDATES", READ = "READ"
}

export interface ISecondApprovalPatient {
  firstName: string;
  lastName: string;
  dob: Date;
  lastFacility: string;
  dischargedTo: string;
  otherDischargedTo: string;
  dischargedDate: string;
  ssn: string,
  reason: string;
  otherReason: string;
  addedBy: string;
  otherFields?: Map<string, string>;
  createdAt?: Date;
  updatedAt?: Date;
  notes?: string,
  ssn_id: string,
  dob_name_id: string
}

export enum ListPatientStatus {
  Accepted = 'accepted',
  Received = 'received',
  Interested = 'interested',
  Declined = 'declined',
  Selected = 'selected',
  NotSelected = 'not-selected',
  Cancelled = 'cancelled',
  New = 'new',
  Admitted = 'admitted',
  ReAdmitted = 're-admitted',
}