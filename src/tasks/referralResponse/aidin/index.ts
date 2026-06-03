import { Task, TaskTypes } from "../../types";

export interface FacilityResponse {
    facilityName: string;
    response: string;
    responseReason?: string;
    comment?: string;
}

export interface AidinReferralResponseData {
    referralId: string;
    responses: { [facilityName: string]: FacilityResponse };
}

export interface AidinSelectPatientData {
    referralId: string;
}

export type AidinSelectPatientTask = Task & {
    srcType: "Aidin";
    type: TaskTypes.referralResponse;
    subType: "selectPatient";
    data: AidinSelectPatientData;
};

export type AidinResponseTask = Task & {
    srcType: "Aidin";
    type: TaskTypes.referralResponse;
    subType: "response";
    data: AidinReferralResponseData;
};

