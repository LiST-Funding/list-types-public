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
}


export enum ReadStatus {
    NEVER_READ = "NEVER_READ", READ_BEFORE_UPDATES = "READ_BEFORE_UPDATES", READ = "READ"
  }
  