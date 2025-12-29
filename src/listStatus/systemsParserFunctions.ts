import { SystemSpecificStatusParser } from "./classes/SystemSpecificStatusParser";
import { FOUR_NEXT_EHR_STATUS, FOUR_NEXT_HOSPITAL_STATUS } from "./ehrStatuses/4NextStatuses";
import { AIDA_EHR_STATUS, AIDA_HOSPITAL_STATUS } from "./ehrStatuses/aidaStatuses";
import { AIDIN_EHR_STATUS, AIDIN_HOSPITAL_STATUS } from "./ehrStatuses/aidenStatuses";
import { GENERAL_EHR_STATUS, GENERAL_HOSPITAL_STATUS } from "./ehrStatuses/generalStatuses";
import { MEDITECH_EHR_STATUS, MEDITECH_HOSPITAL_STATUS } from "./ehrStatuses/meditechStatuses";

export const meditech = new SystemSpecificStatusParser(
    MEDITECH_EHR_STATUS,
    MEDITECH_HOSPITAL_STATUS
  )

  export const aidin = new SystemSpecificStatusParser(
    AIDIN_EHR_STATUS,
    AIDIN_HOSPITAL_STATUS
  )

    
  export const general = new SystemSpecificStatusParser(
    GENERAL_EHR_STATUS,
    GENERAL_HOSPITAL_STATUS
  )

  export const fourNext = new SystemSpecificStatusParser(
    FOUR_NEXT_EHR_STATUS,
    FOUR_NEXT_HOSPITAL_STATUS
)

export const aida = new SystemSpecificStatusParser(
    AIDA_EHR_STATUS,
    AIDA_HOSPITAL_STATUS
)