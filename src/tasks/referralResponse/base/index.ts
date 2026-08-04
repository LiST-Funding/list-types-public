import { Task, TaskTypes, SelectPatientCallbackData } from "../../types";
import { TASK_SUB_TYPE } from "../constants";

export * from "./responseOptions";

/**
 * Re-exported for discoverability alongside the rest of the base referralResponse
 * contract. Defined in `tasks/types.ts` (not moved, to avoid relocating an existing
 * exported symbol) — this is the shape of `Task.callbackData` produced by the
 * selectPatient step.
 */
export type { SelectPatientCallbackData };

/**
 * One facility's requested response inside a response task. EHR modules extend this
 * to add EHR-specific fields; `Navi` predates this contract and is not derived from it
 * (see `referralResponse/navi`).
 */
export interface FacilityResponse {
    /** the ehr site name as it is pesented in the the EHR.
     * this value should be derived from the site.siteName field in the patient doc,
     * which is the exact representation of how it is presented in the EHR. 
     * This is important because the EHR may have multiple sites with the same name, but different site ids. The site name is used to match the response to the correct site in the EHR.
     */
    facilityName: string;
    /**
     * Id of THIS SITE'S SPECIFIC REFERRAL ENTRY on the EHR — the id the EHR's
     * respond call targets (Ensocare: the per-facility referral row id;
     * AllScripts: "connectionId"). NOT the EHR's facility/organization id
     * (that belongs to siteName). One patient (mrn) + facility can accumulate
     * multiple entries over time; the Site carries the latest known one.
     * Optional: sites collected before enrichment (or systems without it)
     * won't have it — handlers must fall back to live resolution.
     */
    ehrReferralIdOfSite?: string;
    response: string;
    responseStatusCode: string | number;
    responseReason?: string;
    responseReasonCode?: string | number;
    comment?: string;
}

/** Base payload of a `response` sub-task. EHRs extend DATA and FacilityResponse. */
export interface ReferralResponseData<F extends FacilityResponse = FacilityResponse> {
    /** Our DB referral id — the patient anchor (Ensocare: visit id). Never the POST target. */
    referralId: string;
    responses: { [facilityName: string]: F };
}

/** Base payload of a `selectPatient` sub-task. */
export interface SelectPatientData {
    referralId: string;
}

/**
 * A `response` sub-task for a given EHR source, typed over its own
 * {@link ReferralResponseData} shape.
 */
export type ResponseTask<SRC extends string, DATA extends ReferralResponseData<any>> = Task & {
    srcType: SRC;
    type: TaskTypes.referralResponse;
    subType: typeof TASK_SUB_TYPE.response;
    data: DATA;
};

/**
 * A `selectPatient` sub-task for a given EHR source, typed over its own
 * {@link SelectPatientData} shape.
 */
export type SelectPatientTask<SRC extends string, DATA extends SelectPatientData = SelectPatientData> = Task & {
    srcType: SRC;
    type: TaskTypes.referralResponse;
    subType: typeof TASK_SUB_TYPE.selectPatient;
    data: DATA;
};
