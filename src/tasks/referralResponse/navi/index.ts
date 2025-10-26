type NaviReferralResponseTaskData = {
    referalId:string;
    srcType: "Navi";
    facilityName:string;
    response:string;
    responseReason:string;

}

type ResponseReasonOption = {
    displayValue: string;
   

    value: string;
     /** helper text of understanding the option */
     description?: string;
     /**group display name to display under */
     group?: string; 
}

const NAVI_RESPONSES = Object.freeze({
    noResponseSubmitted: "No Response Submitted",
    received: "Received",
    requestMoreInformation: "Request More Information",
    decisionPendingAuthorization: "Decision Pending Authorization",
    decisionPendingBedAvailability:"Decision Pending Bed Availability",
    decisionPendingReview: "Decision Pending Review",
    accept: "Accept",
    decline: "Decline",
    reopenReferral: "Re-open Referral"
});

type ResponseOption = {
    commentPrefix: string;
    statusCode: string;
    responseReasonOptions?: ResponseReasonOption[];
    displayValue: string;

    /**the statuses that this response can be transitioned from */
    transitionedFrom: string[];
}


type NaviResponseConfigs = { [key:string]:ResponseOption };

const naviResponseOptions: NaviResponseConfigs = {
    Accept:{
        commentPrefix: "Status changed to Accept. \r\n", // + comment
        statusCode: "ACCEPT",
        displayValue: "Accept",
        transitionedFrom:[
            NAVI_RESPONSES.accept
        ]
    },
    "Decision Pending Authorization": {
        commentPrefix: "Status changed to Decision Pending Authorization. \r\n",
        statusCode: "PENDING_AUTH",
        displayValue: "Decision Pending Authorization",
        transitionedFrom:[
            NAVI_RESPONSES.accept,
            NAVI_RESPONSES.decisionPendingAuthorization,
            NAVI_RESPONSES.decisionPendingBedAvailability,
            NAVI_RESPONSES.decisionPendingReview,
            NAVI_RESPONSES.requestMoreInformation
        ],
        responseReasonOptions: [
            {
                displayValue: "Medicare",
                value: "MEDICARE"}, 
            {
                displayValue: "Medicaid",
                value: "MEDICAID"
            }, 
            {displayValue: "Commercial",
                value: "COMMERCIAL"
            }, 
            {displayValue: "Private",
                value: "PRIVATE"
            }, 
            { displayValue: "Unknown",
                value: "UNKNOWN"
            }
        ]
      },
      "Decision Pending Bed Availability": {
        commentPrefix: "Status changed to Decision Pending Bed Availability. \r\n",
        statusCode: "PENDING_BED",
        displayValue: "Decision Pending Bed Availability",
        transitionedFrom:[
            NAVI_RESPONSES.accept,
            NAVI_RESPONSES.decisionPendingAuthorization,
            NAVI_RESPONSES.decisionPendingBedAvailability,
            NAVI_RESPONSES.decisionPendingReview,
            NAVI_RESPONSES.requestMoreInformation
            
        ],
        responseReasonOptions: [
            {
                displayValue: "Medicare",
                value: "MEDICARE"}, 
            {
                displayValue: "Medicaid",
                value: "MEDICAID"
            }, 
            {displayValue: "Commercial",
                value: "COMMERCIAL"
            }, 
            {displayValue: "Private",
                value: "PRIVATE"
            }, 
            { displayValue: "Unknown",
                value: "UNKNOWN"
            }
        ]
      },
      "Decision Pending Review": {
        commentPrefix: "Status changed to Decision Pending Review. \r\n",
        statusCode: "PENDING_REVIEW",
        displayValue: "Decision Pending Review",
        transitionedFrom:[
            NAVI_RESPONSES.accept,
            NAVI_RESPONSES.decisionPendingAuthorization,
            NAVI_RESPONSES.decisionPendingBedAvailability,
            NAVI_RESPONSES.decisionPendingReview,
            NAVI_RESPONSES.requestMoreInformation
        ],
        responseReasonOptions: [
            {
                displayValue: "Medicare",
                value: "MEDICARE"}, 
            {
                displayValue: "Medicaid",
                value: "MEDICAID"
            }, 
            {displayValue: "Commercial",
                value: "COMMERCIAL"
            }, 
            {displayValue: "Private",
                value: "PRIVATE"
            }, 
            { displayValue: "Unknown",
                value: "UNKNOWN"
            }
        ]
      },
      Decline: {
        commentPrefix:"Status changed to Decline. \r\n",
        statusCode: "DECLINE",
        displayValue: "Decline",
        transitionedFrom:[
            NAVI_RESPONSES.accept,
            NAVI_RESPONSES.decisionPendingAuthorization,
            NAVI_RESPONSES.decisionPendingBedAvailability,
            NAVI_RESPONSES.decisionPendingReview,
            NAVI_RESPONSES.requestMoreInformation
        ],
        responseReasonOptions: [
            {
              "displayValue": "No Bed Available",
              "description": "No beds that meet the patient needs are currently available.",
              "value": "NO_BED",
              "group": "Provider"
            },
            {
              "displayValue": "Noncompliant with agency/facility policy",
              "description": "The patient does not meet the post-acute facilities policies.",
              "value": "NONCOMPLIANT_WITH_AGENCY",
              "group": "Provider"
            },
            {
              "displayValue": "No Secure Units Available",
             
              "value": "NO_SECURE_UNITS_AVAILABLE",
              "group": "Provider"
            },
            {
              "displayValue": "Limited Equipment Resources",
             
              "value": "LIMITED_EQUIPMENT_RESOURCES",
              "group": "Provider"
            },
            {
              "displayValue": "Limited Staffing",
              "value": "LIMITED_STAFFING_NEW",
              "group": "Provider"
            },
            {
              "displayValue": "Accepted at Another Location",
              "value": "ACCEPTED_AT_ANOTHER_LOCATION",
              "group": "Provider"
            },
            {
              "displayValue": "Patient Too Complex",
              "description": "The post-acute facility cannot meet the needs of this patient.",
              "value": "PATIENT_COMPLEX",
              "group": "Clinical"
            },
            {
              "displayValue": "Does Not Meet Admission Criteria",
              "description": "The patient does not meet certain criteria for referred facility.",
              "value": "ADMISSION_CRITERIA_NOT_MET",
              "group": "Clinical"
            },
            {
              "displayValue": "Level of Functioning Too High",
              "description": "The patient does not qualify for the level of care for the referred facility.",
              "value": "FUNCTIONING_LEVEL_TOO_HIGH",
              "group": "Clinical"
            },
            {
              "displayValue": "Level of Functioning Too Low",
              "description": "This is not the right level of care for the patient.",
              "value": "FUNCTIONING_LEVEL_TOO_LOW",
              "group": "Clinical"
            },
            {
              "displayValue": "Concern about Transition to next Level of Care",
              "description": "The post-acute facility has concerns that the patient would be transitioned too early.",
              "value": "DISCHARGE_PLAN_CONCERN",
              "group": "Clinical"
            },
            {
              "displayValue": "Behavioral/Mental Health concerns",
              "description": "There are behavioral/mental concerns on this patient.",
              "value": "MENTAL_HEALTH_CONCERN",
              "group": "Clinical"
            },
            {
              "displayValue": "No Following Physician",
             
              "value": "NO_FOLLOWING_PHYSICIAN",
              "group": "Clinical"
            },
            {
              "displayValue": "Bad Debt/Owes Facility Money",
              "description": "The patient is known to have bad debt/owes the post-acute facility money.",
              "value": "BAD_DEBT",
              "group": "Financial"
            },
            {
              "displayValue": "Payer Not Accepted",
              "description": "The post-acute facility does not accept the payer for the referred patient.",
              "value": "PAYER_NOT_ACCEPTED",
              "group": "Financial"
            },
            {
              "displayValue": "No Payer Source",
              "description": "The patient does not have any insurance.",
              "value": "NO_PAYER_SOURCE",
              "group": "Financial"
            },
            {
              "displayValue": "Insurance Denial",
              "description": "Pre-authorization was denied for the level of care.",
              "value": "INSURANCE_DENIAL",
              "group": "Financial"
            },
            {
              "displayValue": "Issue with Cost of Care",
              "description": "The patient has issue with cost of care.",
              "value": "COST_OF_CARE",
              "group": "Financial"
            },
            {
              "displayValue": "Payer Beds at Capacity",
             
              "value": "PAYER_BEDS_AT_CAPACITY",
              "group": "Financial"
            },
            {
              "displayValue": "Discharged to another facility",
              "description": "This patient has been discharged to another post-acute facility in the network.",
              "value": "DISCHARGED_ANOTHER_FACILITY",
              "group": "Hospital"
            },
            {
              "displayValue": "Known with Other Agency/Facility",
              "description": "Patient currently has services with another known agency/facility.",
              "value": "KNOWN_TO_OTHER_AGENCY",
              "group": "Hospital"
            },
            {
              "displayValue": "Hospital Cancellation",
              "description": "The acute facility cancelled the referral.",
              "value": "HSPTL_CANCELLATION",
              "group": "Hospital"
            },
            {
              "displayValue": "Patient has Expired",
             
              "value": "PATIENT_HAS_EXPIRED",
              "group": "Patient"
            },
            {
              "displayValue": "Patient/Family Declined or Refused Care",
             
              "value": "PATIENT/FAMILY_DECLINED/REFUSED_CARE",
              "group": "Patient"
            },
            {
              "displayValue": "COVID-19",
             
              "value": "COVID-19",
              "group": "COVID-19"
            },
            {
              "displayValue": "COVID-19 Limited Staffing, Equipment Resources",
             
              "value": "COVID-19_LIMITED-STAFFING",
              "group": "COVID-19"
            },
            {
              "displayValue": "COVID-19 No isolation beds available",
             
              "value": "COVID-19_NO-BEDS",
              "group": "COVID-19"
            },
            {
              "displayValue": "COVID-19 Patient Too Complex",
             
              "value": "COVID-19_PATIENT-COMPLEX",
              "group": "COVID-19"
            },
            {
              "displayValue": "COVID-19 Patient/Family Declined Care",
             
              "value": "COVID-19_DECLINED",
              "group": "COVID-19"
            }
          ]
      },
      "Request More Information": {
        commentPrefix: "Status changed to Request More Information. \r\n", // concat with message
        statusCode: "MORE_INFO",
       displayValue: "Request More Information",
       transitionedFrom:[
        NAVI_RESPONSES.accept,
        NAVI_RESPONSES.decisionPendingAuthorization,
        NAVI_RESPONSES.decisionPendingBedAvailability,
        NAVI_RESPONSES.decisionPendingReview,
        NAVI_RESPONSES.requestMoreInformation
       ],
      },
      // from no Response Submited
      Received: {
        commentPrefix: "Status changed to Received. \r\n?",
        statusCode: "RECEIVED", 
        displayValue: "Received",
        transitionedFrom: [
            NAVI_RESPONSES.noResponseSubmitted
        ]
      },
      //only frome decineed
      "Re-open Referral": {
        commentPrefix: "Status changed to Reopen Referral. \r\n",
        statusCode: "REOPEN",
        displayValue: "Re-open Referral",
        transitionedFrom: [
            NAVI_RESPONSES.decline
        ]
      }

}

function getNaviResponseOptionsConfigs() {
    return naviResponseOptions;
}

export { getNaviResponseOptionsConfigs, NAVI_RESPONSES, ResponseOption, ResponseReasonOption, NaviResponseConfigs ,NaviReferralResponseTaskData};