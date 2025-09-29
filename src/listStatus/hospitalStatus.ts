import { FOUR_NEXT_HOSPITAL_STATUS } from "./ehrStatuses/4NextStatuses";
import {  AIDIN_HOSPITAL_STATUS } from "./ehrStatuses/aidenStatuses";
import { GENERAL_HOSPITAL_STATUS} from "./ehrStatuses/generalStatuses";
import { ListStatus, ListStatusType } from "./listStatus";

function getHospitalStatusValues(ListStatusKey:ListStatusType){
    return [
        ...GENERAL_HOSPITAL_STATUS[ListStatusKey],
        ...AIDIN_HOSPITAL_STATUS[ListStatusKey],
        ...FOUR_NEXT_HOSPITAL_STATUS[ListStatusKey]
    ]
}

export   const HOSPITAL_STATUS = {
    [ListStatus.Selected]: getHospitalStatusValues(ListStatus.Selected),
    [ListStatus.NotSelected]: getHospitalStatusValues(ListStatus.NotSelected),
    [ListStatus.Cancelled]: getHospitalStatusValues(ListStatus.Cancelled),
    [ListStatus.Closed]: getHospitalStatusValues(ListStatus.Closed),
  }