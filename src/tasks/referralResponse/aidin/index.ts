import * as Base from "../base";
export * as constants from "./constants";

/** Aidin's facility response — unchanged shape, plus the new optional `ehrReferralIdOfSite`. */
export interface FacilityResponse extends Base.FacilityResponse {
    responseStatusCode: string;
    responseReasonCode?: string;
}

/** Aidin's `response` sub-task payload. */
export interface AidinReferralResponseData extends Base.ReferralResponseData<FacilityResponse> {}

/** Aidin's `selectPatient` sub-task payload. */
export interface AidinSelectPatientData extends Base.SelectPatientData {}

export type AidinSelectPatientTask = Base.SelectPatientTask<"Aidin", AidinSelectPatientData>;

export type AidinResponseTask = Base.ResponseTask<"Aidin", AidinReferralResponseData>;


export * as ResponseOptionsBuilder from "./responseOptionsBuilder";