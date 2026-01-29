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

export interface SnfPatientResponseHistoryItemAllScripts {
  contactName: string;
  responseReceivedTime: string;
  responseText: string;
  reason: string;
  comment: string;
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
  
export interface SnfPatientSite {
  _id?: string;
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
  
  userStatus: string;
  userStatusDate: Date;
  userStatusBy: string;
  userStatusByUsername: string;

  userStatusHistory: {
    fromStatus: string;
    fromUserStatus: string;
    status: string;
    byUser: string;
    byUsername: string;
    date: Date;
  }[];
  firstPostingDate: Date;
  isArchived?: boolean;
  isArchivedOnDate?: Date;
  isArchivedByUser?: {
    isArchived: true,
    userId: string;
    userName: string;
    date: Date;
  };
  lastSeenOnEhrDate?: Date;

  //Aidin Fields
  isClosed?: boolean;

  puppeteerAlerts?:any[];
}