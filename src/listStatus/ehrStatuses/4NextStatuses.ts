
import { ListStatus, StatusesMap } from "../listStatus"

export   const FOUR_NEXT_EHR_STATUS:StatusesMap = {
    [ListStatus.Accepted]: ["Offered","Accept Pending"],
    [ListStatus.Received]: ["Received"],
    [ListStatus.Interested]: [],
    [ListStatus.Declined]: ["Canceled","Denied"],
    [ListStatus.New]: [],
  }

export   const FOUR_NEXT_HOSPITAL_STATUS:StatusesMap = {
    [ListStatus.Selected]: ["Accept Offer", "Finalized"],
    [ListStatus.NotSelected]: ["Retracted"],
    [ListStatus.Cancelled]: [],
    [ListStatus.Closed]: [],  
    [ListStatus.New]: ["New"],
  }

