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
  isArchived?: boolean;
  isArchivedOnDate?: Date;
  lastSeenOnEhrDate?: Date;


  //Aidin Fields
  isClosed?: boolean;
}