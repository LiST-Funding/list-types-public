import { ListPatientStatus } from "../../site";

export type ArchiveMethod = 'ehr' | 'user' | undefined;

export interface ArchivedData {
    archivedTime: Date | null;
    archivedMethod: ArchiveMethod;
}

export interface ParsedResponse {
    ResponseTime: Date | null,
    ResponseStatus: string,
    responseListStatus:ListPatientStatus | null,
    ResponseBy: string,
    ResponseReason?: string,
};

export interface ResponseDeltas {
    firstPostingTillArchive: number | null,
    timeForFirstDecision: number | null,
    timeForFinalDecision: number,
    timeForFirstResponse: number,
};

export interface ResponsesDataObject {
    facility: string;
    regionId?: number;
    archiveData: ArchivedData
    firstResponse: ParsedResponse | null,
    firstDecisionResponse:  ParsedResponse | null,
    finalDecisionResponse: ParsedResponse | null,
    deltas: ResponseDeltas,
    siteFirstMessageDate: Date | null,
    ehrRequestStatus: string,
    listStatus: string,
    listHospitalStatus: string,
    listSiteStatus: string,
    declineReason: string,
    listSiteId?: number,
    firstPostingDate: Date | null,
    
};

export interface PatientData {
    referralId: string;
    srcType: string;
    firstName: string;
    lastName: string;
    sendingHospital: string;
    primaryPayer:string;
    primaryPayerType:string;
    patientFirstPostingDate:string;
    caseManager:string; // or socialWorkers
}


export interface AdmissionData {
    /**date of admission to the facility */
    admissionDate: Date | null,

    /**if the patient was admitted to a facility of the client */
    isAdmitted: boolean,

    /**if the patient was admitted to the facility of the specific site */
    isAdmittedHere:boolean,

    /**name of the facility the patient was admitted to */
    admittedAtSiteName:string,
}

export interface ReferralResponseReportItemDoc {
    _id?:string;
    referalId: string;
    listSiteId: number;
    regionId: number;
    srcType: string;
    patient: PatientData;
    response: ResponsesDataObject;
    admission: AdmissionData;
    createdAt: Date;
    updatedAt: Date;
}