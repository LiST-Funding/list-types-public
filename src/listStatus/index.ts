import { ListStatus, STATUS_ORDER, ListSiteStatuses, ListHospitalStatuses} from "./listStatus";
import {EHR_STATUS} from "./ehrStatus";
import {HOSPITAL_STATUS} from "./hospitalStatus";

export { ListStatus, STATUS_ORDER, EHR_STATUS, HOSPITAL_STATUS,ListSiteStatuses, ListHospitalStatuses };

export * as systemParser from "./systemsParserFunctions";
export * from "./listStatusParserFunctions";



/**legacy exports to support moshe's code */
/**@deprecated */
export const ListPatientStatus = ListStatus;
/**@deprecated */
export const PATIENT_STATUS_PRIORITY = STATUS_ORDER;
/**@deprecated */
export const PATIENT_HOSPITAL_STATUS = HOSPITAL_STATUS;
/**@deprecated */
export const PATIENT_EHR_STATUS = EHR_STATUS;