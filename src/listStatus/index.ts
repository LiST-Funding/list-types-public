import { ListStatus, STATUS_ORDER} from "./listStatus";
import {EHR_STATUS} from "./ehrStatus";
import {HOSPITAL_STATUS} from "./hospitalStatus";

export { ListStatus, STATUS_ORDER, EHR_STATUS, HOSPITAL_STATUS };
export * from "./listStatusParserFunctions";



/**legacy exports to support moshe's code */
export const ListPatientStatus = ListStatus;
export const PATIENT_STATUS_PRIORITY = STATUS_ORDER;
export const PATIENT_HOSPITAL_STATUS = HOSPITAL_STATUS;
export const PATIENT_EHR_STATUS = EHR_STATUS;