/**
 * Our stable keys → the Ensocare response-action catalog (`actionId` 1/2/3 and the
 * display label the Ensocare Respond UI uses for that action). Source of truth for
 * task creation — no magic strings elsewhere; everything references this constant.
 * See `drafts/ensocare_resposne/ensocare-response-reasons.md` for the full captured
 * reason catalog and the hardcode + runtime-drift-guard rationale.
 */
export const ENSOCARE_RESPONSES = Object.freeze({
    accept: "Yes",
    decline: "No",
    considering: "Considering",
});

export type EnsocareResponseOption = typeof ENSOCARE_RESPONSES[keyof typeof ENSOCARE_RESPONSES];

export const ENSOCARE_RESPONSES_CODE: Record<EnsocareResponseOption, number> = Object.freeze({
    [ENSOCARE_RESPONSES.accept]: 1,
    [ENSOCARE_RESPONSES.decline]: 2,
    [ENSOCARE_RESPONSES.considering]: 3,
});

