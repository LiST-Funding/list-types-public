export type BaseInfo = {
  ReferralID ?: number;
  LastActivityDate?: string;
  Hospital?: string;
  PatientName?: string;
  /**
   * @description The date and time the patient was first posted to the system.
   * @example "2026-01-01T00:00:00.000Z"
   */
  FirstPostingDate?: string;
  /**
   * @description Date object of the FirstPostingDate.
   */
  _firstPostingDate?: Date;

  /**
   * @description The projected discharge date of the patient.
   * @example "2026-01-01T00:00:00.000Z"
   */
  ProjectedDischargeDate?: string;
  PlacementInfo?: string;
  SitePlaced?:string;
  isArchived?:boolean;
  [key: string]: any;
};

export interface EpicBaseInfo extends BaseInfo {
    /**
     * @description The source of the request from the patient as it is displayed in the ehr Requset From column
     */
    srcRequestFrom?: string;
}

export interface NaviBaseInfo extends Omit<BaseInfo, 'FirstPostingDate'> {
    FirstPostingDate?: number;
}

export type EHRBaseInfo = EpicBaseInfo | NaviBaseInfo | BaseInfo;
