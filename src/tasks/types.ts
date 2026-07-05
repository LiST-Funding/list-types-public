export enum TaskTypes {
    comprehend = 'comprehend',
    pushToPcc = 'pushToPcc',
    pdf = 'pdf',
    sexOffender = 'sexOffender',
    eligibility = 'eligibility',
    llm = 'llm',
    nlpProcess = 'nlpProcess',
    referralResponse = 'referralResponse',
    extractEfaxData = "extractEfaxData",

}

export enum TaskMessageType {
    LoginSuccess = 'loginSuccess',
    LoginError = 'Login failed',
    NeedCredentials = 'needCredentials',
    NeedPasswordReset = 'needPasswordReset',
    CredentialsUpdate = 'credentialsUpdate',
}

export enum TaskMessageFrom {
    Ehr = 'ehr',
    Client = 'client',
    Server = 'server',
    Service = 'service'
}

export interface TaskMessage {
    type: TaskMessageType;
    message: string;
    from: TaskMessageFrom;
    read: boolean;
}

/**
 * Canonical free-form `statusCode` values a scraper may report back to the
 * backend (via updateTaskProcessStatus) and that the frontend then reads off
 * the polled task. Kept as string-valued members so existing string literals
 * (e.g. "placed_elsewhere") stay assignable; `Task.statusCode` remains `string`
 * for back-compat.
 */
export enum TaskStatusCode {
    PlacedElsewhere = 'placed_elsewhere',
    PatientNotFound = 'patient_not_found',
    SiteNotFound = 'site_not_found',
}

/**
 * A recipient site as the EHR actually reports it during the
 * login / selectPatient check. Carried inside `Task.callbackData`.
 */
export interface AvailableSite {
    siteName: string;
    responseStatus?: string;
    respondByDate?: string;
    lastActivityDate?: string;
}

/**
 * Shape of the `callbackData` payload produced by the selectPatient login-check
 * step. `callbackData` on `Task` stays `any` for back-compat; consumers can
 * narrow to this when reading the selectPatient result.
 */
export interface SelectPatientCallbackData {
    availableSites?: AvailableSite[];
}



export interface Task <STEP_STATUS extends string = string, STEP_TYPE extends object = {}, SUB_TYPE extends string = string> {
    _id?: string;
    date?: Date;
    type?: TaskTypes;
    srcType?: string;
    referralId?: string;
    executingUser?: string;
    executingUserName?: string;
    data?: any;
    taskStartTime?: Date;
    taskEndTime?: Date | string;
    status?: string;
    /** Free-form; see {@link TaskStatusCode} for known values. Kept as string for back-compat. */
    statusCode?: string;
    currentStep?: string;
    steps?: STEP_TYPE[];
    stepStatus?: STEP_STATUS;
    updateStatusMsg?: string;
    updateStatus?: Object;
    createdAt?: Date;
    callback?: any;
    callbackData?: any;
    duration?: number;
    messages?: TaskMessage[];
    timeId?: string;
    subType?: SUB_TYPE;
    regionId?: number;
    recreatedBy?: string;
    recreatedByUserName?: string;
    reHoldAt?: Date;

}
