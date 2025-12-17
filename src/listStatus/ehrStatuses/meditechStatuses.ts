
import { ListStatus, StatusesMap } from "../listStatus"

export   const MEDITECH_EHR_STATUS: StatusesMap = {
    [ListStatus.Accepted]: ["Accepted"],
    [ListStatus.Received]: ["Pending-Viewed"],
    [ListStatus.Interested]: [],
    [ListStatus.Declined]: ["Declined"],
    [ListStatus.New]: [],
  }

export   const MEDITECH_HOSPITAL_STATUS: StatusesMap = {
    [ListStatus.Selected]: ["Accepted & Selected"],
    [ListStatus.NotSelected]: [""],
    [ListStatus.Cancelled]: ["Cancelled"],
    [ListStatus.Closed]: ["Closed"],  
    [ListStatus.New]: ["Pending"],
  }

 