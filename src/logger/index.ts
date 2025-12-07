export interface DbLog {
    service?: string;
    srcType?:string;
    snfAccountId?: string;
    computerName?: string;
    baseUrl?: string;
    branch?: string;
    commit?: string;
    type?: string;
    date?: Date;
    message?: string;
    referralId?: string;
    data?: Object
    stack ?: string[];
    status?: "open" | "closed" | "acknowledged" | string;
    [key: string]: any;  
}

export const dbLogSchema = {
    service: { type: String },
    srcType: { type: String },
    snfAccountId : { type: String },
    computerName: { type: String },
    baseUrl: { type: String },
    branch: { type: String },
    commit: { type: String },
    type: { type: String },
    date: { type: Date },
    message: { type: String },
    status: { type: String },
    referralId: { type: String},
    data: { type: Object },
}