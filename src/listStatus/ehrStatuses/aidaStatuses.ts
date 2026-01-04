
import { ListStatus, StatusesMap } from "../listStatus"

export   const AIDA_EHR_STATUS: StatusesMap = {
    [ListStatus.Accepted]: ["ready_to_admit","accepted","accepted_for_tour"],
    [ListStatus.Received]: [],
    [ListStatus.Interested]: ["interested"],
    [ListStatus.Declined]: ["declined"],
  }

export   const AIDA_HOSPITAL_STATUS: StatusesMap = {
    [ListStatus.Selected]: ["admitted","booked"],
    [ListStatus.NotSelected]: [""],
    [ListStatus.Cancelled]: ["cancelled"],
    [ListStatus.Closed]: ["expired"],  
    [ListStatus.New]: ["awaiting_response"],
  }

//Statuses found on aida
// "cancelled",
// "declined",
// "booked",
// "accepted",
// "interested",
// "ready_to_admit",
// "admitted",
// "accepted_for_tour",
// "awaiting_response",
// "expired"