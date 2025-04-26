export enum TaskTypes {
    comprehend = 'comprehend',
    pushToPcc = 'pushToPcc',
    pdf = 'pdf',
    sexOffender = 'sexOffender',
    eligibility = 'eligibility',
    llm = 'llm',
    nlpProcess = 'nlpProcess',
    referralResponse = 'referralResponse',
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



export interface Task <STEP_STATUS extends string = string, STEP_TYPE extends object = {}> {
    _id?: string,
    date?: Date,
    type?: TaskTypes,
    srcType?: string,
    referralId?: string;
    executingUser?: string,
    executingUserName?: string,
    data?: any,
    taskStartTime?: Date,
    taskEndTime?: Date | string,
    status?: string,
    currentStep?: string;
    steps?: STEP_TYPE[];
    updateStatusMsg?: string;
    updateStatus?: Object,
    createdAt?: Date,
    callback?: any,
    callbackData?: any,
    duration?: number,
    messages?: TaskMessage[];

    timeId?: string;
    referalId?: string;
    subType?: string; 
    stepStatus?: STEP_STATUS;
}
