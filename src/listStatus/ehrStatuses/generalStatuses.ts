import { ListStatus, StatusesMap } from "../listStatus"

export   const GENERAL_EHR_STATUS: StatusesMap = {
    [ListStatus.Accepted]: ['Accepted', 'Accept', 'Yes, willing to accept patient'],
    [ListStatus.Received]: ['Received', 'Referral Received'],
    [ListStatus.Interested]: ['Interested, but need more information', 'Considering', 'Request More Information', 'Decision Pending Authorization', 'Decision Pending Review','Decision Pending Bed Availability'],
    [ListStatus.Declined]: ['Declined', 'Decline', 'No, unable to accept patient'],
    [ListStatus.New]: ['', '-', 'Pending', 'No Response Submitted'],
  }
  export   const GENERAL_HOSPITAL_STATUS: StatusesMap = {
    [ListStatus.Selected]: ['Selected', 'Placed Here', 'Booked'],
    [ListStatus.NotSelected]: ['Not Selected'],
    [ListStatus.Cancelled]: ['Cancelled', 'Suspended'],
    [ListStatus.Closed]: [],  
  }
