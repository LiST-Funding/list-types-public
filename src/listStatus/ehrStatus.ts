import { FOUR_NEXT_EHR_STATUS } from "./ehrStatuses/4NextStatuses";
import { AIDIN_EHR_STATUS } from "./ehrStatuses/aidenStatuses";
import { GENERAL_EHR_STATUS } from "./ehrStatuses/generalStatuses";
import { ListStatus, ListStatusType } from "./listStatus";

function getEhrStatusValues(ListStatusKey:ListStatusType){
    return [
        ...GENERAL_EHR_STATUS[ListStatusKey],
        ...AIDIN_EHR_STATUS[ListStatusKey],
        ...FOUR_NEXT_EHR_STATUS[ListStatusKey]
    ]
}


export   const EHR_STATUS = {
    [ListStatus.Accepted]: getEhrStatusValues(ListStatus.Accepted),
    [ListStatus.Received]: getEhrStatusValues(ListStatus.Received),
    [ListStatus.Interested]: getEhrStatusValues(ListStatus.Interested),
    [ListStatus.Declined]: getEhrStatusValues(ListStatus.Declined),
    [ListStatus.New]: getEhrStatusValues(ListStatus.New),
  }