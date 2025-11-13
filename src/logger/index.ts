export interface DbLogComment{
    userId?: string;
    userDisplayName?: string;
    date?: Date;
    comment?: string;
    handlingStatus?: string;
}
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
    handlingStatus?: string;
    comments?:DbLogComment[];
    // [key: string]: any;  
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
    status: { type: String, enum: ['success', 'fail', 'pending'] },
    referralId: { type: String},
    data: { type: Object },
    handlingStatus: { type: String, default: 'new' },
    comments: [{
        userId: { type: String },
        userDisplayName: { type: String },
        date: { type: Date },
        comment: { type: String },
        handlingStatus: { type: String }
    }]
}