import {AIDIN_RESPONSES, AIDIN_RESPONSES_STATUS_CODE, DECLINE_REASON_GROUPS, AidinResponseOption} from "./constants";
type ResponseReasonOption = {
    displayValue: string;
   

    value: string;
     /** helper text of understanding the option */
     description?: string;
     /**group display name to display under */
     group?: string; 
     requireComment?: boolean;
}



type ResponseOption = {
    statusCode: string;
    responseReasonOptions?: ResponseReasonOption[];
    displayValue: string;
}


type AidinResponseConfigs = { [key:string]:ResponseOption };

function getResponseOptionStatusCodeAndDisplayValue(response: AidinResponseOption){
  return {
    statusCode: AIDIN_RESPONSES_STATUS_CODE[response],
    displayValue: response
  }

}
const aidinResponseOptions: AidinResponseConfigs = {
    [AIDIN_RESPONSES.accept]:getResponseOptionStatusCodeAndDisplayValue(AIDIN_RESPONSES.accept),
    [AIDIN_RESPONSES.underReview]:getResponseOptionStatusCodeAndDisplayValue(AIDIN_RESPONSES.underReview),
      [AIDIN_RESPONSES.decline]: {
        ...getResponseOptionStatusCodeAndDisplayValue(AIDIN_RESPONSES.decline),
        responseReasonOptions: [
            {
              displayValue: "Behavioral / mental health concerns",
              value: "mental_health_concerns",
              group: DECLINE_REASON_GROUPS.clinicallyNotAppropriate
            },
            {
              displayValue: "No following physician",
              value: "no_following_physician",
              group: DECLINE_REASON_GROUPS.clinicallyNotAppropriate
            },
            {
              displayValue: "Medically too complex",
              value: "medically_complex",
              group: DECLINE_REASON_GROUPS.clinicallyNotAppropriate
            },
            {
              displayValue: "Incorrect Level of Care",
              value: "incorrect_level_of_care",
              group: DECLINE_REASON_GROUPS.clinicallyNotAppropriate
            },
            {
              displayValue: "Insufficient documentation",
              value: "insufficient_documentation",
              group: DECLINE_REASON_GROUPS.clinicallyNotAppropriate
            },
            {
              displayValue: "Unable to accommodate requested clinical needs",
              value: "unable_to_accommodate",
              group: DECLINE_REASON_GROUPS.clinicallyNotAppropriate
            },
            {
              displayValue: "Bad debt / owes facility money",
              value: "bad_debt",
              group: DECLINE_REASON_GROUPS.financialMismatch
            },
            {
              displayValue: "Insurance mismatch",
              value: "declined_insurance",
              group: DECLINE_REASON_GROUPS.financialMismatch
            },
            {
              displayValue: "No payor source",
              value: "no_payor_source",
              group: DECLINE_REASON_GROUPS.financialMismatch
            },
            {
              displayValue: "Payor not accepted at this facility",
              value: "payor_not_accepted",
              group: DECLINE_REASON_GROUPS.financialMismatch
            },
            {
              displayValue: "Not covered by plan",
              value: "not_covered_by_plan",
              group: DECLINE_REASON_GROUPS.financialMismatch
            },
            {
              displayValue: "Lack of equipment resources",
              value: "equipment_shortable",
              group: DECLINE_REASON_GROUPS.resourcesMismatch
            },
            {
              displayValue: "Staff shortage",
              value: "staff_shortable",
              group: DECLINE_REASON_GROUPS.resourcesMismatch
            },
            {
              displayValue: "No bed",
              value: "no_bed",
              group: DECLINE_REASON_GROUPS.resourcesMismatch
            },
            {
              displayValue: "Out of our service area",
              value: "service_area",
              group: DECLINE_REASON_GROUPS.resourcesMismatch
            },
            {
              displayValue: "Item not offered",
              value: "item_not_offered",
              group: DECLINE_REASON_GROUPS.resourcesMismatch
            },
            {
              displayValue: "Discharged to another facility",
              value: "discharged_elsewhere",
              group: DECLINE_REASON_GROUPS.hospitalOrPatientChoice
            },
            {
              displayValue: "Cancelled by requesting facility",
              value: "request_cancelled",
              group: DECLINE_REASON_GROUPS.hospitalOrPatientChoice
            },
            {
              displayValue: "Known with other agency / facility",
              value: "known_elsewhere",
              group: DECLINE_REASON_GROUPS.hospitalOrPatientChoice
            },
            {
              displayValue: "Patient declined care with this facility",
              value: "declined_care_with_this_facility",
              group: DECLINE_REASON_GROUPS.hospitalOrPatientChoice
            },
            {
              displayValue: "Homeless",
              value: "homeless",
              group: DECLINE_REASON_GROUPS.transitionConcerns
            },
            {
              displayValue: "Needs long term bed",
              value: "needs_long_term_bed",
              group: DECLINE_REASON_GROUPS.transitionConcerns
            },
            {
              displayValue: "Discharge plan safety concern",
              value: "discharge_plan_safety_concern",
              group: DECLINE_REASON_GROUPS.transitionConcerns
            },
            {
              displayValue: "Noncompliant with agency / facility policy",
              value: "policy_compliance",
              group: DECLINE_REASON_GROUPS.policyCompliance
            },
            {
              displayValue: "Other",
              value: "other",
              group: DECLINE_REASON_GROUPS.other,
              requireComment:true
            }
          ]
      },

}

function getAidinResponseOptionsConfigs() {
    return aidinResponseOptions;
}

export {  AIDIN_RESPONSES , DECLINE_REASON_GROUPS, ResponseOption, ResponseReasonOption, AidinResponseConfigs ,getAidinResponseOptionsConfigs  };