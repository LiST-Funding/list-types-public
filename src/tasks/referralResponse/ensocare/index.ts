import * as Base from "../base";
import { EnsocareResponseOption } from "./constants";

export * as ResponseOptionsBuilder from "./responseOptionsBuilder";

/** Ensocare's facility response — the per-facility referral row id rides in `ehrReferralIdOfSite`. */
export interface EnsocareFacilityResponse extends Base.FacilityResponse {
    response: EnsocareResponseOption;
    responseStatusCode: number;
    responseReasonCode?: number; 
    ehrReferralIdOfSite:string;
}

/** Ensocare's `response` sub-task payload. */
export interface EnsocareReferralResponseData extends Base.ReferralResponseData<EnsocareFacilityResponse> {}

/** Ensocare's `selectPatient` sub-task payload. */
export interface EnsocareSelectPatientData extends Base.SelectPatientData {}

export type EnsocareResponseTask = Base.ResponseTask<"Ensocare", EnsocareReferralResponseData>;

export type EnsocareSelectPatientTask = Base.SelectPatientTask<"Ensocare", EnsocareSelectPatientData>;
