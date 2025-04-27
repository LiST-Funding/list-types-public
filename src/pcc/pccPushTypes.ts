import { Task } from "../tasks/types";

export enum PCC_LOGIN_TASK {
    hold = 'hold',
    start = 'start',
    login = 'login',
    loginSuccess = 'loginSuccess',
    loginFailed = 'loginFailed',
    loginNeedsResetPassword = 'loginNeedsResetPassword'
}

export enum PCC_STEPS {
    hold = 'hold',
    inQueue = 'inQueue',
    start = 'start',
    waitingForLogin = 'waitingForLogin',
    loginFailed = 'loginFailed',
    loginNeedsResetPassword = 'loginNeedsResetPassword',
    waitingForNewCred = 'waitingForNewCred',
    newCredApplied = 'newCredApplied',
    loginSuccess = 'loginSuccess',
    // waitingForFacilityAndPatient = 'waitingForFacilityAndPatient',
    // facilityDataSent = 'facilityDataSent',
    selectFacility = 'selectFacility',
    selectFacilityFailed = 'selectFacilityFailed',
    selectFacilitySuccess = 'selectFacilitySuccess',
    serachPatient = 'serachPatient',
    waitingForSelectPatient = 'waitingForSelectPatient',
    patientSelected = 'patientSelected',
    fillFields = 'fillFields',
    fillFieldsSuccess = 'fillFieldsSuccess',
    fillFieldsFailed = 'fillFieldsFailed',
    tryToUploadFiles = 'tryToUploadFiles',
    uploadFilesSuccess = 'uploadFilesSuccess',
    uploadFilesFailed = 'uploadFilesFailed',
    uploadFilesSuccessWithErrors = 'uploadFilesSuccessWithErrors',
    fillEmergencyContacts = 'fillEmergencyContacts',
    fillEmergencyContactsSuccess = 'fillEmergencyContactsSuccess',
    fillEmergencyContactsFailed = 'fillEmergencyContactsFailed',
    fillEmergencyContactsSuccessWithErrors = 'fillEmergencyContactsSuccessWithErrors',
    fillInsurance = 'fillInsurance',
    fillInsuranceSuccess = 'fillInsuranceSuccess',
    fillInsuranceFailed = 'fillInsuranceFailed',
    fillInsuranceSuccessWithErrors = 'fillInsuranceSuccessWithErrors',
    done = "done"
}

function getStepIndex(step: PCC_STEPS): number {
    return Object.values(PCC_STEPS).indexOf(step);
  }
  

export enum PCC_CLIENT_GENERAL_STEPS {
    login = 'login',
    chooseFacility = 'chooseFacility',
    searchPatient = 'searchPatient',
    fillFields = 'fillFields',
    uploadFiles = 'uploadFiles',
    fillEmergencyContacts = 'fillEmergencyContacts',
    fillInsurance = 'fillInsurance',
}



type StepGeneralMap = {
    [key in PCC_CLIENT_GENERAL_STEPS]: number;
  };
  
export const PCC_CLIENT_GENERAL_STEPS_MAP: StepGeneralMap = {
    [PCC_CLIENT_GENERAL_STEPS.login]: getStepIndex(PCC_STEPS.loginSuccess),
    [PCC_CLIENT_GENERAL_STEPS.chooseFacility]: getStepIndex(PCC_STEPS.selectFacilitySuccess),
    [PCC_CLIENT_GENERAL_STEPS.searchPatient]: getStepIndex(PCC_STEPS.patientSelected),
    [PCC_CLIENT_GENERAL_STEPS.fillFields]: getStepIndex(PCC_STEPS.fillFieldsSuccess),
    [PCC_CLIENT_GENERAL_STEPS.uploadFiles]: getStepIndex(PCC_STEPS.uploadFilesSuccess),
    [PCC_CLIENT_GENERAL_STEPS.fillEmergencyContacts]: getStepIndex(PCC_STEPS.fillEmergencyContactsSuccess),
    [PCC_CLIENT_GENERAL_STEPS.fillInsurance]: getStepIndex(PCC_STEPS.fillInsuranceSuccess),
};
export const PCC_WAITING_STATES: PCC_STEPS[] = [
    PCC_STEPS.hold,
    PCC_STEPS.waitingForLogin,
    PCC_STEPS.waitingForNewCred,
    // PCC_STEPS.waitingForFacilityAndPatient,
];
type StepType = 'clientAction' | 'serverAction' | 'serviceAction' | 'done';

type PCCLevelsMap = {
    [key in PCC_STEPS]: StepType;
};

