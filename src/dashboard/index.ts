

export interface ServiceLastTime {

    lastTimeSendAlarm?: Date;
 
    /**
     * @description Last time the dashboard was updated
     */
    lastTime: Date;

    /**
     * @description Time to live since "lastTime" report
     */
    timeForAlert: number;

    /**
     * @description Originally created for storing Aidin latest ehrLastTimeUpdate for performance.
     */
    ehrLastTimeUpdate?:Date;

    /**
     * @description Region ID
     */
    regionId?: number;
    
    /**
     * @description Status message of the dashboard
     */
    statusMessage?: string;
    
    /** if true, an alert icon will be shown in the dashboard
     */
    alertOn?: boolean;

    /**
     * @description Name of the process
     */
    name: string;

    /**
     * @description Name of the SNF account associate with that process
     */
    snfAccountName?: string;

    /**
     * @description ID of the SNF account associate with that process
     */
    snfAccountId?: number;

    /**
     * @description Name of the server
     */
    serverName?: string;

    /**
     * @description machine, git and etc.
     */
    processData?: any;


    [key: string]: any;
}

