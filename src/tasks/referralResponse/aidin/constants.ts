const AIDIN_RESPONSES = Object.freeze({
    accept: "Pre-approve",
    decline: "Decline",
    underReview: "Mark as Under Review",
});

type AidinResponseOption = typeof AIDIN_RESPONSES[keyof typeof AIDIN_RESPONSES];

const AIDIN_RESPONSES_STATUS_CODE = Object.freeze({
  [AIDIN_RESPONSES.accept]: "available",
  [AIDIN_RESPONSES.decline]: "unavailable",
  [AIDIN_RESPONSES.underReview]: "under_review",
});

const DECLINE_REASON_GROUPS = Object.freeze({
    clinicallyNotAppropriate: "Clinically not appropriate",
    financialMismatch: "Financial mismatch",
    resourcesMismatch: "Resources mismatch",
    hospitalOrPatientChoice: "Hospital or patient choice",
    transitionConcerns: "Concern about transition to next level of care",
    policyCompliance: "Noncompliant with agency / facility policy",
    other: "Other",
});

export {AIDIN_RESPONSES, AIDIN_RESPONSES_STATUS_CODE, DECLINE_REASON_GROUPS}
export type  { AidinResponseOption};