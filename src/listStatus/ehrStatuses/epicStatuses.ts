
import { ListStatus, StatusesMap } from "../listStatus"

export   const EPIC_EHR_STATUS: StatusesMap = {
    [ListStatus.Accepted]: ["Accepted"],
    [ListStatus.Received]: [],
    [ListStatus.Interested]: ["Considering"],
    [ListStatus.Declined]: ["Declined"],
    [ListStatus.New]: [],
  }

export   const EPIC_HOSPITAL_STATUS: StatusesMap = {
    [ListStatus.Selected]: ["Selected"],
    [ListStatus.NotSelected]: ["Not Selected"],
    [ListStatus.Cancelled]: ["Canceled"],
    [ListStatus.Closed]: [],  
    [ListStatus.New]: ["Pending"],
  }

