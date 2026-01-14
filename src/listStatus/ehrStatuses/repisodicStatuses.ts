
import { ListStatus, StatusesMap } from "../listStatus"

export   const REPISODIC_EHR_STATUS: StatusesMap = {
    [ListStatus.Accepted]: ["ACCEPTED"],
    [ListStatus.Received]: ["READ"],
    [ListStatus.Interested]: [],
    [ListStatus.Declined]: ["DECLINED"],
    [ListStatus.New]: [],
  }

export   const REPISODIC_HOSPITAL_STATUS: StatusesMap = {
    [ListStatus.Selected]: ["PLACEMENT_CONFIRMED", "COMPLETED"],
    [ListStatus.NotSelected]: ["EXPIRED"],
    [ListStatus.Cancelled]: ["CANCELLED"],
    [ListStatus.Closed]: [],  
    [ListStatus.New]: ["NEW",'REOPENED'],
  }

 /* 
   'ACCEPTED',
  'NEW',
  'READ',
  'DECLINED',
  'EXPIRED',

  'CANCELLED',
  'PLACEMENT_CONFIRMED',
  'COMPLETED'

  
    'REOPENED',
  */