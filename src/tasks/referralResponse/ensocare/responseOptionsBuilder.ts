import { ResponseOption, ResponseReasonOption } from "../base/responseOptions";
import { ENSOCARE_RESPONSES, ENSOCARE_RESPONSES_CODE, EnsocareResponseOption } from "./constants";

/** Ensocare reason option — value is the numeric catalog entry id. */
export interface EnsocareReasonOption extends ResponseReasonOption {
    value: number;
}

/** Ensocare response option — value is the numeric action code (1/2/3). */
export interface EnsocareOption extends ResponseOption {
    value: number;
    responseReasonOptions?: EnsocareReasonOption[];
}

export type EnsocareResponseConfigs = { [key: string]: EnsocareOption };

/**
 * One entry of the Ensocare response-reason catalog
 * (GET /dischargeservice/api/provider/response/reasons), as captured verbatim.
 * `actionId` links the reason to its action (1 = Yes, 2 = No, 3 = Considering);
 * a reason is only identified by `(id, actionId)` — the same description can exist
 * under multiple actions with different ids.
 */
export type EnsocareResponseReasonCatalogEntry = {
    id: number;
    description: string;
    responseTypeCode: number;
    active: boolean;
    actionId: number;
};

/**
 * Hardcoded from the Jewel client capture (2026-08-02). Managed on our end by
 * decision — see EpicPiedmont drafts/ensocare_resposne/ensocare-response-reasons.md.
 * The scraper's drift guard compares THIS constant against the live endpoint before
 * submitting; the Front builds its options from it. One source of truth.
 */
export const ENSOCARE_REASONS_CATALOG: readonly EnsocareResponseReasonCatalogEntry[] = Object.freeze([
    {
        id: 44,
        description: "1:1 Sitter must be discontinued",
        responseTypeCode: 3,
        active: true,
        actionId: 3,
    },
    {
        id: 16,
        description: "Admission application form needed",
        responseTypeCode: 3,
        active: true,
        actionId: 3,
    },
    {
        id: 41,
        description: "Behavioral issues",
        responseTypeCode: 2,
        active: true,
        actionId: 2,
    },
    {
        id: 57,
        description: "Inability to staff",
        responseTypeCode: 2,
        active: true,
        actionId: 2,
    },
    {
        id: 22,
        description: "Inability to staff",
        responseTypeCode: 3,
        active: true,
        actionId: 3,
    },
    {
        id: 39,
        description: "Insufficient funding for care needs",
        responseTypeCode: 2,
        active: true,
        actionId: 2,
    },
    {
        id: 51,
        description: "Insurance denied",
        responseTypeCode: 2,
        active: true,
        actionId: 2,
    },
    {
        id: 29,
        description: "Insurance out of network",
        responseTypeCode: 3,
        active: true,
        actionId: 3,
    },
    {
        id: 21,
        description: "Insurance out of network",
        responseTypeCode: 2,
        active: true,
        actionId: 2,
    },
    {
        id: 52,
        description: "Lack of firm discharge plan",
        responseTypeCode: 3,
        active: true,
        actionId: 3,
    },
    {
        id: 49,
        description: "Medicaid pending",
        responseTypeCode: 2,
        active: true,
        actionId: 2,
    },
    {
        id: 50,
        description: "Medicaid pending",
        responseTypeCode: 3,
        active: true,
        actionId: 3,
    },
    {
        id: 27,
        description: "Medication list needed",
        responseTypeCode: 3,
        active: true,
        actionId: 3,
    },
    {
        id: 14,
        description: "Need more information - see notes",
        responseTypeCode: 3,
        active: true,
        actionId: 3,
    },
    {
        id: 42,
        description: "Negative history with patient",
        responseTypeCode: 2,
        active: true,
        actionId: 2,
    },
    {
        id: 2,
        description: "No bed available",
        responseTypeCode: 2,
        active: true,
        actionId: 2,
    },
    {
        id: 33,
        description: "No isolation bed",
        responseTypeCode: 2,
        active: true,
        actionId: 2,
    },
    {
        id: 37,
        description: "Not a covered benefit",
        responseTypeCode: 2,
        active: true,
        actionId: 2,
    },
    {
        id: 53,
        description: "Not approved by physician",
        responseTypeCode: 2,
        active: true,
        actionId: 2,
    },
    {
        id: 56,
        description: "Out of service area",
        responseTypeCode: 2,
        active: true,
        actionId: 2,
    },
    {
        id: 36,
        description: "Patient benefits are exhausted",
        responseTypeCode: 2,
        active: true,
        actionId: 2,
    },
    {
        id: 47,
        description: "Patient does not meet criteria (payer guidelines)",
        responseTypeCode: 2,
        active: true,
        actionId: 2,
    },
    {
        id: 12,
        description: "Pending ID/PASRR completion",
        responseTypeCode: 3,
        active: true,
        actionId: 3,
    },
    {
        id: 8,
        description: "Pending nurse evaluation",
        responseTypeCode: 3,
        active: true,
        actionId: 3,
    },
    {
        id: 25,
        description: "Pending orders - see notes",
        responseTypeCode: 3,
        active: true,
        actionId: 3,
    },
    {
        id: 17,
        description: "Please call to discuss",
        responseTypeCode: 3,
        active: true,
        actionId: 3,
    },
    {
        id: 40,
        description: "Social issues (ETOH/drug, criminal history)",
        responseTypeCode: 2,
        active: true,
        actionId: 2,
    },
    {
        id: 54,
        description: "Too high functioning",
        responseTypeCode: 2,
        active: true,
        actionId: 2,
    },
    {
        id: 55,
        description: "Too low functioning",
        responseTypeCode: 2,
        active: true,
        actionId: 2,
    },
    {
        id: 1,
        description: "Unable to meet specialty/medical needs",
        responseTypeCode: 2,
        active: true,
        actionId: 2,
    },
    {
        id: 11,
        description: "Verifying insurance",
        responseTypeCode: 3,
        active: true,
        actionId: 3,
    },
    {
        id: 32,
        description: "We can accept this patient. Thank you for your referral",
        responseTypeCode: 1,
        active: true,
        actionId: 1,
    },
]);

/** Reasons of one action as UI options — displayValue: description, value: id. */
function reasonOptionsForAction(actionId: number): EnsocareReasonOption[] {
    return ENSOCARE_REASONS_CATALOG.filter((entry) => entry.actionId === actionId && entry.active).map((entry) => ({
        displayValue: entry.description,
        value: entry.id,
    }));
}

/** displayValue/value pair of one action — mirrors aidin's helper. */
function buildOption(displayValue: EnsocareResponseOption): EnsocareOption {
    const value = ENSOCARE_RESPONSES_CODE[displayValue];
    return { displayValue, value, responseReasonOptions: reasonOptionsForAction(value) };
}

const ensocareResponseOptions: EnsocareResponseConfigs = {
    // Accept deliberately has NO reason options: its single catalog reason
    // (actionId 1, id 32 "We can accept this patient...") is appended
    // automatically by the automation side when submitting a Yes response —
    // the user is never asked to pick it.
    [ENSOCARE_RESPONSES.accept]: {
        displayValue: ENSOCARE_RESPONSES.accept,
        value: ENSOCARE_RESPONSES_CODE[ENSOCARE_RESPONSES.accept],
    },
    [ENSOCARE_RESPONSES.decline]: buildOption(ENSOCARE_RESPONSES.decline),
    [ENSOCARE_RESPONSES.considering]: buildOption(ENSOCARE_RESPONSES.considering),
};

export function getEnsocareResponseOptionsConfigs() {
    return ensocareResponseOptions;
}