export const PCC_STEP_TYPES: PCCLevelsMap = {
    [PCC_STEPS.hold]: 'serverAction',
    [PCC_STEPS.inQueue]: 'serverAction',
    [PCC_STEPS.start]: 'serviceAction',
    [PCC_STEPS.waitingForLogin]: 'serviceAction',
    [PCC_STEPS.loginFailed]: 'clientAction',
    [PCC_STEPS.loginNeedsResetPassword]: 'clientAction',
    [PCC_STEPS.loginSuccess]: 'serviceAction',
    [PCC_STEPS.waitingForNewCred]: 'clientAction',
    [PCC_STEPS.newCredApplied]: 'serviceAction',
    // [PCC_STEPS.waitingForFacilityAndPatient]: 'clientAction',
    // [PCC_STEPS.facilityDataSent]: 'serviceAction',
    [PCC_STEPS.selectFacility]: 'serviceAction',
    [PCC_STEPS.selectFacilityFailed]: 'clientAction',
    [PCC_STEPS.selectFacilitySuccess]: 'serviceAction',
    // [PCC_STEPS.waitingForPushData]: 'clientAction',
    // [PCC_STEPS.pushDataSent]: 'serviceAction',
    [PCC_STEPS.serachPatient]: 'serviceAction',
    [PCC_STEPS.waitingForSelectPatient]: 'clientAction',
    [PCC_STEPS.patientSelected]: 'serviceAction',
    [PCC_STEPS.fillFields]: 'serviceAction',
    [PCC_STEPS.fillFieldsSuccess]: 'serviceAction',
    [PCC_STEPS.fillFieldsFailed]: 'clientAction',
    [PCC_STEPS.tryToUploadFiles]: 'serviceAction',
    [PCC_STEPS.uploadFilesSuccess]: 'serviceAction',
    [PCC_STEPS.uploadFilesFailed]: 'clientAction',
    [PCC_STEPS.uploadFilesSuccessWithErrors]: 'clientAction',
    [PCC_STEPS.fillEmergencyContacts]: 'serviceAction',
    [PCC_STEPS.fillEmergencyContactsSuccess]: 'serviceAction',
    [PCC_STEPS.fillEmergencyContactsFailed]: 'clientAction',
    [PCC_STEPS.fillEmergencyContactsSuccessWithErrors]: 'clientAction',
    [PCC_STEPS.fillInsurance]: 'serviceAction',
    [PCC_STEPS.fillInsuranceSuccess]: 'serviceAction',
    [PCC_STEPS.fillInsuranceFailed]: 'clientAction',
    [PCC_STEPS.fillInsuranceSuccessWithErrors]: 'clientAction',
    [PCC_STEPS.done]: 'done',

};

export function serviceNeedsPolling(step: PCC_STEPS): boolean {
    return PCC_STEP_TYPES[step] === 'serverAction';
}

export function isClientPolling(step: PCC_STEPS): boolean {
    return PCC_STEP_TYPES[step] === 'serviceAction' || PCC_STEP_TYPES[step] === 'serverAction';
}

export interface SelectPatientData {
    rawData: string[];
    patientData: { lastName: string, firstName: string, dob: string, ssn: string, selected: boolean, facility: string, pccId: string }[]
}

export interface PatientSelectedData {
    index: number;
    rawData: string;
    patientData: { lastName: string, firstName: string, dob: string, ssn: string, selected: boolean, facility: string, pccId: string };
}

type StatusHandler = () => Promise<void>;

interface HandlersMap {
    [key: string]: StatusHandler | undefined;
}

interface ManagerOptions {
    pollingInterval?: number;
    stepTimeoutMs?: number; // timeout per step
}

export interface PCCCallbackEvent {
    resetPassword: () => void;
    selectPatient: (patients: string[]) => void;
    updateStep: (step: PCC_STEPS) => void;
    success: () => void;
    error: () => void;
}

export interface PCCClientEventListener {
    passwordReset: () => void;
    patientSelected: (patient: string, index: number) => void;
    setFacilityNameAndIdAndPatientName: (facilityName: string, facilityId: string, patientName: string) => void;
}

export interface PCC_TASK_STEP {
    step: PCC_STEPS;
    type: 'clientAction' | 'serverAction' | 'serviceAction' | 'done';
    createdBy: 'server' | 'service' | 'client'
    data: any;
    date: Date;
}

export enum PCC_TASK_SUB_TYPE {
    push = 'push',
    login = 'login',
    selectFacility = 'selectFacility',
    selectPatient = 'selectPatient'
}
export interface PCCTask extends Task<PCC_STEPS, PCC_TASK_STEP, PCC_TASK_SUB_TYPE> {
}

export interface PCC_TASK_CREATE_API_BASE <DATA extends object = {}> {
    type: 'pushToPcc';
    subType: PCC_TASK_SUB_TYPE;
    referalId?: string;
    srcType?: string;
    executingUser?: string;
    executingUserName?: string;
    data?: DATA;
}

export interface PCC_TASK_FACILITY_DATA  {
    fac_id?: number;
    fac_name?: string;
    referalId?: string;
    suffix?: string;
    birthDate?: Date;
    SocialSecurity?: string;
}
export interface PCC_TASK_CREATE_API_LOGIN extends  PCC_TASK_CREATE_API_BASE{
    subType: PCC_TASK_SUB_TYPE.login;
    data: {}
}
