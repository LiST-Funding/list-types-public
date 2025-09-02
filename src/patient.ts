export interface SnfPatientDetails {
  _id?: string;
  baseInfo: any;
  patientInfo: any;
  referalInfo: any;
  sites: SnfPatientSite[];
  files: PCCDetailsFile[],
  listFiles: PCCDetailsFile[];
  clientFiles: PCCDetailsFile[];
  splitedFiles?: [];
  jobId?: string;
  lastTimeUpdate: Date;
  referalId: string;
  Hospital?: string;
  ReferralID: string;
  admitionsInfo: Object;
  srcType: string;
  financialInformation: any;
  updates: {
    files: [];
    sites: [];
    other: []
  };
  processStatus: any;
  lastTimeUploadedFiles?: Date;
  lastTimeUploadedFilesList?: Date;
  lastTimeUpdateSite?: Date;
  lastTimeUpdateSiteList?: Date;
  userLastTimeView?: Date;
  userLastTimeViews?: Record<string, Date>;
  readStatus?: ReadStatus;
  commentCount?: number;
  secondApprovalId?: string;
  secondApproval?: ISecondApprovalPatient;
  queueStatus?: string;
  similarOffenders?: [];
  backgroundCheck?: BackgroundCheck;
  listCreatedDate: Date;
  listLastUpdateDate?: Date;
  listUpdateSiteStatusTime?: Date;
  facilitiesNames?: { name: any; status: any; }[];
  pccValues?: Record<string, string>;
  listPayerType?: PayerType;
  listEligibility?:Record<string, any>;
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
export interface SnfPatientComment {
  _id?: string;
  replyToId?: string;
  patientId: string;
  userId: string;
  content: string;
  userLastTimeViews: Record<string, Date>;
  deleted: boolean;
  readStatus?: ReadStatus;
  isMine?: boolean;
  userName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SnfPatientSite {
  siteName: string;
  listSiteName: string;
  listSiteId: number;
  regionId?: number;
  siteStatus: string;
  listSiteStatus: string;
  lastSiteStatusDate?: Date;
  hospitalStatus: string;
  listHospitalStatus: string; 
  lastHospitalStatusDate?: Date;
  ehrSiteReadStatus?: boolean;
  listStatus: string;
  ehrRequestStatus:string;
  srcReadStatus: string;
  responseStatus: string;
  lastActivityDate: string;
  respondByDate:string
  assigned: string;
  naviHospitalStatus?: string;
  responseHistories: (SnfPatientResponseHistoryItemAllScripts | SnfPatientResponseHistoryItemEpic)[];
  displayStatus: string;
  firstPostingDate: Date;
}

export interface SnfPatientResponseHistoryItemEpic {
  fromHospital: boolean;
  fromSite: boolean;
  messageTexts: string[],
  unhandledTds: string[],
  rawMessage: string;
  sentFrom: string
  sentTo: string;
  messageStatus: string
  timestamp: string;
  timestampDate: string;
  files: string[];
  listStatus: ListPatientStatus;
}

export interface SnfPatientResponseHistoryItemAllScripts {
  contactName: string;
  responseReceivedTime: string;
  responseText: string;
  reason: string;
  comment: string;
}

export interface BackgroundCheck {
  sexOffender: {cheked?: boolean, similarOffenders?: [], file?: {}, date?: Date, status: 'Done' | 'Error'}
}

export interface PCCDetailsFile {
  displayName: string;
  File?: string;
  Action?: string;
  name: string;
  date: Date | string;
  pages?: any;
  addedBy?: string;
  status?: 'Uploded' | 'Uploading' | '';
  checked?: boolean;
  url?: string;
  size?: string;
  downloaded?: boolean;
  'Uploaded On'?: string;
  numOfPages?: number;
  type?: string;
  source?: string;
  listSource?: string;
  lastModified?: number;
  listUploadTime?: string;
  listPages?: number;
  listSize?: number;
  listType?: string;
  loader?: boolean;
}

export enum PayerType {
  Medicare = 'MCR',
  Hmo = 'HMO',
  Other = 'Other',
}
