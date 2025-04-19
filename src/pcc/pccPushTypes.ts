export enum PCC_LEVELS {
    hold = 'hold',
    start = 'start',
    waitingForLogin = 'waitingForLogin',
    loginFailed = 'loginFailed',
    loginNeedsResetPassword = 'loginNeedsResetPassword',
    waitingForNewCred = 'waitingForNewCred',
    newCredApplied = 'newCredApplied',
    loginSuccess = 'loginSuccess',
    waitingForFacilityAndPatient = 'waitingForFacilityAndPatient',
    facilityDataSent = 'facilityDataSent',
    selectFacility = 'selectFacility',
    selectFacilityFailed = 'chooseFacilityFailed',
    selectFacilitySuccess = 'chooseFacilitySuccess',
    waitingForPushData = 'waitingForPushData',
    pushDataSent = 'pushDataSent',
    serachPatient = 'serachPatient',
    waithingForChoosePatient = 'waithingForChoosePatient',
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
}

function getStepIndex(level: PCC_LEVELS): number {
    return Object.values(PCC_LEVELS).indexOf(level);
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
    [PCC_CLIENT_GENERAL_STEPS.login]: getStepIndex(PCC_LEVELS.loginSuccess),
    [PCC_CLIENT_GENERAL_STEPS.chooseFacility]: getStepIndex(PCC_LEVELS.selectFacilitySuccess),
    [PCC_CLIENT_GENERAL_STEPS.searchPatient]: getStepIndex(PCC_LEVELS.patientSelected),
    [PCC_CLIENT_GENERAL_STEPS.fillFields]: getStepIndex(PCC_LEVELS.fillFieldsSuccess),
    [PCC_CLIENT_GENERAL_STEPS.uploadFiles]: getStepIndex(PCC_LEVELS.uploadFilesSuccess),
    [PCC_CLIENT_GENERAL_STEPS.fillEmergencyContacts]: getStepIndex(PCC_LEVELS.fillEmergencyContactsSuccess),
    [PCC_CLIENT_GENERAL_STEPS.fillInsurance]: getStepIndex(PCC_LEVELS.fillInsuranceSuccess),
};
export const PCC_WAITING_STATES: PCC_LEVELS[] = [
    PCC_LEVELS.hold,
    PCC_LEVELS.waitingForLogin,
    PCC_LEVELS.waitingForNewCred,
    PCC_LEVELS.waithingForChoosePatient,
];
type StepType = 'clientAction' | 'serverAction' | 'serviceAction';

export const PCC_STEP_TYPES: { [key in PCC_LEVELS]?: StepType } = {
    [PCC_LEVELS.hold]: 'serverAction',
    [PCC_LEVELS.start]: 'serviceAction',
    [PCC_LEVELS.waitingForLogin]: 'serviceAction',
    [PCC_LEVELS.loginFailed]: 'clientAction',
    [PCC_LEVELS.loginNeedsResetPassword]: 'clientAction',
    [PCC_LEVELS.loginSuccess]: 'serviceAction',
    [PCC_LEVELS.waitingForNewCred]: 'clientAction',
    [PCC_LEVELS.newCredApplied]: 'serviceAction',
    [PCC_LEVELS.waitingForFacilityAndPatient]: 'clientAction',
    [PCC_LEVELS.facilityDataSent]: 'serviceAction',
    [PCC_LEVELS.selectFacility]: 'serviceAction',
    [PCC_LEVELS.selectFacilityFailed]: 'clientAction',
    [PCC_LEVELS.selectFacilitySuccess]: 'serviceAction',
    [PCC_LEVELS.waitingForPushData]: 'clientAction',
    [PCC_LEVELS.pushDataSent]: 'serviceAction',
    [PCC_LEVELS.serachPatient]: 'serviceAction',
    [PCC_LEVELS.waithingForChoosePatient]: 'clientAction',
    [PCC_LEVELS.patientSelected]: 'serviceAction',
    [PCC_LEVELS.fillFields]: 'serviceAction',
    [PCC_LEVELS.fillFieldsSuccess]: 'serviceAction',
    [PCC_LEVELS.fillFieldsFailed]: 'clientAction',
    [PCC_LEVELS.tryToUploadFiles]: 'serviceAction',
    [PCC_LEVELS.uploadFilesSuccess]: 'serviceAction',
    [PCC_LEVELS.uploadFilesFailed]: 'clientAction',
    [PCC_LEVELS.uploadFilesSuccessWithErrors]: 'clientAction',
    [PCC_LEVELS.fillEmergencyContacts]: 'serviceAction',
    [PCC_LEVELS.fillEmergencyContactsSuccess]: 'serviceAction',
    [PCC_LEVELS.fillEmergencyContactsFailed]: 'clientAction',
    [PCC_LEVELS.fillEmergencyContactsSuccessWithErrors]: 'clientAction',
    [PCC_LEVELS.fillInsurance]: 'serviceAction',
    [PCC_LEVELS.fillInsuranceSuccess]: 'serviceAction',
    [PCC_LEVELS.fillInsuranceFailed]: 'clientAction',
    [PCC_LEVELS.fillInsuranceSuccessWithErrors]: 'clientAction',

};

export function serviceNeedsPolling(step: PCC_LEVELS): boolean {
    return PCC_STEP_TYPES[step] === 'serverAction';
}

export function isClientPolling(step: PCC_LEVELS): boolean {
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
    updateStep: (step: PCC_LEVELS) => void;
    success: () => void;
    error: () => void;
}

export interface PCCClientEventListener {
    passwordReset: () => void;
    patientSelected: (patient: string, index: number) => void;
    setFacilityNameAndIdAndPatientName: (facilityName: string, facilityId: string, patientName: string) => void;
}

export interface PCCTask {
    _id: string;
    executingUser: string;
    executingUserName: string;
    timeId: string;
    referalId: string;
    status: 'hold' | 'start';
    createdAt: string;
    data: {};
    type: 'pushToPcc';
    stepStatus: PCC_LEVELS;
    steps: {status: PCC_LEVELS, data: {}}[];
}
