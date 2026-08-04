/**
 * One selectable reason under a response option.
 * Mapping contract (what the Front writes onto the task's {@link FacilityResponse}
 * when the user picks this reason):
 * - `displayValue` → `FacilityResponse.responseReason`
 * - `value`        → `FacilityResponse.responseReasonCode`
 */
export interface ResponseReasonOption {
    displayValue: string;
    value: string | number;
    /** Helper text for understanding the option. */
    description?: string;
    /**in some EHRs, the reason are grouped under a specific label. this properte is used to diplay the group lable in the front 
     * Group display name to render the option under. */
    group?: string;
    requireComment?: boolean;
}

/**
 * One top-level response option (the action the provider takes).
 * Mapping contract (what the Front writes onto the task's {@link FacilityResponse}
 * when the user picks this option):
 * - `displayValue` → `FacilityResponse.response`
 * - `value`        → `FacilityResponse.responseStatusCode`
 */
export interface ResponseOption {
    displayValue: string;
    value: string | number;
    responseReasonOptions?: ResponseReasonOption[];
    requireComment?: boolean;
}

/** A system's full option set, keyed by the option's display name. */
export type ResponseConfigs = { [key: string]: ResponseOption };
