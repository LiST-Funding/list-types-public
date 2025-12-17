import { ListStatus, ListStatusType, STATUS_ORDER} from "./listStatus";
import {EHR_STATUS} from "./ehrStatus";
import {HOSPITAL_STATUS} from "./hospitalStatus";


export function parseEhrStatusToListStatus(status:string) {
for(const [listStatus, values] of Object.entries(EHR_STATUS)) {
    if(values.includes(status)) {
        return listStatus;
    }
}
}

export function parseHospitalStatusToListStatus(status:string) {
for(const [listStatus, values] of Object.entries(HOSPITAL_STATUS)) {
    if(values.includes(status)) {
        return listStatus;
    }
}
}


export function parseStatusToListStatus(status:string) {
    if(!status) {
        return ListStatus.New;
    }
    return parseEhrStatusToListStatus(status) || parseHospitalStatusToListStatus(status) || status;
}

/**
 * Defines whether status1 has higher priority than status2
 * based on listStatus input.
 * @param {string} status1 - A string value of one of the values of ListStatus.
 * @param {string} status2 - A string value of one of the values of ListStatus.
 * @returns {boolean} - True if status1 has higher priority than status2, otherwise false.
 */
export function isHigherPriorityListStatus(status1:ListStatusType, status2:ListStatusType):boolean {
    const order1 = STATUS_ORDER[status1];
    const order2 = STATUS_ORDER[status2];
    if(order1 === undefined && order2 === undefined) {
        return false;
    }
    if(order1 === undefined) {
        return false;
    }
    if(order2 === undefined) {
        return true;
    }
    return order1 < order2;
}
