// options
// site_status_values = [
//     "available",  accepted
//     "chosen", "Selected",???
//     "unavailable", Decliened
//     "pending", new
//     "under_review", Interested
//     "viewed", Recieved
//     "handed_to_provider": Selected
// ]
// hospital_status_values = [
//     "provider_responses_closed", "Not Selected"
//     "awaiting_patient",
//     "awaiting_provider_responses", New
//     "provider_chosen", Selected
//     "handed_to_provider" selected
// ]

import { ListStatus } from "../listStatus"


export   const AIDIN_EHR_STATUS = {
    [ListStatus.Accepted]: ["available","chosen"],
    [ListStatus.Received]: ['viewed'],
    [ListStatus.Interested]: ['under_review'],
    [ListStatus.Declined]: ["unavailable"],
    [ListStatus.New]: ['pending'],
  }

export   const AIDIN_HOSPITAL_STATUS = {
    [ListStatus.Selected]: [],// in aidin the selected status is defined by wheter the site status is chosen or not. 
    [ListStatus.NotSelected]: ["provider_chosen","handed_to_provider"],
    [ListStatus.Cancelled]: [],
    [ListStatus.Closed]: ['closed'],  
    [ListStatus.New]: ['awaiting_provider_responses'],
  }