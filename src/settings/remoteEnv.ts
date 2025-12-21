
export type RemoteEnvVariables={
    "DOWNLOAD_ALL_FILES_AND_DONT_UPLOAD_TO_SERVER":boolean;
    "PRINT_DEBUG_TO_CONSOLE":boolean;
    "SKIP_FILES_DOWNLOAD":boolean;
    "RUN_ON_SPECIFIC_PATIENTS_ARRAY":string; // names/referralIds (ehr based) seperated by ";"
    [key: string]: any; 
}
export type RemoteEnv ={
    configKey: string;
    snfAccountId: number;
    shouldRun: boolean;
    lastRunDate:Date;
    envVariables: RemoteEnvVariables;
}

export const defaultRemoteEnvVariables: RemoteEnvVariables= Object.freeze({
    "DOWNLOAD_ALL_FILES_AND_DONT_UPLOAD_TO_SERVER": false,
    "PRINT_DEBUG_TO_CONSOLE": false,
    "SKIP_FILES_DOWNLOAD": false,
    "RUN_ON_SPECIFIC_PATIENTS_ARRAY": "",
});