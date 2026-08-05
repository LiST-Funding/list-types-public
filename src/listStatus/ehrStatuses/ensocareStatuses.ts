
import { ListStatus, StatusesMap } from "../listStatus"

export   const ENSOCARE_EHR_STATUS: StatusesMap = {
    [ListStatus.Selected]: ["Booked"],
    [ListStatus.Accepted]: ["Yes"],
    [ListStatus.Received]: [],
    [ListStatus.Interested]: ["Considering"],
    [ListStatus.Declined]: ["No"],
    [ListStatus.New]: ["Referral Received"],
  }

export   const ENSOCARE_HOSPITAL_STATUS: StatusesMap = {
    [ListStatus.Selected]: ["Booked"],
    [ListStatus.NotSelected]: ["Booked Elsewhere"],
    [ListStatus.Cancelled]: ["Canceled"],
    [ListStatus.Closed]: [],
    [ListStatus.New]: ["Open"],
  }
