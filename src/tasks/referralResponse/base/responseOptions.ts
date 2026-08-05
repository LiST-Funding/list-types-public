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
 * - `displayValue` → `FacilityResponse.response` (unless `response` overrides — see below)
 * - `value`        → `FacilityResponse.responseStatusCode`
 * - `response ?? displayValue` → `FacilityResponse.response` — the actual rule the Front
 *   applies. Lets an option DISPLAY one label while SENDING a different, canonical
 *   response value (e.g. a "Message Booked Referral" option that submits as a "Yes").
 *   Options that omit `response` behave exactly as before — full backward compatibility.
 */
export interface ResponseOption {
    displayValue: string;
     /**
     * Canonical response value to send instead of `displayValue`, when the option's
     * display label and its wire value need to differ. See the mapping contract above.
     */
    response?: string;
    /**the responseCode value */
    value: string | number;
    responseReasonOptions?: ResponseReasonOption[];
    requireComment?: boolean;
}

/** A system's full option set, keyed by the option's display name. */
export type ResponseConfigs = { [key: string]: ResponseOption };
